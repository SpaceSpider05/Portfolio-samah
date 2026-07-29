"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LANDING } from "@/constants/landing";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const ROAD_DURATION = 2.6;
const STEP_COUNT = LANDING.process.length;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const steps = LANDING.process;
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      return;
    }

    if (reduceMotion) {
      setProgress(1);
      return;
    }

    const start = performance.now();
    const delayMs = 120;

    const tick = (now: number) => {
      const elapsed = now - start - delayMs;
      if (elapsed < 0) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const next = Math.min(1, elapsed / (ROAD_DURATION * 1000));
      setProgress(next);

      if (next < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [inView, reduceMotion]);

  const show = inView || Boolean(reduceMotion);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section-pad overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="type-overline mb-3">Process</p>
          <h2 className="type-h2">What happens after you reach out</h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            A clear path from first conversation to measured growth — so nothing
            feels uncertain.
          </p>
        </motion.div>

        <ol className="relative mt-12 md:mt-14">
          {/* Road bed */}
          <div
            aria-hidden
            className="absolute top-5 bottom-5 left-3.75 w-2.5 -translate-x-1/2 overflow-hidden rounded-full bg-tobago-900/90 md:left-6 md:w-3"
          >
            <div className="absolute inset-y-1 inset-x-0.75 rounded-full bg-silver-400/10" />

            {/* Growing road fill */}
            <div
              className="absolute inset-x-0 top-0 overflow-hidden rounded-full"
              style={{ height: `${progress * 100}%` }}
            >
              <div className="absolute inset-0 bg-linear-to-b from-rose-300/90 via-rose-400/75 to-rose-400/45" />
              <div
                className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 opacity-70"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, color-mix(in oklab, var(--fantasy-100) 75%, transparent) 0 7px, transparent 7px 16px)",
                }}
              />
            </div>

            {/* Soft traveler glow at the tip */}
            {progress > 0.01 && progress < 0.995 ? (
              <div
                className="absolute left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-300/35 blur-md"
                style={{ top: `${progress * 100}%` }}
              />
            ) : null}
            {progress > 0.01 && progress < 0.995 ? (
              <div
                className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fantasy-100 shadow-[0_0_12px_color-mix(in_oklab,var(--rose-400)_70%,transparent)]"
                style={{ top: `${progress * 100}%` }}
              />
            ) : null}
          </div>

          {steps.map((step, index) => {
            const threshold = (index + 0.35) / STEP_COUNT;
            const reached = progress >= threshold;
            const textDelay = reduceMotion ? 0 : 0.08 + index * 0.06;

            return (
              <li
                key={step.title}
                className="relative grid grid-cols-[2rem_1fr] gap-5 pb-10 last:pb-0 md:grid-cols-[3rem_1fr] md:gap-8 md:pb-12"
              >
                <div className="relative z-10 flex justify-center">
                  <motion.span
                    className={cn(
                      "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium md:h-12 md:w-12 md:text-sm",
                      "bg-tobago-900 shadow-[0_0_0_6px_color-mix(in_oklab,var(--tobago-900)_92%,transparent)]",
                      reached
                        ? "border-rose-400/60 text-rose-100"
                        : "border-silver-400/25 text-muted",
                    )}
                    animate={
                      reached
                        ? {
                            scale: 1,
                            backgroundColor:
                              "color-mix(in oklab, var(--rose-400) 18%, var(--tobago-900))",
                          }
                        : {
                            scale: 0.92,
                            backgroundColor: "var(--tobago-900)",
                          }
                    }
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>
                </div>

                <motion.div
                  className="min-w-0 pt-0.5 md:pt-2"
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={
                    show
                      ? {
                          opacity: reached || reduceMotion ? 1 : 0.4,
                          y: 0,
                        }
                      : { opacity: 0, y: 12 }
                  }
                  transition={{ duration: 0.4, delay: textDelay, ease: EASE }}
                >
                  <h3
                    className={cn(
                      "font-display text-2xl leading-tight md:text-3xl",
                      reached || reduceMotion
                        ? "text-heading"
                        : "text-heading/55",
                    )}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 max-w-xl text-sm leading-relaxed md:mt-3 md:text-base",
                      reached || reduceMotion ? "text-muted" : "text-muted/55",
                    )}
                  >
                    {step.description}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
