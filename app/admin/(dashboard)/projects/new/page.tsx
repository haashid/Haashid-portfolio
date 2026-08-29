"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

const STATUSES = ["IDEA", "IN_DEVELOPMENT", "ACTIVE", "COMPLETED", "ARCHIVED"];
const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewProjectPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    problem: "",
    solution: "",
    myRole: "",
    technologies: "",
    category: "",
    status: "ACTIVE",
    publishStatus: "DRAFT",
    featured: false,
    githubUrl: "",
    demoUrl: "",
    docsUrl: "",
    videoUrl: "",
    coverImageUrl: "",
    award: "",
    tags: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: unknown) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function save(publish = false) {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          publishStatus: publish ? "PUBLISHED" : form.publishStatus,
          technologies: form.technologies.split(",").map((t) => t.trim()).filter(Boolean),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const project = await res.json();
      router.push(`/admin/projects/${project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/projects" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}>
            <ArrowLeft size={13} /> Projects
          </Link>
          <h1 className="admin-page-title">New Project</h1>
          <p className="admin-page-desc">Add a new project to your portfolio</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => save(false)} disabled={saving || !form.title}>
            <Save size={15} /> Save Draft
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => save(true)} disabled={saving || !form.title}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : null} Publish
          </button>
        </div>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-form">
        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Basic Info</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="proj-title">Project Title *</label>
            <input id="proj-title" className="admin-input" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="My Awesome Project" required />
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="proj-short">Short Description *</label>
            <p className="admin-field-hint">1-2 sentences for the project card (max 500 chars)</p>
            <textarea id="proj-short" className="admin-textarea" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} rows={2} maxLength={500} />
          </div>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="proj-full">Full Description</label>
            <textarea id="proj-full" className="admin-textarea" value={form.fullDescription} onChange={(e) => update("fullDescription", e.target.value)} rows={6} style={{ minHeight: 160 }} />
          </div>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="proj-role">My Role</label>
              <input id="proj-role" className="admin-input" value={form.myRole} onChange={(e) => update("myRole", e.target.value)} placeholder="Lead Developer, AI Architect…" />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-award">Award / Recognition</label>
              <input id="proj-award" className="admin-input" value={form.award} onChange={(e) => update("award", e.target.value)} placeholder="Grand Champion — VEXSTORM 2026" />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-category">Category</label>
              <input id="proj-category" className="admin-input" value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="AI, Blockchain, IoT…" />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-status">Project Status</label>
              <select id="proj-status" className="admin-select" value={form.status} onChange={(e) => update("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}><Tag size={14} style={{ display: "inline", marginRight: 6 }} />Technologies & Tags</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="proj-tech">Technologies</label>
            <p className="admin-field-hint">Comma-separated: Next.js, FastAPI, LangGraph</p>
            <input id="proj-tech" className="admin-input" value={form.technologies} onChange={(e) => update("technologies", e.target.value)} placeholder="Next.js, FastAPI, LangGraph, Gemini" />
          </div>
          <div className="admin-field">
            <label htmlFor="proj-tags">Tags</label>
            <p className="admin-field-hint">Comma-separated tags for filtering</p>
            <input id="proj-tags" className="admin-input" value={form.tags} onChange={(e) => update("tags", e.target.value)} placeholder="ai, hackathon, featured" />
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Links</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="proj-gh">GitHub URL</label>
              <input id="proj-gh" type="url" className="admin-input" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} placeholder="https://github.com/..." />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-demo">Live Demo URL</label>
              <input id="proj-demo" type="url" className="admin-input" value={form.demoUrl} onChange={(e) => update("demoUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-docs">Documentation URL</label>
              <input id="proj-docs" type="url" className="admin-input" value={form.docsUrl} onChange={(e) => update("docsUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="admin-field">
              <label htmlFor="proj-video">Video URL</label>
              <input id="proj-video" type="url" className="admin-input" value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Cover Image</h2>
          <div className="admin-field">
            <label htmlFor="proj-cover">Cover Image URL</label>
            <p className="admin-field-hint">Upload in the Media Library, then paste URL here</p>
            <input id="proj-cover" type="url" className="admin-input" value={form.coverImageUrl} onChange={(e) => update("coverImageUrl", e.target.value)} placeholder="https://..." />
          </div>
          {form.coverImageUrl && (
            <img src={form.coverImageUrl} alt="Cover preview" style={{ marginTop: 12, maxHeight: 200, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }} />
          )}
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>Visibility</h2>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="proj-pub">Publish Status</label>
              <select id="proj-pub" className="admin-select" value={form.publishStatus} onChange={(e) => update("publishStatus", e.target.value)}>
                {PUBLISH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
                Featured Project
              </label>
              <p className="admin-field-hint">Featured projects are highlighted on the homepage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
