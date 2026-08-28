"""
RAG Engine — Retrieval Augmented Generation
Handles embedding queries and retrieving relevant chunks from ChromaDB.
"""
import os
import chromadb
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY    = os.getenv("GEMINI_API_KEY")
CHROMA_DB_PATH    = os.getenv("CHROMA_DB_PATH", "./chroma_db")
EMBED_MODEL       = os.getenv("GEMINI_EMBED_MODEL", "models/text-embedding-004")
TOP_K             = int(os.getenv("TOP_K_RESULTS", 5))
COLLECTION_NAME   = "my_knowledge"

genai.configure(api_key=GEMINI_API_KEY)

# Singleton Chroma client & collection
_client: chromadb.PersistentClient | None = None
_collection = None


def _get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=CHROMA_DB_PATH)
        _collection = _client.get_or_create_collection(
            name=COLLECTION_NAME,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def embed_text(text: str) -> list[float]:
    """Return embedding vector for a given text."""
    result = genai.embed_content(
        model=EMBED_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]


def retrieve(query: str, top_k: int = TOP_K) -> list[str]:
    """
    Embed the query and return the top-k most relevant
    document chunks from the knowledge base.
    """
    collection = _get_collection()
    count = collection.count()
    if count == 0:
        return []

    query_embedding = embed_text(query)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=min(top_k, count),
        include=["documents", "metadatas"],
    )

    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]

    # Annotate each chunk with its source file for transparency
    annotated = []
    for doc, meta in zip(docs, metas):
        source = meta.get("source", "unknown")
        annotated.append(f"[Source: {source}]\n{doc}")

    return annotated


def knowledge_base_is_empty() -> bool:
    """Returns True if no documents have been ingested yet."""
    try:
        return _get_collection().count() == 0
    except Exception:
        return True
