import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  categoryId: z.string().min(1).optional(),
  iconName: z.string().max(100).optional().nullable(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]).optional().nullable(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const parsed = updateSchema.safeParse(await req.json());
  if (!parsed.success) return apiError(parsed.error.message);
  const skill = await db.skill.update({ where: { id }, data: parsed.data });
  await logAudit({ action: "updated", entityType: "Skill", entityId: id, entityTitle: skill.name });
  revalidatePath("/");
  return apiSuccess(skill);
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const existing = await db.skill.findUnique({ where: { id } });
  if (!existing) return apiError("Skill not found.", 404);
  const archived = await db.skill.update({ where: { id }, data: { publishStatus: "ARCHIVED" } });
  await logAudit({ action: "archived", entityType: "Skill", entityId: id, entityTitle: existing.name });
  revalidatePath("/");
  return apiSuccess(archived);
}
