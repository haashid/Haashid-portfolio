import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const seoSchema = z.object({
  siteTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
  ogTitle: z.string().max(200).optional().nullable(),
  ogDescription: z.string().max(500).optional().nullable(),
  ogImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  faviconUrl: z.string().url().or(z.literal("")).optional().nullable(),
  canonicalUrl: z.string().url().or(z.literal("")).optional().nullable(),
  googleAnalyticsId: z.string().max(50).optional().nullable(),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const settings = await db.siteSettings.findFirst();
  return apiSuccess(settings ?? {});
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = seoSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const existing = await db.siteSettings.findFirst();
  const settings = existing
    ? await db.siteSettings.update({ where: { id: existing.id }, data: parsed.data })
    : await db.siteSettings.create({ data: parsed.data as Parameters<typeof db.siteSettings.create>[0]["data"] });

  await logAudit({ action: "updated", entityType: "SiteSettings", entityId: settings.id, entityTitle: "SEO Settings" });
  revalidatePath("/");
  return apiSuccess(settings);
}
