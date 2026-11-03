import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Image as ImageIcon } from "lucide-react";

export default async function GalleryAdminPage() {
  const items = await db.galleryItem.findMany({
      orderBy: { displayOrder: "asc" },
    });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Gallery</h1>
          <p className="admin-page-desc">Manage your photo gallery</p>
        </div>
        <Link href="/admin/gallery/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Photo
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><ImageIcon size={40} /></div>
          <h3>No gallery items yet</h3>
          <p>Add photos to showcase your work environment, speaking events, or team.</p>
          <Link href="/admin/gallery/new" className="admin-btn admin-btn-primary">+ Add Photo</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {items.map((item) => (
            <Link key={item.id} href={`/admin/gallery/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div className="admin-card" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ height: 140, borderRadius: 6, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                  <img src={item.imageUrl} alt={item.caption || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.caption || "No caption"}</p>
                  <p style={{ fontSize: "0.75rem", color: "#71717a" }}>{item.category || "Uncategorized"}</p>
                  <span className={`admin-badge ${item.publishStatus === "PUBLISHED" ? "admin-badge-published" : "admin-badge-draft"}`} style={{ marginTop: 8, display: "inline-block" }}>
                    {item.publishStatus}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
