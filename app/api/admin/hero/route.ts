import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const heroSchema = z.object({
  heading: z.string().max(500),
  subtitle: z.string().max(300),
  description: z.string().max(2000),
  badge: z.string().max(120).optional().nullable(),
  primaryCta: z.string().max(100).optional().nullable(),
  primaryCtaUrl: z.string().max(500).optional().nullable(),
  secondaryCta: z.string().max(100).optional().nullable(),
  secondaryCtaUrl: z.string().max(500).optional().nullable(),
  heroImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  published: z.boolean().default(true),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const hero = await db.heroContent.findFirst({ orderBy: { updatedAt: "desc" } });
  return apiSuccess(hero ?? null);
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const parsed = heroSchema.safeParse(await req.json());
  if (!parsed.success) return apiError(parsed.error.message);

  const current = await db.heroContent.findFirst({ orderBy: { updatedAt: "desc" } });
  const hero = current
    ? await db.heroContent.update({ where: { id: current.id }, data: parsed.data })
    : await db.heroContent.create({ data: parsed.data });
  await logAudit({ action: parsed.data.published ? "published" : "updated", entityType: "HeroContent", entityId: hero.id, entityTitle: "Hero" });
  revalidatePath("/");
  return apiSuccess(hero);
}
