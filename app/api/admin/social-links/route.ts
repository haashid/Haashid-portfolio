import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1).max(100),
  url: z.string().min(1).max(500),
  label: z.string().min(1).max(100),
  icon: z.string().max(100).optional().nullable(),
  enabled: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const links = await db.socialLink.findMany({ orderBy: { displayOrder: "asc" } });
  return apiSuccess(links);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);
  const link = await db.socialLink.create({ data: parsed.data });
  await logAudit({ action: "created", entityType: "SocialLink", entityId: link.id, entityTitle: link.platform });
  revalidatePath("/");
  return apiSuccess(link, 201);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const items = z.array(schema).safeParse(body);
  if (!items.success) return apiError(items.error.message);

  const links = await db.$transaction(async (tx) => {
    const saved = [];
    for (const { id, ...data } of items.data) {
      if (id && !id.startsWith("new_")) {
        saved.push(await tx.socialLink.update({ where: { id }, data }));
      } else {
        saved.push(await tx.socialLink.create({ data }));
      }
    }

    await tx.socialLink.deleteMany({
      where: saved.length ? { id: { notIn: saved.map((link) => link.id) } } : {},
    });
    return saved.sort((a, b) => a.displayOrder - b.displayOrder);
  });

  await logAudit({ action: "updated", entityType: "SocialLink", entityTitle: "Social links reordered" });
  revalidatePath("/");
  return apiSuccess(links);
}
