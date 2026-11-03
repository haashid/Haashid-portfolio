"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({ imageUrl: "", caption: "", description: "", date: "", location: "", category: "", tags: "", publishStatus: "PUBLISHED", displayOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/gallery/${id}`);
    if (!res.ok) return setLoading(false);
    const d = await res.json();
    setForm({ imageUrl: d.imageUrl || "", caption: d.caption || "", description: d.description || "", date: d.date ? new Date(d.date).toISOString().split("T")[0] : "", location: d.location || "", category: d.category || "", tags: (d.tags || []).join(", "), publishStatus: d.publishStatus || "PUBLISHED", displayOrder: d.displayOrder || 0 });
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);
  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = { imageUrl: form.imageUrl, caption: form.caption || null, description: form.description || null, location: form.location || null, category: form.category || null, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), publishStatus: form.publishStatus, displayOrder: form.displayOrder };
      if (form.date) body.date = form.date;
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/gallery");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function archive() {
    if (!confirm("Archive this gallery item?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/gallery/${id}`, { method: "DELETE" });
      router.push("/admin/gallery");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the gallery item.");
    }
  }

  if (loading) return <div style={{ color: "#71717a", padding: 40 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/gallery" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Gallery</Link>
          <h1 className="admin-page-title">Edit Gallery Photo</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-danger" onClick={archive}><Trash2 size={15} /> Archive</button>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.imageUrl}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Image URL *</label><input type="url" className="admin-input" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} required /></div>
          {form.imageUrl && <img src={form.imageUrl} alt="Preview" style={{ marginTop: 12, maxHeight: 200, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }} />}
          <div className="admin-field" style={{ marginTop: 16, marginBottom: 16 }}><label>Caption</label><input className="admin-input" value={form.caption} onChange={(e) => update("caption", e.target.value)} /></div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Description</label><textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Date</label><input type="date" className="admin-input" value={form.date} onChange={(e) => update("date", e.target.value)} /></div>
            <div className="admin-field"><label>Location</label><input className="admin-input" value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
            <div className="admin-field"><label>Category</label><input className="admin-input" value={form.category} onChange={(e) => update("category", e.target.value)} /></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="admin-field"><label>Tags</label><p className="admin-field-hint">Comma-separated</p><input className="admin-input" value={form.tags} onChange={(e) => update("tags", e.target.value)} /></div>
        </div>
      </div>
    </div>
  );
}
