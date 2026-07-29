"use client";

import { useMemo } from "react";
import {
  BarChart3,
  Megaphone,
  Search,
  Share2,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Globe } from "@/components/ui/cobe-globe";
import { cn } from "@/lib/utils";

/** Casablanca, Morocco — origin of worldwide reach. */
const MOROCCO: [number, number] = [33.5731, -7.5898];

const DESTINATIONS: { id: string; location: [number, number]; label: string }[] =
  [
    { id: "london", location: [51.5074, -0.1278], label: "London" },
    { id: "paris", location: [48.8566, 2.3522], label: "Paris" },
    { id: "nyc", location: [40.7128, -74.006], label: "New York" },
    { id: "dubai", location: [25.2048, 55.2708], label: "Dubai" },
    { id: "tokyo", location: [35.6762, 139.6503], label: "Tokyo" },
    { id: "saopaulo", location: [-23.5505, -46.6333], label: "São Paulo" },
    { id: "capetown", location: [-33.9249, 18.4241], label: "Cape Town" },
    { id: "sydney", location: [-33.8688, 151.2093], label: "Sydney" },
  ];

type FloatIcon = {
  icon: LucideIcon;
  label: string;
  className: string;
};

const FLOAT_ICONS: FloatIcon[] = [
  {
    icon: Search,
    label: "SEO",
    className: "hero-float-a -left-1 top-[6%] md:-left-4",
  },
  {
    icon: Megaphone,
    label: "Ads",
    className: "hero-float-b -right-1 top-[14%] md:-right-5",
  },
  {
    icon: Share2,
    label: "Social",
    className: "hero-float-c left-0 top-[46%] md:-left-6",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    className: "hero-float-d -right-2 top-[48%] md:-right-6",
  },
  {
    icon: Target,
    label: "Strategy",
    className: "hero-float-a bottom-[16%] left-1",
  },
  {
    icon: TrendingUp,
    label: "Growth",
    className: "hero-float-b bottom-[8%] right-0",
  },
];

export function HeroGlobe() {
  const markers = useMemo(
    () => [
      { id: "morocco", location: MOROCCO, label: "Morocco" },
      ...DESTINATIONS,
    ],
    [],
  );

  const arcs = useMemo(
    () =>
      DESTINATIONS.map((city) => ({
        id: `morocco-${city.id}`,
        from: MOROCCO,
        to: city.location,
        label: `Morocco → ${city.label}`,
      })),
    [],
  );

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] md:max-w-[26rem] lg:max-w-none">
      <Globe
        className="hero-globe-wrap w-full"
        markers={markers}
        arcs={arcs}
        markerColor={[0.86, 0.63, 0.64]}
        baseColor={[0.26, 0.17, 0.14]}
        arcColor={[0.86, 0.63, 0.64]}
        glowColor={[0.86, 0.63, 0.64]}
        dark={1}
        mapBrightness={7}
        markerSize={0.035}
        markerElevation={0.012}
        arcWidth={0.65}
        arcHeight={0.32}
        speed={0.0022}
        theta={0.3}
      />

      {FLOAT_ICONS.map(({ icon: Icon, label, className }) => (
        <div
          key={label}
          className={cn(
            "pointer-events-none absolute z-20 flex items-center gap-2 rounded-full border border-rose-400/30 bg-tobago-800/90 px-3 py-2 text-fantasy-100 shadow-[0_12px_30px_color-mix(in_oklab,var(--tobago-900)_40%,transparent)] backdrop-blur-sm",
            className,
          )}
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-400/15 text-rose-300">
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-medium tracking-wide">{label}</span>
        </div>
      ))}
    </div>
  );
}
