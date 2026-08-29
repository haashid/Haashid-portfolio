"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Star, StarOff, Trophy } from "lucide-react";

type Achievement = {
  id: string;
  title: string;
  event: string;
  organization?: string | null;
  placement?: string | null;
  year?: string | null;
  featured: boolean;
  publishStatus: string;
  displayOrder: number;
};

export function AchievementsManager({ initialAchievements }: { initialAchievements: Achievement[] }) {
  const [items, setItems] = useState(initialAchievements);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function toggleFeatured(id: string, featured: boolean) {
    await fetch(`/api/admin/achievements/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    setItems((a) => a.map((i) => i.id === id ? { ...i, featured: !i.featured } : i));
  }

  async function archive(id: string, title: string) {
    if (!confirm(`Archive "${title}"?`)) return;
    setDeleting(id);
    await fetch(`/api/admin/achievements/${id}`, { method: "DELETE" });
    setItems((a) => a.filter((i) => i.id !== id));
    setDeleting(null);
  }

  if (items.length === 0) return (
    <div className="admin-empty">
      <div className="admin-empty-icon"><Trophy size={40} /></div>
      <h3>No achievements yet</h3>
      <p>Add your hackathon wins and recognitions.</p>
      <Link href="/admin/achievements/new" className="admin-btn admin-btn-primary">+ Add Achievement</Link>
    </div>
  );

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Achievement</th>
            <th>Event / Org</th>
            <th>Year</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a.id}>
              <td>
                <div style={{ fontWeight: 600, color: "#f4f4f5" }}>
                  {a.placement && <span style={{ color: "#fbbf24", marginRight: 6 }}>🏆 {a.placement}</span>}
                  {a.title}
                </div>
              </td>
              <td>
                <div style={{ fontSize: "0.85rem" }}>{a.event}</div>
                {a.organization && <div style={{ fontSize: "0.78rem", color: "#71717a" }}>{a.organization}</div>}
              </td>
              <td style={{ color: "#71717a", fontSize: "0.85rem" }}>{a.year || "—"}</td>
              <td>
                <span className={`admin-badge ${a.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>
                  {a.publishStatus}
                </span>
              </td>
              <td>
                <div className="admin-table-actions">
                  <button className="admin-btn-icon" title={a.featured ? "Unfeature" : "Feature"} onClick={() => toggleFeatured(a.id, a.featured)}>
                    {a.featured ? <Star size={14} style={{ color: "#fbbf24" }} /> : <StarOff size={14} />}
                  </button>
                  <Link href={`/admin/achievements/${a.id}`} className="admin-btn-icon" title="Edit">
                    <Pencil size={14} />
                  </Link>
                  <button className="admin-btn-icon" style={{ color: "#f87171" }} title="Archive" onClick={() => archive(a.id, a.title)} disabled={deleting === a.id}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
