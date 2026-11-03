"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminRequest } from "@/lib/admin-client";
import { Save, Loader2, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";

const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function EditCertificatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [form, setForm] = useState({
    name: "", organization: "", issueDate: "", credentialId: "",
    verificationUrl: "", fileUrl: "", thumbnailUrl: "", description: "",
    category: "", featured: false, isPublic: true, displayOrder: 0,
    publishStatus: "PUBLISHED", achievementId: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/certificates/${id}`).then((r) => r.json()).then((data) => {
      setForm({
        name: data.name || "", organization: data.organization || "",
        issueDate: data.issueDate ? data.issueDate.split("T")[0] : "",
        credentialId: data.credentialId || "", verificationUrl: data.verificationUrl || "",
        fileUrl: data.fileUrl || "", thumbnailUrl: data.thumbnailUrl || "",
        description: data.description || "", category: data.category || "",
        featured: data.featured || false, isPublic: data.isPublic !== false,
        displayOrder: data.displayOrder || 0, publishStatus: data.publishStatus || "PUBLISHED",
        achievementId: data.achievementId || "",
      });
      setLoading(false);
    }).catch(() => { setError("Failed to load"); setLoading(false); });
  }, [id]);

  function update(field: string, value: unknown) { setForm((f) => ({ ...f, [field]: value })); }

  async function save(publish = false) {
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishStatus: publish ? "PUBLISHED" : form.publishStatus, achievementId: form.achievementId || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      router.push("/admin/certificates");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); setSaving(false); }
  }

  async function deleteItem() {
    if (!confirm("Archive this certificate?")) return;
    setError("");
    try {
      await adminRequest(`/api/admin/certificates/${id}`, { method: "DELETE" });
      router.push("/admin/certificates");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the certificate.");
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: "center" }}><Loader2 size={24} className="admin-spin" /></div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/certificates" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}><ArrowLeft size={13} /> Certificates</Link>
          <h1 className="admin-page-title">Edit Certificate</h1>
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
            <label>Certificate Name *</label>
            <input className="admin-input" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Issuing Organization *</label>
              <input className="admin-input" value={form.organization} onChange={(e) => update("organization", e.target.value)} required />
            </div>
            <div className="admin-field">
              <label>Issue Date</label>
              <input type="date" className="admin-input" value={form.issueDate} onChange={(e) => update("issueDate", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Credential ID</label>
              <input className="admin-input" value={form.credentialId} onChange={(e) => update("credentialId", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Category</label>
              <input className="admin-input" value={form.category} onChange={(e) => update("category", e.target.value)} />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label>Description</label>
            <textarea className="admin-textarea" value={form.description} onChange={(e) => update("description", e.target.value)} rows={3} />
          </div>
        </div>
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Files & Links</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label>Verification URL</label>
              <input className="admin-input" value={form.verificationUrl} onChange={(e) => update("verificationUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>File URL</label>
              <input className="admin-input" value={form.fileUrl} onChange={(e) => update("fileUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Thumbnail URL</label>
              <input className="admin-input" value={form.thumbnailUrl} onChange={(e) => update("thumbnailUrl", e.target.value)} />
            </div>
            <div className="admin-field">
              <label>Linked Achievement ID</label>
              <input className="admin-input" value={form.achievementId} onChange={(e) => update("achievementId", e.target.value)} placeholder="Optional" />
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
          <div className="admin-field" style={{ marginTop: 12, display: "flex", gap: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="checkbox" checked={form.isPublic} onChange={(e) => update("isPublic", e.target.checked)} /> Public
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
