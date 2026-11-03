export const dynamic = "force-dynamic";

import { PortfolioPage } from "@/components/portfolio-page";
import {
  getProfile,
  getHeroContent,
  getSiteSettings,
  getActiveTheme,
  getSections,
  getSocialLinks,
  getPublishedProjects,
  getPublishedAchievements,
  getPublishedCertificates,
  getSkillCategories,
  getPublishedExperience,
  getPublishedLeadership,
  getEducation,
  getWorkshops,
  getPublishedBlogs,
  getGalleryItems,
  getTestimonials,
  getActiveResume,
} from "@/lib/public-data";

export default async function Home() {
  const [
    profile,
    hero,
    siteSettings,
    theme,
    sections,
    socialLinks,
    projects,
    achievements,
    certificates,
    skillCategories,
    experience,
    leadership,
    education,
    workshops,
    blogs,
    gallery,
    testimonials,
    resume,
  ] = await Promise.all([
    getProfile(),
    getHeroContent(),
    getSiteSettings(),
    getActiveTheme(),
    getSections(),
    getSocialLinks(),
    getPublishedProjects(),
    getPublishedAchievements(),
    getPublishedCertificates(),
    getSkillCategories(),
    getPublishedExperience(),
    getPublishedLeadership(),
    getEducation(),
    getWorkshops(),
    getPublishedBlogs(),
    getGalleryItems(),
    getTestimonials(),
    getActiveResume(),
  ]);

  // Derive social link shortcuts
  const githubLink = socialLinks.find((l) => l.platform === "github");
  const linkedinLink = socialLinks.find((l) => l.platform === "linkedin");

  // Build JSON-LD from database
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile?.name || "Muhammad Haashid",
    url: siteSettings?.canonicalUrl || "https://example.com",
    sameAs: [githubLink?.url, linkedinLink?.url].filter(Boolean),
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "P.A. College of Engineering",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Blockchain",
      "Internet of Things",
      "Cybersecurity",
      "Full-stack engineering",
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteSettings?.siteTitle || "Muhammad Haashid Portfolio",
    url: siteSettings?.canonicalUrl || "https://example.com",
    description:
      siteSettings?.metaDescription ||
      "Portfolio of Muhammad Haashid, an AI, Blockchain, IoT and full-stack engineering builder.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <PortfolioPage
        data={{
          profile,
          hero,
          projects,
          achievements,
          certificates,
          skillCategories,
          experience,
          leadership,
          education,
          workshops,
          blogs,
          gallery,
          testimonials,
          socialLinks,
          sections,
          theme,
          resume,
          siteSettings,
        }}
      />
    </>
  );
}
