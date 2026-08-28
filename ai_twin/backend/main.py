"""
FastAPI Backend — Personal AI Twin
Exposes a /chat endpoint that uses RAG + Gemini to answer questions
about you in your own voice and style.
"""
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv
from rag import retrieve, knowledge_base_is_empty

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
YOUR_NAME      = os.getenv("YOUR_NAME", "My AI Twin")
YOUR_TAGLINE   = os.getenv("YOUR_TAGLINE", "Powered by AI")
YOUR_BIO       = os.getenv("YOUR_BIO", "")
CHAT_MODEL     = os.getenv("GEMINI_CHAT_MODEL", "gemini-1.5-flash")
TEMPERATURE    = float(os.getenv("TEMPERATURE", 0.7))

if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
    raise RuntimeError("❌  GEMINI_API_KEY not set in .env file!")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title=f"{YOUR_NAME} — AI Twin", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend files from ../frontend/
FRONTEND_DIR = Path(__file__).parent.parent / "frontend"
if FRONTEND_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


# ─── Request / Response Models ─────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []   # [{"role": "user"|"model", "parts": [str]}]


class ChatResponse(BaseModel):
    reply: str
    sources: list[str] = []


# ─── System Prompt ─────────────────────────────────────────────────────────

SYSTEM_PROMPT = f"""
You are {YOUR_NAME}. You are a real person and this AI is a digital representation of you.

CRITICAL RULES — follow these at all times:
1. Always speak in FIRST PERSON as {YOUR_NAME}. Never say "According to the context" or "Based on the provided information".
2. Sound like a real human, not a robot. Be natural, warm, and conversational.
3. ONLY use facts from the provided context. Never fabricate experiences, projects, or personal details.
4. If the answer is not in the context, say something like: "Hmm, that's something I haven't documented yet — feel free to reach out directly to discuss!"
5. Match the communication style described in the context (tone_guide). 
6. For HR questions (strengths, weaknesses, why this job, salary), give thoughtful, confident answers using real examples from the context.
7. Keep responses concise but complete — 2-5 short paragraphs max unless the question needs more.
8. Never reveal that you are an AI or a language model unless directly asked. If asked, you can say "I'm {YOUR_NAME}'s AI twin — an AI trained on my own knowledge and experiences."

{YOUR_BIO}
""".strip()


# ─── Routes ────────────────────────────────────────────────────────────────

@app.get("/")
async def serve_frontend():
    index = FRONTEND_DIR / "index.html"
    if index.exists():
        return FileResponse(str(index))
    return {"message": f"Welcome to {YOUR_NAME}'s AI Twin API! Frontend not found."}


@app.get("/health")
async def health():
    kb_status = "❌ Empty — run ingest.py first!" if knowledge_base_is_empty() else "✅ Ready"
    return {
        "status": "ok",
        "name": YOUR_NAME,
        "knowledge_base": kb_status,
        "model": CHAT_MODEL,
    }


@app.get("/info")
async def info():
    return {
        "name": YOUR_NAME,
        "tagline": YOUR_TAGLINE,
        "bio": YOUR_BIO,
    }


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    if knowledge_base_is_empty():
        return ChatResponse(
            reply="⚠️ My knowledge base is empty! Please run `python ingest.py` first to load my data.",
            sources=[],
        )

    # Retrieve relevant context
    context_chunks = retrieve(req.message)
    sources = list({c.split("\n")[0].replace("[Source: ", "").replace("]", "") for c in context_chunks})

    context_text = "\n\n---\n\n".join(context_chunks) if context_chunks else "No relevant context found."

    # Build the user turn with injected context
    user_turn = f"""Context about me (use ONLY this to answer):
{context_text}

---
Question: {req.message}"""

    # Build conversation history for multi-turn
    history = []
    for turn in req.history[-10:]:  # Keep last 10 turns for context
        history.append({
            "role": turn.get("role", "user"),
            "parts": [turn.get("content", "")],
        })

    try:
        model = genai.GenerativeModel(
            model_name=CHAT_MODEL,
            system_instruction=SYSTEM_PROMPT,
            generation_config=genai.types.GenerationConfig(
                temperature=TEMPERATURE,
                max_output_tokens=1024,
            ),
        )
        chat_session = model.start_chat(history=history)
        response = chat_session.send_message(user_turn)
        reply = response.text.strip()

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")

    return ChatResponse(reply=reply, sources=sources)


# ─── Entry point ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
