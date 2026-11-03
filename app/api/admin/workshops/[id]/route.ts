import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  eventName: z.string().min(1).max(300).optional(),
  organization: z.string().max(300).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  date: z.string().transform((v) => new Date(v)).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  audienceSize: z.number().int().optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  topics: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  articleUrl: z.string().url().or(z.literal("")).optional().nullable(),
  eventUrl: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.workshop.findUnique({ where: { id } });
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
  const updated = await db.workshop.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Workshop", entityId: id, entityTitle: updated.eventName });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.workshop.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  const archived = await db.workshop.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Workshop", entityId: id, entityTitle: existing.eventName });
  revalidatePath("/");
  return apiSuccess(archived);
}
