"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Globe } from "lucide-react";

export default function SeoAdminPage() {
  const [form, setForm] = useState({
    siteTitle: "",
    metaDescription: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: "",
    twitterHandle: "",
    keywords: "",
    googleAnalyticsId: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); }, []);

  useEffect(() => {
    fetch("/api/admin/seo")
      .then((r) => r.json())
      .then((d) => {
        if (d && !d.error) setForm(d);
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
      showToast("SEO settings saved successfully.");
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
          <h1 className="admin-page-title">SEO & Metadata</h1>
          <p className="admin-page-desc">Manage search engine visibility and social sharing cards</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>

      <div className="admin-form">
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}><Globe size={14} style={{ display: "inline", marginRight: 6 }} /> General SEO</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="seo-title">Site Title</label>
            <p className="admin-field-hint">The main title for your portfolio (e.g. "John Doe | Developer")</p>
            <input id="seo-title" className="admin-input" value={form.siteTitle || ""} onChange={(e) => update("siteTitle", e.target.value)} />
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="seo-desc">Meta Description</label>
            <p className="admin-field-hint">A brief description shown in Google search results (150-160 characters)</p>
            <textarea id="seo-desc" className="admin-textarea" rows={3} maxLength={160} value={form.metaDescription || ""} onChange={(e) => update("metaDescription", e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="seo-keys">Keywords</label>
            <p className="admin-field-hint">Comma-separated tags (e.g. "developer, react, nextjs, portfolio")</p>
            <input id="seo-keys" className="admin-input" value={form.keywords || ""} onChange={(e) => update("keywords", e.target.value)} />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Open Graph (Social Sharing)</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="og-title">OG Title</label>
              <input id="og-title" className="admin-input" value={form.ogTitle || ""} onChange={(e) => update("ogTitle", e.target.value)} placeholder="Title when shared on Twitter/LinkedIn" />
            </div>
            <div className="admin-field">
              <label htmlFor="og-twitter">Twitter Handle</label>
              <input id="og-twitter" className="admin-input" value={form.twitterHandle || ""} onChange={(e) => update("twitterHandle", e.target.value)} placeholder="@username" />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16, marginBottom: 16 }}>
            <label htmlFor="og-desc">OG Description</label>
            <textarea id="og-desc" className="admin-textarea" rows={2} value={form.ogDescription || ""} onChange={(e) => update("ogDescription", e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="og-img">OG Image URL</label>
            <p className="admin-field-hint">The image shown when linking your portfolio on social media (1200x630)</p>
            <input id="og-img" className="admin-input" value={form.ogImageUrl || ""} onChange={(e) => update("ogImageUrl", e.target.value)} placeholder="https://..." />
            {form.ogImageUrl && <img src={form.ogImageUrl} alt="OG Preview" style={{ marginTop: 12, height: 160, borderRadius: 6, objectFit: "cover", border: "1px solid rgba(255,255,255,0.08)" }} />}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Analytics</h2>
          <div className="admin-field">
            <label htmlFor="ga-id">Google Analytics ID</label>
            <p className="admin-field-hint">Measurement ID (e.g. "G-XXXXXXXXXX")</p>
            <input id="ga-id" className="admin-input" value={form.googleAnalyticsId || ""} onChange={(e) => update("googleAnalyticsId", e.target.value)} placeholder="G-..." />
          </div>
        </div>
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
