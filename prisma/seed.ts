/**
 * SEED MIGRATION — Phase S
 *
 * Migrates all hard-coded data from lib/data.ts into the database.
 * Run ONCE after setting up the database:
 *
 *   npx tsx prisma/seed.ts
 *
 * or via:
 *   npm run db:seed
 *
 * This is idempotent — it uses upserts/createOrSkip patterns.
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed migration from lib/data.ts...");

  // ═══════════════════════════════════════════════════════
  // PROFILE
  // ═══════════════════════════════════════════════════════
  const existing = await db.profile.findFirst();
  if (!existing) {
    await db.profile.create({
      data: {
        name: "Muhammad Haashid",
        title: "AI Engineer & Technical Builder",
        shortBio:
          "Building intelligent systems at the intersection of AI, Blockchain, and IoT. I architect solutions that scale, reason, and adapt.",
        fullBio:
          "I am Muhammad Haashid — an AI engineer, full-stack builder, and student founder passionate about systems that think. " +
          "I build multi-agent AI platforms, decentralized systems, and IoT-enabled solutions that push the boundary of what software can do. " +
          "As Founding President of ICSB Club and Chairperson of IEEE SMC at P.A. College of Engineering, I lead communities and run technical workshops that have reached 300+ students.",
        location: "Mangalore, India",
        email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
        availabilityStatus: "OPEN_TO_OPPORTUNITIES",
        availabilityMessage: "Open to internships and collaborations",
        preferredRoles: ["AI Engineer", "Full Stack Developer", "Technical Lead"],
        remoteOk: true,
        hybridOk: true,
        onSiteOk: true,
        ctaText: "Get in Touch",
        ctaUrl: "#contact",
      },
    });
    console.log("✅ Profile created");
  } else {
    console.log("⏭  Profile already exists, skipping");
  }

  // ═══════════════════════════════════════════════════════
  // SOCIAL LINKS
  // ═══════════════════════════════════════════════════════
  const socialLinks = [
    { platform: "github",   label: "GitHub",   url: "https://github.com/haashid",                         icon: "Github",   displayOrder: 0 },
    { platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-haashid/",      icon: "Linkedin", displayOrder: 1 },
    { platform: "email",    label: "Email",    url: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ""}`, icon: "Mail", displayOrder: 2 },
  ];

  await db.socialLink.deleteMany();
  await db.socialLink.createMany({
    data: socialLinks.map(link => ({ ...link, enabled: true })),
  });
  console.log("✅ Social links seeded");

  // ═══════════════════════════════════════════════════════
  // PROJECTS
  // ═══════════════════════════════════════════════════════
  const projects = [
    {
      title: "ORION",
      slug: "orion",
      shortDescription: "A multimodal GenAI platform for oil and gas teams, designed around role-aware assistance, local AI services and engineering workflows.",
      fullDescription: "The public repository describes ORION as a cognitive subsurface AI system for reservoir management, production optimization and drilling operations.",
      problem: "Engineering teams need a clearer way to reason across documents, telemetry, assets and operational roles.",
      solution: "ORION connects role-based interfaces, agentic reasoning, document intelligence and 3D/geospatial visualization into a product-oriented system.",
      technologies: ["Next.js", "FastAPI", "GenAI", "Local LLMs", "ChromaDB", "CesiumJS", "React Three Fiber"],
      category: "Engineering Intelligence / AI / Energy",
      status: "ACTIVE" as const,
      publishStatus: "PUBLISHED" as const,
      featured: true,
      githubUrl: "https://github.com/haashid/ORION",
      accentColor: "blue",
      displayOrder: 0,
    },
    {
      title: "NeuroMesh",
      slug: "neuromesh",
      shortDescription: "A real-time, multi-agent disaster intelligence system built from IoT sensor mesh data during HackToFuture 4.0.",
      fullDescription: "Repository materials describe NeuroMesh as a real-time disaster intelligence system using IoT sensor mesh networks and multi-agent analysis.",
      problem: "Emergency response teams face noisy telemetry, delayed decisions and poorly contextualized alerts during structural and environmental incidents.",
      solution: "NeuroMesh combines live sensor ingestion, ML inference, verification and multi-agent SITREP generation for command visibility.",
      technologies: ["Next.js", "Python", "TensorFlow", "Firebase RTDB", "LangGraph", "IoT"],
      category: "AI / Decentralized Intelligence / Crisis Response",
      status: "COMPLETED" as const,
      publishStatus: "PUBLISHED" as const,
      featured: true,
      githubUrl: "https://github.com/haashid/hacktofuture4-I03",
      award: "National Runner-Up — HackToFuture 4.0",
      accentColor: "green",
      displayOrder: 1,
    },
    {
      title: "TrueHire",
      slug: "truehire",
      shortDescription: "A live interview intelligence system that turns a hiring conversation into a structured AI-assisted evaluation.",
      fullDescription: "The public README positions TrueHire as a multi-agent interview intelligence system with real-time voice analysis and parallel AI debate.",
      problem: "Technical hiring can over-index on subjective impressions, keyword matching and unverified claims.",
      solution: "TrueHire uses resume analysis, live voice intelligence, adaptive questioning and multi-agent review to support Hire / No-Hire decisions.",
      technologies: ["Next.js", "FastAPI", "LangGraph", "Web Audio API", "Tailwind CSS", "Mistral AI"],
      category: "AI / Multi-Agent Systems / Recruitment",
      status: "COMPLETED" as const,
      publishStatus: "PUBLISHED" as const,
      featured: true,
      githubUrl: "https://github.com/haashid/trueHire-Ai-",
      award: "Grand Champion — hackathon-winning project",
      accentColor: "indigo",
      displayOrder: 2,
    },
    {
      title: "Weilchain Nexus",
      slug: "weilchain-nexus",
      shortDescription: "A decentralized AI applet marketplace for deploying applets and composing useful blockchain-backed workflows.",
      fullDescription: "The public repository describes Weilchain Nexus as a decentralized AI applet marketplace built on WeilChain.",
      problem: "Developers need a marketplace model for reusable applets, authenticated workflows and composable on-chain utilities.",
      solution: "The project combines smart contracts, IPFS integration, wallet authentication and a marketplace interface for applet pipelines.",
      technologies: ["Next.js", "Solidity", "Web3.js", "IPFS", "Hardhat", "Weilchain"],
      category: "Blockchain / Web3",
      status: "COMPLETED" as const,
      publishStatus: "PUBLISHED" as const,
      featured: true,
      githubUrl: "https://github.com/haashid/weilchain-nexus",
      demoUrl: "https://weilchainnexus.vercel.app",
      award: "2nd Runner-Up — East India Blockchain Summit 2.0, IIT Kharagpur",
      accentColor: "orange",
      displayOrder: 3,
    },
    {
      title: "Real-Time Heart Health Monitoring System",
      slug: "heart-health-monitor",
      shortDescription: "A real-time health dashboard for ECG, heart rate, SpO2 and temperature signals from connected IoT devices.",
      problem: "Caregivers and researchers need live physiological data, clear abnormality alerts and readable historical context.",
      solution: "The system visualizes connected vitals in a responsive dashboard with MQTT/WebSocket data flow and charting.",
      technologies: ["React", "Vite", "MQTT", "WebSockets", "Tailwind CSS", "Firebase", "Chart.js"],
      category: "IoT / Health Technology",
      status: "COMPLETED" as const,
      publishStatus: "PUBLISHED" as const,
      featured: false,
      githubUrl: "https://github.com/haashid/real-time-heart-health-monitoring-system",
      accentColor: "red",
      displayOrder: 4,
    },
    {
      title: "AuditOS",
      slug: "auditos",
      shortDescription: "An AI-native audit operating system concept with multi-tenant audit workspaces and an audit copilot architecture.",
      problem: "Audit teams often work across fragmented financial, compliance, cyber and operational workflows.",
      solution: "AuditOS consolidates specialized audit workspaces with risk scoring, document parsing and generative AI analysis.",
      technologies: ["Next.js", "TypeScript", "FastAPI", "Postgres", "Docker", "AI Copilot"],
      category: "AI / SaaS / Audit Technology",
      status: "IN_DEVELOPMENT" as const,
      publishStatus: "PUBLISHED" as const,
      featured: false,
      githubUrl: "https://github.com/haashid/AuditOS",
      accentColor: "slate",
      displayOrder: 5,
    },
    {
      title: "ICSB Website",
      slug: "icsb-website",
      shortDescription: "A web platform tied to the ICSB student technology community at P.A. College of Engineering.",
      problem: "Technical student communities need a clear public surface for events, identity and participation.",
      solution: "The site pairs community leadership with a production-style web platform built with a modern Next.js stack.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "UI Components"],
      category: "Community / Web Platform",
      status: "ACTIVE" as const,
      publishStatus: "PUBLISHED" as const,
      featured: false,
      githubUrl: "https://github.com/haashid/ICSB-WEBSITE",
      accentColor: "cyan",
      displayOrder: 6,
    },
  ];

  for (const proj of projects) {
    const existing = await db.project.findUnique({ where: { slug: proj.slug } });
    if (!existing) {
      await db.project.create({ data: proj });
      console.log(`  ✅ Project: ${proj.title}`);
    } else {
      console.log(`  ⏭  Project already exists: ${proj.title}`);
    }
  }

  // ═══════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════
  const achievements = [
    { title: "Grand Champion", placement: "First place", event: "VEXSTORM 2026", organization: "Datavex.AI at Sahyadri College of Engineering and Management", year: "2026", description: "National Level AI Hackathon with 100+ teams, 25 offline finalists and a 32-hour build sprint. The winning team received paid internship opportunities from Datavex.AI.", featured: true, displayOrder: 0 },
    { title: "National Runner-Up", placement: "Runner-up", event: "HackToFuture 4.0", organization: "St. Joseph Engineering College x EG India", year: "2026", description: "Open Innovation track finalist from 3,000+ registrations, 700+ teams and 41 finalist teams. Project: NeuroMesh.", featured: true, displayOrder: 1 },
    { title: "2nd Runner-Up", placement: "Blockchain summit recognition", event: "East India Blockchain Summit 2.0", organization: "KSHITIJ 2026, IIT Kharagpur", year: "2026", description: "Shortlisted-stage competition with 52 teams. Project associated with Weilchain Nexus / Applet Marketplace.", featured: true, displayOrder: 2 },
    { title: "2nd Place", placement: "National hackathon", event: "Hackotsava 2025", organization: "National Level Hackathon", year: "2025", description: "Recognized among 340+ students and 85+ teams with Vineeth S N, Zuhain Ibrahim and Hafeezu Rrahman.", featured: false, displayOrder: 3 },
    { title: "4th Place / Consolation Prize", placement: "National hackathon", event: "CodeSprint 2026", organization: "National-level AI + Blockchain + IoT hackathon", year: "2026", description: "32-hour competition with 54 teams. Team: Muhammad Haashid and Mohammed Shakeeb.", featured: false, displayOrder: 4 },
    { title: "Overall Champion", placement: "Technical-event champion", event: "Innov8rix 2025", organization: "Innov8rix", year: "2025", description: "Overall Champion recognition across supplied technical-event wins.", featured: false, displayOrder: 5 },
    { title: "Runner-Up", placement: "Hackathon", event: "Hackathon 2K26", organization: "Chakravyuha Youth Carnival, Srinivas University", year: "2026", featured: false, displayOrder: 6 },
    { title: "Winner", placement: "Entrepreneurship event", event: "Entrorphosis", organization: "Malnad College of Engineering, Hassan", year: "2025", featured: false, displayOrder: 7 },
    { title: "Best Innovation", placement: "Innovation recognition", event: "Udbhava: Spark the Future", organization: "Nitte Institute of Professional Education", year: "2025", featured: false, displayOrder: 8 },
    { title: "3rd Prize", placement: "Hack summit", event: "Hack Summit 2024", organization: "Hack Summit", year: "2024", featured: false, displayOrder: 9 },
  ];

  for (const a of achievements) {
    const existing = await db.achievement.findFirst({ where: { title: a.title, event: a.event } });
    if (!existing) {
      await db.achievement.create({ data: { ...a, publishStatus: "PUBLISHED" } });
      console.log(`  ✅ Achievement: ${a.title} — ${a.event}`);
    } else {
      console.log(`  ⏭  Achievement already exists: ${a.title}`);
    }
  }

  // ═══════════════════════════════════════════════════════
  // SKILLS
  // ═══════════════════════════════════════════════════════
  const skillGroups = [
    { category: "AI / Generative AI", technologies: ["OpenAI", "Google Gemini", "Generative AI", "AI-powered systems", "Multi-agent systems", "LangGraph", "AI-assisted engineering"] },
    { category: "Blockchain / Web3", technologies: ["Solidity", "Ethereum", "Web3.js", "IPFS", "Smart Contracts", "Weilchain", "Decentralized applications"] },
    { category: "Frontend", technologies: ["React", "Next.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Flutter"] },
    { category: "Backend", technologies: ["Node.js", "Express.js", "FastAPI", "Python", "PHP"] },
    { category: "Databases / Cloud", technologies: ["MongoDB", "MySQL", "Firebase"] },
    { category: "IoT / Hardware", technologies: ["ESP32", "Arduino", "Raspberry Pi", "MQTT", "IoT sensors"] },
    { category: "Developer Tools", technologies: ["Git", "GitHub", "VS Code", "Figma", "Postman"] },
  ];

  for (let ci = 0; ci < skillGroups.length; ci++) {
    const group = skillGroups[ci];
    let cat = await db.skillCategory.findFirst({ where: { name: group.category } });
    if (!cat) {
      cat = await db.skillCategory.create({ data: { name: group.category, displayOrder: ci } });
      console.log(`  ✅ Skill category: ${group.category}`);
    }
    for (let si = 0; si < group.technologies.length; si++) {
      const tech = group.technologies[si];
      const existing = await db.skill.findFirst({ where: { name: tech, categoryId: cat.id } });
      if (!existing) {
        await db.skill.create({
          data: { name: tech, categoryId: cat.id, displayOrder: si, publishStatus: "PUBLISHED" },
        });
      }
    }
  }
  console.log("✅ Skills seeded");

  // ═══════════════════════════════════════════════════════
  // LEADERSHIP (as Experience with LEADERSHIP type)
  // ═══════════════════════════════════════════════════════
  const leadership = [
    { position: "Founding President", company: "ICSB Club — P.A. College of Engineering", employmentType: "LEADERSHIP" as const, isCurrent: true, description: "Leading a student technology community focused on IoT, Cyber Security and Blockchain.", startDate: new Date("2024-01-01") },
    { position: "Chairperson", company: "IEEE Systems, Man & Cybernetics Student Chapter", employmentType: "LEADERSHIP" as const, isCurrent: true, description: "Student chapter leadership across systems thinking, computing and cybernetic technology interests.", startDate: new Date("2024-01-01") },
    { position: "Resource Person", company: "BUILDX Workshop — BIT Polytechnic", employmentType: "LEADERSHIP" as const, isCurrent: false, description: "Conducted a two-day hands-on RC car workshop where 60+ students worked on assembly, programming, logic, electrical connections, debugging and a final race.", startDate: new Date("2025-02-05"), endDate: new Date("2025-02-06") },
  ];

  for (const l of leadership) {
    const existing = await db.experience.findFirst({ where: { position: l.position, company: l.company } });
    if (!existing) {
      await db.experience.create({ data: { ...l, publishStatus: "PUBLISHED" } });
      console.log(`  ✅ Leadership: ${l.position}`);
    }
  }

  // ═══════════════════════════════════════════════════════
  // SITE SETTINGS / SEO
  // ═══════════════════════════════════════════════════════
  const siteSettings = await db.siteSettings.findFirst();
  if (!siteSettings) {
    await db.siteSettings.create({
      data: {
        siteTitle: "Muhammad Haashid — AI Engineer & Technical Builder",
        metaDescription: "Portfolio of Muhammad Haashid, an AI, Blockchain, IoT and full-stack engineering builder based in Mangalore, India.",
        ogTitle: "Muhammad Haashid — AI Engineer & Technical Builder",
        ogDescription: "Building intelligent systems at the intersection of AI, Blockchain, and IoT.",
        googleAnalyticsId: null,
      },
    });
    console.log("✅ Site settings created");
  }

  // ═══════════════════════════════════════════════════════
  // THEME
  // ═══════════════════════════════════════════════════════
  const theme = await db.theme.findFirst();
  if (!theme) {
    await db.theme.create({
      data: {
        name: "Default Dark",
        preset: "DARK",
        colorBg: "#050505",
        colorSurface: "rgba(255,255,255,0.03)",
        colorSurface2: "rgba(255,255,255,0.08)",
        colorInk: "#ffffff",
        colorMuted: "#a1a1aa",
        colorLine: "rgba(255,255,255,0.1)",
        colorAccent: "#38bdf8",
        colorAccentDark: "#0ea5e9",
        colorGold: "#fbbf24",
        fontHeading: "Inter",
        fontBody: "Inter",
        fontMono: "JetBrains Mono",
        containerWidth: "1180px",
        cardRadius: "8px",
        buttonRadius: "8px",
        enableGlow: true,
        enableGridBg: true,
        enableGlass: true,
        enableAnimations: true,
        isActive: true,
      },
    });
    console.log("✅ Default theme created");
  }

  // ═══════════════════════════════════════════════════════
  // SECTIONS CONFIG (default order)
  // ═══════════════════════════════════════════════════════
  const defaultSections = [
    { key: "hero", label: "Hero", enabled: true, order: 0 },
    { key: "about", label: "About", enabled: true, order: 1 },
    { key: "skills", label: "Skills", enabled: true, order: 2 },
    { key: "projects", label: "Projects", enabled: true, order: 3 },
    { key: "experience", label: "Experience", enabled: true, order: 4 },
    { key: "education", label: "Education", enabled: true, order: 5 },
    { key: "achievements", label: "Achievements", enabled: true, order: 6 },
    { key: "certificates", label: "Certificates", enabled: true, order: 7 },
    { key: "leadership", label: "Leadership", enabled: true, order: 8 },
    { key: "workshops", label: "Workshops", enabled: true, order: 9 },
    { key: "blog", label: "Blog", enabled: true, order: 10 },
    { key: "gallery", label: "Gallery", enabled: false, order: 11 },
    { key: "testimonials", label: "Testimonials", enabled: false, order: 12 },
    { key: "ai-twin", label: "AI Twin", enabled: true, order: 13 },
    { key: "contact", label: "Contact", enabled: true, order: 14 },
  ];

  for (const sec of defaultSections) {
    await db.section.upsert({
      where: { key: sec.key },
      update: {},
      create: sec,
    });
  }
  console.log("✅ Sections config seeded");

  console.log("\n🎉 Seed migration complete!");
  console.log("   Next: Run POST /api/admin/setup to create your admin user.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
