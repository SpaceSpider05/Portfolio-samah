"use client";

import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function SiteFooter() {
  return (
    <footer id="contact" className="section-pad border-t border-border bg-tobago-800 text-fantasy-100">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl">{BRAND.name}</p>
          <p className="mt-3 max-w-md text-fantasy-200/75">{BRAND.subtitle}</p>
          <MagneticButton
            className="mt-6"
            onClick={() => {
              document.querySelector("#top")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Start a Project
          </MagneticButton>
        </div>

        <div>
          <p className="type-overline mb-4 text-rose-300">Navigate</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-fantasy-200/80 transition hover:text-rose-300">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="type-overline mb-4 text-rose-300">Connect</p>
          <ul className="space-y-2 text-fantasy-200/80">
            <li>
              <a href={`mailto:${BRAND.email}`} className="hover:text-rose-300">
                {BRAND.email}
              </a>
            </li>
            <li>
              <a href={BRAND.socials.linkedin} className="hover:text-rose-300">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={BRAND.socials.instagram} className="hover:text-rose-300">
                Instagram
              </a>
            </li>
            <li>
              <a href={BRAND.socials.whatsapp} className="hover:text-rose-300">
                WhatsApp
              </a>
            </li>
          </ul>

          <form
            className="mt-6 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <label className="sr-only" htmlFor="newsletter">
              Newsletter email
            </label>
            <input
              id="newsletter"
              type="email"
              required
              placeholder="Email for insights"
              className="w-full rounded-full border border-fantasy-200/20 bg-tobago-700 px-4 py-2.5 text-sm text-fantasy-100 outline-none placeholder:text-fantasy-200/40 focus:border-rose-400"
            />
            <button
              type="submit"
              className="rounded-full bg-rose-400 px-4 py-2.5 text-sm font-medium text-tobago-800"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-fantasy-200/10 pt-6 text-sm text-fantasy-200/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <Link href="/privacy" className="hover:text-rose-300">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
