"use client";

import { useEffect, useState, useCallback } from "react";
import { Save, Loader2, Eye } from "lucide-react";
import Link from "next/link";

const PRESETS: Record<string, Partial<Theme>> = {
  DARK: {
    colorBg: "#050505", colorSurface: "rgba(255,255,255,0.03)", colorSurface2: "rgba(255,255,255,0.08)",
    colorInk: "#ffffff", colorMuted: "#a1a1aa", colorLine: "rgba(255,255,255,0.1)",
    colorAccent: "#38bdf8", colorAccentDark: "#0ea5e9", colorGold: "#fbbf24",
  },
  LIGHT: {
    colorBg: "#f8fafc", colorSurface: "rgba(0,0,0,0.03)", colorSurface2: "rgba(0,0,0,0.07)",
    colorInk: "#0f172a", colorMuted: "#64748b", colorLine: "rgba(0,0,0,0.1)",
    colorAccent: "#0ea5e9", colorAccentDark: "#0284c7", colorGold: "#d97706",
  },
  MIDNIGHT: {
    colorBg: "#0d0d1a", colorSurface: "rgba(129,140,248,0.05)", colorSurface2: "rgba(129,140,248,0.10)",
    colorInk: "#e0e0ff", colorMuted: "#a5b4fc", colorLine: "rgba(129,140,248,0.15)",
    colorAccent: "#818cf8", colorAccentDark: "#6366f1", colorGold: "#fbbf24",
  },
  OCEAN: {
    colorBg: "#030d1a", colorSurface: "rgba(34,211,238,0.04)", colorSurface2: "rgba(34,211,238,0.09)",
    colorInk: "#e0f2fe", colorMuted: "#7dd3fc", colorLine: "rgba(34,211,238,0.12)",
    colorAccent: "#22d3ee", colorAccentDark: "#06b6d4", colorGold: "#34d399",
  },
  PURPLE: {
    colorBg: "#0d0514", colorSurface: "rgba(167,139,250,0.05)", colorSurface2: "rgba(167,139,250,0.10)",
    colorInk: "#f5e6ff", colorMuted: "#c4b5fd", colorLine: "rgba(167,139,250,0.15)",
    colorAccent: "#a78bfa", colorAccentDark: "#7c3aed", colorGold: "#e879f9",
  },
};

const PRESET_LABELS: Record<string, string> = {
  DARK: "Dark", LIGHT: "Light", MIDNIGHT: "Midnight", OCEAN: "Ocean", PURPLE: "Purple",
};

const FONTS = ["Inter", "Outfit", "Roboto", "Space Grotesk", "Plus Jakarta Sans", "Sora", "Geist"];
const TABS = ["Colors", "Typography", "Layout", "Effects"] as const;
type Tab = typeof TABS[number];

type Theme = {
  colorBg: string; colorSurface: string; colorSurface2: string; colorInk: string;
  colorMuted: string; colorLine: string; colorAccent: string; colorAccentDark: string;
  colorGold: string; fontHeading: string; fontBody: string; fontMono: string;
  containerWidth: string; cardRadius: string; buttonRadius: string;
  enableGlow: boolean; enableGridBg: boolean; enableGlass: boolean; enableAnimations: boolean;
  preset: string;
};

const defaults: Theme = {
  colorBg: "#050505", colorSurface: "rgba(255,255,255,0.03)", colorSurface2: "rgba(255,255,255,0.08)",
  colorInk: "#ffffff", colorMuted: "#a1a1aa", colorLine: "rgba(255,255,255,0.1)",
  colorAccent: "#38bdf8", colorAccentDark: "#0ea5e9", colorGold: "#fbbf24",
  fontHeading: "Inter", fontBody: "Inter", fontMono: "JetBrains Mono",
  containerWidth: "1180px", cardRadius: "8px", buttonRadius: "8px",
  enableGlow: true, enableGridBg: true, enableGlass: true, enableAnimations: true,
  preset: "DARK",
};

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const safeHex = value.startsWith("#") ? value : "#38bdf8";
  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-color-field">
        <div className="admin-color-swatch" style={{ background: value }}>
          <input type="color" value={safeHex} onChange={(e) => onChange(e.target.value)} />
        </div>
        <input
          className="admin-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, fontFamily: "monospace", fontSize: "0.82rem" }}
        />
      </div>
    </div>
  );
}

