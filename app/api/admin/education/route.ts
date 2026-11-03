import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const educationSchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  fieldOfStudy: z.string().max(200).optional().nullable(),
  startDate: z.string().transform((v) => new Date(v)),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  grade: z.string().max(50).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  activities: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.education.findMany({ orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }] });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = educationSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.education.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Education", entityId: item.id, entityTitle: item.institution });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
