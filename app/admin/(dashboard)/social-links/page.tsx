"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Link2, GripVertical, Plus, Trash2 } from "lucide-react";

type SocialLink = { id: string; platform: string; label: string; url: string; icon: string; enabled: boolean; displayOrder: number };

export default function SocialLinksAdminPage() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); }, []);

  useEffect(() => {
    fetch("/api/admin/social-links")
      .then((r) => r.json())
      .then((d) => { setLinks(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update(index: number, field: keyof SocialLink, value: unknown) {
    setLinks((arr) => {
      const copy = [...arr];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
    setDirty(true);
  }

  function addLink() {
    setLinks([...links, { id: "new_" + Date.now(), platform: "website", label: "Website", url: "https://", icon: "Link2", enabled: true, displayOrder: links.length }]);
    setDirty(true);
  }

  function removeLink(index: number) {
    setLinks((arr) => arr.filter((_, i) => i !== index));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/social-links", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(links.map((l, i) => ({ ...l, displayOrder: i }))),
      });
      if (!res.ok) throw new Error();
      setLinks(await res.json());
      setDirty(false);
      showToast("Social links saved successfully.");
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
          <h1 className="admin-page-title">Social Links</h1>
          <p className="admin-page-desc">Manage the social media and contact links displayed on your portfolio</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={addLink}>
            <Plus size={15} /> Add Link
          </button>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="admin-card">
        {links.length === 0 ? (
          <div style={{ color: "#71717a", textAlign: "center", padding: 40 }}>No links added yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {links.map((link, i) => (
              <div key={link.id} style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255,255,255,0.02)", padding: 16, borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ cursor: "grab", color: "#71717a", paddingTop: 10 }}><GripVertical size={16} /></div>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12 }}>
                  <div className="admin-field">
                    <label>Platform/Icon</label>
                    <input className="admin-input" value={link.platform} onChange={(e) => update(i, "platform", e.target.value)} placeholder="github, linkedin..." />
                  </div>
                  <div className="admin-field">
                    <label>Label</label>
                    <input className="admin-input" value={link.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="GitHub" />
                  </div>
                  <div className="admin-field">
                    <label>URL</label>
                    <input className="admin-input" value={link.url} onChange={(e) => update(i, "url", e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div style={{ paddingTop: 26, display: "flex", gap: 10 }}>
                  <label className="admin-toggle" title="Enable/Disable">
                    <input type="checkbox" checked={link.enabled} onChange={(e) => update(i, "enabled", e.target.checked)} />
                    <span className="admin-toggle-track" /><span className="admin-toggle-thumb" />
                  </label>
                  <button className="admin-btn-icon" style={{ color: "#f87171" }} onClick={() => removeLink(i)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
