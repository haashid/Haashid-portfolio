import { db } from "@/lib/db";
import { cache } from "react";

export const getProfile = cache(async () => {
  return await db.profile.findFirst();
});

export const getHeroContent = cache(async () => {
  return await db.heroContent.findFirst({ where: { published: true } });
});

export const getSiteSettings = cache(async () => {
  return await db.siteSettings.findFirst();
});

export const getActiveTheme = cache(async () => {
  return db.theme.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
});

export const getSections = cache(async () => {
  return await db.section.findMany({ orderBy: { order: "asc" } });
});

export const getSocialLinks = cache(async () => {
  return await db.socialLink.findMany({
    where: { enabled: true },
    orderBy: { displayOrder: "asc" },
  });
});

// ── Projects ────────────────────────────────────────────────

export const getPublishedProjects = cache(async () => {
  return db.project.findMany({ where: { publishStatus: "PUBLISHED" }, include: { images: { orderBy: { order: "asc" } } }, orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }] });
});

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  return db.project.findFirst({ where: { slug, publishStatus: "PUBLISHED" }, include: { images: { orderBy: { order: "asc" } } } });
});

// ── Achievements ────────────────────────────────────────────

export const getPublishedAchievements = cache(async () => {
  return await db.achievement.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
});

// ── Certificates ────────────────────────────────────────────

export const getPublishedCertificates = cache(async () => {
  return await db.certificate.findMany({
    where: { publishStatus: "PUBLISHED", isPublic: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
});

// ── Skills ──────────────────────────────────────────────────

export const getSkillCategories = cache(async () => {
  return await db.skillCategory.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      skills: {
        where: { publishStatus: "PUBLISHED" },
        orderBy: { displayOrder: "asc" },
      },
    },
  });
});

// ── Experience (non-leadership) ─────────────────────────────

export const getPublishedExperience = cache(async () => {
  return await db.experience.findMany({
    where: {
      publishStatus: "PUBLISHED",
      employmentType: { not: "LEADERSHIP" },
    },
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
});

// ── Leadership ──────────────────────────────────────────────

export const getPublishedLeadership = cache(async () => {
  return await db.leadership.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
});

// ── Education ───────────────────────────────────────────────

export const getEducation = cache(async () => {
  return await db.education.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
  });
});

// ── Workshops ───────────────────────────────────────────────

export const getWorkshops = cache(async () => {
  return await db.workshop.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
  });
});

// ── Blog ────────────────────────────────────────────────────

export const getPublishedBlogs = cache(async () => {
  return await db.blogPost.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { categories: true, tags: true },
  });
});

export const getPublishedBlogBySlug = cache(async (slug: string) => {
  return await db.blogPost.findFirst({
    where: { slug, publishStatus: "PUBLISHED" },
    include: { categories: true, tags: true },
  });
});

// ── Gallery ─────────────────────────────────────────────────

export const getGalleryItems = cache(async () => {
  return await db.galleryItem.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
});

// ── Testimonials ────────────────────────────────────────────

export const getTestimonials = cache(async () => {
  return await db.testimonial.findMany({
    where: { publishStatus: "PUBLISHED" },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
});

// ── Resume ──────────────────────────────────────────────────

export const getActiveResume = cache(async () => {
  return db.resume.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } });
});

