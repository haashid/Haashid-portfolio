"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft, Image, Eye } from "lucide-react";
import Link from "next/link";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [publishStatus, setPublishStatus] = useState("DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Simple autosave (draft only)
  function handleContentChange(val: string) {
    setContent(val);
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      // Autosave to localStorage as a local draft backup
      localStorage.setItem("blog_draft_content", val);
      localStorage.setItem("blog_draft_title", title);
      setLastSaved(new Date());
    }, 2000);
  }

  async function save(publish = false) {
    if (!title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, content, coverImageUrl: coverImageUrl || null,
          seoTitle: seoTitle || null, seoDescription: seoDescription || null,
          publishStatus: publish ? "PUBLISHED" : "DRAFT",
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const post = await res.json();
      localStorage.removeItem("blog_draft_content");
      localStorage.removeItem("blog_draft_title");
      router.push(`/admin/blog/${post.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/blog" className="admin-btn admin-btn-secondary" style={{ fontSize: "0.8rem", marginBottom: 10 }}>
            <ArrowLeft size={13} /> Blog
          </Link>
          <h1 className="admin-page-title">New Post</h1>
          {lastSaved && <p className="admin-page-desc">Auto-saved locally at {lastSaved.toLocaleTimeString()}</p>}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => save(false)} disabled={saving || !title}>
            <Save size={15} /> Save Draft
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => save(true)} disabled={saving || !title}>
            {saving ? <Loader2 size={15} className="admin-spin" /> : <Eye size={15} />}
            Publish
          </button>
        </div>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="admin-form">
        <div className="admin-card">
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="blog-title">Post Title *</label>
            <input
              id="blog-title"
              className="admin-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My thoughts on AI agents…"
              style={{ fontSize: "1.1rem", padding: "12px" }}
            />
          </div>

          <div className="admin-field">
            <label>Content</label>
            <p className="admin-field-hint">Write your blog post below (Markdown-style)</p>
            <div className="admin-editor">
              <div className="admin-editor-toolbar">
                {[
                  { label: "H1", action: () => handleContentChange(content + "\n# ") },
                  { label: "H2", action: () => handleContentChange(content + "\n## ") },
                  { label: "H3", action: () => handleContentChange(content + "\n### ") },
                  { label: "B", action: () => handleContentChange(content + "**bold**") },
                  { label: "I", action: () => handleContentChange(content + "*italic*") },
                  { label: "•", action: () => handleContentChange(content + "\n- ") },
                  { label: "1.", action: () => handleContentChange(content + "\n1. ") },
                  { label: '❝', action: () => handleContentChange(content + "\n> ") },
                  { label: "</>", action: () => handleContentChange(content + "\n```\n\n```") },
                  { label: "—", action: () => handleContentChange(content + "\n---\n") },
                ].map((btn) => (
                  <button key={btn.label} className="admin-editor-btn" type="button" onClick={btn.action}>{btn.label}</button>
                ))}
              </div>
              <textarea
                className="admin-editor-content"
                style={{ width: "100%", background: "none", border: "none", outline: "none", color: "inherit", fontFamily: "inherit", resize: "vertical", minHeight: 400, lineHeight: 1.7 }}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Write your post content here…"
              />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}><Image size={14} style={{ display: "inline", marginRight: 6 }} />Cover Image</h2>
          <div className="admin-field">
            <label htmlFor="blog-cover">Cover Image URL</label>
            <p className="admin-field-hint">Upload in Media Library, then paste URL here</p>
            <input id="blog-cover" type="url" className="admin-input" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          {coverImageUrl && (
            <img src={coverImageUrl} alt="Cover" style={{ marginTop: 12, maxHeight: 200, width: "100%", objectFit: "cover", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)" }} />
          )}
        </div>

        <div className="admin-card">
          <h2 className="admin-card-title" style={{ marginBottom: 16 }}>SEO</h2>
          <div className="admin-field" style={{ marginBottom: 16 }}>
            <label htmlFor="blog-seo-title">SEO Title</label>
            <input id="blog-seo-title" className="admin-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Override page title for search engines" />
          </div>
          <div className="admin-field">
            <label htmlFor="blog-seo-desc">Meta Description</label>
            <textarea id="blog-seo-desc" className="admin-textarea" rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Short description for search result snippets (150-160 chars)" maxLength={160} />
          </div>
        </div>
      </div>
    </div>
  );
}
