import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, MessageSquareQuote } from "lucide-react";

export default async function TestimonialsAdminPage() {
  const items = await db.testimonial.findMany({
      orderBy: { displayOrder: "asc" },
    });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-desc">Manage reviews and endorsements</p>
        </div>
        <Link href="/admin/testimonials/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Testimonial
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><MessageSquareQuote size={40} /></div>
          <h3>No testimonials yet</h3>
          <p>Add endorsements from colleagues, clients, or mentors.</p>
          <Link href="/admin/testimonials/new" className="admin-btn admin-btn-primary">+ Add Testimonial</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Person</th><th>Role/Company</th><th>Preview</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {item.personName}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{item.role}</td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{item.content}"
                  </td>
                  <td><span className={`admin-badge ${item.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{item.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/testimonials/${item.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
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
