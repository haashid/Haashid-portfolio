"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { adminRequest } from "@/lib/admin-client";

type Hero = { heading: string; subtitle: string; description: string; badge: string | null; primaryCta: string | null; primaryCtaUrl: string | null; secondaryCta: string | null; secondaryCtaUrl: string | null; heroImageUrl: string | null; published: boolean };
const emptyHero: Hero = { heading: "", subtitle: "", description: "", badge: "", primaryCta: "", primaryCtaUrl: "", secondaryCta: "", secondaryCtaUrl: "", heroImageUrl: "", published: true };

export default function HeroAdminPage() {
  const [form, setForm] = useState<Hero>(emptyHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminRequest<Hero | null>("/api/admin/hero").then((hero) => {
      if (hero) setForm({ ...emptyHero, ...hero });
    }).catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load hero content.")).finally(() => setLoading(false));
  }, []);

  function update<K extends keyof Hero>(field: K, value: Hero[K]) {
    setForm((current) => ({ ...current, [field]: value }));
    setSuccess("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try {
      const saved = await adminRequest<Hero>("/api/admin/hero", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setForm({ ...emptyHero, ...saved }); setSuccess("Hero content saved.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save hero content."); }
    finally { setSaving(false); }
  }

  if (loading) return <div style={{ padding: 40, color: "#a1a1aa" }}><Loader2 className="admin-spin" size={18} /> Loading hero content…</div>;

  return <div>
    <div className="admin-page-header"><div><h1 className="admin-page-title">Hero</h1><p className="admin-page-desc">Edit the public portfolio introduction and calls to action.</p></div><button form="hero-form" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}{saving ? "Saving…" : "Save Changes"}</button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}{success && <p role="status">{success}</p>}
    <form id="hero-form" className="admin-form" onSubmit={save}>
      <section className="admin-card"><h2 className="admin-card-title">Hero content</h2>
        <div className="admin-field"><label htmlFor="hero-heading">Heading</label><textarea id="hero-heading" className="admin-textarea" required maxLength={500} value={form.heading} onChange={(event) => update("heading", event.target.value)} /></div>
        <div className="admin-field"><label htmlFor="hero-subtitle">Subtitle</label><input id="hero-subtitle" className="admin-input" value={form.subtitle} onChange={(event) => update("subtitle", event.target.value)} /></div>
        <div className="admin-field"><label htmlFor="hero-description">Description</label><textarea id="hero-description" className="admin-textarea" rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} /></div>
        <div className="admin-field"><label htmlFor="hero-badge">Badge</label><input id="hero-badge" className="admin-input" value={form.badge || ""} onChange={(event) => update("badge", event.target.value)} /></div>
      </section>
      <section className="admin-card"><h2 className="admin-card-title">Calls to action and image</h2>
        <div className="admin-form-grid">
          <label className="admin-field">Primary button<input className="admin-input" value={form.primaryCta || ""} onChange={(event) => update("primaryCta", event.target.value)} /></label>
          <label className="admin-field">Primary URL<input className="admin-input" value={form.primaryCtaUrl || ""} onChange={(event) => update("primaryCtaUrl", event.target.value)} /></label>
          <label className="admin-field">Secondary button<input className="admin-input" value={form.secondaryCta || ""} onChange={(event) => update("secondaryCta", event.target.value)} /></label>
          <label className="admin-field">Secondary URL<input className="admin-input" value={form.secondaryCtaUrl || ""} onChange={(event) => update("secondaryCtaUrl", event.target.value)} /></label>
          <label className="admin-field">Image URL<input className="admin-input" type="url" value={form.heroImageUrl || ""} onChange={(event) => update("heroImageUrl", event.target.value)} /></label>
          <label className="admin-field">Visibility<select className="admin-select" value={form.published ? "published" : "draft"} onChange={(event) => update("published", event.target.value === "published")}><option value="published">Published</option><option value="draft">Draft</option></select></label>
        </div>
      </section>
    </form>
  </div>;
}
