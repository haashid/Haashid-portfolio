import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  url: z.string().url(),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const resume = await db.resume.findFirst({ where: { isActive: true } });
  return apiSuccess({ url: resume?.fileUrl || null });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const resume = await db.$transaction(async (tx) => {
    await tx.resume.updateMany({ where: { isActive: true }, data: { isActive: false } });
    const existing = await tx.resume.findFirst({ where: { fileUrl: parsed.data.url } });
    return existing
      ? tx.resume.update({ where: { id: existing.id }, data: { isActive: true } })
      : tx.resume.create({
          data: { name: "resume.pdf", fileUrl: parsed.data.url, isActive: true },
        });
  }, { isolationLevel: "Serializable" });

  await logAudit({ action: "updated", entityType: "Resume", entityId: resume.id, entityTitle: "Resume" });
  revalidatePath("/");
  return apiSuccess({ url: resume.fileUrl });
}