const EFFECT_LABELS: Record<string, string> = {
  enableGlow: "Glow Effects",
  enableGridBg: "Grid Background",
  enableGlass: "Glass Morphism",
  enableAnimations: "Animations",
};

function EffectToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="admin-toggle-wrap">
      <p style={{ fontSize: "0.88rem", fontWeight: 500, color: "#f4f4f5", margin: 0 }}>{label}</p>
      <label className="admin-toggle">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="admin-toggle-track" />
        <span className="admin-toggle-thumb" />
      </label>
    </div>
  );
}

function LivePreview({ theme }: { theme: Theme }) {
  return (
    <div style={{
      borderRadius: theme.cardRadius,
      background: theme.colorBg,
      border: `1px solid ${theme.colorLine}`,
      padding: "20px",
      fontFamily: theme.fontBody,
      overflow: "hidden",
      minHeight: 140,
    }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
        <span style={{
          padding: "3px 10px", borderRadius: theme.buttonRadius,
          background: theme.colorAccent, color: "#fff", fontSize: "0.75rem", fontWeight: 600,
        }}>Badge</span>
        <span style={{ color: theme.colorMuted, fontSize: "0.75rem" }}>Preview</span>
      </div>
      <p style={{ color: theme.colorInk, fontSize: "0.95rem", fontWeight: 600, margin: "0 0 4px" }}>
        Heading Text
      </p>
      <p style={{ color: theme.colorMuted, fontSize: "0.8rem", margin: "0 0 12px" }}>
        Muted body copy shown here.
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{
          padding: "5px 14px", background: theme.colorAccent, color: "#fff",
          border: "none", borderRadius: theme.buttonRadius, fontSize: "0.78rem", cursor: "default",
        }}>Primary</button>
        <button style={{
          padding: "5px 14px", background: theme.colorSurface2, color: theme.colorInk,
          border: `1px solid ${theme.colorLine}`, borderRadius: theme.buttonRadius,
          fontSize: "0.78rem", cursor: "default",
        }}>Secondary</button>
      </div>
    </div>
  );
}

