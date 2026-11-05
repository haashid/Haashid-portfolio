import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedProjectBySlug } from "@/lib/public-data";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const coverImageUrl = project.coverImageUrl || `/projects/${project.slug}.jpg`;
  return {
    title: `${project.title} | Muhammad Haashid`,
    description: project.shortDescription,
    openGraph: { title: project.title, description: project.shortDescription, images: coverImageUrl ? [coverImageUrl] : [] },
  };
}

function dateLabel(value: Date | null) {
  return value ? new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(value) : null;
}

interface ProjectImage {
  id: string;
  url: string;
  alt?: string | null;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) notFound();

  const coverImageUrl = project.coverImageUrl || `/projects/${project.slug}.jpg`;
  const images = (project.images || []) as ProjectImage[];
  const gallery = images.filter((image: ProjectImage) => image.url !== coverImageUrl && image.url !== project.coverImageUrl);
  const start = dateLabel(project.startDate);
  const end = dateLabel(project.endDate);
  const technologies = (project.technologies || []) as string[];

  return (
    <main className="content-route case-study">
      <Link href="/projects" className="subtle-link">← All projects</Link>
      <header className="case-study-header">
        {project.category && <p className="eyebrow">{project.category}</p>}
        <h1>{project.title}</h1>
        <p className="case-study-summary">{project.shortDescription}</p>
        <div className="content-tags">{technologies.map((technology: string) => <span key={technology}>{technology}</span>)}</div>
        {(start || end || project.status) && <p className="content-meta">{[start, end].filter(Boolean).join(" – ")}{project.status ? ` · ${project.status.replace(/_/g, " ").toLowerCase()}` : ""}</p>}
        <div className="case-study-links">
          {project.githubUrl && <a className="button secondary" href={project.githubUrl} target="_blank" rel="noreferrer">Source repository</a>}
          {project.demoUrl && <a className="button primary" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo</a>}
          {project.docsUrl && <a className="button secondary" href={project.docsUrl} target="_blank" rel="noreferrer">Documentation</a>}
        </div>
      </header>
      {coverImageUrl && <Image src={coverImageUrl} alt={`${project.title} cover`} width={1440} height={810} unoptimized className="case-study-cover" priority />}
      <div className="case-study-content">
        {project.fullDescription && <section><h2>Overview</h2><p>{project.fullDescription}</p></section>}
        {project.problem && <section><h2>Problem</h2><p>{project.problem}</p></section>}
        {project.solution && <section><h2>Solution</h2><p>{project.solution}</p></section>}
        {project.myRole && <section><h2>My role</h2><p>{project.myRole}</p></section>}
        {project.award && <section><h2>Recognition</h2><p>{project.award}</p></section>}
        {gallery.length > 0 && <section><h2>Project media</h2><div className="content-card-grid">{gallery.map((image: ProjectImage) => <figure key={image.id}><Image src={image.url} alt={image.alt || `${project.title} project image`} width={960} height={640} unoptimized className="content-card-image" /></figure>)}</div></section>}
      </div>
    </main>
  );
}
