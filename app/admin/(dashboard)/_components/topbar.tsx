"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { ExternalLink, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import type { Session } from "next-auth";

interface TopbarProps {
  user: Session["user"];
}

export function AdminTopbar({ user }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  function openCommandPalette() {
    window.dispatchEvent(new CustomEvent("admin:openCommandPalette"));
  }

  function openMobileNav() {
    const btn = document.getElementById("admin-mobile-nav-toggle");
    btn?.click();
  }

  const initials = (user?.name ?? user?.email ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="admin-topbar">
      {/* Mobile nav toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={openMobileNav}
        aria-label="Open navigation"
        style={{ marginRight: 4 }}
      >
        <Menu size={18} />
      </button>

      {/* Search / Command palette trigger */}
      <div className="admin-topbar-search">
        <button
          className="admin-search-trigger"
          onClick={openCommandPalette}
          aria-label="Open command palette"
          id="admin-search-btn"
        >
          <Search size={14} />
          <span>Search or run a command…</span>
          <kbd className="admin-search-kbd">⌘K</kbd>
        </button>
      </div>

      <div className="admin-topbar-actions">
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="admin-topbar-btn"
          title="View public portfolio"
        >
          <ExternalLink size={14} />
          <span style={{ display: "none" }}>Preview</span>
        </Link>

        {/* Avatar menu */}
        <div style={{ position: "relative" }}>
          <button
            className="admin-avatar-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="User menu"
            title={user?.email ?? ""}
          >
            {initials}
          </button>

          {menuOpen && (
            <>
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 48,
                }}
                onClick={() => setMenuOpen(false)}
              />
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  zIndex: 49,
                  width: 200,
                  background: "#111",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  padding: "6px",
                }}
              >
                <div style={{ padding: "8px 10px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 4 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#f4f4f5" }}>{user?.name ?? "Admin"}</p>
                  <p style={{ fontSize: "0.75rem", color: "#71717a", marginTop: 2 }}>{user?.email}</p>
                </div>
                <Link
                  href="/admin/settings"
                  className="admin-nav-link"
                  onClick={() => setMenuOpen(false)}
                  style={{ fontSize: "0.82rem" }}
                >
                  Settings
                </Link>
                <button
                  className="admin-nav-link"
                  style={{ fontSize: "0.82rem", color: "#f87171", width: "100%" }}
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
