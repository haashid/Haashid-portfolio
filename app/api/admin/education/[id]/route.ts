import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  institution: z.string().min(1).max(200).optional(),
  degree: z.string().min(1).max(200).optional(),
  fieldOfStudy: z.string().max(200).optional().nullable(),
  startDate: z.string().transform((v) => new Date(v)).optional(),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  activities: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.education.findUnique({ where: { id } });
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
  const updated = await db.education.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Education", entityId: id, entityTitle: updated.institution });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.education.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  await db.education.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Education", entityId: id, entityTitle: existing.institution });
  revalidatePath("/");
  return apiSuccess({ archived: true });
}
