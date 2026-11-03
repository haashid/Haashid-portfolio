import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError, slugify } from "@/lib/api-utils";
import { logAudit, createVersion } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().max(200).optional(),
  shortDescription: z.string().max(500).optional(),
  fullDescription: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  myRole: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional(),
  category: z.string().max(200).optional().nullable(),
  status: z.enum(["IDEA", "IN_DEVELOPMENT", "ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  githubUrl: z.string().url().or(z.literal("")).optional().nullable(),
  demoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  docsUrl: z.string().url().or(z.literal("")).optional().nullable(),
  videoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  coverImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  award: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).optional(),
  accentColor: z.string().max(50).optional().nullable(),
});

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { id } = await params;
  const project = await db.project.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) return apiError("Project not found", 404);
  return apiSuccess(project);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { id } = await params;
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return apiError("Project not found", 404);

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const nextSlug = parsed.data.slug ? slugify(parsed.data.slug) : existing.slug;
  if (!nextSlug) return apiError("A non-empty slug is required.");
  const slugOwner = await db.project.findUnique({ where: { slug: nextSlug } });
  if (slugOwner && slugOwner.id !== id) return apiError("A project with this slug already exists.", 409);

  // Snapshot before update
  await createVersion("Project", id, existing.title, existing as unknown as Record<string, unknown>);

  const updated = await db.project.update({
    where: { id },
    data: { ...parsed.data, slug: nextSlug },
    include: { images: { orderBy: { order: "asc" } } },
  });

  await logAudit({
    action: parsed.data.publishStatus === "PUBLISHED" ? "published" : "updated",
    entityType: "Project",
    entityId: id,
    entityTitle: updated.title,
  });

  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  revalidatePath(`/projects/${updated.slug}`);
  return apiSuccess(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { id } = await params;
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) return apiError("Project not found", 404);

  // Soft delete: archive instead of destroy
  const archived = await db.project.update({
    where: { id },
    data: { publishStatus: "ARCHIVED", status: "ARCHIVED" },
  });

  await logAudit({ action: "archived", entityType: "Project", entityId: id, entityTitle: existing.title });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${existing.slug}`);
  return apiSuccess(archived);
}
