import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const colorValue = z.string().regex(/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$|^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i);
const pixelValue = (max: number) => z.string().regex(/^\d{1,4}px$/).refine((v) => Number.parseInt(v, 10) > 0 && Number.parseInt(v, 10) <= max);

const themeSchema = z.object({
  name: z.string().max(100).optional(),
  preset: z.enum(["DARK","LIGHT","MIDNIGHT","OCEAN","PURPLE","CUSTOM"]).optional(),
  colorBg: colorValue.optional(),
  colorSurface: colorValue.optional(),
  colorSurface2: colorValue.optional(),
  colorInk: colorValue.optional(),
  colorMuted: colorValue.optional(),
  colorLine: colorValue.optional(),
  colorAccent: colorValue.optional(),
  colorAccentDark: colorValue.optional(),
  colorGold: colorValue.optional(),
  fontHeading: z.enum(["Inter", "JetBrains Mono"]).optional(),
  fontBody: z.enum(["Inter", "JetBrains Mono"]).optional(),
  fontMono: z.enum(["Inter", "JetBrains Mono"]).optional(),
  containerWidth: pixelValue(1600).optional(),
  cardRadius: pixelValue(32).optional(),
  buttonRadius: pixelValue(32).optional(),
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

  const theme = await db.$transaction(async (tx) => {
    const existing = await tx.theme.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: "desc" },
    });
    await tx.theme.updateMany({ where: { isActive: true }, data: { isActive: false } });
    return existing
      ? tx.theme.update({ where: { id: existing.id }, data: { ...parsed.data, isActive: true } })
      : tx.theme.create({ data: { ...parsed.data, isActive: true } as Parameters<typeof tx.theme.create>[0]["data"] });
  }, { isolationLevel: "Serializable" });

  await logAudit({ action: "updated", entityType: "Theme", entityId: theme.id, entityTitle: "Theme" });
  revalidatePath("/");
  return apiSuccess(theme);
}
