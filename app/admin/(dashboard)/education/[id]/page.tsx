"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditEducationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({
    institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "",
    grade: "", description: "", activities: "", featured: false,
    displayOrder: 0, publishStatus: "PUBLISHED",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/education/${id}`).then((r) => r.json()).then((data) => {
      setForm({
        institution: data.institution || "", degree: data.degree || "",
        fieldOfStudy: data.fieldOfStudy || "",
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        grade: data.grade || "", description: data.description || "",
        activities: Array.isArray(data.activities) ? data.activities.join("\n") : "",
        featured: data.featured || false, displayOrder: data.displayOrder || 0,
        publishStatus: data.publishStatus || "PUBLISHED",
      });
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, [id]);

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save(publish = false) {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/education/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishStatus: publish ? "PUBLISHED" : form.publishStatus,
          activities: form.activities.split("\n").map((s) => s.trim()).filter(Boolean),
          endDate: form.endDate || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/education");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function deleteItem() {
    if (!confirm("Archive this education?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/education/${id}`, { method: "DELETE" });
      router.push("/admin/education");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the education record.");
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Loader2 size={24} className="admin-spin" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/education" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Education</Link>
          <h1 className="admin-page-title">Edit Education</h1>
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
          <div className="admin-form-grid">
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Institution *</label>
              <input className="admin-input" value={form.institution} onChange={(e) => update("institution", e.target.value)} required />
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Degree *</label>
              <input className="admin-input" value={form.degree} onChange={(e) => update("degree", e.target.value)} required />
            </div>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Field of Study</label>
              <input className="admin-input" value={form.fieldOfStudy} onChange={(e) => update("fieldOfStudy", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Grade / GPA</label>
              <input className="admin-input" value={form.grade} onChange={(e) => update("grade", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Start Date *</label>
              <input type="date" className="admin-input" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>End Date</label>
              <input type="date" className="admin-input" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label>Activities (one per line)</label>
            <textarea className="admin-textarea" value={form.activities} onChange={(e) => update("activities", e.target.value)} rows={3} />
          </div>
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Visibility</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Publish Status</label>
              <select className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>
                {PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Display Order</label>
              <input type="number" className="admin-input" value={form.displayOrder} onChange={(e) => update("displayOrder", parseInt(e.target.value) || 0)} />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
