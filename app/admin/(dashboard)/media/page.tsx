"use client";

import { useEffect, useState, useRef } from "react";
import { Upload, Search, Trash2, Copy, Image, Loader2, X } from "lucide-react";
import { adminRequest } from "@/lib/admin-client";

type MediaItem = {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  category: string | null;
  createdAt: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

export default function MediaAdminPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  async function loadMedia(q?: string) {
    const url = `/api/admin/media${q ? `?q=${encodeURIComponent(q)}` : ""}`;
    setError("");
    try {
      setMedia(await adminRequest<MediaItem[]>(url));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadMedia(); }, []);

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: MediaItem[] = [];
    const failures: string[] = [];
    setError("");
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        try {
          uploaded.push(await adminRequest<MediaItem>("/api/admin/media", { method: "POST", body: fd }));
        } catch (err) {
          failures.push(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
        }
      }
      if (uploaded.length) setMedia((m) => [...uploaded, ...m]);
      if (failures.length) setError(failures.join(" "));
      else showToast(`${uploaded.length} file(s) uploaded.`);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    showToast("URL copied to clipboard!");
  }

  async function deleteMedia(id: string) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/media/${id}`, { method: "DELETE" });
      setMedia((m) => m.filter((item) => item.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete this file.");
    }
  }

  const filtered = media.filter((m) =>
    !query || m.originalName.toLowerCase().includes(query.toLowerCase()) || m.alt?.toLowerCase().includes(query.toLowerCase())
  );

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div style={{ display: "flex", gap: 20, height: "calc(100vh - 140px)", overflow: "hidden" }}>
      {error && <p role="alert" style={{ position: "absolute", zIndex: 2, top: 88, right: 24, maxWidth: 420, color: "#f87171" }}>{error}</p>}
      {/* Main panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div className="admin-page-header" style={{ marginBottom: 16 }}>
          <div>
            <h1 className="admin-page-title">Media Library</h1>
            <p className="admin-page-desc">{media.length} files</p>
          </div>
          <button className="admin-btn admin-btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={15} className="admin-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading…" : "Upload Files"}
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*,application/pdf" style={{ display: "none" }} onChange={(e) => uploadFiles(e.target.files)} />
        </div>

        {/* Search */}
        <div style={{ marginBottom: 16 }}>
          <div className="admin-input-wrap">
            <Search size={14} className="admin-input-icon" />
            <input
              className="admin-input"
              placeholder="Search files…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); }}
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`admin-upload-zone ${dragOver ? "drag-over" : ""}`}
          style={{ marginBottom: 16, padding: 16 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={20} style={{ opacity: 0.5, marginBottom: 4 }} />
          <p>Drag and drop files here, or click to select</p>
          <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>Images (JPG, PNG, WebP, AVIF, SVG) · PDFs · Max 20 MB</p>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ color: "#71717a", padding: 20 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty"><div className="admin-empty-icon"><Image size={40} /></div><h3>No files yet</h3><p>Upload files to build your media library.</p></div>
        ) : (
          <div style={{ overflowY: "auto", flex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
              {filtered.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "rgba(255,255,255,0.03)", border: `1px solid ${selected?.id === item.id ? "#38bdf8" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 8, overflow: "hidden", cursor: "pointer", transition: "border-color 140ms ease",
                  }}
                  onClick={() => setSelected(item)}
                >
                  {isImage(item.mimeType) ? (
                    <img src={item.url} alt={item.alt || item.originalName} style={{ width: "100%", height: 90, objectFit: "cover" }} />
                  ) : (
                    <div style={{ height: 90, display: "grid", placeItems: "center", background: "rgba(255,255,255,0.04)", color: "#71717a" }}>
                      <span style={{ fontSize: "0.7rem" }}>PDF</span>
                    </div>
                  )}
                  <div style={{ padding: "6px 8px" }}>
                    <p style={{ fontSize: "0.7rem", color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.originalName}</p>
                    <p style={{ fontSize: "0.65rem", color: "#71717a" }}>{formatBytes(item.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="admin-card" style={{ width: 280, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, height: "fit-content" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontWeight: 600, fontSize: "0.85rem" }}>File Details</p>
            <button className="admin-btn-icon" onClick={() => setSelected(null)}><X size={14} /></button>
          </div>
          {isImage(selected.mimeType) && (
            <img src={selected.url} alt={selected.alt || ""} style={{ width: "100%", borderRadius: 6, maxHeight: 160, objectFit: "cover" }} />
          )}
          <div>
            <p style={{ fontSize: "0.72rem", color: "#71717a" }}>FILENAME</p>
            <p style={{ fontSize: "0.82rem", wordBreak: "break-all" }}>{selected.originalName}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#71717a" }}>SIZE</p>
            <p style={{ fontSize: "0.82rem" }}>{formatBytes(selected.size)}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.72rem", color: "#71717a", marginBottom: 4 }}>URL</p>
            <div style={{ display: "flex", gap: 6 }}>
              <input className="admin-input" value={selected.url} readOnly style={{ fontSize: "0.75rem", flex: 1 }} />
              <button className="admin-btn-icon" onClick={() => copyUrl(selected.url)} title="Copy URL"><Copy size={13} /></button>
            </div>
          </div>
          <button className="admin-btn admin-btn-danger" onClick={() => deleteMedia(selected.id)}>
            <Trash2 size={14} /> Delete File
          </button>
        </div>
      )}

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
