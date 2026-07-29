"use client";

import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminLoadingStateProps = {
  label?: string;
  className?: string;
};

export function AdminLoadingState({
  label = "Loading…",
  className,
}: AdminLoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[40vh] flex-col items-center justify-center gap-4 py-16",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/20" />
        <span className="absolute inset-1 rounded-full border border-rose-400/25" />
        <LoaderCircle className="relative h-7 w-7 animate-spin text-rose-300" />
      </div>
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
