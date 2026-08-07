"use client";

import { useEffect, useRef, useState } from "react";
import type { StatsContent } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StatsSectionProps = {
  stats: StatsContent;
};

function useInView<T extends HTMLElement>(once = true) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) {
            observer.disconnect();
          }
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return { ref, inView };
}

function AnimatedMetric({
  value,
  prefix,
  suffix,
  label,
  active,
}: {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(prefersReducedMotion() ? value : 0);

  useEffect(() => {
    if (!active) {
      return;
    }

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const duration = 1200;
    const start = performance.now();
    const decimals = value % 1 === 0 ? 0 : 1;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Number((value * eased).toFixed(decimals)));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value]);

  const decimals = value % 1 === 0 ? 0 : 1;

  return (
    <GlassPanel className="p-6">
      <p className="font-display text-4xl text-fantasy-100 md:text-5xl">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </p>
      <p className="type-caption mt-2">{label}</p>
    </GlassPanel>
  );
}

export function StatsSection({ stats }: StatsSectionProps) {
  const { ref: metricsRef, inView: metricsInView } = useInView<HTMLDivElement>();
  const { ref: chartRef, inView: chartInView } = useInView<HTMLDivElement>();

  const metrics = stats.metrics ?? [];
  const chart = stats.chart ?? [];
  const max = chart.length > 0 ? Math.max(...chart.map((point) => point.value), 1) : 1;

  if (metrics.length === 0 && chart.length === 0) {
    return null;
  }

  return (
    <section id="stats" className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <p className="type-overline mb-3">Results</p>
        <h2 className="type-h2 max-w-xl">Real work, counted as it ships.</h2>

        {metrics.length > 0 ? (
          <div
            ref={metricsRef}
            className="stats-metrics mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {metrics.map((metric) => (
              <AnimatedMetric
                key={metric.id}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                label={metric.label}
                active={metricsInView}
              />
            ))}
          </div>
        ) : null}

        {chart.length > 0 ? (
          <GlassPanel className="mt-8 p-6 md:p-8">
            <p className="type-overline mb-6">Work by focus</p>
            <div
              ref={chartRef}
              className="flex h-52 items-end gap-3 md:h-56 md:gap-5"
            >
              {chart.map((point, index) => {
                const height = Math.max((point.value / max) * 100, 8);
                return (
                  <div
                    key={point.label}
                    className="flex min-w-0 flex-1 flex-col items-center gap-3"
                  >
                    <div className="relative flex h-40 w-full items-end md:h-44">
                      <div
                        className={cn(
                          "w-full origin-bottom rounded-t-xl bg-linear-to-t from-rose-500 to-rose-300 shadow-[0_0_24px_color-mix(in_oklab,var(--rose-400)_25%,transparent)] transition-[transform,opacity] duration-700 ease-out will-change-transform",
                          chartInView ? "opacity-100" : "opacity-40",
                        )}
                        style={{
                          height: "100%",
                          transform: chartInView
                            ? `scaleY(${height / 100})`
                            : "scaleY(0.08)",
                          transitionDelay: `${index * 80}ms`,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-fantasy-100">{point.value}</p>
                      <p className="type-caption mt-0.5">{point.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>
        ) : null}
      </div>
    </section>
  );
}
