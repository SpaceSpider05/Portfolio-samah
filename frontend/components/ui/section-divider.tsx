"use client";

import { useRef } from "react";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SectionDividerProps = {
  className?: string;
  label?: string;
};

export function SectionDivider({ className, label }: SectionDividerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  registerGsap();

  useGSAP(
    () => {
      if (prefersReducedMotion() || !rootRef.current) {
        return;
      }

      gsap.fromTo(
        ".divider-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
          },
        },
      );

      gsap.fromTo(
        ".divider-orb",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
          },
        },
      );
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      aria-hidden={!label}
      className={cn("relative mx-auto flex max-w-6xl items-center gap-4 px-[clamp(1.25rem,4vw,3rem)] py-2", className)}
    >
      <div className="divider-line h-px flex-1 origin-left bg-gradient-to-r from-transparent via-rose-400/70 to-silver-400/40" />
      <div className="divider-orb relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-rose-400/20" />
        <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_16px_color-mix(in_oklab,var(--rose-400)_70%,transparent)]" />
      </div>
      {label ? (
        <p className="type-overline whitespace-nowrap text-rose-300">{label}</p>
      ) : null}
      <div className="divider-line h-px flex-1 origin-right bg-gradient-to-l from-transparent via-rose-400/70 to-silver-400/40" />
    </div>
  );
}
