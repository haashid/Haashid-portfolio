"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Settings, User } from "lucide-react";

export default function SettingsAdminPage() {
  const [form, setForm] = useState({
    siteTitle: "",
    metaDescription: "",
    googleAnalyticsId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); }, []);

  useEffect(() => {
    fetch("/api/admin/seo") // using seo endpoint as it manages siteSettings
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setForm({ siteTitle: d.siteTitle, metaDescription: d.metaDescription, googleAnalyticsId: d.googleAnalyticsId });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
      showToast("Settings saved successfully.");
    } catch {
      showToast("Save failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ color: "#71717a", padding: 40 }}><Loader2 size={18} className="admin-spin" /> Loading…</div>;

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Global Settings</h1>
          <p className="admin-page-desc">Manage site-wide configurations</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      <div className="admin-form">
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}><Settings size={14} style={{ display: "inline", marginRight: 6 }} /> General Information</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="settings-title">Site Title</label>
            <input id="settings-title" className="admin-input" value={form.siteTitle || ""} onChange={(e) => update("siteTitle", e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="settings-desc">Site Description</label>
            <textarea id="settings-desc" className="admin-textarea" rows={3} value={form.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}><User size={14} style={{ display: "inline", marginRight: 6 }} /> Account Management</h2>
          <p className="admin-field-hint" style={{ marginBottom: 16 }}>
            To change your password or admin email, please update your <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> environment variables and re-run the setup migration.
          </p>
          <button className="admin-btn admin-btn-secondary" disabled>Change Password (Disabled)</button>
        </div>
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
