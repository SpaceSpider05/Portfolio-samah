"use client";

import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="glass-panel mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2.5 md:px-6">
        <Link
          href="/"
          className="font-display text-2xl tracking-tight text-fantasy-200"
        >
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="type-caption text-vanilla-200/85 transition hover:text-rose-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <MagneticButton
          className="hidden sm:inline-flex"
          onClick={() => {
            document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Book Consultation
        </MagneticButton>
      </div>
    </header>
  );
}
