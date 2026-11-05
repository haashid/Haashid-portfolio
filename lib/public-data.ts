import { db } from "@/lib/db";
import { cache } from "react";

// ── Fallback static data when database is paused, offline, or unset ──

const FALLBACK_PROFILE = {
  id: "default-profile",
  name: "Muhammad Haashid",
  title: "AI Engineer & Technical Builder",
  shortBio:
    "Building intelligent systems at the intersection of AI, Blockchain, and IoT. I architect solutions that scale, reason, and adapt.",
  fullBio:
    "I am Muhammad Haashid — an AI engineer, full-stack builder, and student founder passionate about systems that think. " +
    "I build multi-agent AI platforms, decentralized systems, and IoT-enabled solutions that push the boundary of what software can do. " +
    "As Founding President of ICSB Club and Chairperson of IEEE SMC at P.A. College of Engineering, I lead communities and run technical workshops that have reached 300+ students.",
  location: "Mangalore, India",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "haashid.0607@gmail.com",
  avatarUrl: "/haashid-avatar.png",
  avatarAlt: "Muhammad Haashid",
  availabilityStatus: "OPEN_TO_OPPORTUNITIES",
  availabilityMessage: "Open to internships and collaborations",
  preferredRoles: ["AI Engineer", "Full Stack Developer", "Technical Lead"],
  remoteOk: true,
  hybridOk: true,
  onSiteOk: true,
  ctaText: "Get in Touch",
  ctaUrl: "#contact",
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

const FALLBACK_HERO = {
  id: "default-hero",
  heading: "I build systems that solve real problems.",
  subtitle: "",
  description:
    "Engineering student, builder, and technical leader focused on turning ambitious ideas into working systems.",
  badge: "Available for new opportunities",
  primaryCta: "View Projects",
  primaryCtaUrl: "#projects",
  secondaryCta: "Get in Touch",
  secondaryCtaUrl: "#contact",
  heroImageUrl: "/haashid-avatar.png",
  published: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
};

const FALLBACK_SITE_SETTINGS = {
  id: "default-settings",
  siteTitle: "Muhammad Haashid — AI Engineer & Technical Builder",
  metaDescription:
    "Portfolio of Muhammad Haashid, an AI, Blockchain, IoT and full-stack engineering builder based in Mangalore, India.",
  canonicalUrl: "https://haashid.vercel.app",
  ogTitle: "Muhammad Haashid — AI Engineer & Technical Builder",
  ogDescription:
    "Building intelligent systems at the intersection of AI, Blockchain, and IoT.",
  ogImageUrl: "/haashid-avatar.png",
  faviconUrl: "/favicon.svg",
  googleAnalyticsId: null,
};

const FALLBACK_THEME = {
  id: "default-theme",
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
};

const FALLBACK_SECTIONS = [
  { id: "sec-hero", key: "hero", label: "Hero", enabled: true, order: 0 },
  { id: "sec-about", key: "about", label: "About", enabled: true, order: 1 },
  { id: "sec-skills", key: "skills", label: "Skills", enabled: true, order: 2 },
  { id: "sec-projects", key: "projects", label: "Projects", enabled: true, order: 3 },
  { id: "sec-experience", key: "experience", label: "Experience", enabled: true, order: 4 },
  { id: "sec-education", key: "education", label: "Education", enabled: true, order: 5 },
  { id: "sec-achievements", key: "achievements", label: "Achievements", enabled: true, order: 6 },
  { id: "sec-certificates", key: "certificates", label: "Certificates", enabled: true, order: 7 },
  { id: "sec-leadership", key: "leadership", label: "Leadership", enabled: true, order: 8 },
  { id: "sec-workshops", key: "workshops", label: "Workshops", enabled: true, order: 9 },
  { id: "sec-blog", key: "blog", label: "Blog", enabled: true, order: 10 },
  { id: "sec-gallery", key: "gallery", label: "Gallery", enabled: false, order: 11 },
  { id: "sec-testimonials", key: "testimonials", label: "Testimonials", enabled: false, order: 12 },
  { id: "sec-ai-twin", key: "ai-twin", label: "AI Twin", enabled: true, order: 13 },
  { id: "sec-contact", key: "contact", label: "Contact", enabled: true, order: 14 },
];

const FALLBACK_SOCIAL_LINKS = [
  { id: "soc-1", platform: "github", label: "GitHub", url: "https://github.com/haashid", icon: "Github", displayOrder: 0, enabled: true },
  { id: "soc-2", platform: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/muhammad-haashid/", icon: "Linkedin", displayOrder: 1, enabled: true },
  { id: "soc-3", platform: "email", label: "Email", url: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || "haashid.0607@gmail.com"}`, icon: "Mail", displayOrder: 2, enabled: true },
];

const FALLBACK_PROJECTS = [
  {
    id: "proj-orion",
    title: "ORION",
    slug: "orion",
    shortDescription: "A multimodal GenAI platform for oil and gas teams, designed around role-aware assistance, local AI services and engineering workflows.",
    fullDescription: "The public repository describes ORION as a cognitive subsurface AI system for reservoir management, production optimization and drilling operations.",
    problem: "Engineering teams need a clearer way to reason across documents, telemetry, assets and operational roles.",
    solution: "ORION connects role-based interfaces, agentic reasoning, document intelligence and 3D/geospatial visualization into a product-oriented system.",
    technologies: ["Next.js", "FastAPI", "GenAI", "Local LLMs", "ChromaDB", "CesiumJS", "React Three Fiber"],
    category: "Engineering Intelligence / AI / Energy",
    status: "ACTIVE",
    publishStatus: "PUBLISHED",
    featured: true,
    githubUrl: "https://github.com/haashid/ORION",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/orion.jpg",
    award: null,
    accentColor: "blue",
    myRole: "System Architect & AI Engineer",
    displayOrder: 0,
    startDate: new Date("2025-06-01"),
    endDate: null,
    images: [],
  },
  {
    id: "proj-neuromesh",
    title: "NeuroMesh",
    slug: "neuromesh",
    shortDescription: "A real-time, multi-agent disaster intelligence system built from IoT sensor mesh data during HackToFuture 4.0.",
    fullDescription: "Repository materials describe NeuroMesh as a real-time disaster intelligence system using IoT sensor mesh networks and multi-agent analysis.",
    problem: "Emergency response teams face noisy telemetry, delayed decisions and poorly contextualized alerts during structural and environmental incidents.",
    solution: "NeuroMesh combines live sensor ingestion, ML inference, verification and multi-agent SITREP generation for command visibility.",
    technologies: ["Next.js", "Python", "TensorFlow", "Firebase RTDB", "LangGraph", "IoT"],
    category: "AI / Decentralized Intelligence / Crisis Response",
    status: "COMPLETED",
    publishStatus: "PUBLISHED",
    featured: true,
    githubUrl: "https://github.com/haashid/hacktofuture4-I03",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/neuromesh.jpg",
    award: "National Runner-Up — HackToFuture 4.0",
    accentColor: "green",
    myRole: "Lead Developer",
    displayOrder: 1,
    startDate: new Date("2026-02-01"),
    endDate: new Date("2026-02-28"),
    images: [],
  },
  {
    id: "proj-truehire",
    title: "TrueHire",
    slug: "truehire",
    shortDescription: "A live interview intelligence system that turns a hiring conversation into a structured AI-assisted evaluation.",
    fullDescription: "The public README positions TrueHire as a multi-agent interview intelligence system with real-time voice analysis and parallel AI debate.",
    problem: "Technical hiring can over-index on subjective impressions, keyword matching and unverified claims.",
    solution: "TrueHire uses resume analysis, live voice intelligence, adaptive questioning and multi-agent review to support Hire / No-Hire decisions.",
    technologies: ["Next.js", "FastAPI", "LangGraph", "Web Audio API", "Tailwind CSS", "Mistral AI"],
    category: "AI / Multi-Agent Systems / Recruitment",
    status: "COMPLETED",
    publishStatus: "PUBLISHED",
    featured: true,
    githubUrl: "https://github.com/haashid/trueHire-Ai-",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/truehire.jpg",
    award: "Grand Champion — hackathon-winning project",
    accentColor: "indigo",
    myRole: "Full Stack & Multi-Agent Lead",
    displayOrder: 2,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-01-31"),
    images: [],
  },
  {
    id: "proj-weilchain",
    title: "Weilchain Nexus",
    slug: "weilchain-nexus",
    shortDescription: "A decentralized AI applet marketplace for deploying applets and composing useful blockchain-backed workflows.",
    fullDescription: "The public repository describes Weilchain Nexus as a decentralized AI applet marketplace built on WeilChain.",
    problem: "Developers need a marketplace model for reusable applets, authenticated workflows and composable on-chain utilities.",
    solution: "The project combines smart contracts, IPFS integration, wallet authentication and a marketplace interface for applet pipelines.",
    technologies: ["Next.js", "Solidity", "Web3.js", "IPFS", "Hardhat", "Weilchain"],
    category: "Blockchain / Web3",
    status: "COMPLETED",
    publishStatus: "PUBLISHED",
    featured: true,
    githubUrl: "https://github.com/haashid/weilchain-nexus",
    demoUrl: "https://weilchainnexus.vercel.app",
    docsUrl: null,
    coverImageUrl: "/projects/weilchain-nexus.jpg",
    award: "2nd Runner-Up — East India Blockchain Summit 2.0, IIT Kharagpur",
    accentColor: "orange",
    myRole: "Smart Contract & Frontend Dev",
    displayOrder: 3,
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-02-01"),
    images: [],
  },
  {
    id: "proj-heart-health",
    title: "Real-Time Heart Health Monitoring System",
    slug: "heart-health-monitor",
    shortDescription: "A real-time health dashboard for ECG, heart rate, SpO2 and temperature signals from connected IoT devices.",
    fullDescription: "A real-time health dashboard for ECG, heart rate, SpO2 and temperature signals from connected IoT devices.",
    problem: "Caregivers and researchers need live physiological data, clear abnormality alerts and readable historical context.",
    solution: "The system visualizes connected vitals in a responsive dashboard with MQTT/WebSocket data flow and charting.",
    technologies: ["React", "Vite", "MQTT", "WebSockets", "Tailwind CSS", "Firebase", "Chart.js"],
    category: "IoT / Health Technology",
    status: "COMPLETED",
    publishStatus: "PUBLISHED",
    featured: false,
    githubUrl: "https://github.com/haashid/real-time-heart-health-monitoring-system",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/heart-health-monitor.jpg",
    award: null,
    accentColor: "red",
    myRole: "IoT & Frontend Developer",
    displayOrder: 4,
    startDate: new Date("2025-08-01"),
    endDate: new Date("2025-09-01"),
    images: [],
  },
  {
    id: "proj-auditos",
    title: "AuditOS",
    slug: "auditos",
    shortDescription: "An AI-native audit operating system concept with multi-tenant audit workspaces and an audit copilot architecture.",
    fullDescription: "An AI-native audit operating system concept with multi-tenant audit workspaces and an audit copilot architecture.",
    problem: "Audit teams often work across fragmented financial, compliance, cyber and operational workflows.",
    solution: "AuditOS consolidates specialized audit workspaces with risk scoring, document parsing and generative AI analysis.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Postgres", "Docker", "AI Copilot"],
    category: "AI / SaaS / Audit Technology",
    status: "IN_DEVELOPMENT",
    publishStatus: "PUBLISHED",
    featured: false,
    githubUrl: "https://github.com/haashid/AuditOS",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/auditos.jpg",
    award: null,
    accentColor: "slate",
    myRole: "Founding Engineer",
    displayOrder: 5,
    startDate: new Date("2025-11-01"),
    endDate: null,
    images: [],
  },
  {
    id: "proj-icsb",
    title: "ICSB Website",
    slug: "icsb-website",
    shortDescription: "A web platform tied to the ICSB student technology community at P.A. College of Engineering.",
    fullDescription: "A web platform tied to the ICSB student technology community at P.A. College of Engineering.",
    problem: "Technical student communities need a clear public surface for events, identity and participation.",
    solution: "The site pairs community leadership with a production-style web platform built with a modern Next.js stack.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "UI Components"],
    category: "Community / Web Platform",
    status: "ACTIVE",
    publishStatus: "PUBLISHED",
    featured: false,
    githubUrl: "https://github.com/haashid/ICSB-WEBSITE",
    demoUrl: null,
    docsUrl: null,
    coverImageUrl: "/projects/icsb-website.jpg",
    award: null,
    accentColor: "cyan",
    myRole: "Lead Maintainer",
    displayOrder: 6,
    startDate: new Date("2024-03-01"),
    endDate: null,
    images: [],
  },
];

const FALLBACK_ACHIEVEMENTS = [
  { id: "ach-1", title: "Grand Champion", placement: "First place", event: "VEXSTORM 2026", organization: "Datavex.AI at Sahyadri College of Engineering and Management", year: "2026", description: "National Level AI Hackathon with 100+ teams, 25 offline finalists and a 32-hour build sprint. The winning team received paid internship opportunities from Datavex.AI.", verificationUrl: null, featured: true, displayOrder: 0, publishStatus: "PUBLISHED" },
  { id: "ach-2", title: "National Runner-Up", placement: "Runner-up", event: "HackToFuture 4.0", organization: "St. Joseph Engineering College x EG India", year: "2026", description: "Open Innovation track finalist from 3,000+ registrations, 700+ teams and 41 finalist teams. Project: NeuroMesh.", verificationUrl: null, featured: true, displayOrder: 1, publishStatus: "PUBLISHED" },
  { id: "ach-3", title: "2nd Runner-Up", placement: "Blockchain summit recognition", event: "East India Blockchain Summit 2.0", organization: "KSHITIJ 2026, IIT Kharagpur", year: "2026", description: "Shortlisted-stage competition with 52 teams. Project associated with Weilchain Nexus / Applet Marketplace.", verificationUrl: null, featured: true, displayOrder: 2, publishStatus: "PUBLISHED" },
  { id: "ach-4", title: "2nd Place", placement: "National hackathon", event: "Hackotsava 2025", organization: "National Level Hackathon", year: "2025", description: "Recognized among 340+ students and 85+ teams with Vineeth S N, Zuhain Ibrahim and Hafeezu Rrahman.", verificationUrl: null, featured: false, displayOrder: 3, publishStatus: "PUBLISHED" },
  { id: "ach-5", title: "4th Place / Consolation Prize", placement: "National hackathon", event: "CodeSprint 2026", organization: "National-level AI + Blockchain + IoT hackathon", year: "2026", description: "32-hour competition with 54 teams. Team: Muhammad Haashid and Mohammed Shakeeb.", verificationUrl: null, featured: false, displayOrder: 4, publishStatus: "PUBLISHED" },
  { id: "ach-6", title: "Overall Champion", placement: "Technical-event champion", event: "Innov8rix 2025", organization: "Innov8rix", year: "2025", description: "Overall Champion recognition across supplied technical-event wins.", verificationUrl: null, featured: false, displayOrder: 5, publishStatus: "PUBLISHED" },
  { id: "ach-7", title: "Runner-Up", placement: "Hackathon", event: "Hackathon 2K26", organization: "Chakravyuha Youth Carnival, Srinivas University", year: "2026", description: null, verificationUrl: null, featured: false, displayOrder: 6, publishStatus: "PUBLISHED" },
  { id: "ach-8", title: "Winner", placement: "Entrepreneurship event", event: "Entrorphosis", organization: "Malnad College of Engineering, Hassan", year: "2025", description: null, verificationUrl: null, featured: false, displayOrder: 7, publishStatus: "PUBLISHED" },
  { id: "ach-9", title: "Best Innovation", placement: "Innovation recognition", event: "Udbhava: Spark the Future", organization: "Nitte Institute of Professional Education", year: "2025", description: null, verificationUrl: null, featured: false, displayOrder: 8, publishStatus: "PUBLISHED" },
  { id: "ach-10", title: "3rd Prize", placement: "Hack summit", event: "Hack Summit 2024", organization: "Hack Summit", year: "2024", description: null, verificationUrl: null, featured: false, displayOrder: 9, publishStatus: "PUBLISHED" },
];

const FALLBACK_SKILL_CATEGORIES = [
  {
    id: "cat-1",
    name: "AI / Generative AI",
    displayOrder: 0,
    skills: [
      { id: "sk-1", name: "OpenAI", iconName: "Bot", featured: true, displayOrder: 0 },
      { id: "sk-2", name: "Google Gemini", iconName: "Sparkles", featured: true, displayOrder: 1 },
      { id: "sk-3", name: "Generative AI", iconName: "BrainCircuit", featured: true, displayOrder: 2 },
      { id: "sk-4", name: "Multi-agent systems", iconName: "Users", featured: true, displayOrder: 3 },
      { id: "sk-5", name: "LangGraph", iconName: "Network", featured: true, displayOrder: 4 },
      { id: "sk-6", name: "AI-assisted engineering", iconName: "Cpu", featured: false, displayOrder: 5 },
    ],
  },
  {
    id: "cat-2",
    name: "Blockchain / Web3",
    displayOrder: 1,
    skills: [
      { id: "sk-7", name: "Solidity", iconName: "Blocks", featured: true, displayOrder: 0 },
      { id: "sk-8", name: "Ethereum", iconName: "Globe", featured: true, displayOrder: 1 },
      { id: "sk-9", name: "Web3.js", iconName: "Code", featured: false, displayOrder: 2 },
      { id: "sk-10", name: "IPFS", iconName: "Database", featured: false, displayOrder: 3 },
      { id: "sk-11", name: "Smart Contracts", iconName: "FileCheck", featured: true, displayOrder: 4 },
      { id: "sk-12", name: "Weilchain", iconName: "ShieldCheck", featured: false, displayOrder: 5 },
    ],
  },
  {
    id: "cat-3",
    name: "Frontend",
    displayOrder: 2,
    skills: [
      { id: "sk-13", name: "React", iconName: "Atom", featured: true, displayOrder: 0 },
      { id: "sk-14", name: "Next.js", iconName: "Layers", featured: true, displayOrder: 1 },
      { id: "sk-15", name: "TypeScript", iconName: "FileCode", featured: true, displayOrder: 2 },
      { id: "sk-16", name: "JavaScript", iconName: "Code", featured: false, displayOrder: 3 },
      { id: "sk-17", name: "Tailwind CSS", iconName: "Palette", featured: true, displayOrder: 4 },
      { id: "sk-18", name: "Flutter", iconName: "Smartphone", featured: false, displayOrder: 5 },
    ],
  },
  {
    id: "cat-4",
    name: "Backend",
    displayOrder: 3,
    skills: [
      { id: "sk-19", name: "Node.js", iconName: "Server", featured: true, displayOrder: 0 },
      { id: "sk-20", name: "Express.js", iconName: "Cpu", featured: false, displayOrder: 1 },
      { id: "sk-21", name: "FastAPI", iconName: "Zap", featured: true, displayOrder: 2 },
      { id: "sk-22", name: "Python", iconName: "Terminal", featured: true, displayOrder: 3 },
    ],
  },
  {
    id: "cat-5",
    name: "Databases / Cloud",
    displayOrder: 4,
    skills: [
      { id: "sk-23", name: "PostgreSQL", iconName: "Database", featured: true, displayOrder: 0 },
      { id: "sk-24", name: "MongoDB", iconName: "HardDrive", featured: false, displayOrder: 1 },
      { id: "sk-25", name: "Firebase", iconName: "Cloud", featured: true, displayOrder: 2 },
    ],
  },
  {
    id: "cat-6",
    name: "IoT / Hardware",
    displayOrder: 5,
    skills: [
      { id: "sk-26", name: "ESP32", iconName: "CircuitBoard", featured: true, displayOrder: 0 },
      { id: "sk-27", name: "Arduino", iconName: "Cpu", featured: false, displayOrder: 1 },
      { id: "sk-28", name: "Raspberry Pi", iconName: "RadioTower", featured: true, displayOrder: 2 },
      { id: "sk-29", name: "MQTT", iconName: "Wifi", featured: true, displayOrder: 3 },
      { id: "sk-30", name: "IoT sensors", iconName: "Activity", featured: false, displayOrder: 4 },
    ],
  },
  {
    id: "cat-7",
    name: "Developer Tools",
    displayOrder: 6,
    skills: [
      { id: "sk-31", name: "Git", iconName: "GitBranch", featured: true, displayOrder: 0 },
      { id: "sk-32", name: "GitHub", iconName: "Github", featured: true, displayOrder: 1 },
      { id: "sk-33", name: "VS Code", iconName: "Terminal", featured: false, displayOrder: 2 },
      { id: "sk-34", name: "Figma", iconName: "Figma", featured: false, displayOrder: 3 },
      { id: "sk-35", name: "Postman", iconName: "Send", featured: false, displayOrder: 4 },
    ],
  },
];

const FALLBACK_LEADERSHIP = [
  {
    id: "lead-1",
    position: "Founding President",
    organization: "ICSB Club — P.A. College of Engineering",
    description: "Leading a student technology community focused on IoT, Cyber Security and Blockchain.",
    startDate: new Date("2024-01-01"),
    endDate: null,
    isCurrent: true,
    displayOrder: 0,
    imageUrls: [],
  },
  {
    id: "lead-2",
    position: "Chairperson",
    organization: "IEEE Systems, Man & Cybernetics Student Chapter",
    description: "Student chapter leadership across systems thinking, computing and cybernetic technology interests.",
    startDate: new Date("2024-01-01"),
    endDate: null,
    isCurrent: true,
    displayOrder: 1,
    imageUrls: [],
  },
  {
    id: "lead-3",
    position: "Resource Person",
    organization: "BUILDX Workshop — BIT Polytechnic",
    description: "Conducted a two-day hands-on RC car workshop where 60+ students worked on assembly, programming, logic, electrical connections, debugging and a final race.",
    startDate: new Date("2025-02-05"),
    endDate: new Date("2025-02-06"),
    isCurrent: false,
    displayOrder: 2,
    imageUrls: [],
  },
];

const FALLBACK_EDUCATION = [
  {
    id: "edu-1",
    institution: "P.A. College of Engineering",
    degree: "Bachelor of Engineering (B.E.)",
    field: "Computer Science & Engineering",
    startDate: new Date("2022-09-01"),
    endDate: new Date("2026-06-30"),
    isCurrent: true,
    description: "Specializing in AI systems, distributed systems, and embedded computing.",
    grade: null,
    institutionUrl: "https://pace.edu.in/",
    achievements: [
      "Founding President of ICSB Club",
      "Chairperson of IEEE SMC Student Chapter",
      "Multiple national-level hackathon wins",
    ],
  },
];

const FALLBACK_WORKSHOPS = [
  {
    id: "ws-1",
    eventName: "BUILDX Workshop",
    organization: "BIT Polytechnic",
    role: "Lead Resource Person",
    date: new Date("2025-02-05"),
    location: "Mangalore, India",
    audienceSize: 60,
    description: "Conducted a two-day hands-on RC car engineering workshop covering chassis assembly, embedded microcontrollers, motor drivers, RF modules, logic programming, and debugging.",
    topics: ["RC Car Assembly", "Embedded Logic", "Motor Control", "RF Communication", "Hands-on Debugging"],
    imageUrls: [],
    articleUrl: "https://english.varthabharati.in/karavali/bit-polytechnic-hosts-successful-two-day-buildx-workshop-on-building-rc-cars",
    eventUrl: null,
  },
];

const FALLBACK_RESUME = {
  id: "default-resume",
  fileUrl: "/MuhammadHaashid.pdf",
  name: "Muhammad Haashid Resume",
  isActive: true,
};

// ── Safe Query Helper ──────────────────────────────────────────────

async function safeQuery<T>(queryFn: () => Promise<T>, fallback: unknown): Promise<T> {
  try {
    const result = await queryFn();
    if (result === null || result === undefined) return fallback as T;
    if (Array.isArray(result) && result.length === 0) return fallback as T;
    return result;
  } catch {
    return fallback as T;
  }
}

// ── Public Data Fetchers ───────────────────────────────────────────

export const getProfile = cache(async () => {
  return await safeQuery(() => db.profile.findFirst(), FALLBACK_PROFILE);
});

export const getHeroContent = cache(async () => {
  return await safeQuery(
    () => db.heroContent.findFirst({ where: { published: true } }),
    FALLBACK_HERO
  );
});

export const getSiteSettings = cache(async () => {
  return await safeQuery(() => db.siteSettings.findFirst(), FALLBACK_SITE_SETTINGS);
});

export const getActiveTheme = cache(async () => {
  return await safeQuery(
    () => db.theme.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } }),
    FALLBACK_THEME
  );
});

export const getSections = cache(async () => {
  return await safeQuery(
    () => db.section.findMany({ orderBy: { order: "asc" } }),
    FALLBACK_SECTIONS
  );
});

export const getSocialLinks = cache(async () => {
  return await safeQuery(
    () =>
      db.socialLink.findMany({
        where: { enabled: true },
        orderBy: { displayOrder: "asc" },
      }),
    FALLBACK_SOCIAL_LINKS
  );
});

// ── Projects ────────────────────────────────────────────────

export const getPublishedProjects = cache(async () => {
  return await safeQuery(
    () =>
      db.project.findMany({
        where: { publishStatus: "PUBLISHED" },
        include: { images: { orderBy: { order: "asc" } } },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    FALLBACK_PROJECTS
  );
});

export const getPublishedProjectBySlug = cache(async (slug: string) => {
  try {
    const project = await db.project.findFirst({
      where: { slug, publishStatus: "PUBLISHED" },
      include: { images: { orderBy: { order: "asc" } } },
    });
    if (project) return project;
  } catch {
    // Database failed, check fallback
  }
  return (FALLBACK_PROJECTS.find((p) => p.slug === slug) as any) || null;
});

// ── Achievements ────────────────────────────────────────────

export const getPublishedAchievements = cache(async () => {
  return await safeQuery(
    () =>
      db.achievement.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    FALLBACK_ACHIEVEMENTS
  );
});

// ── Certificates ────────────────────────────────────────────

export const getPublishedCertificates = cache(async () => {
  return await safeQuery(
    () =>
      db.certificate.findMany({
        where: { publishStatus: "PUBLISHED", isPublic: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    []
  );
});

// ── Skills ──────────────────────────────────────────────────

export const getSkillCategories = cache(async () => {
  return await safeQuery(
    () =>
      db.skillCategory.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          skills: {
            where: { publishStatus: "PUBLISHED" },
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
    FALLBACK_SKILL_CATEGORIES
  );
});

// ── Experience (non-leadership) ─────────────────────────────

export const getPublishedExperience = cache(async () => {
  return await safeQuery(
    () =>
      db.experience.findMany({
        where: {
          publishStatus: "PUBLISHED",
          employmentType: { not: "LEADERSHIP" },
        },
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      }),
    []
  );
});

// ── Leadership ──────────────────────────────────────────────

export const getPublishedLeadership = cache(async () => {
  const result = await safeQuery(
    () =>
      db.leadership.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      }),
    null
  );
  if (result && result.length > 0) return result;
  return FALLBACK_LEADERSHIP;
});

// ── Education ───────────────────────────────────────────────

export const getEducation = cache(async () => {
  return await safeQuery(
    () =>
      db.education.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { startDate: "desc" }],
      }),
    FALLBACK_EDUCATION
  );
});

// ── Workshops ───────────────────────────────────────────────

export const getWorkshops = cache(async () => {
  return await safeQuery(
    () =>
      db.workshop.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { date: "desc" }],
      }),
    FALLBACK_WORKSHOPS
  );
});

// ── Blog ────────────────────────────────────────────────────

export const getPublishedBlogs = cache(async () => {
  return await safeQuery(
    () =>
      db.blogPost.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        include: { categories: true, tags: true },
      }),
    []
  );
});

export const getPublishedBlogBySlug = cache(async (slug: string) => {
  try {
    return await db.blogPost.findFirst({
      where: { slug, publishStatus: "PUBLISHED" },
      include: { categories: true, tags: true },
    });
  } catch {
    return null;
  }
});

// ── Gallery ─────────────────────────────────────────────────

export const getGalleryItems = cache(async () => {
  return await safeQuery(
    () =>
      db.galleryItem.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    []
  );
});

// ── Testimonials ────────────────────────────────────────────

export const getTestimonials = cache(async () => {
  return await safeQuery(
    () =>
      db.testimonial.findMany({
        where: { publishStatus: "PUBLISHED" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
      }),
    []
  );
});

// ── Resume ──────────────────────────────────────────────────

export const getActiveResume = cache(async () => {
  return await safeQuery(
    () => db.resume.findFirst({ where: { isActive: true }, orderBy: { updatedAt: "desc" } }),
    FALLBACK_RESUME
  );
});
