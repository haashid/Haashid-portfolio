"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { adminRequest } from "@/lib/admin-client";

type BlogPost = { id: string; title: string; slug: string; subtitle: string | null; content: string; coverImageUrl: string | null; publishStatus: string; seoTitle: string | null; seoDescription: string | null; readingTimeMin: number | null; publishedAt: string | null };

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    adminRequest<BlogPost>(`/api/admin/blog/${id}`).then(setPost)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load the post."))
      .finally(() => setLoading(false));
  }, [id]);

  function update<K extends keyof BlogPost>(field: K, value: BlogPost[K]) {
    setPost((current) => current ? { ...current, [field]: value } : current);
    setSuccess("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!post) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const saved = await adminRequest<BlogPost>(`/api/admin/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: post.title, slug: post.slug, subtitle: post.subtitle, content: post.content, coverImageUrl: post.coverImageUrl, publishStatus: post.publishStatus, seoTitle: post.seoTitle, seoDescription: post.seoDescription, readingTimeMin: post.readingTimeMin }) });
      setPost(saved); setSuccess("Post saved to the database."); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save the post."); }
    finally { setSaving(false); }
  }

  if (loading) return <div style={{ padding: 40 }}><Loader2 className="admin-spin" size={18} /> Loading post…</div>;
  if (!post) return <div><p role="alert" className="admin-error">{error || "Post not found."}</p><Link href="/admin/blog">Back to Blog</Link></div>;

  return <div>
    <div className="admin-page-header"><div><Link href="/admin/blog" className="admin-btn admin-btn-secondary"><ArrowLeft size={14} /> Blog</Link><h1 className="admin-page-title">Edit article</h1><p className="admin-page-desc">Changes to published content are visible on the public article route after saving.</p></div><button form="edit-blog-form" className="admin-btn admin-btn-primary" disabled={saving}>{saving ? <Loader2 size={15} className="admin-spin" /> : <Save size={15} />}{saving ? "Saving…" : "Save Changes"}</button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}{success && <p role="status">{success}</p>}
    <form id="edit-blog-form" className="admin-form" onSubmit={save}>
      <section className="admin-card"><div className="admin-form-grid"><label className="admin-field">Title<input className="admin-input" required value={post.title} onChange={(event) => update("title", event.target.value)} /></label><label className="admin-field">Slug<input className="admin-input" required value={post.slug} onChange={(event) => update("slug", event.target.value)} /></label><label className="admin-field">Subtitle<input className="admin-input" value={post.subtitle || ""} onChange={(event) => update("subtitle", event.target.value)} /></label><label className="admin-field">Publication<select className="admin-select" value={post.publishStatus} onChange={(event) => update("publishStatus", event.target.value)}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label><label className="admin-field">Cover image URL<input className="admin-input" type="url" value={post.coverImageUrl || ""} onChange={(event) => update("coverImageUrl", event.target.value)} /></label><label className="admin-field">Reading time (minutes)<input className="admin-input" type="number" min={1} value={post.readingTimeMin ?? ""} onChange={(event) => update("readingTimeMin", event.target.value ? Number(event.target.value) : null)} /></label><label className="admin-field">SEO title<input className="admin-input" value={post.seoTitle || ""} onChange={(event) => update("seoTitle", event.target.value)} /></label><label className="admin-field">SEO description<textarea className="admin-textarea" value={post.seoDescription || ""} onChange={(event) => update("seoDescription", event.target.value)} /></label></div></section>
      <section className="admin-card"><label className="admin-field">Article content<textarea className="admin-textarea" rows={22} value={post.content} onChange={(event) => update("content", event.target.value)} /></label><p className="admin-field-hint">Content is stored in the database and rendered as safe text or structured editor JSON.</p></section>
    </form>
  </div>;
}
