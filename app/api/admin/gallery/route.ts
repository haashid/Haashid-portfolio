import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  mediaId: z.string().optional().nullable(),
  imageUrl: z.string().url().min(1),
  caption: z.string().max(500).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  date: z.string().transform((v) => new Date(v)).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const items = await db.galleryItem.findMany({
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
  const item = await db.galleryItem.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "GalleryItem", entityId: item.id, entityTitle: item.caption || "Gallery item" });
  revalidatePath("/");
  return apiSuccess(item, 201);
}
