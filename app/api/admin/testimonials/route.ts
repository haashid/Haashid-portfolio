import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  personName: z.string().min(1).max(200),
  role: z.string().max(200).optional().nullable(),
  organization: z.string().max(300).optional().nullable(),
  avatarUrl: z.string().url().or(z.literal("")).optional().nullable(),
  content: z.string().min(1).max(2000),
  linkedinUrl: z.string().url().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.testimonial.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.testimonial.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Testimonial", entityId: item.id, entityTitle: item.personName });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
