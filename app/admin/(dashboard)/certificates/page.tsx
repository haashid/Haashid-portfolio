import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Award } from "lucide-react";

export default async function CertificatesAdminPage() {
  let items: any[] = [];
  try {
    items = await db.certificate.findMany({
      orderBy: [{ displayOrder: "asc" }, { issueDate: "desc" }],
    });
  } catch (err) {
    console.warn("[admin-certificates] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Certificates</h1>
          <p className="admin-page-desc">Manage your certifications and licenses</p>
        </div>
        <Link href="/admin/certificates/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Certificate
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Award size={40} /></div>
          <h3>No certificates yet</h3>
          <p>Add your professional certifications.</p>
          <Link href="/admin/certificates/new" className="admin-btn admin-btn-primary">+ Add Certificate</Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Certificate Name</th><th>Issuer</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600, color: "#f4f4f5" }}>
                    {item.name}
                  </td>
                  <td style={{ color: "#a1a1aa" }}>{item.organization}</td>
                  <td style={{ fontSize: "0.82rem", color: "#71717a" }}>
                    {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : "—"}
                  </td>
                  <td><span className={`admin-badge ${item.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`}>{item.publishStatus}</span></td>
                  <td>
                    <Link href={`/admin/certificates/${item.id}`} className="admin-btn admin-btn-secondary" style={{ fontSize: "0.78rem", padding: "5px 10px" }}>Edit</Link>
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
