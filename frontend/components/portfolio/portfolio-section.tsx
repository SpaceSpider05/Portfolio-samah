"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { useUiStore } from "@/stores/ui-store";

type PortfolioSectionProps = {
  projects: Project[];
};

export function PortfolioSection({ projects }: PortfolioSectionProps) {
  const [active, setActive] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const setCursorLabel = useUiStore((s) => s.setCursorLabel);
  const setModalOpen = useUiStore((s) => s.setModalOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setModalOpen(Boolean(active));

    if (!active) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, setModalOpen]);

  const close = () => setActive(null);

  const modal =
    mounted &&
    createPortal(
      <AnimatePresence>
        {active ? (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.button
              type="button"
              aria-label="Close dialog backdrop"
              className="absolute inset-0 cursor-pointer bg-tobago-900/75 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.5rem] border border-silver-400/20 bg-tobago-800 shadow-2xl sm:rounded-[1.5rem]"
              initial={{ y: 48, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 32, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-silver-400/15 px-5 py-4 md:px-8 md:py-5">
                <div className="min-w-0">
                  <p className="type-overline">{active.category}</p>
                  <h3 id={titleId} className="type-h2 mt-1 truncate text-3xl text-fantasy-100 md:text-4xl">
                    {active.title}
                  </h3>
                  <p className="type-caption mt-1 text-vanilla-200/80">{active.client}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close case study"
                  className="shrink-0 cursor-pointer rounded-full border border-silver-400/30 p-2.5 text-fantasy-100 transition hover:border-rose-400 hover:bg-rose-400/15"
                  onClick={close}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-y-auto overscroll-contain px-5 py-5 md:px-8 md:py-6">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-tobago-700">
                  <Image
                    src={active.coverImage}
                    alt={`${active.title} cover`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>

                <p className="type-body mt-5 text-vanilla-200/90">{active.summary}</p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-silver-400/15 bg-tobago-700/50 p-4">
                    <p className="type-overline mb-2">Challenge</p>
                    <p className="type-body text-fantasy-200">{active.challenge}</p>
                  </div>
                  <div className="rounded-2xl border border-silver-400/15 bg-tobago-700/50 p-4">
                    <p className="type-overline mb-2">Solution</p>
                    <p className="type-body text-fantasy-200">{active.solution}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="type-overline mb-3">Results</p>
                  <ul className="flex flex-wrap gap-2">
                    {active.results.map((result) => (
                      <li
                        key={result}
                        className="rounded-full bg-rose-400/25 px-3 py-1.5 text-sm text-fantasy-100"
                      >
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="type-overline mb-3">Technologies</p>
                  <p className="type-caption text-silver-300">{active.technologies.join(" · ")}</p>
                </div>

                <MagneticButton
                  className="mt-8 cursor-pointer"
                  onClick={() => {
                    close();
                    window.setTimeout(() => {
                      document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                    }, 120);
                  }}
                >
                  Book Similar Project
                </MagneticButton>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
      document.body,
    );

  return (
    <section id="portfolio" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <p className="type-overline mb-3">Featured Projects</p>
        <h2 className="type-h2 max-w-2xl">Each project is a mini experience.</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="group cursor-pointer text-left"
              onMouseEnter={() => setCursorLabel("View")}
              onMouseLeave={() => setCursorLabel(null)}
              onClick={() => setActive(project)}
            >
              <GlassPanel className="overflow-hidden p-0 transition duration-300 group-hover:-translate-y-1 group-hover:border-rose-400/40">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-110"
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
            </button>
          ))}
        </div>
      </div>

      {modal}
    </section>
  );
}
