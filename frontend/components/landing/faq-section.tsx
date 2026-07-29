"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { LANDING } from "@/constants/landing";
import { cn } from "@/lib/utils";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <section id="faq" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="type-overline mb-3">FAQ</p>
          <h2 className="type-h2 max-w-md">Answers before the first call</h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Clear expectations on timing, pricing, and how we collaborate —
            so you can decide with confidence.
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex items-center gap-2 text-sm text-rose-300 transition hover:text-rose-200"
          >
            Still unsure? Book a free consultation
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="space-y-3">
          {LANDING.faq.map((item, index) => {
            const open = openIndex === index;
            const panelId = `${baseId}-panel-${index}`;
            const buttonId = `${baseId}-button-${index}`;

            return (
              <div
                key={item.question}
                className={cn(
                  "rounded-2xl border transition duration-300",
                  open
                    ? "border-rose-400/35 bg-tobago-800/55 shadow-[0_0_0_1px_color-mix(in_oklab,var(--rose-400)_12%,transparent)]"
                    : "border-silver-400/15 bg-tobago-800/30 hover:border-silver-400/30 hover:bg-tobago-800/45",
                )}
              >
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-start gap-4 px-5 py-5 text-left md:px-6"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition",
                      open
                        ? "bg-rose-400/20 text-rose-200"
                        : "bg-tobago-900/70 text-rose-300/80",
                    )}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="min-w-0 flex-1 pt-0.5 font-display text-lg leading-snug text-heading md:text-xl">
                    {item.question}
                  </span>

                  <span
                    className={cn(
                      "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition",
                      open
                        ? "border-rose-400/40 bg-rose-400/15 text-rose-200"
                        : "border-silver-400/20 text-rose-300",
                    )}
                  >
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        open && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={
                        reduceMotion
                          ? false
                          : { height: 0, opacity: 0 }
                      }
                      animate={{ height: "auto", opacity: 1 }}
                      exit={
                        reduceMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{
                        duration: reduceMotion ? 0 : 0.32,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-border/50 px-5 pb-5 pt-4 text-base leading-relaxed text-muted md:px-6 md:pl-17">
                        {item.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
