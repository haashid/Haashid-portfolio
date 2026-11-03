import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects | Muhammad Haashid",
  description: "Published engineering projects and case studies by Muhammad Haashid.",
};

export default async function ProjectsIndexPage() {
  const projects = await getPublishedProjects();

  return (
    <main className="content-route">
      <header className="content-route-header">
        <Link href="/" className="subtle-link">← Portfolio home</Link>
        <p className="eyebrow">Selected work</p>
        <h1>Projects</h1>
        <p>Engineering work, experiments, and products published from the portfolio CMS.</p>
      </header>
      {projects.length === 0 ? (
        <p className="content-empty">No published projects are available yet.</p>
      ) : (
        <div className="content-card-grid">
          {projects.map((project) => {
            const cover = project.coverImageUrl || `/projects/${project.slug}.jpg`;
            return (
              <article className="content-card" key={project.id}>
                {cover && (
                  <Image src={cover} alt={project.title} width={960} height={540} unoptimized className="content-card-image" />
                )}
              <div className="content-card-body">
                {project.category && <p className="eyebrow">{project.category}</p>}
                <h2><Link href={`/projects/${project.slug}`}>{project.title}</Link></h2>
                <p>{project.shortDescription}</p>
                <div className="content-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
                <Link className="subtle-link" href={`/projects/${project.slug}`}>Read case study <ArrowUpRight size={15} /></Link>
              </div>
            </article>
          );
        })}
        </div>
      )}
    </main>
  );
}
