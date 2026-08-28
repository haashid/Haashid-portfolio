import type { ComponentType } from "react";
import {
  Blocks,
  Bot,
  BrainCircuit,
  CircuitBoard,
  Cpu,
  Github,
  GraduationCap,
  HeartPulse,
  Linkedin,
  Medal,
  Newspaper,
  RadioTower,
  ShieldCheck,
  Trophy,
  Users
} from "lucide-react";

export type Project = {
  title: string;
  category: string;
  description: string;
  problem?: string;
  solution?: string;
  award?: string;
  technologies: string[];
  github?: string;
  demo?: string;
  imageLabel: string;
  accent: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  details: {
    overview: string;
    architecture?: string[];
    decisions?: string[];
    result?: string;
    team?: string;
  };
};

export type Achievement = {
  title: string;
  placement: string;
  event: string;
  organization: string;
  year: string;
  description?: string;
  source?: string;
};

export type Leadership = {
  role: string;
  organization: string;
  description: string;
  meta?: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
};

export type SkillGroup = {
  category: string;
  technologies: string[];
};

export const links = {
  github: "https://github.com/haashid",
  linkedin: "https://www.linkedin.com/in/muhammad-haashid/",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  pace: "https://pace.edu.in/",
  buildx:
    "https://english.varthabharati.in/karavali/bit-polytechnic-hosts-successful-two-day-buildx-workshop-on-building-rc-cars"
};

export const credibility = [
  { value: "8+", label: "National-level hackathon wins / recognitions" },
  { value: "2026", label: "Google Student Ambassador cohort" },
  { value: "300+", label: "Students reached through technical workshops" },
  { value: "ICSB", label: "Founding President at P.A. College of Engineering" }
];

export const currentlyBuilding = [
  {
    name: "ORION",
    label: "Engineering intelligence",
    description:
      "A role-aware, multi-department engineering intelligence platform for upstream oil & gas, combining multimodal GenAI with physics-aware, domain-specific reasoning.",
    href: "https://github.com/haashid/ORION"
  },
  {
    name: "Meetily / Meeting Intelligence",
    label: "Local-first AI productivity",
    description:
      "A local-first AI meeting and project intelligence system designed around persistent project memory and privacy-preserving workflows."
  }
];

