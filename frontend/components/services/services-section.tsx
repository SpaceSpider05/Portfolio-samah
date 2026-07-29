"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service } from "@/types";
import { GlassPanel } from "@/components/ui/glass-panel";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

type ServicesSectionProps = {
  services: Service[];
};

function DemoVisual({ type, active }: { type: Service["hoverDemo"]; active: boolean }) {
  if (type === "seo") {
    return (
      <div className="mt-5 space-y-2">
        {["#4 · boutique skincare", "#2 · boutique skincare", "#1 · boutique skincare"].map(
          (row, index) => (
            <div
              key={row}
              className={cn(
                "rounded-lg bg-tobago-800/80 px-3 py-2 text-xs text-fantasy-200 transition-all duration-500",
                active && index === 2 && "bg-rose-400/35 font-medium text-fantasy-100",
                active && index === 0 && "opacity-40",
              )}
              style={{
                transform: active ? `translateY(${(2 - index) * -6}px)` : undefined,
              }}
            >
              {row}
            </div>
          ),
        )}
      </div>
    );
  }

  if (type === "social") {
    return (
      <div className="mt-5 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "aspect-square rounded-lg bg-tobago-800/70 transition duration-500",
              active && "scale-105 bg-rose-400/50",
            )}
            style={{ transitionDelay: `${index * 40}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5 flex h-20 items-end gap-2">
      {[28, 44, 36, 62, 78, 94].map((height, index) => (
        <div
          key={height}
          className="flex-1 rounded-t-md bg-rose-400/70 transition-all duration-700"
          style={{
            height: active ? `${height}%` : "18%",
            transitionDelay: `${index * 50}ms`,
          }}
        />
      ))}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const router = useRouter();
  const [active, setActive] = useState(false);
  const setCursorLabel = useUiStore((s) => s.setCursorLabel);

  return (
    <GlassPanel
      className={cn(
        "group relative overflow-hidden p-6 transition-transform duration-300",
        "md:hover:-translate-y-2",
      )}
      onMouseEnter={() => {
        setActive(true);
        setCursorLabel("View");
      }}
      onMouseLeave={() => {
        setActive(false);
        setCursorLabel(null);
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-linear-to-br from-rose-300/0 to-rose-400/0 transition duration-500",
          active && "from-rose-300/15 to-vanilla-200/30",
        )}
      />
      <p className="type-h3 relative">{service.title}</p>
      <p className="type-caption relative mt-3">{service.description}</p>
      <DemoVisual type={service.hoverDemo} active={active} />
      <div
        className={cn(
          "relative mt-6 overflow-hidden transition-all duration-300",
          active ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <MagneticButton
          cursorLabel="Book"
          className="w-full"
          onClick={() => router.push(`/book?service=${service.slug}`)}
        >
          {service.cta}
        </MagneticButton>
      </div>
    </GlassPanel>
  );
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <p className="type-overline mb-3">Services</p>
        <h2 className="type-h2 max-w-xl">Interactive capabilities that show the outcome.</h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
