type ThemeTokens = {
  preset?: string;
  colorBg?: string;
  colorSurface?: string;
  colorSurface2?: string;
  colorInk?: string;
  colorMuted?: string;
  colorLine?: string;
  colorAccent?: string;
  colorAccentDark?: string;
  colorGold?: string;
  fontHeading?: string;
  fontBody?: string;
  fontMono?: string;
  containerWidth?: string;
  cardRadius?: string;
  buttonRadius?: string;
  enableGlow?: boolean;
  enableGridBg?: boolean;
  enableGlass?: boolean;
  enableAnimations?: boolean;
} | null;

const DEFAULTS = {
  colorBg: "#050505", colorSurface: "rgba(255,255,255,0.03)", colorSurface2: "rgba(255,255,255,0.08)",
  colorInk: "#ffffff", colorMuted: "#a1a1aa", colorLine: "rgba(255,255,255,0.1)",
  colorAccent: "#38bdf8", colorAccentDark: "#0ea5e9", colorGold: "#fbbf24",
};

function safeColor(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  const hex = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;
  const rgb = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;
  return hex.test(value) || rgb.test(value) ? value : fallback;
}

function safeFont(value: string | undefined, fallback: string) {
  if (value === "Inter") return "var(--font-sans)";
  if (value === "JetBrains Mono") return "var(--font-mono)";
  return fallback;
}

function safePixel(value: string | undefined, fallback: string, max: number) {
  if (!value || !/^\d{1,4}px$/.test(value)) return fallback;
  const number = Number.parseInt(value, 10);
  return number > 0 && number <= max ? value : fallback;
}

export function getThemeMarkup(theme: ThemeTokens) {
  const isLight = theme?.preset === "LIGHT";
  const color = (key: keyof typeof DEFAULTS) => safeColor(theme?.[key], DEFAULTS[key]);
  const vars = `
  --bg:${color("colorBg")}; --surface:${color("colorSurface")}; --surface-2:${color("colorSurface2")};
  --ink:${color("colorInk")}; --muted:${color("colorMuted")}; --line:${color("colorLine")};
  --accent:${color("colorAccent")}; --accent-dark:${color("colorAccentDark")}; --gold:${color("colorGold")};
  --shadow:0 24px 80px rgba(0,0,0,.24);
  --glow:${theme?.enableGlow === false ? "none" : `0 0 40px color-mix(in srgb, ${color("colorAccent")} 24%, transparent)`};
  --glass-bg:${theme?.enableGlass === false ? color("colorSurface") : "rgba(0,0,0,.4)"};
  --grid-line:${theme?.enableGridBg === false ? "transparent" : color("colorLine")};
  --font-heading-theme:${safeFont(theme?.fontHeading, "'Inter'")};
  --font-body-theme:${safeFont(theme?.fontBody, "'Inter'")};
  --font-mono-theme:${safeFont(theme?.fontMono, "'JetBrains Mono'")};
  --container-width:${safePixel(theme?.containerWidth, "1180px", 1600)};
  --card-radius:${safePixel(theme?.cardRadius, "8px", 32)};
  --button-radius:${safePixel(theme?.buttonRadius, "8px", 32)};
`;
  return {
    colorScheme: isLight ? "light" : "dark",
    css: `html[data-theme="${isLight ? "light" : "dark"}"] {${vars}}`,
    animations: theme?.enableAnimations !== false,
  };
}
