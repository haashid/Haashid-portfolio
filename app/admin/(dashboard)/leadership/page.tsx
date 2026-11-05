import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Users } from "lucide-react";

export default async function LeadershipAdminPage() {
  let leadershipRoles: any[] = [];
  try {
    leadershipRoles = await db.leadership.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    });
  } catch (err) {
    console.warn("[admin-leadership] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Leadership</h1>
          <p className="admin-page-desc">Manage your leadership roles, positions, and responsibilities</p>
        </div>
        <Link href="/admin/leadership/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Role
        </Link>
      </div>

      {leadershipRoles.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Users size={40} /></div>
          <h3>No leadership roles yet</h3>
          <p>Add your leadership experience to showcase on your portfolio.</p>
          <Link href="/admin/leadership/new" className="admin-btn admin-btn-primary">+ Add Role</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Position</th><th>Organization</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {leadershipRoles.map((role) => (
                <tr key={role.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {role.position}
                    {role.isCurrent && <span className="admin-badge admin-badge-published" style={{ marginLeft: 8 }}>CURRENT</span>}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{role.organization}</td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a" }}>
                    {role.startDate ? new Date(role.startDate).getFullYear() : "—"} — {role.isCurrent ? "Present" : role.endDate ? new Date(role.endDate).getFullYear() : "—"}
                  </td>
                  <td><span className={`admin-badge ${role.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{role.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/leadership/${role.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
