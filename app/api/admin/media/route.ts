import { requireAdminAuth, apiSuccess, apiError, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  if (process.env.NODE_ENV === "production" && !process.env.BLOB_READ_WRITE_TOKEN) {
    return apiError("Media storage is not configured. Configure durable storage before uploading files.", 503);
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const alt = formData.get("alt") as string | null;
  const category = formData.get("category") as string | null;

  if (!file) return apiError("No file provided");

  // Validate type
  const allowed = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (!allowed.includes(file.type)) return apiError("File type not allowed");

  // Validate size
  if (file.size > MAX_DOCUMENT_SIZE) return apiError("File too large (max 20 MB)");

  // Sanitize filename
  const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const timestamp = Date.now();
  const filename = `${timestamp}_${originalName}`;

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Production: Vercel Blob
    const { put } = await import("@vercel/blob");
    const blob = await put(`media/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    url = blob.url;
  } else {
    // Development: local file system
    const uploadDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) await mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  // Save to Media table
  const media = await db.media.create({
    data: {
      filename,
      originalName: file.name,
      url,
      mimeType: file.type,
      size: file.size,
      alt: alt || null,
      category: category || null,
    },
  });

  await logAudit({ action: "uploaded", entityType: "Media", entityId: media.id, entityTitle: media.originalName });
  revalidatePath("/");

  return apiSuccess(media, 201);
}

export async function GET(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 50;

  const media = await db.media.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(q
        ? {
            OR: [
              { originalName: { contains: q, mode: "insensitive" } },
              { alt: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return apiSuccess(media);
}
