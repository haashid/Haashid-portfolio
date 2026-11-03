"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewGalleryPage() {
  const router = useRouter();
  const [form, setForm] = useState({ imageUrl: "", caption: "", description: "", date: "", location: "", category: "", tags: "", publishStatus: "PUBLISHED", displayOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = { imageUrl: form.imageUrl, caption: form.caption || null, description: form.description || null, location: form.location || null, category: form.category || null, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), publishStatus: form.publishStatus, displayOrder: form.displayOrder };
      if (form.date) body.date = form.date;
      const res = await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/gallery");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/gallery" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Gallery</Link>
          <h1 className="admin-page-title">Add Gallery Photo</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.imageUrl}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Image URL *</label><p className="admin-field-hint">Upload in Media Library, then paste URL here</p><input type="url" className="admin-input" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} required /></div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{ marginTop: 12, maxHeight: 200, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }} />}
          <div className="admin-field" style={{ marginTop: 16, marginBottom: 16 }}><label>Caption</label><input className="admin-input" value={form.caption} onChange={(e) => update("caption", e.target.value)} /></div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Description</label><textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Date</label><input type="date" className="admin-input" value={form.date} onChange={(e) => update("date", e.target.value)} /></div>
            <div className="admin-field"><label>Location</label><input className="admin-input" value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
            <div className="admin-field"><label>Category</label><input className="admin-input" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Workshop, Event…" /></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="admin-field"><label>Tags</label><p className="admin-field-hint">Comma-separated</p><input className="admin-input" value={form.tags} onChange={(e) => update("tags", e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
