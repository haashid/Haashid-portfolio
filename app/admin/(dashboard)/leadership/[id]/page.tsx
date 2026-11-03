"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditLeadershipPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({ position: "", organization: "", description: "", startDate: "", endDate: "", isCurrent: false, publishStatus: "PUBLISHED", displayOrder: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/leadership/${id}`);
    if (!res.ok) return setLoading(false);
    const d = await res.json();
    setForm({
      position: d.position || "",
      organization: d.organization || "",
      description: d.description || "",
      startDate: d.startDate ? new Date(d.startDate).toISOString().split("T")[0] : "",
      endDate: d.endDate ? new Date(d.endDate).toISOString().split("T")[0] : "",
      isCurrent: d.isCurrent || false,
      publishStatus: d.publishStatus || "PUBLISHED",
      displayOrder: d.displayOrder || 0,
    });
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save() {
    setSaving(true); setError("");
    try {
      const body: Record<string, unknown> = { position: form.position, organization: form.organization, description: form.description || null, isCurrent: form.isCurrent, publishStatus: form.publishStatus, displayOrder: form.displayOrder };
      if (form.startDate) body.startDate = form.startDate;
      if (form.endDate) body.endDate = form.endDate;
      const res = await fetch(`/api/admin/leadership/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/leadership");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function archive() {
    if (!confirm("Archive this leadership role?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/leadership/${id}`, { method: "DELETE" });
      router.push("/admin/leadership");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the leadership role.");
    }
  }

  if (loading) return <div style={{ color: "#71717a", padding: 40 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/leadership" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Leadership</Link>
          <h1 className="admin-page-title">Edit Leadership</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-danger" onClick={archive}><Trash2 size={15} /> Archive</button>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !form.position}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />} {saving ? "Saving…" : "Save"}</button>
        </div>
      </div>
      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}
      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Position *</label><input className="admin-input" value={form.position} onChange={(e) => update("position", e.target.value)} required /></div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Organization *</label><input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} required /></div>
          <div className="admin-field" style={{ marginBottom: 16 }}><label>Description</label><textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} /></div>
          <div className="admin-form-grid">
            <div className="admin-field"><label>Start Date</label><input type="date" className="admin-input" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} /></div>
            <div className="admin-field"><label>End Date</label><input type="date" className="admin-input" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} disabled={form.isCurrent} /></div>
            <div className="admin-field"><label style={{ display: "flex", alignItems: "center", gap: 10 }}><input type="checkbox" checked={form.isCurrent} onChange={(e) => update("isCurrent", e.target.checked)} /> Currently active</label></div>
            <div className="admin-field"><label>Publish Status</label><select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>{PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
        </div>
      </div>
    </div>
  );
}
