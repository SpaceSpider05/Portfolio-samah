"use client";

import { useRouter } from "next/navigation";
import { LANDING } from "@/constants/landing";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function FinalCtaSection() {
  const router = useRouter();

  return (
    <section id="final-cta" className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[2rem] border border-rose-400/25 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--rose-400)_18%,transparent),transparent_55%),color-mix(in_oklab,var(--tobago-800)_88%,transparent)] px-6 py-14 text-center md:px-12 md:py-20">
          <p className="type-overline text-rose-300">Next step</p>
          <h2 className="type-h2 mx-auto mt-4 max-w-2xl text-heading">
            {LANDING.finalCta.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted md:text-lg">
            {LANDING.finalCta.description}
          </p>
          <div className="mt-8 flex justify-center">
            <MagneticButton onClick={() => router.push("/book")}>
              {LANDING.finalCta.button}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
