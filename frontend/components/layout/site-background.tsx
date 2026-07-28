"use client";

export function SiteBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-tobago-800 via-tobago-700 to-tobago-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--rose-400)_18%,transparent),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--vanilla-200)_08%,transparent),transparent_50%)]" />
      <div className="aurora-bg">
        <div
          className="aurora-blob h-[42vw] w-[42vw] bg-rose-500/25"
          style={{ top: "-8%", left: "-6%" }}
        />
        <div
          className="aurora-blob h-[36vw] w-[36vw] bg-vanilla-400/15"
          style={{ top: "20%", right: "-10%", animationDelay: "-6s" }}
        />
        <div
          className="aurora-blob h-[30vw] w-[30vw] bg-silver-500/15"
          style={{ bottom: "-5%", left: "30%", animationDelay: "-12s" }}
        />
      </div>
      <div className="noise-overlay" />
    </div>
  );
}
