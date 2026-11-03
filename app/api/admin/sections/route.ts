import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const sectionUpdateSchema = z.array(
  z.object({
    id: z.string().optional(),
    key: z.string(),
    label: z.string(),
    enabled: z.boolean(),
    order: z.number().int(),
  })
);

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const sections = await db.section.findMany({ orderBy: { order: "asc" } });
  return apiSuccess(sections);
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const body = await req.json();
  const parsed = sectionUpdateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  // Upsert all sections
  const results = await Promise.all(
    parsed.data.map((s) =>
      db.section.upsert({
        where: { key: s.key },
        update: { enabled: s.enabled, order: s.order, label: s.label },
        create: { key: s.key, label: s.label, enabled: s.enabled, order: s.order },
      })
    )
  );

  await logAudit({ action: "updated", entityType: "SectionConfig", entityTitle: "Section layout" });
  revalidatePath("/");
  return apiSuccess(results);
}
