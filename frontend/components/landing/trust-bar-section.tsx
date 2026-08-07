import { LANDING } from "@/constants/landing";
import { TRUST_BRAND_ICONS } from "@/components/landing/trust-brand-icons";

export function TrustBarSection() {
  const brands = LANDING.trust.brands;
  const loop = [...brands, ...brands];

  return (
    <section
      id="trust"
      className="overflow-hidden border-y border-border/60 bg-tobago-800/35 py-8 md:py-10"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className="type-overline text-center text-rose-300">
          {LANDING.trust.label}
        </p>
      </div>

      <div className="trust-marquee relative mt-7">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-[color-mix(in_oklab,var(--tobago-800)_90%,transparent)] to-transparent md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-[color-mix(in_oklab,var(--tobago-800)_90%,transparent)] to-transparent md:w-24" />

        <div className="trust-marquee-track flex w-max items-center gap-4 md:gap-6">
          {loop.map((brand, index) => {
            const Icon =
              TRUST_BRAND_ICONS[brand as keyof typeof TRUST_BRAND_ICONS];

            return (
              <div
                key={`${brand}-${index}`}
                className="flex min-w-[9.5rem] items-center gap-3 rounded-full border border-silver-400/15 bg-tobago-900/35 px-4 py-3 text-fantasy-100/80 md:min-w-[11rem]"
              >
                {Icon ? (
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-400/10 text-rose-300">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : null}
                <span className="font-display text-base tracking-wide md:text-lg">
                  {brand}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
