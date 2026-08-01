import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/constants/brand";
import { SEO, pageMetadata } from "@/constants/seo";
import { getProjects } from "@/services/api";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ProjectBookCta } from "@/components/portfolio/project-book-cta";
import { ProjectCoverImage } from "@/components/portfolio/project-cover-image";

export const metadata: Metadata = pageMetadata(SEO.pages.portfolio);

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <section className="section-pad relative mx-auto max-w-6xl pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--rose-400)_22%,transparent),transparent_70%)]" />

      <div className="mb-12 max-w-2xl">
        <p className="type-overline text-rose-300">Portfolio</p>
        <h1 className="type-h1 mt-3">Selected work by {BRAND.name}</h1>
        <p className="type-subheading mt-4 text-heading-soft">
          Case studies built around measurable growth — brand, content, and acquisition.
        </p>
      </div>

      {projects.length === 0 ? (
        <GlassPanel className="p-8">
          <p className="type-body text-muted">No published projects yet.</p>
        </GlassPanel>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block text-left"
            >
              <GlassPanel className="overflow-hidden p-0 transition duration-300 group-hover:-translate-y-1 group-hover:border-rose-400/40">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProjectCoverImage
                    src={project.coverImage}
                    alt={`${project.title} — ${project.category} case study for ${project.client}`}
                    className="transition duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tobago-900/85 via-tobago-800/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-fantasy-100">
                    <p className="type-caption text-rose-300">{project.category}</p>
                    <p className="font-display text-2xl text-fantasy-100">{project.title}</p>
                    <p className="mt-1 text-sm text-vanilla-200/80">{project.client}</p>
                  </div>
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12">
        <ProjectBookCta />
      </div>
    </section>
  );
}
