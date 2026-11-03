import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  personName: z.string().min(1).max(200).optional(),
  role: z.string().max(200).optional().nullable(),
  organization: z.string().max(300).optional().nullable(),
  avatarUrl: z.string().url().or(z.literal("")).optional().nullable(),
  content: z.string().min(1).max(2000).optional(),
  linkedinUrl: z.string().url().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.testimonial.findUnique({ where: { id } });
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
  const updated = await db.testimonial.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Testimonial", entityId: id, entityTitle: updated.personName });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.testimonial.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.testimonial.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Testimonial", entityId: id, entityTitle: existing.personName });
  revalidatePath("/");
  return apiSuccess(archived);
}