export default function ThemeAdminPage() {
  const [theme, setTheme] = useState<Theme>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("Colors");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }, []);

  useEffect(() => {
    fetch("/api/admin/theme")
      .then((r) => r.json())
      .then((d) => { if (d.colorBg) setTheme({ ...defaults, ...d }); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update(field: keyof Theme, value: unknown) {
    setTheme((t) => ({ ...t, [field]: value }));
    setDirty(true);
  }

  function applyPreset(preset: string) {
    const p = PRESETS[preset];
    if (p) {
      setTheme((t) => ({ ...t, ...p, preset }));
      setDirty(true);
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/theme", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setDirty(false);
      showToast("Theme saved and published.");
    } catch {
      showToast("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div style={{ color: "#71717a", padding: 40, display: "flex", alignItems: "center", gap: 10 }}>
      <Loader2 size={18} className="admin-spin" /> Loading theme...
    </div>
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Theme Studio</h1>
          <p className="admin-page-desc">Customize the visual appearance of your portfolio</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/" target="_blank" className="admin-btn admin-btn-secondary">
            <Eye size={15} /> Preview
          </Link>
          <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving || !dirty}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save & Publish"}
          </button>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 20 }}>
        <h2 className="admin-card-title" style={{ marginBottom: 14 }}>Presets</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.keys(PRESETS).map((p) => {
            const preset = PRESETS[p];
            const isActive = theme.preset === p;
            return (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                  border: isActive ? `2px solid ${preset.colorAccent}` : "1px solid rgba(255,255,255,0.1)",
                  background: isActive ? `${preset.colorAccent}22` : "rgba(255,255,255,0.03)",
                  color: isActive ? preset.colorAccent : "#a1a1aa",
                  fontWeight: isActive ? 600 : 400, fontSize: "0.85rem", transition: "all 150ms ease",
                }}
              >
                <span style={{ display: "flex", gap: 3 }}>
                  {([preset.colorBg, preset.colorAccent, preset.colorGold] as string[]).map((c, i) => (
                    <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.2)", display: "inline-block" }} />
                  ))}
                </span>
                {PRESET_LABELS[p] ?? p}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        <div>
          <div className="admin-tabs" style={{ marginBottom: 0 }}>
            {TABS.map((t) => (
              <button
                key={t}
                id={`theme-tab-${t.toLowerCase()}`}
                className={`admin-tab ${activeTab === t ? "active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {activeTab === "Colors" && (
            <div className="admin-card" style={{ borderTopLeftRadius: 0 }}>
              <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Color Tokens</h2>
              <div className="admin-form-grid">
                <ColorField label="Background" value={theme.colorBg} onChange={(v) => update("colorBg", v)} />
                <ColorField label="Ink (Text)" value={theme.colorInk} onChange={(v) => update("colorInk", v)} />
                <ColorField label="Accent" value={theme.colorAccent} onChange={(v) => update("colorAccent", v)} />
                <ColorField label="Accent Dark" value={theme.colorAccentDark} onChange={(v) => update("colorAccentDark", v)} />
                <ColorField label="Gold / Highlight" value={theme.colorGold} onChange={(v) => update("colorGold", v)} />
                <ColorField label="Muted Text" value={theme.colorMuted} onChange={(v) => update("colorMuted", v)} />
                <ColorField label="Surface" value={theme.colorSurface} onChange={(v) => update("colorSurface", v)} />
                <ColorField label="Surface 2" value={theme.colorSurface2} onChange={(v) => update("colorSurface2", v)} />
                <ColorField label="Border / Line" value={theme.colorLine} onChange={(v) => update("colorLine", v)} />
              </div>
            </div>
          )}

          {activeTab === "Typography" && (
            <div className="admin-card" style={{ borderTopLeftRadius: 0 }}>
              <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Typography</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Heading Font</label>
                  <select className="admin-select" value={theme.fontHeading} onChange={(e) => update("fontHeading", e.target.value)}>
                    {FONTS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Body Font</label>
                  <select className="admin-select" value={theme.fontBody} onChange={(e) => update("fontBody", e.target.value)}>
                    {FONTS.map((f) => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label>Monospace Font</label>
                  <input className="admin-input" value={theme.fontMono} onChange={(e) => update("fontMono", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Layout" && (
            <div className="admin-card" style={{ borderTopLeftRadius: 0 }}>
              <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Layout</h2>
              <div className="admin-form-grid">
                <div className="admin-field">
                  <label>Container Width</label>
                  <input className="admin-input" value={theme.containerWidth} onChange={(e) => update("containerWidth", e.target.value)} placeholder="1180px" />
                </div>
                <div className="admin-field">
                  <label>Card Border Radius</label>
                  <input className="admin-input" value={theme.cardRadius} onChange={(e) => update("cardRadius", e.target.value)} placeholder="8px" />
                </div>
                <div className="admin-field">
                  <label>Button Border Radius</label>
                  <input className="admin-input" value={theme.buttonRadius} onChange={(e) => update("buttonRadius", e.target.value)} placeholder="8px" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "Effects" && (
            <div className="admin-card" style={{ borderTopLeftRadius: 0 }}>
              <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Effects</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {(["enableGlow", "enableGridBg", "enableGlass", "enableAnimations"] as const).map((key) => (
                  <EffectToggle
                    key={key}
                    label={EFFECT_LABELS[key]}
                    checked={theme[key]}
                    onChange={(v) => update(key, v)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: "sticky", top: 20 }}>
          <div className="admin-card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: "0.78rem", color: "#71717a", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, fontWeight: 600 }}>
              Live Preview
            </h3>
            <LivePreview theme={theme} />
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {([theme.colorBg, theme.colorAccent, theme.colorGold, theme.colorMuted, theme.colorInk] as string[]).map((c, i) => (
                <div key={i} title={c} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: "1px solid rgba(255,255,255,0.1)" }} />
              ))}
            </div>
            <p style={{ fontSize: "0.73rem", color: "#52525b", marginTop: 8 }}>
              {dirty ? "Unsaved changes" : "Saved"}
            </p>
          </div>
        </div>
      </div>

      {toast && <div className="admin-toast admin-toast-success">{toast}</div>}
    </div>
  );
}
