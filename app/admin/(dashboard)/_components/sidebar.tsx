"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  PanelTop,
  User,
  FolderKanban,
  Trophy,
  Award,
  GraduationCap,
  Briefcase,
  Cpu,
  Users,
  BookOpen,
  Image,
  GalleryVertical,
  Quote,
  Palette,
  Layers,
  Link2,
  FileText,
  Search,
  Settings,
  Activity,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Overview",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/profile", label: "Profile", icon: User },
      { href: "/admin/hero", label: "Hero", icon: PanelTop },
      { href: "/admin/projects", label: "Projects", icon: FolderKanban },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/education", label: "Education", icon: GraduationCap },
      { href: "/admin/achievements", label: "Achievements", icon: Trophy },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/skills", label: "Skills", icon: Cpu },
      { href: "/admin/leadership", label: "Leadership", icon: Users },
      { href: "/admin/workshops", label: "Workshops", icon: BookOpen },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    ],
  },
  {
    label: "Publishing",
    items: [
      { href: "/admin/blog", label: "Blog", icon: BookOpen },
      { href: "/admin/media", label: "Media", icon: Image },
      { href: "/admin/gallery", label: "Gallery", icon: GalleryVertical },
    ],
  },
  {
    label: "Design",
    items: [
      { href: "/admin/theme", label: "Theme", icon: Palette },
      { href: "/admin/sections", label: "Sections", icon: Layers },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/social-links", label: "Social Links", icon: Link2 },
      { href: "/admin/resume", label: "Resume", icon: FileText },
      { href: "/admin/seo", label: "SEO", icon: Search },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/activity", label: "Activity", icon: Activity },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/admin/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  const sidebarContent = (
    <>
      <Link
        href="/admin/dashboard"
        className="admin-sidebar-brand"
        onClick={() => setMobileOpen(false)}
      >
        <div className="admin-sidebar-brand-icon">MH</div>
        Portfolio Admin
      </Link>

      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navItems.map((section) => (
          <div key={section.label}>
            <p className="admin-nav-section">{section.label}</p>
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${isActive(item.href) ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={15} />
                  {item.label}
                  {isActive(item.href) && (
                    <ChevronRight size={12} style={{ marginLeft: "auto", opacity: 0.5 }} />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/" target="_blank" className="admin-nav-link">
          <Sparkles size={15} />
          View Portfolio
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`admin-sidebar`} aria-label="Sidebar navigation">
        {sidebarContent}
      </aside>

      {/* Mobile overlay + drawer */}
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? "open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`admin-sidebar ${mobileOpen ? "open" : ""}`}
        aria-label="Mobile navigation"
        style={{ zIndex: 31 }}
      >
        <button
          className="admin-btn-icon"
          style={{ position: "absolute", top: 14, right: 14 }}
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
        >
          <X size={16} />
        </button>
        {sidebarContent}
      </aside>

      {/* Mobile toggle button — rendered in topbar via prop */}
      <button
        id="admin-mobile-nav-toggle"
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        style={{ display: "none" }}
      >
        ☰
      </button>
    </>
  );
}
