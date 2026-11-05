import { db } from "@/lib/db";
import Link from "next/link";
import { PenSquare } from "lucide-react";
import { BlogList } from "./_components/blog-list";

export default async function BlogAdminPage() {
  let posts: any[] = [];
  try {
    posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { categories: true, tags: true },
    });
  } catch (err) {
    console.warn("[admin-blog] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Blog</h1>
          <p className="admin-page-desc">Write and publish blog posts</p>
        </div>
        <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
          <PenSquare size={15} /> Write Post
        </Link>
      </div>
      <BlogList initialPosts={posts} />
    </div>
  );
}
