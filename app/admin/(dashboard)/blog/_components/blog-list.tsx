"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Eye, EyeOff, Trash2, BookOpen } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  publishStatus: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  categories: { name: string }[];
};

export function BlogList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);

  async function togglePublish(id: string, status: string) {
    const newStatus = status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publishStatus: newStatus }),
    });
    setPosts((p) => p.map((post) => post.id === id ? { ...post, publishStatus: newStatus } : post));
  }

  async function archive(id: string, title: string) {
    if (!confirm(`Archive "${title}"?`)) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setPosts((p) => p.filter((post) => post.id !== id));
  }

  if (posts.length === 0) return (
    <div className="admin-empty">
      <div className="admin-empty-icon"><BookOpen size={40} /></div>
      <h3>No blog posts yet</h3>
      <p>Start writing to share your knowledge.</p>
      <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">Write your first post</Link>
    </div>
  );

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr><th>Post</th><th>Status</th><th>Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td>
                <div style={{ fontWeight: 600, color: "#f4f4f5" }}>{p.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#71717a" }}>/{p.slug}</div>
                {p.categories.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {p.categories.map((c) => (
                      <span key={c.name} style={{ padding: "2px 6px", background: "rgba(56,189,248,0.1)", borderRadius: 4, fontSize: "0.7rem", color: "#38bdf8", marginRight: 4 }}>{c.name}</span>
                    ))}
                  </div>
                )}
              </td>
              <td>
                <span className={`admin-badge ${p.publishStatus === "PUBLISHED" ? "admin-badge-published" : p.publishStatus === "DRAFT" ? "admin-badge-draft" : "admin-badge-archived"}`}>
                  {p.publishStatus}
                </span>
              </td>
              <td style={{ color: "#71717a", fontSize: "0.82rem" }}>
                {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : new Date(p.createdAt).toLocaleDateString()}
              </td>
              <td>
                <div className="admin-table-actions">
                  <button className="admin-btn-icon" title={p.publishStatus === "PUBLISHED" ? "Unpublish" : "Publish"} onClick={() => togglePublish(p.id, p.publishStatus)}>
                    {p.publishStatus === "PUBLISHED" ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <Link href={`/admin/blog/${p.id}`} className="admin-btn-icon" title="Edit"><Pencil size={14} /></Link>
                  <button className="admin-btn-icon" style={{ color: "#f87171" }} onClick={() => archive(p.id, p.title)} title="Archive">
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
