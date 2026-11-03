import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit, createVersion } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/api-utils";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  slug: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  content: z.string().optional(),
  coverImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  seoTitle: z.string().max(200).optional().nullable(),
  seoDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  readingTimeMin: z.number().int().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const post = await db.blogPost.findUnique({ where: { id }, include: { categories: true, tags: true } });
  if (!post) return apiError("Not found", 404);
  return apiSuccess(post);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const nextSlug = parsed.data.slug
    ? slugify(parsed.data.slug)
    : parsed.data.title && parsed.data.title !== existing.title
      ? slugify(parsed.data.title)
      : existing.slug;
  if (!nextSlug) return apiError("A non-empty slug is required.");
  const slugOwner = await db.blogPost.findUnique({ where: { slug: nextSlug } });
  if (slugOwner && slugOwner.id !== id) return apiError("A post with this slug already exists.", 409);

  await createVersion("BlogPost", id, existing.title, { ...existing, content: "[content]" } as unknown as Record<string, unknown>);

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...parsed.data,
      slug: nextSlug,
      publishedAt:
        parsed.data.publishStatus === "PUBLISHED" && !existing.publishedAt
          ? new Date()
          : existing.publishedAt,
    },
    include: { categories: true, tags: true },
  });

  await logAudit({
    action: parsed.data.publishStatus === "PUBLISHED" ? "published" : "updated",
    entityType: "BlogPost", entityId: id, entityTitle: updated.title,
  });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${updated.slug}`);
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.blogPost.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.blogPost.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "BlogPost", entityId: id, entityTitle: existing.title });
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  return apiSuccess(archived);
}
