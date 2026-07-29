"use client";

import Link from "next/link";
import type { Project } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { ProjectCoverImage } from "@/components/portfolio/project-cover-image";
import { useUiStore } from "@/stores/ui-store";

type PortfolioSectionProps = {
  projects: Project[];
};

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const setCursorLabel = useUiStore((s) => s.setCursorLabel);

  return (
    <section id="portfolio" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-overline mb-3">Featured Projects</p>
            <h2 className="type-h2 max-w-2xl">Each project is a mini experience.</h2>
          </div>
          <Link
            href="/portfolio"
            className="type-caption text-rose-300 transition hover:text-rose-200"
          >
            View all projects →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group block text-left"
              onMouseEnter={() => setCursorLabel("View")}
              onMouseLeave={() => setCursorLabel(null)}
            >
              <GlassPanel className="overflow-hidden p-0 transition duration-300 group-hover:-translate-y-1 group-hover:border-rose-400/40">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <ProjectCoverImage
                    src={project.coverImage}
                    alt={project.title}
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
      </div>
    </section>
  );
}
