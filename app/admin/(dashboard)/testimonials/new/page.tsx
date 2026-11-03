"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewTestimonialPage() {
  const router = useRouter();
  const [form, setForm] = useState({ personName: "", role: "", organization: "", content: "", linkedinUrl: "", website: "", publishStatus: "PUBLISHED", displayOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const body = { personName: form.personName, role: form.role || null, organization: form.organization || null, content: form.content, linkedinUrl: form.linkedinUrl || null, website: form.website || null, publishStatus: form.publishStatus, displayOrder: form.displayOrder };
      const res = await fetch("/api/admin/testimonials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/testimonials");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/testimonials" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Testimonials</Link>
          <h1 className="admin-page-title">New Testimonial</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.personName || !form.content}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Person Name *</label><input className="admin-input" value={form.personName} onChange={(e) => update("personName", e.target.value)} required /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Role</label><input className="admin-input" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Software Engineer" /></div>
            <div className="admin-field"><label>Organization</label><input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} placeholder="Google" /></div>
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Testimonial Content *</label><textarea className="admin-textarea" value={form.content} onChange={(e) => update("content", e.target.value)} rows={4} required /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>LinkedIn URL</label><input type="url" className="admin-input" value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} /></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
        </div>
      </div>
    </div>
  );
}
