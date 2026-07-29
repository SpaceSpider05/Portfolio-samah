"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND, NAV_LINKS } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { getSectionIdFromHref, useNavLinks } from "@/hooks/use-nav-links";
import { cn } from "@/lib/utils";

type SiteFooterProps = {
  contactEmail?: string;
  contactPhone?: string | null;
};

export function SiteFooter({
  contactEmail = BRAND.email,
  contactPhone = BRAND.phone,
}: SiteFooterProps) {
  const router = useRouter();
  const { onHashLinkClick, isLinkActive } = useNavLinks();

  return (
    <footer id="contact" className="section-pad border-t border-border bg-tobago-800 text-fantasy-100">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl">{BRAND.name}</p>
          <p className="mt-3 max-w-md text-fantasy-200/75">{BRAND.subtitle}</p>
          <MagneticButton className="mt-6" onClick={() => router.push("/book")}>
            Start a Project
          </MagneticButton>
        </div>

        <div>
          <p className="type-overline mb-4 text-rose-300">Navigate</p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              const sectionId = getSectionIdFromHref(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={
                      sectionId
                        ? (event) => onHashLinkClick(event, link.href)
                        : undefined
                    }
                    className={cn(
                      "transition active:scale-95 active:text-rose-200",
                      active
                        ? "text-rose-300"
                        : "text-fantasy-200/80 hover:text-rose-300",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="type-overline mb-4 text-rose-300">Connect</p>
          <ul className="space-y-2 text-fantasy-200/80">
            <li>
              <a href={`mailto:${contactEmail}`} className="transition hover:text-rose-300 active:text-rose-200">
                {contactEmail}
              </a>
            </li>
            {contactPhone ? (
              <li>
                <a
                  href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                  className="transition hover:text-rose-300 active:text-rose-200"
                >
                  {contactPhone}
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={BRAND.socials.linkedin}
                className="transition hover:text-rose-300 active:text-rose-200"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={BRAND.socials.instagram}
                className="transition hover:text-rose-300 active:text-rose-200"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={BRAND.socials.whatsapp}
                className="transition hover:text-rose-300 active:text-rose-200"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </li>
          </ul>

          <p className="mt-6 text-sm text-fantasy-200/65">
            Prefer a quick chat?{" "}
            <Link href="/book" className="text-rose-300 transition hover:text-rose-200 active:text-rose-100">
              Book a free consultation →
            </Link>
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-3 border-t border-fantasy-200/10 pt-6 text-sm text-fantasy-200/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
        <Link href="/privacy" className="transition hover:text-rose-300 active:text-rose-200">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
