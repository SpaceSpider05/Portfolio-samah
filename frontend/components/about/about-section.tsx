"use client";

import Image from "next/image";
import { useRef } from "react";
import type { AboutContent } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type AboutSectionProps = {
  about: AboutContent;
};

export function AboutSection({ about }: AboutSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  registerGsap();

  useGSAP(
    () => {
      if (prefersReducedMotion() || !rootRef.current) {
        return;
      }

      gsap.from(".about-photo", {
        scrollTrigger: { trigger: rootRef.current, start: "top 78%" },
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".about-copy > *", {
        scrollTrigger: { trigger: rootRef.current, start: "top 75%" },
        y: 22,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
      });

      gsap.from(".timeline-line", {
        scrollTrigger: { trigger: ".about-timeline", start: "top 75%" },
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.15,
        ease: "power2.out",
      });

      gsap.from(".timeline-item", {
        scrollTrigger: { trigger: ".about-timeline", start: "top 75%" },
        x: -16,
        opacity: 0,
        stagger: 0.12,
        duration: 0.65,
        ease: "power2.out",
      });

      gsap.from(".about-card", {
        scrollTrigger: { trigger: ".about-achievements", start: "top 82%" },
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.55,
      });
    },
    { scope: rootRef, dependencies: [about] },
  );

  return (
    <section id="about" ref={rootRef} className="section-pad relative">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline mb-3">Biography</p>
          <h2 className="type-h2">A visual story of craft, not a wall of text.</h2>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(280px,0.85fr)_1.15fr] lg:gap-14">
          <div className="about-photo lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[1.75rem] border border-silver-400/20 bg-tobago-600 shadow-[0_30px_80px_color-mix(in_oklab,var(--tobago-900)_45%,transparent)] lg:mx-0 lg:max-w-none">
              <Image
                src={about.photoUrl}
                alt={`${about.name} portrait`}
                fill
                className="object-cover object-[center_15%]"
                sizes="(max-width: 1024px) 90vw, 380px"
                priority
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-tobago-900 via-tobago-900/55 to-transparent px-6 pb-6 pt-20">
                <p className="font-display text-3xl text-fantasy-100 md:text-4xl">{about.name}</p>
                <p className="mt-1 text-sm text-vanilla-200/90">{about.role}</p>
              </div>
            </div>
          </div>

          <div className="about-copy space-y-8">
            <p className="type-body text-lg leading-relaxed text-vanilla-200/90 md:text-xl">
              {about.bio}
            </p>

            <div className="about-timeline relative pl-10">
              <div className="timeline-line absolute bottom-3 left-[15px] top-3 w-px origin-top bg-gradient-to-b from-rose-400 via-rose-400/70 to-transparent" />
              <ol className="space-y-8">
                {about.timeline.map((item) => (
                  <li key={item.id} className="timeline-item relative">
                    <span className="absolute -left-10 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-rose-400 bg-tobago-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    </span>
                    <p className="type-overline">{item.year}</p>
                    <p className="type-h3 mt-1 text-xl text-fantasy-100 md:text-2xl">{item.title}</p>
                    <p className="type-caption mt-2 max-w-md text-silver-300">{item.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="about-achievements grid gap-3 sm:grid-cols-3">
              {about.achievements.map((item) => (
                <GlassPanel key={item.id} className="about-card p-5 text-center sm:text-left">
                  <p className="font-display text-4xl text-fantasy-100">
                    {item.value}
                    {item.suffix}
                  </p>
                  <p className="type-caption mt-1">{item.label}</p>
                </GlassPanel>
              ))}
            </div>

            <GlassPanel className="border-rose-400/25 bg-gradient-to-br from-tobago-600/80 to-tobago-700/60 p-6 md:p-7">
              <p className="type-overline mb-3">Mission</p>
              <p className="type-h3 text-2xl leading-snug text-vanilla-200 md:text-3xl">
                {about.mission}
              </p>
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}
