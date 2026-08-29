import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError } from "@/lib/api-utils";
import { logAudit } from "@/lib/services/audit";
import { z } from "zod";
import { NextRequest } from "next/server";

const profileSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  title: z.string().max(200).optional(),
  shortBio: z.string().max(500).optional(),
  fullBio: z.string().max(5000).optional(),
  location: z.string().max(200).optional(),
  email: z.string().email().or(z.literal("")).optional(),
  phone: z.string().max(50).optional().nullable(),
  website: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  avatarAlt: z.string().max(200).optional().nullable(),
  availabilityStatus: z.enum([
    "OPEN_TO_WORK", "OPEN_TO_INTERNSHIPS", "OPEN_TO_FULL_TIME",
    "OPEN_TO_FREELANCE", "OPEN_TO_COLLABORATIONS",
    "OPEN_TO_OPPORTUNITIES", "NOT_AVAILABLE",
  ]).optional(),
  availabilityMessage: z.string().max(500).optional().nullable(),
  preferredRoles: z.array(z.string()).optional(),
  preferredLocations: z.array(z.string()).optional(),
  remoteOk: z.boolean().optional(),
  hybridOk: z.boolean().optional(),
  onSiteOk: z.boolean().optional(),
  ctaText: z.string().max(100).optional().nullable(),
  ctaUrl: z.string().optional().nullable(),
});

export async function GET() {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const profile = await db.profile.findFirst();
  return apiSuccess(profile ?? {});
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const existing = await db.profile.findFirst();
  const profile = existing
    ? await db.profile.update({ where: { id: existing.id }, data: parsed.data })
    : await db.profile.create({ data: parsed.data as Parameters<typeof db.profile.create>[0]["data"] });

  await logAudit({
    action: "updated",
    entityType: "Profile",
    entityId: profile.id,
    entityTitle: profile.name || "Profile",
  });

  return apiSuccess(profile);
}
