import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  position: z.string().min(1).max(200).optional(),
  company: z.string().min(1).max(200).optional(),
  companyLogoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  companyUrl: z.string().url().or(z.literal("")).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  employmentType: z.enum(["FULL_TIME","PART_TIME","INTERNSHIP","FREELANCE","CONTRACT","VOLUNTEER","LEADERSHIP"]).optional(),
  startDate: z.string().transform((v) => new Date(v)).optional(),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  isCurrent: z.boolean().optional(),
  description: z.string().max(3000).optional().nullable(),
  responsibilities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  technologies: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).optional(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const item = await db.experience.findUnique({ where: { id } });
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
  const updated = await db.experience.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Experience", entityId: id, entityTitle: `${updated.position} at ${updated.company}` });
  revalidatePath("/");
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.experience.findUnique({ where: { id } });
  if (!existing) return apiError("Not found", 404);
  await db.experience.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Experience", entityId: id, entityTitle: `${existing.position} at ${existing.company}` });
  revalidatePath("/");
  return apiSuccess({ archived: true });
}
