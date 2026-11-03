"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewWorkshopPage() {
  const router = useRouter();
  const [form, setForm] = useState({ eventName: "", organization: "", role: "", date: "", location: "", audienceSize: "", description: "", topics: "", articleUrl: "", eventUrl: "", publishStatus: "PUBLISHED", displayOrder: 0 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = { eventName: form.eventName, organization: form.organization || null, role: form.role || null, location: form.location || null, audienceSize: form.audienceSize ? parseInt(form.audienceSize) : null, description: form.description || null, topics: form.topics.split(",").map((t) => t.trim()).filter(Boolean), articleUrl: form.articleUrl || null, eventUrl: form.eventUrl || null, publishStatus: form.publishStatus, displayOrder: form.displayOrder };
      if (form.date) body.date = form.date;
      const res = await fetch("/api/admin/workshops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/workshops");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/workshops" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Workshops</Link>
          <h1 className="admin-page-title">New Workshop</h1>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.eventName}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Event Name *</label><input className="admin-input" value={form.eventName} onChange={(e) => update("eventName", e.target.value)} required /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Organization</label><input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} /></div>
            <div className="admin-field"><label>Role</label><input className="admin-input" value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Workshop Facilitator" /></div>
            <div className="admin-field"><label>Date</label><input type="date" className="admin-input" value={form.date} onChange={(e) => update("date", e.target.value)} /></div>
            <div className="admin-field"><label>Location</label><input className="admin-input" value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
            <div className="admin-field"><label>Audience Size</label><input type="number" className="admin-input" value={form.audienceSize} onChange={(e) => update("audienceSize", e.target.value)} /></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Description</label><textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} /></div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Topics</label><p className="admin-field-hint">Comma-separated</p><input className="admin-input" value={form.topics} onChange={(e) => update("topics", e.target.value)} placeholder="Arduino, RC Cars, Programming" /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Article URL</label><input type="url" className="admin-input" value={form.articleUrl} onChange={(e) => update("articleUrl", e.target.value)} /></div>
            <div className="admin-field"><label>Event URL</label><input type="url" className="admin-input" value={form.eventUrl} onChange={(e) => update("eventUrl", e.target.value)} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
