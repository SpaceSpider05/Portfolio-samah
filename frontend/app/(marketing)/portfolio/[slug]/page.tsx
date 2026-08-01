import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND } from "@/constants/brand";
import { getProjectBySlug, getProjects } from "@/services/api";
import { ProjectBookCta } from "@/components/portfolio/project-book-cta";
import { ProjectCoverImage } from "@/components/portfolio/project-cover-image";
import { ProjectGallery } from "@/components/portfolio/project-gallery";

export const dynamicParams = true;
export const revalidate = 60;

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Project" };
  }

  const title = `${project.title} — ${project.category}`;
  const description = project.summary;
  const path = `/portfolio/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: project.coverImage
        ? [{ url: project.coverImage, alt: project.title }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const galleryImages = project.galleryImages ?? [];

  return (
    <article>
      <section className="relative isolate min-h-[70svh] overflow-hidden bg-tobago-900 pt-24 md:pt-28">
        <div className="absolute inset-0">
          <ProjectCoverImage
            src={project.coverImage}
            alt={`${project.title} cover`}
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-tobago-900 via-tobago-900/70 to-tobago-900/30" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-end px-5 pb-12 md:px-8 md:pb-16">
          <Link
            href="/portfolio"
            className="type-caption mb-10 w-fit text-vanilla-200/75 transition hover:text-rose-300"
          >
            ← Portfolio
          </Link>

          <p className="type-overline text-rose-300">{project.category}</p>
          <h1 className="type-display mt-3 max-w-4xl text-fantasy-100">
            {project.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-vanilla-200/90 md:text-xl">
            {project.client}
          </p>
        </div>
      </section>

      <section className="section-pad mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)] lg:gap-16">
          <div>
            <p className="type-overline">Overview</p>
            <p className="type-body mt-5 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-heading-soft md:text-xl">
              {project.summary}
            </p>
          </div>

          <aside className="space-y-8 border-t border-border pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <div>
              <p className="type-overline">Client</p>
              <p className="mt-2 font-display text-2xl text-heading">{project.client}</p>
            </div>
            <div>
              <p className="type-overline">Focus</p>
              <p className="mt-2 text-base text-heading-soft">{project.category}</p>
            </div>
            <div>
              <p className="type-overline">Stack</p>
              <ul className="mt-3 space-y-2">
                {project.technologies.map((tech) => (
                  <li key={tech} className="text-sm text-muted">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-border/60 bg-tobago-800/30">
        <div className="section-pad mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="type-overline">The work</p>
            <h2 className="type-h2 mt-3 text-heading">Challenge & solution</h2>
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-14">
            <div>
              <p className="type-overline text-rose-300">Challenge</p>
              <h3 className="mt-3 font-display text-2xl text-heading md:text-3xl">
                What stood in the way
              </h3>
              <p className="type-body mt-5 whitespace-pre-line leading-relaxed text-muted">
                {project.challenge}
              </p>
            </div>

            <div>
              <p className="type-overline text-rose-300">Solution</p>
              <h3 className="mt-3 font-display text-2xl text-heading md:text-3xl">
                How we moved it
              </h3>
              <p className="type-body mt-5 whitespace-pre-line leading-relaxed text-muted">
                {project.solution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {galleryImages.length > 0 ? (
        <ProjectGallery images={galleryImages} title={project.title} />
      ) : null}

      <section className="section-pad mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline">Results</p>
          <h2 className="type-h2 mt-3 text-heading">What changed</h2>
        </div>

        <ul className="mt-10 divide-y divide-border/70 border-y border-border/70">
          {project.results.map((result, index) => (
            <li
              key={`${result}-${index}`}
              className="flex items-start gap-5 py-6 md:gap-8 md:py-7"
            >
              <span className="type-overline shrink-0 pt-1 text-rose-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="font-display text-2xl leading-snug text-fantasy-100 md:text-3xl">
                {result}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-2xl text-heading md:text-3xl">
              Want results like these?
            </p>
            <p className="mt-2 max-w-md text-sm text-muted">
              Book a consultation with {BRAND.name} and we’ll map the next move.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ProjectBookCta />
            <Link
              href="/portfolio"
              className="inline-flex items-center rounded-full border border-silver-400/25 px-6 py-3 text-sm text-fantasy-100 transition hover:border-rose-400/40"
            >
              More work
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
