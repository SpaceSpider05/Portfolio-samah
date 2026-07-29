"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LANDING } from "@/constants/landing";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhyMeSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const show = inView || Boolean(reduceMotion);

  return (
    <section
      id="why-me"
      ref={sectionRef}
      className="section-pad section-alt overflow-hidden"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="type-overline mb-3">Benefits</p>
          <h2 className="type-h2">{LANDING.whyMe.headline}</h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {LANDING.whyMe.intro}
          </p>
        </motion.div>

        <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {LANDING.whyMe.benefits.map((benefit, index) => (
            <motion.li
              key={benefit.title}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{
                duration: 0.45,
                delay: reduceMotion ? 0 : 0.1 + index * 0.07,
                ease: EASE,
              }}
              className="relative border-t border-rose-400/30 pt-5"
            >
              <span className="font-display text-4xl leading-none text-rose-400/35 md:text-5xl">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl text-heading">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted md:text-base">
                {benefit.detail}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