export const projects: Project[] = [
  {
    title: "ORION",
    category: "Engineering Intelligence / AI / Energy",
    description:
      "A multimodal GenAI platform for oil and gas teams, designed around role-aware assistance, local AI services and engineering workflows.",
    problem:
      "Engineering teams need a clearer way to reason across documents, telemetry, assets and operational roles.",
    solution:
      "ORION connects role-based interfaces, agentic reasoning, document intelligence and 3D/geospatial visualization into a product-oriented system.",
    technologies: ["Next.js", "FastAPI", "GenAI", "Local LLMs", "ChromaDB", "CesiumJS", "React Three Fiber"],
    github: "https://github.com/haashid/ORION",
    imageLabel: "Role-aware GenAI control plane",
    accent: "blue",
    icon: BrainCircuit,
    details: {
      overview:
        "The public repository describes ORION as a cognitive subsurface AI system for reservoir management, production optimization and drilling operations.",
      architecture: [
        "Next.js frontend paired with a FastAPI backend.",
        "Specialized AI agents for reservoir, drilling, production and maintenance workflows.",
        "Document RAG through ChromaDB plus 3D and geospatial interfaces."
      ],
      decisions: [
        "Local-first AI services reduce dependency on external model infrastructure.",
        "Role-based access keeps engineering context tailored to each user group."
      ],
      result: "A technically ambitious AI engineering platform with substantial frontend, backend and AI system surface area."
    }
  },
  {
    title: "NeuroMesh",
    category: "AI / Decentralized Intelligence / Crisis Response",
    description:
      "A real-time, multi-agent disaster intelligence system built from IoT sensor mesh data during HackToFuture 4.0.",
    award: "National Runner-Up - HackToFuture 4.0",
    problem:
      "Emergency response teams face noisy telemetry, delayed decisions and poorly contextualized alerts during structural and environmental incidents.",
    solution:
      "NeuroMesh combines live sensor ingestion, ML inference, verification and multi-agent SITREP generation for command visibility.",
    technologies: ["Next.js", "Python", "TensorFlow", "Firebase RTDB", "LangGraph", "IoT"],
    github: "https://github.com/haashid/hacktofuture4-I03",
    imageLabel: "Sensor mesh incident intelligence",
    accent: "green",
    icon: RadioTower,
    details: {
      overview:
        "Repository materials describe NeuroMesh as a real-time disaster intelligence system using IoT sensor mesh networks and multi-agent analysis.",
      architecture: [
        "Dashboard interface for live field visibility.",
        "IoT data pipeline with inference and verification layers.",
        "Agent orchestration for operational situation reports."
      ],
      result:
        "National Runner-Up at HackToFuture 4.0 in the Open Innovation track.",
      team: "Muhammad Haashid, Vineeth S N, Mohammed Shakeeb and Mohammed Sinan."
    }
  },
  {
    title: "TrueHire",
    category: "AI / Multi-Agent Systems / Recruitment",
    description:
      "A live interview intelligence system that turns a hiring conversation into a structured AI-assisted evaluation.",
    award: "Grand Champion / hackathon-winning project",
    problem:
      "Technical hiring can over-index on subjective impressions, keyword matching and unverified claims.",
    solution:
      "TrueHire uses resume analysis, live voice intelligence, adaptive questioning and multi-agent review to support Hire / No-Hire decisions.",
    technologies: ["Next.js", "FastAPI", "LangGraph", "Web Audio API", "Tailwind CSS", "Mistral AI"],
    github: "https://github.com/haashid/trueHire-Ai-",
    imageLabel: "Live interview intelligence",
    accent: "indigo",
    icon: Bot,
    details: {
      overview:
        "The public README positions TrueHire as a multi-agent interview intelligence system with real-time voice analysis and parallel AI debate.",
      architecture: [
        "Frontend, backend and browser-extension surfaces.",
        "Resume/JD parsing before interview interaction.",
        "Passive evaluation from live speech and candidate responses."
      ],
      decisions: [
        "AI personas debate evidence instead of relying on a single opaque score.",
        "Pre-call resume analysis gives the system context before live questioning."
      ]
    }
  },
  {
    title: "Weilchain Nexus",
    category: "Blockchain / Web3",
    description:
      "A decentralized AI applet marketplace for deploying applets and composing useful blockchain-backed workflows.",
    award: "2nd Runner-Up - East India Blockchain Summit 2.0, IIT Kharagpur",
    problem:
      "Developers need a marketplace model for reusable applets, authenticated workflows and composable on-chain utilities.",
    solution:
      "The project combines smart contracts, IPFS integration, wallet authentication and a marketplace interface for applet pipelines.",
    technologies: ["Next.js", "Solidity", "Web3.js", "IPFS", "Hardhat", "Weilchain"],
    github: "https://github.com/haashid/weilchain-nexus",
    demo: "https://weilchainnexus.vercel.app",
    imageLabel: "Decentralized applet marketplace",
    accent: "orange",
    icon: Blocks,
    details: {
      overview:
        "The public repository describes Weilchain Nexus as a decentralized AI applet marketplace built on WeilChain.",
      architecture: [
        "Next.js application with Hardhat smart-contract tooling.",
        "Contract, applet and deployment directories in the repository.",
        "IPFS-oriented frontend and applet deployment flow."
      ],
      result:
        "2nd Runner-Up at East India Blockchain Summit 2.0 during KSHITIJ 2026 at IIT Kharagpur.",
      team: "Muhammad Haashid, Mohammed Rashid and Mohammed Shakeeb."
    }
  },
  {
    title: "Real-Time Heart Health Monitoring System",
    category: "IoT / Health Technology",
    description:
      "A real-time health dashboard for ECG, heart rate, SpO2 and temperature signals from connected IoT devices.",
    problem:
      "Caregivers and researchers need live physiological data, clear abnormality alerts and readable historical context.",
    solution:
      "The system visualizes connected vitals in a responsive dashboard with MQTT/WebSocket data flow and charting.",
    technologies: ["React", "Vite", "MQTT", "WebSockets", "Tailwind CSS", "Firebase", "Chart.js"],
    github: "https://github.com/haashid/real-time-heart-health-monitoring-system",
    imageLabel: "Connected vitals dashboard",
    accent: "red",
    icon: HeartPulse,
    details: {
      overview:
        "The public README describes a dashboard for real-time ECG, heart rate, SpO2 and temperature monitoring.",
      architecture: [
        "Vite/React frontend with chart visualizations.",
        "MQTT/WebSocket-oriented live data flow.",
        "Firebase configuration for app deployment and data workflows."
      ]
    }
  },
  {
    title: "AuditOS",
    category: "AI / SaaS / Audit Technology",
    description:
      "An AI-native audit operating system concept with multi-tenant audit workspaces and an audit copilot architecture.",
    problem:
      "Audit teams often work across fragmented financial, compliance, cyber and operational workflows.",
    solution:
      "AuditOS consolidates specialized audit workspaces with risk scoring, document parsing and generative AI analysis.",
    technologies: ["Next.js", "TypeScript", "FastAPI", "Postgres", "Docker", "AI Copilot"],
    github: "https://github.com/haashid/AuditOS",
    imageLabel: "Audit workspaces and risk intelligence",
    accent: "slate",
    icon: ShieldCheck,
    details: {
      overview:
        "Repository metadata and README describe AuditOS as a multi-tenant enterprise auditing platform with AI-assisted audit workflows.",
      architecture: [
        "Frontend and backend directories with Docker orchestration.",
        "Modules for financial, internal, tax, compliance and related audit workflows."
      ],
      decisions: [
        "The portfolio presents this as an engineering/product project rather than a commercial claim."
      ]
    }
  },
  {
    title: "ICSB Website",
    category: "Community / Web Platform",
    description:
      "A web platform tied to the ICSB student technology community at P.A. College of Engineering.",
    problem:
      "Technical student communities need a clear public surface for events, identity and participation.",
    solution:
      "The site pairs community leadership with a production-style web platform built with a modern Next.js stack.",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "UI Components"],
    github: "https://github.com/haashid/ICSB-WEBSITE",
    imageLabel: "Student technology community platform",
    accent: "cyan",
    icon: Users,
    details: {
      overview:
        "The repository structure shows a Next.js application with app, components, hooks, lib and styles directories.",
      result:
        "Supports the broader ICSB leadership story: IoT, Cyber Security and Blockchain community building at P.A. College of Engineering."
    }
  }
];

