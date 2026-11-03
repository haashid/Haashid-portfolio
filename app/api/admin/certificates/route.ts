import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  name: z.string().min(1).max(300),
  organization: z.string().min(1).max(300),
  issueDate: z.string().transform((v) => new Date(v)).optional().nullable(),
  credentialId: z.string().max(200).optional().nullable(),
  verificationUrl: z.string().url().or(z.literal("")).optional().nullable(),
  fileUrl: z.string().url().or(z.literal("")).optional().nullable(),
  thumbnailUrl: z.string().url().or(z.literal("")).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  featured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT","PUBLISHED","ARCHIVED"]).default("PUBLISHED"),
  achievementId: z.string().optional().nullable(),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.certificate.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    include: { achievement: { select: { title: true } } },
  });
  return apiSuccess(items);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const item = await db.certificate.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "Certificate", entityId: item.id, entityTitle: item.name });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
