import { db } from "@/lib/db";
import { requireAdminAuth, apiSuccess, apiError, slugify } from "@/lib/api-utils";
import { logAudit, createVersion } from "@/lib/services/audit";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { NextRequest } from "next/server";

const projectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().max(200).optional(),
  shortDescription: z.string().max(500),
  fullDescription: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  myRole: z.string().optional().nullable(),
  technologies: z.array(z.string()).default([]),
  category: z.string().max(200).optional().nullable(),
  status: z.enum(["IDEA", "IN_DEVELOPMENT", "ACTIVE", "COMPLETED", "ARCHIVED"]).default("ACTIVE"),
  publishStatus: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
  githubUrl: z.string().url().or(z.literal("")).optional().nullable(),
  demoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  docsUrl: z.string().url().or(z.literal("")).optional().nullable(),
  videoUrl: z.string().url().or(z.literal("")).optional().nullable(),
  coverImageUrl: z.string().url().or(z.literal("")).optional().nullable(),
  award: z.string().max(500).optional().nullable(),
  tags: z.array(z.string()).default([]),
  accentColor: z.string().max(50).optional().nullable(),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  const projects = await db.project.findMany({
    where: {
      ...(status ? { publishStatus: status as "DRAFT" | "PUBLISHED" | "ARCHIVED" } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return apiSuccess(projects);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdminAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return apiError(parsed.error.message);

  const slug = parsed.data.slug || slugify(parsed.data.title);

  // Check slug uniqueness
  const existing = await db.project.findUnique({ where: { slug } });
  if (existing) return apiError("A project with this slug already exists.", 409);

  const project = await db.project.create({
    data: { ...parsed.data, slug },
    include: { images: true },
  });

  await logAudit({ action: "created", entityType: "Project", entityId: project.id, entityTitle: project.title });
  await createVersion("Project", project.id, project.title, project as unknown as Record<string, unknown>, "Initial creation");

  revalidatePath("/");
  revalidatePath("/projects");
  if (project.publishStatus === "PUBLISHED") revalidatePath(`/projects/${project.slug}`);
  return apiSuccess(project, 201);
}
