import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";

export default async function ExperienceAdminPage() {
  let experience: any[] = [];
  try {
    experience = await db.experience.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    });
  } catch (err) {
    console.warn("[admin-experience] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Experience</h1>
          <p className="admin-page-desc">Manage your work experience and employment history</p>
        </div>
        <Link href="/admin/experience/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Experience
        </Link>
      </div>

      {experience.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Briefcase size={40} /></div>
          <h3>No experience entries yet</h3>
          <p>Add your work experience to showcase on your portfolio.</p>
          <Link href="/admin/experience/new" className="admin-btn admin-btn-primary">+ Add Experience</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Role</th><th>Company</th><th>Type</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {experience.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {e.position}
                    {e.isCurrent && <span className="admin-badge admin-badge-published" style={{ marginLeft: 8 }}>CURRENT</span>}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{e.company}</td>
                  <td><span style={{ fontSize: "0.78rem", color: "#71717a" }}>{e.employmentType.replace("_", " ")}</span></td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a" }}>
                    {new Date(e.startDate).getFullYear()} — {e.isCurrent ? "Present" : e.endDate ? new Date(e.endDate).getFullYear() : "—"}
                  </td>
                  <td><span className={`admin-badge ${e.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{e.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/experience/${e.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
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
