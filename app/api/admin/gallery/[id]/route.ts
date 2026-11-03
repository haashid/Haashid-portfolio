import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  imageUrl: z.string().url().optional(),
  caption: z.string().max(500).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  date: z.string().transform((v) => new Date(v)).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.galleryItem.findUnique({ where: { id } });
  if (!item) return apiError("Not found", 404);
  return apiSuccess(item);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const updated = await db.galleryItem.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "GalleryItem", entityId: id, entityTitle: updated.caption || "Gallery item" });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.galleryItem.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.galleryItem.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "GalleryItem", entityId: id, entityTitle: existing.caption || "Gallery item" });
  revalidatePath("/");
  return apiSuccess(archived);
}
