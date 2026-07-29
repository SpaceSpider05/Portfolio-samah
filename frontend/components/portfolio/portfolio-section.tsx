"use client";

import Link from "next/link";
import type { Project } from "@/types";
import { ProjectCoverImage } from "@/components/portfolio/project-cover-image";
import { useUiStore } from "@/stores/ui-store";

type PortfolioSectionProps = {
  projects: Project[];
};

const FEATURED_LIMIT = 3;

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const setCursorLabel = useUiStore((s) => s.setCursorLabel);
  const featured = projects.slice(0, FEATURED_LIMIT);

  return (
    <section id="portfolio" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="type-overline mb-3">Featured projects</p>
            <h2 className="type-h2 max-w-2xl">Results that sell the work</h2>
          </div>
          <Link
            href="/portfolio"
            className="type-caption text-rose-300 transition hover:text-rose-200"
          >
            View all projects →
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-silver-400/15 bg-tobago-800/35 text-left transition hover:border-rose-400/35"
              onMouseEnter={() => setCursorLabel("View")}
              onMouseLeave={() => setCursorLabel(null)}
            >
              <div className="relative aspect-4/3 overflow-hidden">
                <ProjectCoverImage
                  src={project.coverImage}
                  alt={project.title}
                  className="transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <p className="type-caption text-rose-300">{project.client}</p>
                <h3 className="mt-2 font-display text-2xl text-heading">
                  {project.title}
                </h3>

                <div className="mt-5 space-y-3 text-sm">
                  <div>
                    <p className="type-overline">Problem</p>
                    <p className="mt-1 line-clamp-2 text-muted">{project.challenge}</p>
                  </div>
                  <div>
                    <p className="type-overline">Solution</p>
                    <p className="mt-1 line-clamp-2 text-muted">{project.solution}</p>
                  </div>
                </div>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.results.slice(0, 3).map((result) => (
                    <li
                      key={result}
                      className="rounded-full border border-rose-400/25 bg-rose-400/10 px-3 py-1 text-xs text-rose-200"
                    >
                      {result}
                    </li>
                  ))}
                </ul>

                <span className="mt-6 inline-flex text-sm text-rose-300 transition group-hover:text-rose-200">
                  Read case study →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
