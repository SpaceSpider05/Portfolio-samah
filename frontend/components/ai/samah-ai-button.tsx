"use client";

import { Sparkles } from "lucide-react";
import { useAiStore } from "@/stores/ai-store";
import { cn } from "@/lib/utils";

export function SamahAiButton() {
  const open = useAiStore((state) => state.open);
  const minimized = useAiStore((state) => state.minimized);
  const setOpen = useAiStore((state) => state.setOpen);
  const setMinimized = useAiStore((state) => state.setMinimized);

  const onClick = () => {
    if (open && minimized) {
      setMinimized(false);
      return;
    }
    setOpen(!open);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open && !minimized ? "Close Samah AI" : "Open Samah AI"}
      aria-expanded={open && !minimized}
      className={cn(
        "fixed z-[70] flex h-14 w-14 items-center justify-center rounded-full",
        "bg-rose-400 text-tobago-800 shadow-[0_16px_40px_color-mix(in_oklab,var(--rose-400)_45%,transparent)]",
        "transition hover:bg-rose-500 active:scale-95",
        "right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-8",
        open && !minimized && "pointer-events-none opacity-0",
      )}
    >
      <Sparkles className="h-5 w-5" aria-hidden />
    </button>
  );
}
