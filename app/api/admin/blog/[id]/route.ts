import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit, createVersion } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
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

  await createVersion("BlogPost", id, existing.title, { ...existing, content: "[content]" } as unknown as Record<string, unknown>);

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...parsed.data,
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
  return apiSuccess(archived);
}