export const achievements: Achievement[] = [
  {
    title: "Grand Champion",
    placement: "First place",
    event: "VEXSTORM 2026",
    organization: "Datavex.AI at Sahyadri College of Engineering and Management",
    year: "2026",
    description:
      "National Level AI Hackathon with 100+ teams, 25 offline finalists and a 32-hour build sprint. The winning team received paid internship opportunities from Datavex.AI."
  },
  {
    title: "National Runner-Up",
    placement: "Runner-up",
    event: "HackToFuture 4.0",
    organization: "St. Joseph Engineering College x EG India",
    year: "2026",
    description:
      "Open Innovation track finalist from 3,000+ registrations, 700+ teams and 41 finalist teams. Project: NeuroMesh."
  },
  {
    title: "2nd Runner-Up",
    placement: "Blockchain summit recognition",
    event: "East India Blockchain Summit 2.0",
    organization: "KSHITIJ 2026, IIT Kharagpur",
    year: "2026",
    description:
      "Shortlisted-stage competition with 52 teams according to institutional coverage. Project associated with Weilchain Nexus / Applet Marketplace."
  },
  {
    title: "2nd Place",
    placement: "National hackathon",
    event: "Hackotsava 2025",
    organization: "National Level Hackathon",
    year: "2025",
    description:
      "Recognized among 340+ students and 85+ teams with Vineeth S N, Zuhain Ibrahim and Hafeezu Rrahman."
  },
  {
    title: "4th Place / Consolation Prize",
    placement: "National hackathon",
    event: "CodeSprint 2026",
    organization: "National-level AI + Blockchain + IoT hackathon",
    year: "2026",
    description:
      "32-hour competition with 54 teams. Team: Muhammad Haashid and Mohammed Shakeeb."
  },
  {
    title: "Overall Champion",
    placement: "Technical-event champion",
    event: "Innov8rix 2025",
    organization: "Innov8rix",
    year: "2025",
    description: "Overall Champion recognition across supplied technical-event wins."
  },
  {
    title: "Runner-Up",
    placement: "Hackathon",
    event: "Hackathon 2K26",
    organization: "Chakravyuha Youth Carnival, Srinivas University",
    year: "2026"
  },
  {
    title: "Winner",
    placement: "Entrepreneurship event",
    event: "Entrorphosis",
    organization: "Malnad College of Engineering, Hassan",
    year: "2025"
  },
  {
    title: "Best Innovation",
    placement: "Innovation recognition",
    event: "Udbhava: Spark the Future",
    organization: "Nitte Institute of Professional Education",
    year: "2025"
  },
  {
    title: "3rd Prize",
    placement: "Hack summit",
    event: "Hack Summit 2024",
    organization: "Hack Summit",
    year: "2024"
  }
];

