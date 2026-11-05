import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, GraduationCap } from "lucide-react";

export default async function EducationAdminPage() {
  let education: any[] = [];
  try {
    education = await db.education.findMany({
      orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
    });
  } catch (err) {
    console.warn("[admin-education] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Education</h1>
          <p className="admin-page-desc">Manage your academic history</p>
        </div>
        <Link href="/admin/education/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Education
        </Link>
      </div>

      {education.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><GraduationCap size={40} /></div>
          <h3>No education entries yet</h3>
          <p>Add your degrees and academic background.</p>
          <Link href="/admin/education/new" className="admin-btn admin-btn-primary">+ Add Education</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Degree</th><th>Institution</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {education.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {e.degree} {e.field ? `in ${e.field}` : ""}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{e.institution}</td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a" }}>
                    {e.startDate ? new Date(e.startDate).getFullYear() : "—"} — {e.endDate ? new Date(e.endDate).getFullYear() : "Present"}
                  </td>
                  <td><span className={`admin-badge ${e.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{e.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/education/${e.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
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
