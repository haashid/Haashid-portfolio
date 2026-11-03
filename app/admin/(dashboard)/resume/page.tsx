"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Save, Loader2, FileText, Upload, Trash2, Copy } from "lucide-react";
import Link from "next/link";
import { adminRequest } from "@/lib/admin-client";

export default function ResumeAdminPage() {
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); }, []);

  useEffect(() => {
    adminRequest<{ url: string | null }>("/api/admin/resume")
      .then((d) => {
        if (d && d.url) setResumeUrl(d.url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf") {
      showToast("Please upload a PDF file.");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const data = await adminRequest<{ url: string }>("/api/admin/media", { method: "POST", body: fd });
      
      await adminRequest("/api/admin/resume", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      });
      setResumeUrl(data.url);
      showToast("Resume updated successfully!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function copyUrl() {
    navigator.clipboard.writeText(resumeUrl);
    showToast("Resume URL copied!");
  }

  if (loading) return <div style={{ color: "#71717a", padding: 40 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Resume / CV</h1>
          <p className="admin-page-desc">Upload and manage your primary resume PDF</p>
        </div>
      </div>

      <div className="admin-card" style={{ maxWidth: 600 }}>
        <h2 className="admin-card-title" style={{ marginBottom: 16 }}><FileText size={14} style={{ display: "inline", marginRight: 6 }} /> Current Resume</h2>
        
        {resumeUrl ? (
          <div style={{ background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(56,189,248,0.1)", color: "#38bdf8", display: "grid", placeItems: "center" }}>
                <FileText size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>resume.pdf</p>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button className="admin-btn-icon" onClick={copyUrl} style={{ fontSize: "0.8rem" }}><Copy size={13} style={{ marginRight: 4 }} /> Copy Link</button>
                  <Link href={resumeUrl} target="_blank" className="admin-btn-icon" style={{ fontSize: "0.8rem", color: "#38bdf8" }}>View PDF</Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="admin-empty" style={{ padding: "40px 20px", marginBottom: 20, border: "1px dashed rgba(255,255,255,0.1)" }}>
            <p>No resume uploaded yet.</p>
          </div>
        )}

        <div>
          <h3 style={{ fontSize: "0.9rem", marginBottom: 12, fontWeight: 500 }}>Upload New Resume</h3>
          <p className="admin-field-hint" style={{ marginBottom: 12 }}>Uploading a new PDF will replace the current one.</p>
          <button className="admin-btn admin-btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 size={15} className="admin-spin" /> : <Upload size={15} />}
            {uploading ? "Uploading…" : "Select PDF File"}
          </button>
          <input ref={fileInputRef} type="file" accept="application/pdf" style={{ display: "none" }} onChange={(e) => handleUpload(e.target.files)} />
        </div>
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
