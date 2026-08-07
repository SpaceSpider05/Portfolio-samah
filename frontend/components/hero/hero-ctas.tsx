"use client";

import { useRouter } from "next/navigation";
import { LANDING } from "@/constants/landing";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function HeroCtas() {
  const router = useRouter();

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <MagneticButton onClick={() => router.push("/book")}>
        {LANDING.hero.primaryCta}
      </MagneticButton>
      <MagneticButton
        variant="secondary"
        cursorLabel="View"
        onClick={() =>
          document
            .querySelector("#portfolio")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        {LANDING.hero.secondaryCta}
      </MagneticButton>
    </div>
  );
}
