"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, User, Globe, Mail, Phone, MapPin, Link2 } from "lucide-react";

const AVAILABILITY_OPTIONS = [
  { value: "OPEN_TO_WORK", label: "Open to Work" },
  { value: "OPEN_TO_INTERNSHIPS", label: "Open to Internships" },
  { value: "OPEN_TO_FULL_TIME", label: "Open to Full-Time" },
  { value: "OPEN_TO_FREELANCE", label: "Open to Freelance" },
  { value: "OPEN_TO_COLLABORATIONS", label: "Open to Collaborations" },
  { value: "OPEN_TO_OPPORTUNITIES", label: "Open to Opportunities" },
  { value: "NOT_AVAILABLE", label: "Not Currently Available" },
];

type Profile = {
  id?: string;
  name?: string;
  title?: string;
  shortBio?: string;
  fullBio?: string;
  location?: string;
  email?: string;
  phone?: string | null;
  website?: string | null;
  avatarUrl?: string | null;
  availabilityStatus?: string;
  availabilityMessage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  remoteOk?: boolean;
  hybridOk?: boolean;
  onSiteOk?: boolean;
};

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return <div className={`admin-toast admin-toast-${type}`}>{msg}</div>;
}

export default function ProfileAdminPage() {
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((d) => { setProfile(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function update(field: keyof Profile, value: unknown) {
    setProfile((p) => ({ ...p, [field]: value }));
    setDirty(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated = await res.json();
      setProfile(updated);
      setDirty(false);
      showToast("Profile saved successfully.");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#71717a", padding: "40px 0" }}>
      <Loader2 size={18} className="admin-spin" /> Loading profile…
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Profile</h1>
          <p className="admin-page-desc">Manage your public profile information</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? <><Loader2 size={15} className="admin-spin" /> Saving…</> : <><Save size={15} /> Save changes</>}
        </button>
      </div>

      <form onSubmit={save} className="admin-form">
        {/* Basic Info */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title"><User size={15} style={{ display: "inline", marginRight: 6 }} />Basic Information</h2>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="p-name">Full Name</label>
              <input id="p-name" className="admin-input" value={profile.name || ""} onChange={(e) => update("name", e.target.value)} placeholder="Muhammad Haashid" />
            </div>
            <div className="admin-field">
              <label htmlFor="p-title">Professional Title</label>
              <input id="p-title" className="admin-input" value={profile.title || ""} onChange={(e) => update("title", e.target.value)} placeholder="AI Engineer & Technical Builder" />
            </div>
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label htmlFor="p-shortbio">Short Bio</label>
            <p className="admin-field-hint">Displayed in the hero section (max 500 chars)</p>
            <textarea id="p-shortbio" className="admin-textarea" value={profile.shortBio || ""} onChange={(e) => update("shortBio", e.target.value)} rows={3} maxLength={500} />
          </div>
          <div className="admin-field" style={{ marginTop: 16 }}>
            <label htmlFor="p-bio">Full Biography</label>
            <p className="admin-field-hint">Displayed in the About section</p>
            <textarea id="p-bio" className="admin-textarea" value={profile.fullBio || ""} onChange={(e) => update("fullBio", e.target.value)} rows={8} style={{ minHeight: 180 }} />
          </div>
        </div>

        {/* Contact */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title"><Mail size={15} style={{ display: "inline", marginRight: 6 }} />Contact & Location</h2>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="p-email">Email</label>
              <div className="admin-input-wrap">
                <Mail size={14} className="admin-input-icon" />
                <input id="p-email" type="email" className="admin-input" value={profile.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="haashid@example.com" />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="p-phone">Phone (optional)</label>
              <div className="admin-input-wrap">
                <Phone size={14} className="admin-input-icon" />
                <input id="p-phone" className="admin-input" value={profile.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="+91 ..." />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="p-location">Location</label>
              <div className="admin-input-wrap">
                <MapPin size={14} className="admin-input-icon" />
                <input id="p-location" className="admin-input" value={profile.location || ""} onChange={(e) => update("location", e.target.value)} placeholder="Mangalore, India" />
              </div>
            </div>
            <div className="admin-field">
              <label htmlFor="p-website">Website</label>
              <div className="admin-input-wrap">
                <Globe size={14} className="admin-input-icon" />
                <input id="p-website" type="url" className="admin-input" value={profile.website || ""} onChange={(e) => update("website", e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Profile Picture</h2>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
            {profile.avatarUrl && (
              <img
                src={profile.avatarUrl}
                alt="Profile preview"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.1)" }}
              />
            )}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="admin-field">
                <label htmlFor="p-avatar">Avatar URL</label>
                <p className="admin-field-hint">Upload via Media Library, then paste URL here</p>
                <div className="admin-input-wrap">
                  <Link2 size={14} className="admin-input-icon" />
                  <input id="p-avatar" type="url" className="admin-input" value={profile.avatarUrl || ""} onChange={(e) => update("avatarUrl", e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Availability Status</h2>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="p-avail">Current Status</label>
              <select id="p-avail" className="admin-select" value={profile.availabilityStatus || "OPEN_TO_OPPORTUNITIES"} onChange={(e) => update("availabilityStatus", e.target.value)}>
                {AVAILABILITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label htmlFor="p-avail-msg">Availability Message (optional)</label>
              <input id="p-avail-msg" className="admin-input" value={profile.availabilityMessage || ""} onChange={(e) => update("availabilityMessage", e.target.value)} placeholder="Available from September 2025" />
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
            {(["remoteOk", "hybridOk", "onSiteOk"] as const).map((key) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.85rem", color: "#f4f4f5" }}>
                <input type="checkbox" checked={!!profile[key]} onChange={(e) => update(key, e.target.checked)} />
                {key === "remoteOk" ? "Remote" : key === "hybridOk" ? "Hybrid" : "On-site"}
              </label>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Call to Action</h2>
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="p-cta">CTA Button Text</label>
              <input id="p-cta" className="admin-input" value={profile.ctaText || ""} onChange={(e) => update("ctaText", e.target.value)} placeholder="Get in Touch" />
            </div>
            <div className="admin-field">
              <label htmlFor="p-ctaurl">CTA URL</label>
              <input id="p-ctaurl" className="admin-input" value={profile.ctaUrl || ""} onChange={(e) => update("ctaUrl", e.target.value)} placeholder="#contact" />
            </div>
          </div>
        </div>
      </form>

      {dirty && (
        <div className="admin-unsaved-banner">
          <span>You have unsaved changes</span>
          <button className="admin-btn admin-btn-primary" style={{ padding: "6px 14px", fontSize: "0.8rem" }} onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save now"}
          </button>
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
