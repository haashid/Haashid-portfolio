import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { id } = await params;
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return apiError("Not found", 404);

  // If Vercel Blob, delete from blob storage
  if (process.env.BLOB_READ_WRITE_TOKEN && media.url.includes("vercel-storage")) {
    try {
      const { del } = await import("@vercel/blob");
      await del(media.url);
    } catch {
      console.warn("[Media] Could not delete from Vercel Blob:", media.url);
    }
  }

  await db.media.delete({ where: { id } });
  await logAudit({ action: "deleted", entityType: "Media", entityId: id, entityTitle: media.originalName });
  revalidatePath("/");
  return apiSuccess({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const updated = await db.media.update({
    where: { id },
    data: {
      alt: body.alt ?? undefined,
      caption: body.caption ?? undefined,
      category: body.category ?? undefined,
    },
  });
  return apiSuccess(updated);
}
