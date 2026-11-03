"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Eye, Globe, Github, Trash2, Star, StarOff } from "lucide-react";
import { adminRequest } from "@/lib/admin-client";

type Project = {
  id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  publishStatus: string;
  featured: boolean;
  status: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  award?: string | null;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PUBLISHED: "admin-badge-published",
    DRAFT: "admin-badge-draft",
    ARCHIVED: "admin-badge-archived",
  };
  return <span className={`admin-badge ${map[status] ?? "admin-badge-draft"}`}>{status}</span>;
}

export function ProjectsTable({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  async function toggleFeatured(id: string, featured: boolean) {
    setPending(id);
    setError("");
    try {
      await adminRequest(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
      });
      setProjects((p) => p.map((pr) => pr.id === id ? { ...pr, featured: !featured } : pr));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update the project.");
    } finally {
      setPending(null);
    }
  }

  async function archive(id: string) {
    if (!confirm("Archive this project? It will be hidden from the public site.")) return;
    setDeleting(id);
    setError("");
    try {
      await adminRequest(`/api/admin/projects/${id}`, { method: "DELETE" });
      setProjects((p) => p.filter((pr) => pr.id !== id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive the project.");
    } finally {
      setDeleting(null);
    }
  }

  async function publish(id: string, current: string) {
    const newStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setPending(id);
    setError("");
    try {
      await adminRequest(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishStatus: newStatus }),
      });
      setProjects((p) => p.map((pr) => pr.id === id ? { ...pr, publishStatus: newStatus } : pr));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update publication status.");
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="admin-table-wrap">
      {error && <p role="alert" style={{ padding: 12, color: "#f87171" }}>{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Status</th>
            <th>Technologies</th>
            <th>Links</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>
                <div style={{ fontWeight: 600, color: "#f4f4f5", marginBottom: 2 }}>{p.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#71717a", maxWidth: 280 }}>{p.shortDescription}</div>
                {p.award && <div style={{ fontSize: "0.72rem", color: "#fbbf24", marginTop: 2 }}>🏆 {p.award}</div>}
              </td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <StatusBadge status={p.publishStatus} />
                  <span style={{ fontSize: "0.72rem", color: "#71717a" }}>{p.status.replace("_", " ")}</span>
                </div>
              </td>
              <td>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 200 }}>
                  {p.technologies.slice(0, 4).map((t) => (
                    <span key={t} style={{ padding: "2px 6px", background: "rgba(255,255,255,0.06)", borderRadius: 4, fontSize: "0.72rem", color: "#a1a1aa" }}>{t}</span>
                  ))}
                  {p.technologies.length > 4 && <span style={{ fontSize: "0.72rem", color: "#71717a" }}>+{p.technologies.length - 4}</span>}
                </div>
              </td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="admin-btn-icon" title="GitHub"><Github size={14} /></a>}
                  {p.demoUrl && <a href={p.demoUrl} target="_blank" rel="noreferrer" className="admin-btn-icon" title="Demo"><Globe size={14} /></a>}
                </div>
              </td>
              <td>
                <div className="admin-table-actions">
                  <button
                    className="admin-btn-icon"
                    title={p.featured ? "Unfeature" : "Feature"}
                    onClick={() => toggleFeatured(p.id, p.featured)}
                    disabled={pending === p.id || deleting === p.id}
                  >
                    {p.featured ? <Star size={14} style={{ color: "#fbbf24" }} /> : <StarOff size={14} />}
                  </button>
                  <button
                    className="admin-btn-icon"
                    title={p.publishStatus === "PUBLISHED" ? "Unpublish" : "Publish"}
                    onClick={() => publish(p.id, p.publishStatus)}
                    disabled={pending === p.id || deleting === p.id}
                    style={{ color: p.publishStatus === "PUBLISHED" ? "#4ade80" : "#71717a" }}
                  >
                    <Eye size={14} />
                  </button>
                  <Link href={`/admin/projects/${p.id}`} className="admin-btn-icon" title="Edit">
                    <Pencil size={14} />
                  </Link>
                  <button
                    className="admin-btn-icon"
                    title="Archive"
                    onClick={() => archive(p.id)}
                    disabled={deleting === p.id}
                    style={{ color: "#f87171" }}
                  >
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
