import { db } from "@/lib/db";
import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { ProjectsTable } from "./_components/projects-table";

export default async function ProjectsAdminPage() {
  const projects = await db.project.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      include: { images: { take: 1 } },
    });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Projects</h1>
          <p className="admin-page-desc">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
          <FolderPlus size={15} /> Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><FolderPlus size={40} /></div>
          <h3>No projects yet</h3>
          <p>Add your first project to start building your portfolio.</p>
          <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">+ Add Project</Link>
        </div>
      ) : (
        <ProjectsTable initialProjects={projects} />
      )}
    </div>
  );
}
