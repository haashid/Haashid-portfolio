import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  title: z.string().min(1).max(300),
  slug: z.string().max(300).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  content: z.string().default(""),
  coverImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  readingTimeMin: z.number().int().optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const posts = await db.blogPost.findMany({
    where: status ? { publishStatus: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {},
    orderBy: { createdAt: "desc" },
    include: { categories: true, tags: true },
  });
  return apiSuccess(posts);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  // Auto-generate slug
  const { slugify } = await import("@/lib/api-utils");
  const slug = parsed.data.slug || slugify(parsed.data.title);
  const existing = await db.blogPost.findUnique({ where: { slug } });
  if (existing) return apiError("A post with this slug already exists.", 409);

  const post = await db.blogPost.create({
    data: {
      ...parsed.data,
      slug,
      publishedAt: parsed.data.publishStatus === "PUBLISHED" ? new Date() : null,
    },
    include: { categories: true, tags: true },
  });

  await logAudit({ action: "created", entityType: "BlogPost", entityId: post.id, entityTitle: post.title });
  return apiSuccess(post, 201);
}
