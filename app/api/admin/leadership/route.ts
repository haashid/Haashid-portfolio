import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  position: z.string().min(1).max(200),
  organization: z.string().min(1).max(300),
  logoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  startDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  endDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  isCurrent: z.boolean().default(false),
  achievements: z.array(z.string()).default([]),
  imageUrls: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.leadership.findMany({
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.leadership.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Leadership", entityId: item.id, entityTitle: item.position });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
