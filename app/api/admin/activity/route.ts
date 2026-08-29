import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess } from "@/lib/api-utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const logs = await db.auditLog.findMany({
    take: limit,
    skip: (page - 1) * limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
  const total = await db.auditLog.count();
  return apiSuccess({ logs, total, page, limit });
}
