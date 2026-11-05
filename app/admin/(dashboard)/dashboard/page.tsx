import { db } from "@/lib/db";
import Link from "next/link";
import {
  FolderKanban,
  Trophy,
  Award,
  BookOpen,
  Briefcase,
  Image,
  FolderPlus,
  PenSquare,
  Upload,
  Palette,
  Layers,
  User,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

async function getStats() {
  try {
    const [projects, achievements, certificates, blogPosts, experience, media] =
      await Promise.all([
        db.project.count({ where: { publishStatus: "PUBLISHED" } }),
        db.achievement.count({ where: { publishStatus: "PUBLISHED" } }),
        db.certificate.count(),
        db.blogPost.count({ where: { publishStatus: "PUBLISHED" } }),
        db.experience.count({ where: { publishStatus: "PUBLISHED" } }),
        db.media.count(),
      ]);

    return { projects, achievements, certificates, blogPosts, experience, media, dbConnected: true, error: null };
  } catch (error) {
    console.warn("[admin-dashboard] Could not fetch live database stats:", error);
    return {
      projects: 7,
      achievements: 10,
      certificates: 0,
      blogPosts: 0,
      experience: 3,
      media: 0,
      dbConnected: false,
      error: error instanceof Error ? error.message : "Database connection unavailable",
    };
  }
}

async function getRecentActivity() {
  try {
    return await db.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
  } catch {
    return [];
  }
}

async function getProfile() {
  try {
    const profile = await db.profile.findFirst();
    if (profile) return profile;
  } catch {
    // Database offline
  }
  return {
    name: "Muhammad Haashid",
    title: "AI Engineer & Technical Builder",
    availabilityStatus: "OPEN_TO_OPPORTUNITIES",
  };
}

export default async function AdminDashboardPage() {
  const [stats, activity, profile] = await Promise.all([
    getStats(),
    getRecentActivity(),
    getProfile(),
  ]);

  const statCards = [
    { label: "Projects", value: stats.projects, icon: FolderKanban, href: "/admin/projects" },
    { label: "Achievements", value: stats.achievements, icon: Trophy, href: "/admin/achievements" },
    { label: "Certificates", value: stats.certificates, icon: Award, href: "/admin/certificates" },
    { label: "Blog Posts", value: stats.blogPosts, icon: BookOpen, href: "/admin/blog" },
    { label: "Experience", value: stats.experience, icon: Briefcase, href: "/admin/experience" },
    { label: "Media Files", value: stats.media, icon: Image, href: "/admin/media" },
  ];

  const quickActions = [
    { label: "Add Project", href: "/admin/projects/new", icon: FolderPlus },
    { label: "Write Blog", href: "/admin/blog/new", icon: PenSquare },
    { label: "Add Achievement", href: "/admin/achievements/new", icon: Trophy },
    { label: "Upload Certificate", href: "/admin/certificates/new", icon: Upload },
    { label: "Edit Profile", href: "/admin/profile", icon: User },
    { label: "Change Theme", href: "/admin/theme", icon: Palette },
    { label: "Manage Sections", href: "/admin/sections", icon: Layers },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-desc">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}. Here&apos;s your portfolio overview.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className={`admin-badge ${stats.dbConnected ? "admin-badge-live" : ""}`} style={!stats.dbConnected ? { background: "rgba(251,191,36,0.15)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" } : undefined}>
            {stats.dbConnected ? "● LIVE (DB CONNECTED)" : "▲ OFFLINE FALLBACK MODE"}
          </span>
          <Link
            href="/"
            target="_blank"
            className="admin-btn admin-btn-secondary"
            style={{ fontSize: "0.82rem" }}
          >
            View Portfolio
          </Link>
        </div>
      </div>

      {/* Database Warning Banner if DB connection failed */}
      {!stats.dbConnected && (
        <div
          style={{
            background: "rgba(251, 191, 36, 0.08)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "flex-start",
            gap: "14px",
          }}
        >
          <AlertTriangle size={22} style={{ color: "#fbbf24", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: "0.95rem", color: "#fbbf24", fontWeight: 600 }}>
              Database Connection Notice
            </h3>
            <p style={{ margin: "0 0 8px", fontSize: "0.84rem", color: "#d4d4d8", lineHeight: 1.5 }}>
              The portfolio is currently serving from high-speed static fallbacks because the PostgreSQL database at Supabase could not be reached.
            </p>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8rem", color: "#a1a1aa", lineHeight: 1.6 }}>
              <li>
                <strong>Supabase Project Paused?</strong> Log into <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: "#38bdf8", textDecoration: "underline" }}>Supabase</a> and click <em>Restore project</em> if it has paused due to inactivity.
              </li>
              <li>
                <strong>Vercel Environment Variables:</strong> Ensure <code>DATABASE_URL</code> and <code>DIRECT_URL</code> are added in your Vercel Project Settings &gt; Environment Variables.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="admin-stats-grid">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="admin-stat-card"
              style={{ textDecoration: "none" }}
            >
              <Icon size={18} className="admin-stat-icon" />
              <p className="admin-stat-value">{s.value}</p>
              <p className="admin-stat-label">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Current status */}
      {profile && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div className="admin-card-header">
            <h2 className="admin-card-title">Current Status</h2>
            <Link href="/admin/profile" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>
              Edit
            </Link>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 4 }}>NAME</p>
              <p style={{ fontSize: "0.9rem" }}>{profile.name || "Not set"}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 4 }}>TITLE</p>
              <p style={{ fontSize: "0.9rem" }}>{profile.title || "Not set"}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: 4 }}>AVAILABILITY</p>
              <p style={{ fontSize: "0.9rem" }}>{profile.availabilityStatus?.replace(/_/g, " ") || "Open to opportunities"}</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-dashboard-grid">
        {/* Quick actions */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Quick Actions</h2>
          </div>
          <div className="admin-quick-actions">
            {quickActions.map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.label} href={a.href} className="admin-quick-action">
                  <Icon size={18} />
                  {a.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent activity */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2 className="admin-card-title">Recent Activity</h2>
            <Link href="/admin/activity" style={{ fontSize: "0.78rem", color: "#71717a", textDecoration: "none" }}>
              View all
            </Link>
          </div>
          <div className="admin-activity-list">
            {activity.length === 0 ? (
              <p style={{ color: "#71717a", fontSize: "0.84rem", padding: "8px 0" }}>
                No activity yet. Start managing your portfolio!
              </p>
            ) : (
              activity.map((log: any) => (
                <div key={log.id} className="admin-activity-item">
                  <div className="admin-activity-dot" />
                  <div>
                    <p className="admin-activity-text">
                      <strong>{log.action}</strong>
                      {log.entityTitle ? ` — ${log.entityTitle}` : ""}
                    </p>
                    <p className="admin-activity-time">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
