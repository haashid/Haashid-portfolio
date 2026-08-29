import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const themeSchema = z.object({
  name: z.string().max(100).optional(),
  preset: z.enum(["DARK","LIGHT","MIDNIGHT","OCEAN","PURPLE","CUSTOM"]).optional(),
  colorBg: z.string().max(50).optional(),
  colorSurface: z.string().max(50).optional(),
  colorSurface2: z.string().max(50).optional(),
  colorInk: z.string().max(50).optional(),
  colorMuted: z.string().max(50).optional(),
  colorLine: z.string().max(50).optional(),
  colorAccent: z.string().max(50).optional(),
  colorAccentDark: z.string().max(50).optional(),
  colorGold: z.string().max(50).optional(),
  fontHeading: z.string().max(100).optional(),
  fontBody: z.string().max(100).optional(),
  fontMono: z.string().max(100).optional(),
  containerWidth: z.string().max(50).optional(),
  cardRadius: z.string().max(20).optional(),
  buttonRadius: z.string().max(20).optional(),
  enableGlow: z.boolean().optional(),
  enableGridBg: z.boolean().optional(),
  enableGlass: z.boolean().optional(),
  enableAnimations: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const theme = await db.theme.findFirst({ where: { isActive: true } }) ??
    await db.theme.findFirst({ orderBy: { createdAt: "asc" } });
  return apiSuccess(theme ?? {});
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = themeSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const existing = await db.theme.findFirst({ where: { isActive: true } });
  const theme = existing
    ? await db.theme.update({ where: { id: existing.id }, data: { ...parsed.data, isActive: true } })
    : await db.theme.create({ data: { ...parsed.data, isActive: true } as Parameters<typeof db.theme.create>[0]["data"] });

  await logAudit({ action: "updated", entityType: "Theme", entityId: theme.id, entityTitle: "Theme" });
  return apiSuccess(theme);
}
