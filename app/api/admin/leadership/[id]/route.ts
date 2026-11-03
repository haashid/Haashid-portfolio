import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  position: z.string().min(1).max(200).optional(),
  organization: z.string().min(1).max(300).optional(),
  logoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  startDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  isCurrent: z.boolean().optional(),
  achievements: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.leadership.findUnique({ where: { id } });
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
  const updated = await db.leadership.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Leadership", entityId: id, entityTitle: updated.position });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.leadership.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.leadership.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Leadership", entityId: id, entityTitle: existing.position });
  revalidatePath("/");
  return apiSuccess(archived);
}
