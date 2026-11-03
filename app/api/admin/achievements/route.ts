import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const achievementSchema = z.object({
  title: z.string().min(1).max(300),
  event: z.string().min(1).max(300),
  organization: z.string().max(300).optional().nullable(),
  placement: z.string().max(200).optional().nullable(),
  year: z.string().max(10).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  verificationUrl: z.string().url().or(z.literal("")).optional().nullable(),
  imageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const achievements = await db.achievement.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    include: { certificates: true },
  });
  return apiSuccess(achievements);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = achievementSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const achievement = await db.achievement.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Achievement", entityId: achievement.id, entityTitle: achievement.title });
  revalidatePath("/");
  return apiSuccess(achievement, 201);
}
