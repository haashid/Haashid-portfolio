"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  FolderPlus,
  Trophy,
  Award,
  Briefcase,
  Palette,
  Layers,
  User,
  BookOpen,
  Image,
  ExternalLink,
  LogOut,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";

const commands = [
  { id: "add-project",      label: "Add Project",          href: "/admin/projects/new",      icon: FolderPlus },
  { id: "add-achievement",  label: "Add Achievement",       href: "/admin/achievements/new",  icon: Trophy },
  { id: "add-certificate",  label: "Upload Certificate",    href: "/admin/certificates/new",  icon: Award },
  { id: "add-experience",   label: "Add Experience",        href: "/admin/experience/new",    icon: Briefcase },
  { id: "add-blog",         label: "Write Blog Post",       href: "/admin/blog/new",          icon: BookOpen },
  { id: "upload-media",     label: "Upload Media",          href: "/admin/media",             icon: Image },
  { id: "edit-profile",     label: "Edit Profile",          href: "/admin/profile",           icon: User },
  { id: "change-theme",     label: "Change Theme",          href: "/admin/theme",             icon: Palette },
  { id: "manage-sections",  label: "Manage Sections",       href: "/admin/sections",          icon: Layers },
  { id: "settings",         label: "Open Settings",         href: "/admin/settings",          icon: Settings },
  { id: "preview",          label: "Preview Portfolio",     href: "/",                        icon: ExternalLink, external: true },
  { id: "signout",          label: "Sign Out",              icon: LogOut, action: "signout" },
];

export function AdminCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const router = useRouter();

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
  }, []);

  const execute = useCallback(
    (cmd: (typeof commands)[0]) => {
      close();
      if (cmd.action === "signout") {
        signOut({ callbackUrl: "/admin/login" });
      } else if (cmd.href) {
        if (cmd.external) {
          window.open(cmd.href, "_blank");
        } else {
          router.push(cmd.href);
        }
      }
    },
    [close, router]
  );

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowDown") setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setHighlighted((h) => Math.max(h - 1, 0));
      if (e.key === "Enter" && filtered[highlighted]) execute(filtered[highlighted]);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filtered, highlighted, close, execute]);

  useEffect(() => {
    function handleCustom() { setOpen(true); }
    window.addEventListener("admin:openCommandPalette", handleCustom);
    return () => window.removeEventListener("admin:openCommandPalette", handleCustom);
  }, []);

  useEffect(() => { setHighlighted(0); }, [query]);

  if (!open) return null;

  return (
    <div className="admin-cmd-backdrop" onClick={close} role="dialog" aria-label="Command palette" aria-modal="true">
      <div className="admin-cmd-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-cmd-search">
          <Search size={16} style={{ color: "#71717a", flexShrink: 0 }} />
          <input
            autoFocus
            className="admin-cmd-input"
            placeholder="Search commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Command search"
          />
          <kbd style={{ padding: "2px 6px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 4, fontSize: "0.7rem", color: "#71717a", fontFamily: "monospace" }}>
            ESC
          </kbd>
        </div>

        <div className="admin-cmd-list" role="listbox">
          {filtered.length === 0 && (
            <p className="admin-cmd-empty">No commands found for "{query}"</p>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                role="option"
                aria-selected={i === highlighted}
                className={`admin-cmd-item ${i === highlighted ? "highlighted" : ""}`}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setHighlighted(i)}
              >
                <Icon size={15} />
                {cmd.label}
                {cmd.external && (
                  <ExternalLink size={11} style={{ marginLeft: "auto", opacity: 0.4 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
