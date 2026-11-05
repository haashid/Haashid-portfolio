"use client";

import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRight,
  ChevronUp,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  Sparkles,
  X,
  Terminal,
} from "lucide-react";
import { AiTwinWidget } from "./ai-twin-widget";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { resolveIcon, trophyIcon as TrophyIcon } from "@/lib/icon-registry";
import Image from "next/image";

// ── Types ───────────────────────────────────────────────────

interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

interface Section {
  key: string;
  label: string;
  enabled: boolean;
  order: number;
}

interface Profile {
  name: string;
  title: string;
  shortBio: string;
  fullBio: string;
  location: string;
  email: string;
  avatarUrl?: string | null;
  avatarAlt?: string | null;
  availabilityStatus: string;
  availabilityMessage?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

interface HeroContent {
  heading: string;
  subtitle: string;
  description: string;
  badge?: string | null;
  primaryCta?: string | null;
  primaryCtaUrl?: string | null;
  secondaryCta?: string | null;
  secondaryCtaUrl?: string | null;
  heroImageUrl?: string | null;
}

interface DbProject {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string | null;
  problem?: string | null;
  solution?: string | null;
  myRole?: string | null;
  technologies: string[];
  category?: string | null;
  status: string;
  publishStatus: string;
  featured: boolean;
  displayOrder: number;
  githubUrl?: string | null;
  demoUrl?: string | null;
  coverImageUrl?: string | null;
  award?: string | null;
  accentColor?: string | null;
  images: { id: string; url: string; alt?: string | null }[];
}

interface DbAchievement {
  id: string;
  title: string;
  event: string;
  organization?: string | null;
  placement?: string | null;
  year?: string | null;
  description?: string | null;
  verificationUrl?: string | null;
  featured: boolean;
  displayOrder: number;
}

interface SkillCategory {
  id: string;
  name: string;
  displayOrder: number;
  skills: {
    id: string;
    name: string;
    iconName?: string | null;
    featured: boolean;
    displayOrder: number;
  }[];
}

interface DbLeadership {
  id: string;
  position: string;
  organization: string;
  description?: string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  isCurrent: boolean;
  displayOrder: number;
  imageUrls: string[];
}

interface DbExperience {
  id: string; position: string; company: string; startDate: Date | string; endDate?: Date | string | null;
  isCurrent: boolean; description?: string | null; responsibilities: string[]; achievements: string[];
  technologies: string[]; companyUrl?: string | null;
}
interface DbEducation {
  id: string; institution: string; degree?: string | null; field?: string | null; startDate?: Date | string | null;
  endDate?: Date | string | null; isCurrent: boolean; description?: string | null; grade?: string | null;
  institutionUrl?: string | null; achievements: string[];
}
interface DbCertificate {
  id: string; name: string; organization: string; issueDate?: Date | string | null; verificationUrl?: string | null;
  fileUrl?: string | null; thumbnailUrl?: string | null; description?: string | null; category?: string | null;
}
interface DbWorkshop {
  id: string; eventName: string; organization?: string | null; role?: string | null; date?: Date | string | null;
  location?: string | null; audienceSize?: number | null; description?: string | null; topics: string[];
  imageUrls: string[]; articleUrl?: string | null; eventUrl?: string | null;
}
interface DbBlog {
  id: string; title: string; slug: string; subtitle?: string | null; coverImageUrl?: string | null;
  publishedAt?: Date | string | null; readingTimeMin?: number | null; categories: { id: string; name: string }[];
}
interface DbGalleryItem {
  id: string; imageUrl: string; caption?: string | null; description?: string | null; date?: Date | string | null;
  location?: string | null; category?: string | null; tags: string[]; featured: boolean;
}
interface DbTestimonial {
  id: string; personName: string; role?: string | null; organization?: string | null; avatarUrl?: string | null;
  content: string; linkedinUrl?: string | null; website?: string | null;
}

export interface PortfolioData {
  profile: Profile | null;
  hero: HeroContent | null;
  projects: DbProject[];
  achievements: DbAchievement[];
  certificates: DbCertificate[];
  skillCategories: SkillCategory[];
  experience: DbExperience[];
  leadership: DbLeadership[];
  education: DbEducation[];
  workshops: DbWorkshop[];
  blogs: DbBlog[];
  gallery: DbGalleryItem[];
  testimonials: DbTestimonial[];
  socialLinks: SocialLink[];
  sections: Section[];
  theme: unknown;
  resume: { fileUrl: string; name: string } | null;
  siteSettings: { siteTitle?: string; canonicalUrl?: string | null } | null;
}

// ── Derived data types for display ──────────────────────────

interface DisplayProject {
  title: string;
  category: string;
  description: string;
  problem?: string;
  solution?: string;
  award?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  coverImageUrl?: string | null;
  coverImageAlt?: string;
  imageLabel: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  details: {
    overview: string;
    result?: string;
    team?: string;
  };
}

// ── Helpers ─────────────────────────────────────────────────


function mapProject(p: DbProject): DisplayProject {
  const category = p.category || "Project";
  return {
    title: p.title,
    category,
    description: p.shortDescription || "",
    problem: p.problem || undefined,
    solution: p.solution || undefined,
    award: p.award || undefined,
    technologies: p.technologies || [],
    github: p.githubUrl || undefined,
    demo: p.demoUrl || undefined,
    coverImageUrl: p.coverImageUrl || p.images?.[0]?.url || null,
    coverImageAlt: p.images?.[0]?.alt || `${p.title} project image`,
    imageLabel: p.myRole || category.split("/")[0].trim(),
    accent: p.accentColor || "blue",
    icon: TrophyIcon,
    details: {
      overview: p.fullDescription || p.shortDescription || "",
      result: p.award || undefined,
    },
  };
}

function getSocialUrl(links: SocialLink[], platform: string): string {
  return links.find((l) => l.platform === platform)?.url || "#";
}

function splitBioParagraphs(bio: string | undefined | null): string[] {
  if (!bio) return [];
  return bio
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// ── UI Components ───────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress-bar"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="scroll-to-top-btn"
          initial={{ opacity: 0, scale: 0.6, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 14 }}
          whileHover={{ scale: 1.12, translateY: -2 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Navbar({ socialLinks, name, sections, initialTheme }: { socialLinks: SocialLink[]; name: string; sections: Section[]; initialTheme: "dark" | "light" }) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const defaultNav = ["about", "projects", "achievements", "leadership", "contact"];
  const navItems = defaultNav
    .filter((key) => sections.length === 0 || sections.some((section) => section.key === key && section.enabled))
    .map((key) => ({ key, label: sections.find((section) => section.key === key)?.label || key[0].toUpperCase() + key.slice(1) }));
  const linkedinUrl = getSocialUrl(socialLinks, "linkedin");
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  const navLinks = (
    <>
      {navItems.map((item) => (
        <a key={item.key} href={`#${item.key}`} onClick={() => setOpen(false)}>
          {item.label}
        </a>
      ))}
    </>
  );

  return (
    <>
    <header className={`nav-shell${scrolled ? " nav-scrolled" : ""}`}>
      <a href="#home" className="brand" aria-label="Muhammad Haashid home">
        <span>{initials}</span>
        <strong>{name}</strong>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navLinks}
        <a
          href="/MuhammadHaashid.pdf"
          target="_blank"
          rel="noreferrer"
          className="nav-resume-btn"
          aria-label="View Resume PDF"
        >
          <FileText size={14} /> Resume
        </a>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
      <a className="nav-cta" href={linkedinUrl} target="_blank" rel="noreferrer">
        Let&apos;s Connect
      </a>
      <button
        className="icon-button mobile-menu-button"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu size={20} />
      </button>
    </header>
    {open ? createPortal(
      <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button className="icon-button drawer-close" aria-label="Close navigation" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>
        <nav>
          {navLinks}
          <a
            href="/MuhammadHaashid.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FileText size={16} /> Resume (PDF)
          </a>
        </nav>
        <a className="button primary" href={linkedinUrl} target="_blank" rel="noreferrer">
          Connect on LinkedIn
        </a>
      </div>,
      document.body
    ) : null}
    </>
  );
}

function AnimatedTerminal() {
  const codeLines = [
    "import { Agent, Network } from '@ai/core';",
    "",
    "const system = new Network({",
    "  nodes: ['iot-sensors', 'web3-contracts', 'ai-brain'],",
    "  consensus: 'proof-of-reasoning',",
    "});",
    "",
    "async function initialize() {",
    "  await system.connect();",
    "  console.log('System online. Awaiting commands...');",
    "}",
    "",
    "initialize();",
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < codeLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, 150 + Math.random() * 200);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines, codeLines.length]);

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
        </div>
        <div className="terminal-title">
          <Terminal size={14} /> system-init.ts
        </div>
      </div>
      <div className="terminal-body">
        {codeLines.slice(0, visibleLines).map((line, i) => (
          <div key={i} className="code-line">
            <span className="line-number">{i + 1}</span>
            <span className="line-content">{line}</span>
          </div>
        ))}
        {visibleLines < codeLines.length && (
          <div className="code-line">
            <span className="line-number">{visibleLines + 1}</span>
            <span className="typing-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}

function Hero({
  profile,
  hero,
  socialLinks,
  style,
}: {
  profile: Profile | null;
  hero: HeroContent | null;
  socialLinks: SocialLink[];
  style?: React.CSSProperties;
}) {
  const name = profile?.name || "";
  const heading = hero?.heading || "";
  const subtitle = hero?.subtitle || profile?.title || "";
  const description = hero?.description || "";
  const availabilityLabels: Record<string, string> = {
    OPEN_TO_WORK: "Open to work",
    OPEN_TO_INTERNSHIPS: "Open to internships",
    OPEN_TO_FULL_TIME: "Open to full-time roles",
    OPEN_TO_FREELANCE: "Open to freelance work",
    OPEN_TO_COLLABORATIONS: "Open to collaborations",
    OPEN_TO_OPPORTUNITIES: "Open to opportunities",
    NOT_AVAILABLE: "Not currently available",
  };
  const linkedinUrl = getSocialUrl(socialLinks, "linkedin");
  const githubUrl = getSocialUrl(socialLinks, "github");
  const primaryCtaText = hero?.primaryCta || profile?.ctaText || "View Projects";
  const primaryCtaUrl = hero?.primaryCtaUrl || profile?.ctaUrl || "#projects";
  const secondaryCtaText = hero?.secondaryCta || "Connect on LinkedIn";
  const secondaryCtaUrl = hero?.secondaryCtaUrl || linkedinUrl;

  return (
    <section id="home" className="hero" style={style}>
      <div className="ambient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{hero?.badge || name}</p>
        <h1>{heading}</h1>
        <p className="hero-kicker">{subtitle}</p>
        <p className="hero-description">{description}</p>
        {profile?.availabilityStatus && (
          <p className="hero-availability" aria-label={`Availability: ${availabilityLabels[profile.availabilityStatus] || profile.availabilityStatus.replace(/_/g, " ")}`}>
            <span aria-hidden="true" />
            {profile.availabilityMessage || availabilityLabels[profile.availabilityStatus] || profile.availabilityStatus.replace(/_/g, " ")}
          </p>
        )}
        <div className="hero-actions">
          <a className="button primary" href={primaryCtaUrl}>
            {primaryCtaText} <ArrowRight size={17} />
          </a>
          <a className="button secondary" href={secondaryCtaUrl} target={secondaryCtaUrl.startsWith("http") ? "_blank" : undefined} rel={secondaryCtaUrl.startsWith("http") ? "noreferrer" : undefined}>
            <Linkedin size={17} /> {secondaryCtaText}
          </a>
          <a
            className="button resume-btn"
            href="/MuhammadHaashid.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="View Muhammad Haashid's resume PDF"
          >
            <FileText size={17} /> Resume
          </a>
          <a className="subtle-link" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={14} />
          </a>
        </div>
        <p className="cred-line">
          National Hackathon Winner · Google Student Ambassador 2026 · Technical Community Leader
        </p>
      </div>
      <div className="hero-visual" aria-label={hero?.heroImageUrl || profile?.avatarUrl ? "Portfolio profile image" : "Animated AI Terminal"}>
        {(hero?.heroImageUrl || profile?.avatarUrl) ? <Image src={hero?.heroImageUrl || profile?.avatarUrl || ""} alt={hero?.badge || profile?.avatarAlt || name} fill sizes="(max-width: 900px) 100vw, 45vw" unoptimized style={{ objectFit: "cover", borderRadius: "inherit" }} /> : <AnimatedTerminal />}
      </div>
    </section>
  );
}

function ProjectPreview({ project }: { project: DisplayProject }) {
  const Icon = project.icon;
  return (
    <div className={`project-preview accent-${project.accent}`}>
      {project.coverImageUrl ? (
        <Image src={project.coverImageUrl} alt={project.coverImageAlt || project.title} fill sizes="(max-width: 760px) 100vw, 50vw" unoptimized className="project-cover-image" />
      ) : (
        <>
          <div className="preview-top"><Icon size={24} /><span>{project.category.split("/")[0].trim()}</span></div>
          <div className="preview-grid"><span /><span /><span /><span /></div>
        </>
      )}
      <strong>{project.imageLabel}</strong>
    </div>
  );
}

function ProjectDetail({
  project,
  onClose,
}: {
  project: DisplayProject;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <article className="project-modal" onClick={(event) => event.stopPropagation()}>
        <button className="icon-button modal-close" aria-label="Close project details" onClick={onClose}>
          <X size={20} />
        </button>
        <ProjectPreview project={project} />
        <div className="modal-content">
          <p className="eyebrow">{project.category}</p>
          <h3>{project.title}</h3>
          <p>{project.details.overview}</p>
          <dl className="detail-grid">
            {project.problem ? (
              <div>
                <dt>Problem</dt>
                <dd>{project.problem}</dd>
              </div>
            ) : null}
            {project.solution ? (
              <div>
                <dt>Solution</dt>
                <dd>{project.solution}</dd>
              </div>
            ) : null}
            {project.details.result ? (
              <div>
                <dt>Result</dt>
                <dd>{project.details.result}</dd>
              </div>
            ) : null}
            {project.details.team ? (
              <div>
                <dt>Team</dt>
                <dd>{project.details.team}</dd>
              </div>
            ) : null}
          </dl>
          <div className="tech-row">
            {project.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="modal-actions">
            {project.github ? (
              <a className="button secondary" href={project.github} target="_blank" rel="noreferrer">
                <Github size={17} /> Repository
              </a>
            ) : null}
            {project.demo ? (
              <a className="button primary" href={project.demo} target="_blank" rel="noreferrer">
                Live demo <ExternalLink size={17} />
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </div>
  );
}

// ── Main Portfolio Page ─────────────────────────────────────

export function PortfolioPage({ data }: { data: PortfolioData }) {
  const [selectedProject, setSelectedProject] = useState<DisplayProject | null>(null);

  // Resolve data from props
  const profile = data.profile;
  const hero = data.hero;
  const socialLinks = data.socialLinks;
  const sections = data.sections;
  const resume = data.resume;

  // Build section visibility and ordering
  const sectionOrder = useMemo(() => {
    if (sections.length === 0) {
      // Fallback: show all sections in default order
      return [
        "hero",
        "about",
        "skills",
        "projects",
        "experience",
        "education",
        "achievements",
        "certificates",
        "leadership",
        "workshops",
        "blog",
        "gallery",
        "testimonials",
        "contact",
      ];
    }
    return sections
      .filter((s) => s.enabled)
      .sort((a, b) => a.order - b.order)
      .map((s) => s.key);
  }, [sections]);

  const isSectionEnabled = (key: string) => sectionOrder.includes(key);
  const sectionPosition = (key: string) => {
    const index = sectionOrder.indexOf(key);
    return index < 0 ? 99 : index;
  };

  // Map projects from DB to display format
  const displayProjects = useMemo(
    () => data.projects.map(mapProject),
    [data.projects],
  );

  // Derive "Currently Building" from featured projects
  const currentlyBuilding = useMemo(
    () =>
      data.projects
        .filter((p) => p.featured && p.status !== "ARCHIVED")
        .slice(0, 2)
        .map((p) => ({
          name: p.title,
          label: p.category?.split("/")[0]?.trim() || "Building",
          description: p.shortDescription || "",
          href: p.githubUrl || undefined,
        })),
    [data.projects],
  );

  // Social link shortcuts
  const githubUrl = getSocialUrl(socialLinks, "github");
  const linkedinUrl = getSocialUrl(socialLinks, "linkedin");
  const contactEmail = profile?.email || "";
  const mailtoHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Portfolio inquiry")}&body=${encodeURIComponent("Hi Muhammad,\n\nI found your portfolio and wanted to reach out about ")}`
    : "";

  // Credibility entries come from the published achievements collection.
  const credibility = useMemo(() => {
    return data.achievements.slice(0, 4).map((achievement) => ({
      value: achievement.placement || achievement.year || "Recognition",
      label: achievement.title,
    }));
  }, [data.achievements]);

  // Leadership items
  const leadershipItems = useMemo(
    () =>
      data.leadership.map((l) => ({
        role: l.position,
        organization: l.organization,
        description: l.description || "",
        meta: l.startDate
          ? new Date(l.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
          : undefined,
        icon: resolveIcon(null) as React.ComponentType<{ size?: number; strokeWidth?: number }>,
      })),
    [data.leadership],
  );

  // Skill groups for display
  const skillGroups = useMemo(
    () =>
      data.skillCategories.map((cat) => ({
        category: cat.name,
        technologies: cat.skills.map((s) => s.name),
      })),
    [data.skillCategories],
  );

  // Bio paragraphs
  const bioParagraphs = useMemo(
    () => splitBioParagraphs(profile?.fullBio),
    [profile],
  );

  return (
    <main className="portfolio-main">
      <ScrollProgress />
      <Navbar socialLinks={socialLinks} name={profile?.name || ""} sections={sections} initialTheme={(data.theme as { preset?: string } | null)?.preset === "LIGHT" ? "light" : "dark"} />
      {isSectionEnabled("hero") && (
        <Hero profile={profile} hero={hero} socialLinks={socialLinks} style={{ order: sectionPosition("hero") }} />
      )}

      {isSectionEnabled("hero") && credibility.length > 0 && (
        <section className="credibility-strip" aria-label="Credibility highlights" style={{ order: sectionPosition("hero") + 0.1 }}>
          {credibility.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
            >
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </section>
      )}

      {isSectionEnabled("about") && (
        <section id="about" className="section split-section" style={{ order: sectionPosition("about") }}>
          <Reveal>
            <SectionHeader eyebrow="About" title="Builder first. Credentials second.">
              {profile?.shortBio || ""}
            </SectionHeader>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="editorial-copy">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : null}
            </div>
          </Reveal>
        </section>
      )}

      {currentlyBuilding.length > 0 && (
        <section className="section building-section" style={{ order: sectionPosition("projects") + 0.1 }}>
          <SectionHeader eyebrow="Currently Building" title="Work with real system ambition.">
            Active projects focused on domain reasoning, persistent memory and pragmatic AI product engineering.
          </SectionHeader>
          <div className="building-grid">
            {currentlyBuilding.map((item) => (
              <Reveal key={item.name}>
                <article className="building-item">
                  <span>{item.label}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {item.href ? (
                    <a className="subtle-link" href={item.href} target="_blank" rel="noreferrer">
                      View repository <ExternalLink size={14} />
                    </a>
                  ) : null}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("projects") && (
        <section id="projects" className="section" style={{ order: sectionPosition("projects") }}>
          <SectionHeader eyebrow="Selected Work" title="Systems, products and experiments.">
            A curated set of projects chosen for technical depth, evidence, competitive context and range across AI, blockchain, IoT and product engineering.
          </SectionHeader>
          <div className="project-grid">
            {displayProjects.map((project, index) => (
              <Reveal key={project.title} delay={index * 0.03}>
                <article className="project-card">
                  <ProjectPreview project={project} />
                  <div className="project-body">
                    <p className="project-category">{project.category}</p>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    {project.award ? <strong className="award-pill">{project.award}</strong> : null}
                    <div className="tech-row">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                    <div className="project-actions">
                      <button className="text-button" onClick={() => setSelectedProject(project)}>
                        View case study <ArrowRight size={15} />
                      </button>
                      {project.github ? (
                        <a href={project.github} target="_blank" rel="noreferrer" aria-label={`${project.title} repository`}>
                          <Github size={18} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("experience") && data.experience.length > 0 && (
        <section id="experience" className="section" style={{ order: sectionPosition("experience") }}>
          <SectionHeader eyebrow="Experience" title="Experience and contribution.">Published roles and responsibilities from the CMS.</SectionHeader>
          <div className="timeline">
            {data.experience.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.05}>
                <article className="timeline-item">
                  <div className="timeline-marker" />
                  <div>
                    <span>{new Date(item.startDate).getFullYear()} – {item.isCurrent ? "Present" : item.endDate ? new Date(item.endDate).getFullYear() : ""}</span>
                    <h3>{item.position}</h3>
                    <strong>{item.company}</strong>
                    {item.description && <p>{item.description}</p>}
                    {item.responsibilities.length > 0 && <ul>{item.responsibilities.map((entry) => <li key={entry}>{entry}</li>)}</ul>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("education") && data.education.length > 0 && (
        <section id="education" className="section" style={{ order: sectionPosition("education") }}>
          <SectionHeader eyebrow="Education" title="Education." />
          <div className="content-card-grid">
            {data.education.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.06}>
                <article className="content-card content-card-body">
                  <p className="eyebrow">{item.startDate ? new Date(item.startDate).getFullYear() : ""}{item.endDate ? ` – ${new Date(item.endDate).getFullYear()}` : item.isCurrent ? " – Present" : ""}</p>
                  <h3>{item.degree}{item.field ? ` · ${item.field}` : ""}</h3>
                  <strong>{item.institution}</strong>
                  {item.grade && <p>{item.grade}</p>}
                  {item.description && <p>{item.description}</p>}
                  {item.achievements.map((entry) => <p key={entry}>{entry}</p>)}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("achievements") && (
        <section id="achievements" className="section recognition-section" style={{ order: sectionPosition("achievements") }}>
          <SectionHeader eyebrow="Recognition" title="Competition results with receipts.">
            Competitions, leadership milestones and moments that pushed the work further.
          </SectionHeader>
          <div className="timeline">
            {data.achievements.map((item, index) => (
              <Reveal key={`${item.event}-${item.title}`} delay={index * 0.02}>
                <article className="timeline-item">
                  <div className="timeline-marker">
                    <TrophyIcon size={18} />
                  </div>
                  <div>
                    <span>
                      {item.year || "—"} · {item.placement || ""}
                    </span>
                    <h3>{item.title}</h3>
                    <strong>{item.event}</strong>
                    {item.organization ? <p>{item.organization}</p> : null}
                    {item.description ? <p>{item.description}</p> : null}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {/* Achievement photo marquee */}
          {(() => {
            // All achievement photos — named + extra bulk photos
            const ALBUM_PHOTOS = [
              { src: "/achievements/vexstorm-champion.jpg",      label: "VEXSTORM 2026 · Champion" },
              { src: "/achievements/hacktofuture-runnerup.jpg",  label: "HackToFuture 4.0 · Runner-Up" },
              { src: "/achievements/iit-blockchain-summit.jpg",  label: "IIT KGP Blockchain Summit" },
              { src: "/achievements/codesprint-national.jpg",    label: "CodeSprint 2026" },
              { src: "/achievements/yenexa-winner.jpg",          label: "Yenexa 2026 · 2nd Place" },
              { src: "/achievements/hackothsava-2nd.jpg",        label: "Hackothsava 2025 · 2nd Place" },
              { src: "/achievements/chakravyuha-runners.jpg",    label: "Chakravyuha 2K26 · Runners" },
              { src: "/achievements/pragyatha-1st.jpg",          label: "Pragyatha-25 · 1st Place" },
              { src: "/achievements/pace-nirman-winners.jpg",    label: "PACE Nirman-25 · Winners" },
              { src: "/achievements/nitte-prabhava.jpg",         label: "NITTE Prabhava" },
              { src: "/achievements/ach-extra-1.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-2.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-3.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-4.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-5.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-6.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-7.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-8.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-9.jpg",            label: "Achievement" },
              { src: "/achievements/ach-extra-10.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-11.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-12.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-13.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-14.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-15.jpg",           label: "Achievement" },
              { src: "/achievements/ach-extra-16.jpg",           label: "Achievement" },
            ];
            const half = Math.ceil(ALBUM_PHOTOS.length / 2);
            const row1 = ALBUM_PHOTOS.slice(0, half);
            const row2 = ALBUM_PHOTOS.slice(half);
            const renderRow = (photos: typeof ALBUM_PHOTOS, dir: "left" | "right") => {
              const doubled = [...photos, ...photos]; // duplicate for seamless loop
              return (
                <div className={`marquee-track marquee-track--${dir}`} aria-hidden="true">
                  <div className="marquee-inner">
                    {doubled.map((p, i) => (
                      <figure key={`${dir}-${i}`} className="marquee-card">
                        <div className="marquee-img-wrap">
                          <Image
                            src={p.src}
                            alt={p.label}
                            fill
                            sizes="280px"
                            unoptimized
                            className="marquee-img"
                          />
                          <div className="marquee-card-overlay">
                            <span>{p.label}</span>
                          </div>
                        </div>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            };
            return (
              <div className="achievement-marquee-wrap">
                <p className="achievement-album-label">Moments from the stage</p>
                <div className="achievement-marquee">
                  {renderRow(row1, "left")}
                  {renderRow(row2, "right")}
                </div>
              </div>
            );
          })()}
        </section>
      )}

      {isSectionEnabled("certificates") && data.certificates.length > 0 && (
        <section id="certificates" className="section" style={{ order: sectionPosition("certificates") }}>
          <SectionHeader eyebrow="Certificates" title="Credentials and learning." />
          <div className="content-card-grid">
            {data.certificates.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.06}>
                <article className="content-card content-card-body">
                  {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt={item.name} width={640} height={400} unoptimized className="content-card-image" />}
                  <p className="eyebrow">{item.category || item.organization}</p>
                  <h3>{item.name}</h3>
                  {item.description && <p>{item.description}</p>}
                  {item.issueDate && <p className="content-meta">{new Date(item.issueDate).getFullYear()}</p>}
                  <div className="case-study-links">
                    {item.verificationUrl && <a className="subtle-link" href={item.verificationUrl} target="_blank" rel="noreferrer">Verify credential <ExternalLink size={14} /></a>}
                    {item.fileUrl && <a className="subtle-link" href={item.fileUrl} target="_blank" rel="noreferrer">View certificate <ExternalLink size={14} /></a>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("skills") && (
        <section id="skills" className="section skills-section" style={{ order: sectionPosition("skills") }}>
          <SectionHeader eyebrow="Technical Stack" title="Capability clusters, not percentages.">
            Technologies are grouped by how they show up in the work: AI systems, Web3 architecture, product frontend, backend services, data and connected hardware.
          </SectionHeader>
          <div className="skill-grid">
            {skillGroups.map((group, index) => (
              <Reveal key={group.category} delay={index * 0.06}>
                <article className="skill-group">
                  <h3>{group.category}</h3>
                  <div className="tech-row">
                    {group.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("leadership") && (
        <section id="leadership" className="section" style={{ order: sectionPosition("leadership") }}>
          <SectionHeader eyebrow="Build. Lead. Share." title="Technical leadership that compounds.">
            Engineering is more valuable when knowledge moves through a community.
          </SectionHeader>
          <div className="leadership-grid">
            {leadershipItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={`${item.role}-${item.organization}`} delay={index * 0.06}>
                  <article className="leadership-card">
                    <Icon size={22} />
                    <span>{item.meta ?? item.role}</span>
                    <h3>{item.role}</h3>
                    <strong>{item.organization}</strong>
                    <p>{item.description}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {isSectionEnabled("workshops") && data.workshops.length > 0 && (
        <section id="workshops" className="section" style={{ order: sectionPosition("workshops") }}>
          <SectionHeader eyebrow="Workshops" title="Teaching, sharing, and building community." />
          <div className="content-card-grid">
            {data.workshops.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.06}>
                <article className="content-card">
                  {item.imageUrls[0] && <Image src={item.imageUrls[0]} alt={`${item.eventName} workshop`} width={960} height={540} unoptimized className="content-card-image" />}
                  <div className="content-card-body">
                    <p className="eyebrow">{item.date ? new Date(item.date).toLocaleDateString("en", { month: "long", year: "numeric" }) : "Workshop"}</p>
                    <h3>{item.eventName}</h3>
                    {item.organization && <strong>{item.organization}</strong>}
                    {item.role && <p>{item.role}</p>}
                    {item.description && <p>{item.description}</p>}
                    {item.audienceSize && <p className="content-meta">Audience: {item.audienceSize}</p>}
                    <div className="content-tags">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                    {item.articleUrl && <a className="subtle-link" href={item.articleUrl} target="_blank" rel="noreferrer">Related article <ExternalLink size={14} /></a>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {isSectionEnabled("blog") && data.blogs.length > 0 && (
        <section id="blog" className="section" style={{ order: sectionPosition("blog") }}>
          <SectionHeader eyebrow="Writing" title="Notes from the work." />
          <div className="content-card-grid">{data.blogs.slice(0, 3).map((post) => <article className="content-card" key={post.id}>{post.coverImageUrl && <Image src={post.coverImageUrl} alt={post.title} width={960} height={540} unoptimized className="content-card-image" />}<div className="content-card-body"><div className="content-tags">{post.categories.map((category) => <span key={category.id}>{category.name}</span>)}</div><h3><a href={`/blog/${post.slug}`}>{post.title}</a></h3>{post.subtitle && <p>{post.subtitle}</p>}<p className="content-meta">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en", { dateStyle: "medium" }) : ""}{post.readingTimeMin ? ` · ${post.readingTimeMin} min read` : ""}</p><a className="subtle-link" href={`/blog/${post.slug}`}>Read article →</a></div></article>)}</div>
        </section>
      )}

      {isSectionEnabled("gallery") && data.gallery.length > 0 && (
        <section id="gallery" className="section" style={{ order: sectionPosition("gallery") }}>
          <SectionHeader eyebrow="Gallery" title="Moments from the work." />
          <div className="content-card-grid">{data.gallery.map((item) => <figure className="content-card gallery-card" key={item.id}><Image src={item.imageUrl} alt={item.caption || item.description || "Portfolio gallery image"} width={960} height={640} unoptimized className="content-card-image" />{(item.caption || item.location) && <figcaption className="content-card-body">{item.caption}{item.location && <span className="content-meta">{item.location}</span>}</figcaption>}</figure>)}</div>
        </section>
      )}

      {isSectionEnabled("testimonials") && data.testimonials.length > 0 && (
        <section id="testimonials" className="section" style={{ order: sectionPosition("testimonials") }}>
          <SectionHeader eyebrow="Testimonials" title="What collaborators say." />
          <div className="content-card-grid">{data.testimonials.map((item, idx) => <Reveal key={item.id} delay={idx * 0.06}><figure className="content-card content-card-body"><blockquote>{item.content}</blockquote><figcaption><strong>{item.personName}</strong>{item.role && <span>{item.role}</span>}{item.organization && <span>{item.organization}</span>}</figcaption></figure></Reveal>)}</div>
        </section>
      )}

      {isSectionEnabled("contact") && (
        <Reveal y={30}>
          <section id="contact" className="contact-section" style={{ order: sectionPosition("contact") }}>
            <Sparkles size={24} />
            <h2>Let&apos;s build something meaningful.</h2>
            <p>
              I&apos;m interested in ambitious engineering problems, AI products, blockchain systems, hackathons, research collaborations, and technology communities.
            </p>
            <div className="contact-actions">
              <a className="button primary" href={linkedinUrl} target="_blank" rel="noreferrer">
                <Linkedin size={17} /> LinkedIn
              </a>
              <a className="button secondary" href={githubUrl} target="_blank" rel="noreferrer">
                <Github size={17} /> GitHub
              </a>
              {contactEmail ? (
                <a className="button secondary email-button" href={mailtoHref} aria-label={`Email Muhammad Haashid at ${contactEmail}`}>
                  <Mail size={17} /> Email
                </a>
              ) : (
                <span className="button secondary disabled-link" aria-disabled="true" title="Add NEXT_PUBLIC_CONTACT_EMAIL to enable direct email">
                  <Mail size={17} /> Email
                </span>
              )}
            </div>
            {contactEmail ? <p className="contact-email">{contactEmail}</p> : null}
            <a className="resume-link" href={resume?.fileUrl || "/MuhammadHaashid.pdf"} target="_blank" rel="noreferrer" aria-label="View Muhammad Haashid's resume PDF">
              <FileText size={16} /> View Muhammad Haashid&apos;s Resume (PDF)
            </a>
          </section>
        </Reveal>
      )}

      <footer style={{ order: 100 }}>
        <strong>{profile?.name || ""}</strong>
        <span>{profile?.title || ""}</span>
        <nav aria-label="Footer links">
          <a href="/MuhammadHaashid.pdf" target="_blank" rel="noreferrer">Resume</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
        <small>© {new Date().getFullYear()} {profile?.name || ""}</small>
      </footer>

      {selectedProject ? <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}

      {/* AI Twin floating widget */}
      <AiTwinWidget />

      {/* Back to top scroll button */}
      <ScrollToTop />
    </main>
  );
}
