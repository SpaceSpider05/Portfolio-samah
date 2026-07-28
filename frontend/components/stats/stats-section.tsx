"use client";

import { useRef } from "react";
import type { StatsContent } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { gsap, registerGsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type StatsSectionProps = {
  stats: StatsContent;
};

export function StatsSection({ stats }: StatsSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  registerGsap();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        return;
      }

      const counters = rootRef.current?.querySelectorAll<HTMLElement>("[data-count]");
      counters?.forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            const decimals = target % 1 === 0 ? 0 : 1;
            el.textContent = obj.val.toFixed(decimals);
          },
        });
      });

      gsap.from(".stats-bar", {
        scrollTrigger: { trigger: ".stats-chart", start: "top 80%" },
        scaleY: 0,
        transformOrigin: "bottom",
        stagger: 0.08,
        duration: 0.9,
        ease: "power2.out",
      });
    },
    { scope: rootRef, dependencies: [stats] },
  );

  const max = Math.max(...stats.chart.map((point) => point.value));

  return (
    <section id="stats" ref={rootRef} className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <p className="type-overline mb-3">Results</p>
        <h2 className="type-h2">Numbers that move when you arrive.</h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.metrics.map((metric) => (
            <GlassPanel key={metric.id} className="p-6">
              <p className="font-display text-4xl text-fantasy-200 md:text-5xl">
                {metric.prefix}
                <span data-count={metric.value}>{metric.value}</span>
                {metric.suffix}
              </p>
              <p className="type-caption mt-2">{metric.label}</p>
            </GlassPanel>
          ))}
        </div>

        <GlassPanel className="stats-chart mt-8 p-6 md:p-8">
          <p className="type-overline mb-6">Growth trajectory</p>
          <div className="flex h-48 items-end gap-3 md:gap-5">
            {stats.chart.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="stats-bar w-full rounded-t-lg bg-gradient-to-t from-rose-500 to-rose-300"
                  style={{ height: `${(point.value / max) * 100}%` }}
                />
                <span className="type-caption">{point.label}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}
