import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  eventName: z.string().min(1).max(300),
  organization: z.string().max(300).optional().nullable(),
  role: z.string().max(200).optional().nullable(),
  date: z.string().transform((v) => new Date(v)).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  audienceSize: z.number().int().optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  topics: z.array(z.string()).default([]),
  imageUrls: z.array(z.string()).default([]),
  articleUrl: z.string().url().or(z.literal("")).optional().nullable(),
  eventUrl: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.workshop.findMany({
    orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
  });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.workshop.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Workshop", entityId: item.id, entityTitle: item.eventName });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
