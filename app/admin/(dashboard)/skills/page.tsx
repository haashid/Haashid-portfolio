import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SkillsAdminPage() {
  const categories = await db.skillCategory.findMany({
    orderBy: { displayOrder: "asc" },
    include: { skills: { orderBy: { displayOrder: "asc" } } },
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Skills</h1>
          <p className="admin-page-desc">Manage your technical skills by category</p>
        </div>
        <Link href="/admin/skills/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Skill
        </Link>
      </div>

      {categories.length === 0 ? (
        <div className="admin-empty">
          <h3>No skills yet</h3>
          <p>Skills will be seeded from your existing data during database setup.</p>
          <Link href="/admin/skills/new" className="admin-btn admin-btn-primary">+ Add Skill</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {categories.map((cat) => (
            <div key={cat.id} className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">{cat.name}</h2>
                <span style={{ color: "#71717a", fontSize: "0.78rem" }}>{cat.skills.length} skills</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cat.skills.map((skill) => (
                  <Link key={skill.id} href={`/admin/skills/${skill.id}`} style={{ textDecoration: "none" }}>
                    <span className="admin-skill-tag">{skill.name}</span>
                  </Link>
                ))}
                {cat.skills.length === 0 && <p style={{ color: "#71717a", fontSize: "0.82rem" }}>No skills in this category yet.</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
