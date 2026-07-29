"use client";

import { LANDING } from "@/constants/landing";
import { getSkillIcon } from "@/components/landing/skill-tool-icons";
import { cn } from "@/lib/utils";

export function SkillsSection() {
  return (
    <section id="skills" className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline mb-3">Skills & tools</p>
          <h2 className="type-h2">The stack behind the strategy</h2>
          <p className="mt-4 text-base text-muted">
            Hover a tool to see how it supports the work.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {LANDING.skills.map((skill) => {
            const Icon = getSkillIcon(skill.icon);

            return (
              <li key={skill.name} className="group relative z-0 hover:z-20 focus-within:z-20">
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col items-center gap-3 rounded-2xl border border-silver-400/15 bg-tobago-800/40 px-3 py-5 text-center transition",
                    "hover:border-rose-400/40 hover:bg-tobago-800/70 focus-visible:border-rose-400/50 focus-visible:outline-none",
                  )}
                  aria-describedby={`skill-tip-${skill.icon}`}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/10 text-rose-300 transition group-hover:scale-110 group-hover:bg-rose-400/20 group-hover:text-rose-200">
                    {Icon ? <Icon className="h-6 w-6" /> : null}
                  </span>
                  <span className="text-xs font-medium text-fantasy-100/90 sm:text-sm">
                    {skill.name}
                  </span>
                </button>

                <div
                  id={`skill-tip-${skill.icon}`}
                  role="tooltip"
                  className={cn(
                    "pointer-events-none absolute top-[calc(100%+0.65rem)] left-1/2 z-20 w-52 -translate-x-1/2 rounded-xl border border-rose-400/25 bg-tobago-900 px-3 py-2.5 text-left shadow-lg",
                    "opacity-0 transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100",
                    "scale-95 group-hover:scale-100 group-focus-within:scale-100",
                  )}
                >
                  <p className="text-xs font-medium text-rose-200">{skill.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {skill.purpose}
                  </p>
                  <span
                    aria-hidden
                    className="absolute bottom-full left-1/2 -mb-1.25 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-t border-l border-rose-400/25 bg-tobago-900"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
