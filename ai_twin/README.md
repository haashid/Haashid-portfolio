# 🤖 Personal AI Twin

A conversational AI that **knows everything about you** and **talks like you**.
Built with Google Gemini + ChromaDB + FastAPI.

---

## Project Structure

```
ai_twin/
├── backend/
│   ├── main.py          ← FastAPI server
│   ├── rag.py           ← RAG engine (retrieval)
│   ├── requirements.txt
│   └── .env.example     ← Copy this to .env and fill in!
├── data/                ← YOUR KNOWLEDGE BASE (fill these in!)
│   ├── about_me.txt
│   ├── resume.txt
│   ├── qa_pairs.txt     ← Most important!
│   ├── experiences.txt
│   ├── opinions.txt
│   └── tone_guide.txt
├── frontend/
│   └── index.html       ← Chat UI
└── ingest.py            ← Run this to load your data
```

---

## 🚀 Setup (5 steps)

### Step 1 — Get a Free Gemini API Key
1. Go to: https://aistudio.google.com/app/apikey
2. Click **"Create API Key"**
3. Copy the key

### Step 2 — Configure Environment
```powershell
# In the backend/ folder, copy the example env file
Copy-Item backend\.env.example backend\.env

# Open backend\.env and set:
#   GEMINI_API_KEY = your_key_here
#   YOUR_NAME = Your Full Name
#   YOUR_TAGLINE = Software Engineer · Builder · etc.
```

### Step 3 — Fill in Your Data
Open each file in the `data/` folder and fill in your information.
**The most important file is `data/qa_pairs.txt`** — fill in all HR questions!

### Step 4 — Install Dependencies & Ingest Data
```powershell
# Create a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r backend\requirements.txt

# Load your data into the AI's brain!
python ingest.py
```

> ✅ You should see: `Ingested X total chunks into ChromaDB`

### Step 5 — Run the Server
```powershell
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then open your browser at: **http://localhost:8000**

---

## 🔄 Updating Your Knowledge Base

Whenever you update files in `data/`, re-run:
```powershell
python ingest.py
```
Then restart the server.

---

## 🌐 Deploy to the Web (Free)

### Option A — Render (Recommended)
1. Push this folder to GitHub
2. Go to https://render.com → New Web Service
3. Connect your repo, set root to `ai_twin/backend/`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from `.env`

### Option B — Railway
Same steps, go to https://railway.app

---

## 🔑 Key Files to Customize

| File | Priority | What to do |
|---|---|---|
| `data/qa_pairs.txt` | 🔴 CRITICAL | Write your complete interview answers |
| `data/about_me.txt` | 🔴 CRITICAL | Your full personal bio |
| `data/resume.txt` | 🟠 HIGH | Paste your full resume |
| `data/experiences.txt` | 🟠 HIGH | STAR-format work stories |
| `data/tone_guide.txt` | 🟡 MEDIUM | How you talk/communicate |
| `data/opinions.txt` | 🟡 MEDIUM | Your views and perspectives |
| `backend/.env` | ✅ REQUIRED | API key + your name |

---

## 💡 Tips for Best Results

- **More data = better answers.** Don't be sparse — write detailed answers.
- **Write in your own voice** in the data files — that's what the AI will mirror.
- **Add more Q&A pairs** over time as you think of new questions.
- **Re-run ingest.py** every time you update data files.
- The AI will only answer from what's in your knowledge base — no hallucination!

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| LLM | Google Gemini 1.5 Flash (free) |
| Embeddings | Gemini text-embedding-004 (free) |
| Vector DB | ChromaDB (local, free) |
| Backend | FastAPI + Python |
| Frontend | Pure HTML/CSS/JS |

**Total cost to run: $0** (within Gemini free tier)
