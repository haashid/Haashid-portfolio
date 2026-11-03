import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  organization: z.string().min(1).max(300).optional(),
  issueDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  credentialId: z.string().max(200).optional().nullable(),
  verificationUrl: z.string().url().or(z.literal("")).optional().nullable(),
  fileUrl: z.string().url().or(z.literal("")).optional().nullable(),
  thumbnailUrl: z.string().url().or(z.literal("")).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  featured: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
  achievementId: z.string().optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.certificate.findUnique({ where: { id }, include: { achievement: { select: { title: true } } } });
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
  const updated = await db.certificate.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Certificate", entityId: id, entityTitle: updated.name });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.certificate.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  await db.certificate.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Certificate", entityId: id, entityTitle: existing.name });
  revalidatePath("/");
  return apiSuccess({ archived: true });
}
