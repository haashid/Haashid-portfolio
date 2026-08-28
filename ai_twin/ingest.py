"""
Data Ingestion Script
Run this once (and re-run whenever you update your data files) to:
  1. Read all .txt files from the /data directory
  2. Split them into chunks
  3. Embed each chunk with Gemini
  4. Store everything in ChromaDB
"""
import os
import sys
import hashlib
import time
from pathlib import Path
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

# Load from backend/.env
load_dotenv(dotenv_path=Path(__file__).parent / "backend" / ".env")

GEMINI_API_KEY  = os.getenv("GEMINI_API_KEY")
CHROMA_DB_PATH  = os.getenv("CHROMA_DB_PATH", "./backend/chroma_db")
EMBED_MODEL     = os.getenv("GEMINI_EMBED_MODEL", "models/text-embedding-004")
DATA_DIR        = Path(__file__).parent / "data"
COLLECTION_NAME = "my_knowledge"

# Chunking settings
CHUNK_SIZE    = 800   # characters per chunk
CHUNK_OVERLAP = 150   # overlap between chunks

genai.configure(api_key=GEMINI_API_KEY)


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def embed_with_retry(text: str, retries: int = 3) -> list[float]:
    """Embed text with exponential backoff on rate limit errors."""
    for attempt in range(retries):
        try:
            result = genai.embed_content(
                model=EMBED_MODEL,
                content=text,
                task_type="retrieval_document",
            )
            return result["embedding"]
        except Exception as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"  ⚠  Rate limit / error, retrying in {wait}s… ({e})")
                time.sleep(wait)
            else:
                raise


def main():
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        print("❌  Please set GEMINI_API_KEY in backend/.env first!")
        sys.exit(1)

    if not DATA_DIR.exists():
        print(f"❌  Data directory not found: {DATA_DIR}")
        sys.exit(1)

    txt_files = list(DATA_DIR.glob("*.txt"))
    if not txt_files:
        print(f"❌  No .txt files found in {DATA_DIR}")
        sys.exit(1)

    print(f"📂  Found {len(txt_files)} data file(s): {[f.name for f in txt_files]}")

    # Connect to ChromaDB
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )

    # Clear existing data (fresh re-ingest)
    existing = collection.count()
    if existing > 0:
        print(f"🗑   Clearing {existing} existing chunks for fresh ingest…")
        collection.delete(where={"source": {"$ne": "__NONE__"}})

    all_ids, all_embeddings, all_documents, all_metadatas = [], [], [], []
    total_chunks = 0

    for file_path in txt_files:
        text = file_path.read_text(encoding="utf-8").strip()
        if not text:
            print(f"  ⚠  Skipping empty file: {file_path.name}")
            continue

        chunks = chunk_text(text)
        print(f"\n📄  {file_path.name} → {len(chunks)} chunk(s)")

        for i, chunk in enumerate(chunks):
            chunk_id = hashlib.md5(f"{file_path.name}:{i}:{chunk[:50]}".encode()).hexdigest()
            print(f"  Embedding chunk {i+1}/{len(chunks)}…", end="\r")
            embedding = embed_with_retry(chunk)

            all_ids.append(chunk_id)
            all_embeddings.append(embedding)
            all_documents.append(chunk)
            all_metadatas.append({"source": file_path.stem, "chunk_index": i})
            total_chunks += 1
            time.sleep(0.1)  # gentle rate limiting

        print(f"  ✅  {file_path.name} done ({len(chunks)} chunks)")

    # Batch upsert
    if all_ids:
        collection.upsert(
            ids=all_ids,
            embeddings=all_embeddings,
            documents=all_documents,
            metadatas=all_metadatas,
        )
        print(f"\n✅  Ingested {total_chunks} total chunks into ChromaDB at: {CHROMA_DB_PATH}")
    else:
        print("\n⚠  No chunks were ingested.")


if __name__ == "__main__":
    main()
