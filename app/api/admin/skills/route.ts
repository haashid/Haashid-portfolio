import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

// Skills
const skillSchema = z.object({
  name: z.string().min(1).max(200),
  categoryId: z.string().min(1),
  iconName: z.string().max(100).optional().nullable(),
  level: z.enum(["BEGINNER","INTERMEDIATE","ADVANCED","EXPERT"]).optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const categories = await db.skillCategory.findMany({
    orderBy: { displayOrder: "asc" },
    include: { skills: { orderBy: { displayOrder: "asc" } } },
  });
  return apiSuccess(categories);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();

  // Handle category creation
  if (body.type === "category") {
    const cat = await db.skillCategory.create({ data: { name: body.name, displayOrder: body.displayOrder ?? 0 } });
    return apiSuccess(cat, 201);
  }

  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const skill = await db.skill.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Skill", entityId: skill.id, entityTitle: skill.name });
  return apiSuccess(skill, 201);
}