export const leadership: Leadership[] = [
  {
    role: "Founding President",
    organization: "ICSB Club - P.A. College of Engineering",
    description:
      "Leading a student technology community focused on IoT, Cyber Security and Blockchain.",
    icon: CircuitBoard
  },
  {
    role: "Chairperson",
    organization: "IEEE Systems, Man & Cybernetics Student Chapter",
    description:
      "Student chapter leadership across systems thinking, computing and cybernetic technology interests.",
    icon: Cpu
  },
  {
    role: "Resource Person",
    organization: "BUILDX Workshop - BIT Polytechnic",
    description:
      "Conducted a two-day hands-on RC car workshop where 60+ students worked on assembly, programming, logic, electrical connections, debugging and a final race.",
    meta: "February 5-6, 2025",
    icon: GraduationCap
  },
  {
    role: "Technical Workshops",
    organization: "Student engineering communities",
    description:
      "Conducted technical workshops reaching 300+ students.",
    icon: Users
  }
];

export const skillGroups: SkillGroup[] = [
  {
    category: "AI / Generative AI",
    technologies: ["OpenAI", "Google Gemini", "Generative AI", "AI-powered systems", "multi-agent systems", "LangGraph", "AI-assisted engineering"]
  },
  {
    category: "Blockchain / Web3",
    technologies: ["Solidity", "Ethereum", "Web3.js", "IPFS", "Smart Contracts", "Weilchain", "decentralized applications"]
  },
  {
    category: "Frontend",
    technologies: ["React", "Next.js", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Flutter"]
  },
  {
    category: "Backend",
    technologies: ["Node.js", "Express.js", "FastAPI", "Python", "PHP"]
  },
  {
    category: "Databases / Cloud",
    technologies: ["MongoDB", "MySQL", "Firebase"]
  },
  {
    category: "IoT / Hardware",
    technologies: ["ESP32", "Arduino", "Raspberry Pi", "MQTT", "IoT sensors"]
  },
  {
    category: "Developer Tools",
    technologies: ["Git", "GitHub", "VS Code", "Figma", "Postman"]
  }
];

export const recognition = [
  {
    title: "Google Student Ambassador - 2026",
    description: "Selected as a Google Student Ambassador for the 2026 cohort.",
    icon: Medal
  },
  {
    title: "Featured In Vartha Bharathi",
    description:
      "BIT Polytechnic Hosts Successful Two-Day BUILDX Workshop on Building RC Cars.",
    href: links.buildx,
    icon: Newspaper
  },
  {
    title: "GitHub @haashid",
    description:
      "Selected public repositories across AI, blockchain, IoT, audit technology and community web platforms.",
    href: links.github,
    icon: Github
  },
  {
    title: "LinkedIn",
    description:
      "Professional profile, public updates and technical community activity.",
    href: links.linkedin,
    icon: Linkedin
  }
];

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Haashid",
  url: "https://example.com",
  sameAs: [links.github, links.linkedin],
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "P.A. College of Engineering"
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Blockchain",
    "Internet of Things",
    "Cybersecurity",
    "Full-stack engineering"
  ]
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Muhammad Haashid Portfolio",
  url: "https://example.com",
  description:
    "Portfolio of Muhammad Haashid, an AI, Blockchain, IoT and full-stack engineering builder."
};

export const trophyIcon = Trophy;
