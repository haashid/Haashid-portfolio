import { db } from "@/lib/db";
import Link from "next/link";
import { PenSquare } from "lucide-react";
import { BlogList } from "./_components/blog-list";

export default async function BlogAdminPage() {
  const posts = await db.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { categories: true, tags: true },
    });

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
