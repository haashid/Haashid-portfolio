"use client";

import { useMemo, useState, useEffect } from "react";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Sun,
  Sparkles,
  X,
  Terminal
} from "lucide-react";
import { AiTwinWidget } from "./ai-twin-widget";
import { motion } from "framer-motion";
import {
  achievements,
  credibility,
  currentlyBuilding,
  leadership,
  links,
  projects,
  recognition,
  skillGroups,
  trophyIcon as TrophyIcon,
  type Project
} from "@/lib/data";

const nav = ["About", "Projects", "Achievements", "Leadership", "Contact"];

function SectionHeader({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = (
    <>
      {nav.map((item) => (
        <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>
          {item}
        </a>
      ))}
    </>
  );

  return (
    <header className="nav-shell">
      <a href="#home" className="brand" aria-label="Muhammad Haashid home">
        <span>MH</span>
        <strong>Muhammad Haashid</strong>
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navLinks}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </nav>
      <a className="nav-cta" href={links.linkedin} target="_blank" rel="noreferrer">
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
      {open ? (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button className="icon-button drawer-close" aria-label="Close navigation" onClick={() => setOpen(false)}>
            <X size={20} />
          </button>
          <nav>{navLinks}</nav>
          <a className="button primary" href={links.linkedin} target="_blank" rel="noreferrer">
            Connect on LinkedIn
          </a>
        </div>
      ) : null}
    </header>
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
    "initialize();"
  ];

  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines < codeLines.length) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
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
        <div className="terminal-title"><Terminal size={14} /> system-init.ts</div>
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

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="ambient-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">Muhammad Haashid</p>
        <h1>I build systems that solve real problems.</h1>
        <p className="hero-kicker">AI · Blockchain · IoT · Full-Stack Engineering</p>
        <p className="hero-description">
          Engineering student, builder, and technical leader focused on turning ambitious ideas into working systems.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View Projects <ArrowRight size={17} />
          </a>
          <a className="button secondary" href={links.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={17} /> Connect on LinkedIn
          </a>
          <a className="subtle-link" href={links.github} target="_blank" rel="noreferrer">
            GitHub <ExternalLink size={14} />
          </a>
        </div>
        <p className="cred-line">
          National Hackathon Winner · Google Student Ambassador 2026 · Technical Community Leader
        </p>
      </div>
      <div className="hero-visual" aria-label="Animated AI Terminal">
        <AnimatedTerminal />
      </div>
    </section>
  );
}

function ProjectPreview({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div className={`project-preview accent-${project.accent}`}>
      <div className="preview-top">
        <Icon size={24} />
        <span>{project.category.split("/")[0].trim()}</span>
      </div>
      <div className="preview-grid">
        <span />
        <span />
        <span />
        <span />
      </div>
      <strong>{project.imageLabel}</strong>
    </div>
  );
}

