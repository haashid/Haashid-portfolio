"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const EMPLOYMENT_TYPES = ["FULL_TIME","PART_TIME","INTERNSHIP","FREELANCE","CONTRACT","VOLUNTEER","LEADERSHIP"];
const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({
    position: "", company: "", companyLogoUrl: "", companyUrl: "",
    location: "", employmentType: "FULL_TIME", startDate: "", endDate: "",
    isCurrent: false, description: "", responsibilities: "", achievements: "",
    technologies: "", featured: false, displayOrder: 0, publishStatus: "PUBLISHED",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/experience/${id}`).then((r) => r.json()).then((data) => {
      setForm({
        position: data.position || "", company: data.company || "",
        companyLogoUrl: data.companyLogoUrl || "", companyUrl: data.companyUrl || "",
        location: data.location || "", employmentType: data.employmentType || "FULL_TIME",
        startDate: data.startDate ? data.startDate.split("T")[0] : "",
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        isCurrent: data.isCurrent || false, description: data.description || "",
        responsibilities: Array.isArray(data.responsibilities) ? data.responsibilities.join("\n") : "",
        achievements: Array.isArray(data.achievements) ? data.achievements.join("\n") : "",
        technologies: Array.isArray(data.technologies) ? data.technologies.join(", ") : "",
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
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishStatus: publish ? "PUBLISHED" : form.publishStatus,
          responsibilities: form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
          achievements: form.achievements.split("\n").map((s) => s.trim()).filter(Boolean),
          technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
          endDate: form.isCurrent ? null : form.endDate || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/experience");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function deleteItem() {
    if (!confirm("Archive this experience?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/experience/${id}`, { method: "DELETE" });
      router.push("/admin/experience");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the experience.");
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Loader2 size={24} className="admin-spin" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/experience" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Experience</Link>
          <h1 className="admin-page-title">Edit Experience</h1>
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
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Basic Info</h2>
          <div className="admin-form-grid">
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Position *</label>
              <input className="admin-input" value={form.position} onChange={(e) => update("position", e.target.value)} required />
            </div>
            <div className="admin-field" style={{ marginBottom: 16 }}>
              <label>Company *</label>
              <input className="admin-input" value={form.company} onChange={(e) => update("company", e.target.value)} required />
            </div>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Employment Type</label>
              <select className="admin-select" value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)}>
                {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Location</label>
              <input className="admin-input" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Start Date *</label>
              <input type="date" className="admin-input" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>End Date</label>
              <input type="date" className="admin-input" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} disabled={form.isCurrent} />
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, cursor: "pointer" }}>
                <input type="checkbox" checked={form.isCurrent} onChange={(e) => update("isCurrent", e.target.checked)} /> Currently here
              </label>
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
          </div>
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Lists</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label>Responsibilities (one per line)</label>
            <textarea className="admin-textarea" value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} rows={4} />
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label>Achievements (one per line)</label>
            <textarea className="admin-textarea" value={form.achievements} onChange={(e) => update("achievements", e.target.value)} rows={3} />
          </div>
          <div className="admin-field">
            <label>Technologies (comma-separated)</label>
            <input className="admin-input" value={form.technologies} onChange={(e) => update("technologies", e.target.value)} />
          </div>
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Links & Branding</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Company Logo URL</label>
              <input className="admin-input" value={form.companyLogoUrl} onChange={(e) => update("companyLogoUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Company URL</label>
              <input className="admin-input" value={form.companyUrl} onChange={(e) => update("companyUrl", e.target.value)} />
            </div>
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
