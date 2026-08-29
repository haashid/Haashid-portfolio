import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Returns the authenticated session or a 401 response.
 * Use in all admin API routes.
 */
export async function requireAdminAuth() {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

/**
 * Standard success response
 */
export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

/**
 * Standard error response
 */
export function apiError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Slugify a string for use in URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Validate file type for uploads
 */
export function validateFileType(
  mimeType: string,
  allowed: string[]
): boolean {
  return allowed.some(
    (a) => mimeType === a || mimeType.startsWith(a.replace("*", ""))
  );
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
];

export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  ...ALLOWED_IMAGE_TYPES,
];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 MB
