import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const schema = z.object({
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
  return apiSuccess(link, 201);
}

export async function PUT(req: NextRequest) {
  // Bulk update for reordering
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const items = z.array(z.object({ id: z.string(), displayOrder: z.number().int(), enabled: z.boolean() })).safeParse(body);
  if (!items.success) return apiError(items.error.message);
  await Promise.all(items.data.map((item) =>
    db.socialLink.update({ where: { id: item.id }, data: { displayOrder: item.displayOrder, enabled: item.enabled } })
  ));
  await logAudit({ action: "updated", entityType: "SocialLink", entityTitle: "Social links reordered" });
  return apiSuccess({ ok: true });
}
