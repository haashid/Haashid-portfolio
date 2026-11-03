import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  event: z.string().min(1).max(300).optional(),
  organization: z.string().max(300).optional().nullable(),
  placement: z.string().max(200).optional().nullable(),
  year: z.string().max(10).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  verificationUrl: z.string().url().or(z.literal("")).optional().nullable(),
  imageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const achievement = await db.achievement.findUnique({ where: { id }, include: { certificates: true } });
  if (!achievement) return apiError("Not found", 404);
  return apiSuccess(achievement);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const updated = await db.achievement.update({ where: { id }, data: parsed.data, include: { certificates: true } });
  await logAudit({ action: "updated", entityType: "Achievement", entityId: id, entityTitle: updated.title });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.achievement.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.achievement.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Achievement", entityId: id, entityTitle: existing.title });
  revalidatePath("/");
  return apiSuccess(archived);
}
