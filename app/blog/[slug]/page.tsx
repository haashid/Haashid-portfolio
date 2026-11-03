import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog-content";
import { getProfile, getPublishedBlogBySlug } from "@/lib/public-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);
  if (!post) return { title: "Article not found" };
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.subtitle || undefined;
  const image = post.ogImageUrl || post.coverImageUrl;
  return {
    title: `${title} | Muhammad Haashid`,
    description,
    openGraph: { title, description, type: "article", publishedTime: post.publishedAt?.toISOString(), images: image ? [image] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([getPublishedBlogBySlug(slug), getProfile()]);
  if (!post) notFound();
  return (
    <main className="content-route article-route">
      <Link href="/blog" className="subtle-link">← All articles</Link>
      <article>
        <header className="article-header">
          <div className="content-tags">{post.categories.map((category) => <span key={category.id}>{category.name}</span>)}{post.tags.map((tag) => <span key={tag.id}>#{tag.name}</span>)}</div>
          <h1>{post.title}</h1>
          {post.subtitle && <p className="case-study-summary">{post.subtitle}</p>}
          <p className="content-meta">
            {profile?.name || ""}
            {profile?.name && post.publishedAt ? " · " : ""}
            {post.publishedAt ? new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(post.publishedAt) : ""}
            {post.readingTimeMin ? ` · ${post.readingTimeMin} min read` : ""}
          </p>
        </header>
        {post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} width={1440} height={810} unoptimized className="case-study-cover" priority />}
        <BlogContent content={post.content} />
      </article>
    </main>
  );
}
