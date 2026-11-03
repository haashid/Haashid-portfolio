"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditAchievementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({
    title: "", event: "", organization: "", placement: "", year: "",
    description: "", category: "", verificationUrl: "", imageUrl: "",
    featured: false, publishStatus: "DRAFT",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/achievements/${id}`).then((r) => r.json()).then((data) => {
      setForm({
        title: data.title || "", event: data.event || "", organization: data.organization || "",
        placement: data.placement || "", year: data.year || "", description: data.description || "",
        category: data.category || "", verificationUrl: data.verificationUrl || "",
        imageUrl: data.imageUrl || "", featured: data.featured || false,
        publishStatus: data.publishStatus || "DRAFT",
      });
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, [id]);

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save(publish = false) {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishStatus: publish ? "PUBLISHED" : form.publishStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/achievements");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function deleteItem() {
    if (!confirm("Archive this achievement?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/achievements/${id}`, { method: "DELETE" });
      router.push("/admin/achievements");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the achievement.");
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Loader2 size={24} className="admin-spin" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/achievements" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Achievements</Link>
          <h1 className="admin-page-title">Edit Achievement</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-danger" onClick={deleteItem}><Trash2 size={15} /> Archive</button>
          <button className="admin-btn admin-btn-secondary" onClick={() => save(false)} disabled={saving}><Save size={15} /> Save</button>
          <button className="admin-btn admin-btn-primary" onClick={() => save(true)} disabled={saving}>{saving ? <Loader2 size={15} className="admin-spin" /> : null} Publish</button>
        </div>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Details</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label>Title *</label>
            <input className="admin-input" value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Event / Competition</label>
              <input className="admin-input" value={form.event} onChange={(e) => update("event", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Organization</label>
              <input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Placement</label>
              <input className="admin-input" value={form.placement} onChange={(e) => update("placement", e.target.value)} placeholder="1st Place, Runner-Up…" />
            </div>
            <div className="admin-field">
              <label>Year</label>
              <input className="admin-input" value={form.year} onChange={(e) => update("year", e.target.value)} placeholder="2026" />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input className="admin-input" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="Hackathon, Innovation…" />
            </div>
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Image URL</label>
              <input className="admin-input" value={form.imageUrl} onChange={(e) => update("imageUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Verification URL</label>
              <input className="admin-input" value={form.verificationUrl} onChange={(e) => update("verificationUrl", e.target.value)} />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
            </label>
          </div>
          <div className="admin-field" style={{ marginTop: 12 }}>
            <label>Publish Status</label>
            <select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>
              {PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
