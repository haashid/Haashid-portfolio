import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | Muhammad Haashid",
  description: "Published writing by Muhammad Haashid.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();
  return (
    <main className="content-route">
      <header className="content-route-header">
        <Link href="/" className="subtle-link">← Portfolio home</Link>
        <p className="eyebrow">Writing</p>
        <h1>Blog</h1>
        <p>Notes and articles published through the portfolio CMS.</p>
      </header>
      {posts.length === 0 ? (
        <p className="content-empty">No published articles are available yet.</p>
      ) : (
        <div className="content-card-grid">
          {posts.map((post) => (
            <article className="content-card" key={post.id}>
              {post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} width={960} height={540} unoptimized className="content-card-image" />}
              <div className="content-card-body">
                <div className="content-tags">{post.categories.map((category) => <span key={category.id}>{category.name}</span>)}</div>
                <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                {post.subtitle && <p>{post.subtitle}</p>}
                <p className="content-meta">
                  {post.publishedAt ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(post.publishedAt) : "Published"}
                  {post.readingTimeMin ? ` · ${post.readingTimeMin} min read` : ""}
                </p>
                <Link className="subtle-link" href={`/blog/${post.slug}`}>Read article →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
