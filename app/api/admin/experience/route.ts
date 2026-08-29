import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const experienceSchema = z.object({
  position: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  companyLogoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  companyUrl: z.string().url().or(z.literal("")).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  employmentType: z.enum(["FULL_TIME","PART_TIME","INTERNSHIP","FREELANCE","CONTRACT","VOLUNTEER","LEADERSHIP"]).default("FULL_TIME"),
  startDate: z.string().transform((v) => new Date(v)),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().max(3000).optional().nullable(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.experience.findMany({ orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }] });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = experienceSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.experience.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Experience", entityId: item.id, entityTitle: `${item.position} at ${item.company}` });
  return apiSuccess(item, 201);
}
