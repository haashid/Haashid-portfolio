import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

export default async function WorkshopsAdminPage() {
  const workshops = await db.workshop.findMany({
      orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
    });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Workshops & Speaking</h1>
          <p className="admin-page-desc">Manage your workshops, talks, and speaking engagements</p>
        </div>
        <Link href="/admin/workshops/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Workshop
        </Link>
      </div>

      {workshops.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><BookOpen size={40} /></div>
          <h3>No workshops yet</h3>
          <p>Add your speaking engagements or workshops to showcase on your portfolio.</p>
          <Link href="/admin/workshops/new" className="admin-btn admin-btn-primary">+ Add Workshop</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Event Name</th><th>Organization</th><th>Role</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {workshops.map((workshop) => (
                <tr key={workshop.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {workshop.eventName}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{workshop.organization || "—"}</td>
                  <td style={{ color: "#a1a1aa" }}>{workshop.role || "—"}</td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a" }}>
                    {workshop.date ? new Date(workshop.date).toLocaleDateString() : "—"}
                  </td>
                  <td><span className={`admin-badge ${workshop.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{workshop.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/workshops/${workshop.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
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
