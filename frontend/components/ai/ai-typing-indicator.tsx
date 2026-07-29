"use client";

import { cn } from "@/lib/utils";

export function AiTypingIndicator({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center gap-1.5 px-1 py-1", className)}
      aria-label="Samah AI is typing"
    >
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-300"
          style={{ animationDelay: `${dot * 160}ms` }}
        />
      ))}
    </div>
  );
}
