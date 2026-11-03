"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({ personName: "", role: "", organization: "", content: "", linkedinUrl: "", publishStatus: "PUBLISHED", displayOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    void adminRequest<Record<string, unknown>>(`/api/admin/testimonials/${id}`)
      .then((d) => {
        if (cancelled) return;
        setForm({ personName: String(d.personName || ""), role: String(d.role || ""), organization: String(d.organization || ""), content: String(d.content || ""), linkedinUrl: String(d.linkedinUrl || ""), publishStatus: String(d.publishStatus || "PUBLISHED"), displayOrder: Number(d.displayOrder || 0) });
      })
      .catch((err: unknown) => { if (!cancelled) setError(err instanceof Error ? err.message : "Could not load testimonial."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);
  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ personName: form.personName, role: form.role || null, organization: form.organization || null, content: form.content, linkedinUrl: form.linkedinUrl || null, publishStatus: form.publishStatus, displayOrder: form.displayOrder }) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/testimonials");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function archive() {
    if (!confirm("Archive this testimonial?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      router.push("/admin/testimonials");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the testimonial.");
    }
  }

  if (loading) return <div style={{ color: "#71717a", padding: 40 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/testimonials" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Testimonials</Link>
          <h1 className="admin-page-title">Edit Testimonial</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-danger" onClick={archive}><Trash2 size={15} /> Archive</button>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.personName}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Person Name *</label><input className="admin-input" value={form.personName} onChange={(e) => update("personName", e.target.value)} required /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Role</label><input className="admin-input" value={form.role} onChange={(e) => update("role", e.target.value)} /></div>
            <div className="admin-field"><label>Organization</label><input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} /></div>
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Content *</label><textarea className="admin-textarea" value={form.content} onChange={(e) => update("content", e.target.value)} rows={4} required /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>LinkedIn URL</label><input type="url" className="admin-input" value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} /></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
        </div>
      </div>
    </div>
  );
}