function ProjectDetail({
  project,
  onClose
}: {
  project: Project;
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
          {project.details.architecture ? (
            <div className="detail-block">
              <h4>Architecture</h4>
              <ul>
                {project.details.architecture.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {project.details.decisions ? (
            <div className="detail-block">
              <h4>Key engineering decisions</h4>
              <ul>
                {project.details.decisions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
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

export function PortfolioPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const contactEmail = links.email.trim();
  const mailtoHref = contactEmail
    ? `mailto:${contactEmail}?subject=${encodeURIComponent("Portfolio inquiry")}&body=${encodeURIComponent(
        "Hi Muhammad,\n\nI found your portfolio and wanted to reach out about "
      )}`
    : "";
  const selectedRepos = useMemo(
    () => [
      "ORION",
      "AuditOS",
      "real-time-heart-health-monitoring-system",
      "weilchain-nexus",
      "vexstrom-26",
      "hacktofuture4-I03",
      "RakshaChain",
      "trueHire-Ai-",
      "ICSB-WEBSITE",
      "EchoVerse",
      "DIES"
    ],
    []
  );

  return (
    <main>
      <Navbar />
      <Hero />

      <section className="credibility-strip" aria-label="Credibility highlights">
        {credibility.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section id="about" className="section split-section">
        <Reveal>
          <SectionHeader eyebrow="About" title="Builder first. Credentials second.">
            I build systems across AI, blockchain and IoT, with projects spanning decentralized applications, multi-agent recruitment systems, engineering intelligence and real-time connected health monitoring.
          </SectionHeader>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="editorial-copy">
            <p>
              I&apos;m Muhammad Haashid, a CSE / IoT and Cyber Security with Blockchain Technology student at P.A. College of Engineering.
            </p>
            <p>
              I enjoy building systems where software, intelligence, and real-world constraints meet, from decentralized applications and AI platforms to IoT systems and developer tools.
            </p>
            <p>
              My work has taken me through national hackathons, blockchain competitions, technical workshops, student leadership, and product-oriented engineering projects.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section building-section">
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

      <section id="projects" className="section">
        <SectionHeader eyebrow="Selected Work" title="Systems, products and experiments.">
          A curated set of projects chosen for technical depth, evidence, competitive context and range across AI, blockchain, IoT and product engineering.
        </SectionHeader>
        <div className="project-grid">
          {projects.map((project, index) => (
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

      <section id="achievements" className="section recognition-section">
        <SectionHeader eyebrow="Recognition" title="Competition results with receipts.">
          Competitions, leadership milestones and moments that pushed the work further.
        </SectionHeader>
        <div className="timeline">
          {achievements.map((item, index) => (
            <Reveal key={`${item.event}-${item.title}`} delay={index * 0.02}>
              <article className="timeline-item">
                <div className="timeline-marker">
                  <TrophyIcon size={18} />
                </div>
                <div>
                  <span>{item.year} · {item.placement}</span>
                  <h3>{item.title}</h3>
                  <strong>{item.event}</strong>
                  <p>{item.organization}</p>
                  {item.description ? <p>{item.description}</p> : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section skills-section">
        <SectionHeader eyebrow="Technical Stack" title="Capability clusters, not percentages.">
          Technologies are grouped by how they show up in the work: AI systems, Web3 architecture, product frontend, backend services, data and connected hardware.
        </SectionHeader>
        <div className="skill-grid">
          {skillGroups.map((group) => (
            <article className="skill-group" key={group.category}>
              <h3>{group.category}</h3>
              <div className="tech-row">
                {group.technologies.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="leadership" className="section">
        <SectionHeader eyebrow="Build. Lead. Share." title="Technical leadership that compounds.">
          Engineering is more valuable when knowledge moves through a community.
        </SectionHeader>
        <div className="leadership-grid">
          {leadership.map((item) => {
            const Icon = item.icon;
            return (
              <article className="leadership-card" key={`${item.role}-${item.organization}`}>
                <Icon size={22} />
                <span>{item.meta ?? item.role}</span>
                <h3>{item.role}</h3>
                <strong>{item.organization}</strong>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section media-github-section">
        <div>
          <SectionHeader eyebrow="Featured In" title="Recognition beyond the repository.">
            Public signals from technical communities, media coverage and professional profiles.
          </SectionHeader>
          <div className="recognition-grid">
            {recognition.map((item) => {
              const Icon = item.icon;
              const body = (
                <>
                  <Icon size={21} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </>
              );
              return item.href ? (
                <a className="recognition-card" href={item.href} target="_blank" rel="noreferrer" key={item.title}>
                  {body}
                  <span>Read source <ExternalLink size={13} /></span>
                </a>
              ) : (
                <article className="recognition-card" key={item.title}>{body}</article>
              );
            })}
          </div>
        </div>
        <aside className="github-panel" aria-label="Selected GitHub repositories">
          <Github size={24} />
          <p className="eyebrow">GitHub</p>
          <h2>@haashid</h2>
          <p>Selected public repositories across AI, blockchain, IoT, audit technology and community platforms.</p>
          <div className="repo-list">
            {selectedRepos.map((repo) => (
              <a key={repo} href={`https://github.com/haashid/${repo}`} target="_blank" rel="noreferrer">
                {repo}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section id="contact" className="contact-section">
        <Sparkles size={24} />
        <h2>Let&apos;s build something meaningful.</h2>
        <p>
          I&apos;m interested in ambitious engineering problems, AI products, blockchain systems, hackathons, research collaborations, and technology communities.
        </p>
        <div className="contact-actions">
          <a className="button primary" href={links.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={17} /> LinkedIn
          </a>
          <a className="button secondary" href={links.github} target="_blank" rel="noreferrer">
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
        <a className="resume-link" href="#" aria-disabled="true">
          View Resume - placeholder until a resume file is added
        </a>
      </section>

      <footer>
        <strong>Muhammad Haashid</strong>
        <span>AI · Blockchain · IoT · Full-Stack</span>
        <nav aria-label="Footer links">
          <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </nav>
        <small>© 2026 Muhammad Haashid</small>
      </footer>

      {selectedProject ? <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} /> : null}

      {/* AI Twin floating widget */}
      <AiTwinWidget />
    </main>
  );
}
