import { cn } from "@/lib/utils";

type SectionDividerProps = {
  className?: string;
  label?: string;
};

export function SectionDivider({ className, label }: SectionDividerProps) {
  return (
    <div
      aria-hidden={!label}
      className={cn(
        "relative mx-auto flex max-w-6xl items-center gap-4 px-[clamp(1.25rem,4vw,3rem)] py-2",
        className,
      )}
    >
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-rose-400/70 to-silver-400/40" />
      <div className="relative flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-rose-400/20" />
        <span className="h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_16px_color-mix(in_oklab,var(--rose-400)_70%,transparent)]" />
      </div>
      {label ? (
        <p className="type-overline whitespace-nowrap text-rose-300">{label}</p>
      ) : null}
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-rose-400/70 to-silver-400/40" />
    </div>
  );
}
