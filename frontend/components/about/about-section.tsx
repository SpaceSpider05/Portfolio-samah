"use client";

import Image from "next/image";
import type { AboutContent } from "@/types";
import { LANDING } from "@/constants/landing";
import { resolveMediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

type AboutSectionProps = {
  about: AboutContent;
};

function timelineKind(title: string, description: string): "education" | "career" {
  const haystack = `${title} ${description}`.toLowerCase();
  if (
    haystack.includes("degree") ||
    haystack.includes("university") ||
    haystack.includes("bachelor") ||
    haystack.includes("master") ||
    haystack.includes("diploma") ||
    haystack.includes("certificat") ||
    haystack.includes("school") ||
    haystack.includes("graduat") ||
    haystack.includes("education") ||
    haystack.includes("stud")
  ) {
    return "education";
  }

  return "career";
}

export function AboutSection({ about }: AboutSectionProps) {
  const photoSrc = resolveMediaUrl(about.photoUrl);
  const isLocalLaravelMedia =
    photoSrc.startsWith("http://127.0.0.1") ||
    photoSrc.startsWith("http://localhost");

  const timeline = about.timeline ?? [];

  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline mb-3">About me</p>
          <h2 className="type-h2">hadi Meet the strategist behind</h2>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(260px,0.9fr)_1.1fr] lg:gap-14">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-4/5 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-silver-400/20 bg-tobago-600 lg:mx-0 lg:max-w-none">
              <Image
                src={photoSrc}
                alt={`${about.name} portrait`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 90vw, 380px"
                unoptimized={isLocalLaravelMedia}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-tobago-900 via-tobago-900/55 to-transparent px-6 pb-6 pt-20">
                <p className="font-display text-3xl text-fantasy-100 md:text-4xl">
                  {about.name}
                </p>
                <p className="mt-1 text-sm text-vanilla-200/90">{about.role}</p>
              </div>
            </div>

            {about.achievements.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {about.achievements.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-silver-400/15 bg-tobago-800/40 px-3 py-4 text-center"
                  >
                    <p className="font-display text-2xl text-fantasy-100">
                      {item.value}
                      {item.suffix}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-wider text-muted">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-10">
            <div>
              <p className="type-overline">Story</p>
              <p className="type-body mt-4 text-lg leading-relaxed text-vanilla-200/90 md:text-xl">
                {about.bio}
              </p>
            </div>

            <div>
              <p className="type-overline">Mission</p>
              <p className="mt-3 font-display text-2xl leading-snug text-heading md:text-3xl">
                {about.mission}
              </p>
            </div>

            <div>
              <p className="type-overline">Core values</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {LANDING.about.values.map((value) => (
                  <li
                    key={value}
                    className="rounded-full border border-silver-400/20 px-4 py-2 text-sm text-heading-soft"
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>

            {timeline.length > 0 ? (
              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="type-overline">Education & journey</p>
                    <h3 className="mt-2 font-display text-2xl text-heading md:text-3xl">
                      Timeline
                    </h3>
                  </div>
                  <p className="text-xs text-muted">
                    Education, certifications, and career milestones
                  </p>
                </div>

                <ol className="relative mt-8 space-y-0 border-l border-rose-400/35 pl-6 md:pl-8">
                  {timeline.map((item, index) => {
                    const kind = timelineKind(item.title, item.description);

                    return (
                      <li key={item.id} className="relative pb-8 last:pb-0">
                        <span className="absolute -left-[1.7rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-rose-400 bg-tobago-700 md:-left-[2.2rem]">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                        </span>

                        <div className="flex flex-wrap items-center gap-2">
                          <p className="type-overline text-rose-300">{item.year}</p>
                          <span
                            className={cn(
                              "rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider",
                              kind === "education"
                                ? "bg-vanilla-200/15 text-vanilla-200"
                                : "bg-rose-400/15 text-rose-200",
                            )}
                          >
                            {kind === "education" ? "Education" : "Career"}
                          </span>
                        </div>

                        <h4 className="mt-2 font-display text-xl text-heading md:text-2xl">
                          {item.title}
                        </h4>
                        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted md:text-base">
                          {item.description}
                        </p>

                        {index < timeline.length - 1 ? (
                          <span className="sr-only">Next milestone</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ol>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
