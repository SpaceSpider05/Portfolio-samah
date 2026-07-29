export function SiteBackground({ lite = false }: { lite?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-tobago-800 via-tobago-700 to-tobago-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklab,var(--rose-400)_14%,transparent),transparent_55%)]" />
      {!lite ? (
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_bottom_left,color-mix(in_oklab,var(--vanilla-200)_06%,transparent),transparent_50%)] md:block" />
      ) : null}
      {!lite ? (
        <div className="aurora-bg hidden md:block">
          <div
            className="aurora-blob h-[36vw] w-[36vw] bg-rose-500/20"
            style={{ top: "-8%", left: "-6%" }}
          />
          <div
            className="aurora-blob h-[30vw] w-[30vw] bg-vanilla-400/12"
            style={{ top: "22%", right: "-10%", animationDelay: "-6s" }}
          />
        </div>
      ) : null}
      {!lite ? <div className="noise-overlay hidden md:block opacity-[0.045]" /> : null}
    </div>
  );
}
