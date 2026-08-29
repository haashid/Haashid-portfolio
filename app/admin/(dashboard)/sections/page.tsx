"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";

const DEFAULT_SECTIONS = [
  { key: "hero", label: "Hero" },
  { key: "about", label: "About" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "achievements", label: "Achievements" },
  { key: "certificates", label: "Certificates" },
  { key: "leadership", label: "Leadership" },
  { key: "workshops", label: "Workshops" },
  { key: "blog", label: "Blog" },
  { key: "gallery", label: "Gallery" },
  { key: "testimonials", label: "Testimonials" },
  { key: "ai-twin", label: "AI Twin" },
  { key: "contact", label: "Contact" },
];

type Section = { id?: string; key: string; label: string; enabled: boolean; order: number };

export default function SectionsAdminPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState<number | null>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); }, []);

  useEffect(() => {
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((data: Section[]) => {
        if (data.length === 0) {
          setSections(DEFAULT_SECTIONS.map((s, i) => ({ ...s, enabled: true, order: i })));
        } else {
          const merged = DEFAULT_SECTIONS.map((def) => {
            const existing = data.find((d) => d.key === def.key);
            return existing ?? { ...def, enabled: true, order: 99 };
          });
          merged.sort((a, b) => a.order - b.order);
          setSections(merged);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggleEnabled(key: string) {
    setSections((s) => s.map((sec) => sec.key === key ? { ...sec, enabled: !sec.enabled } : sec));
    setDirty(true);
  }

  function handleDragStart(index: number) { setDragging(index); }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragging === null || dragging === index) return;
    setSections((s) => {
      const arr = [...s];
      const [removed] = arr.splice(dragging, 1);
      arr.splice(index, 0, removed);
      setDragging(index);
      setDirty(true);
      return arr.map((sec, i) => ({ ...sec, order: i }));
    });
  }

  function handleDragEnd() { setDragging(null); }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sections.map((s, i) => ({ ...s, order: i }))),
      });
      if (!res.ok) throw new Error();
      setDirty(false);
      showToast("Sections saved. Changes are live.");
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
          <h1 className="admin-page-title">Section Manager</h1>
          <p className="admin-page-desc">Enable/disable and reorder portfolio sections. Drag to reorder.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? <><Loader2 size={15} className="admin-spin" /> Saving…</> : <><Save size={15} /> Save Layout</>}
        </button>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {sections.map((sec, i) => (
            <div
              key={sec.key}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 14px",
                background: dragging === i ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.03)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
                cursor: "grab",
                opacity: sec.enabled ? 1 : 0.5,
                transition: "background 120ms ease",
                userSelect: "none",
              }}
            >
              <GripVertical size={16} style={{ color: "#71717a", flexShrink: 0 }} />
              <span style={{ fontWeight: 500, flex: 1, fontSize: "0.9rem" }}>{sec.label}</span>
              <span style={{ fontSize: "0.75rem", color: "#71717a", fontFamily: "monospace" }}>#{sec.key}</span>
              <button
                className="admin-btn-icon"
                onClick={() => toggleEnabled(sec.key)}
                title={sec.enabled ? "Disable section" : "Enable section"}
                style={{ color: sec.enabled ? "#4ade80" : "#71717a" }}
              >
                {sec.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
