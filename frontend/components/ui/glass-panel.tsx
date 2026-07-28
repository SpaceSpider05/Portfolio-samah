import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type GlassPanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassPanel({ children, className, ...props }: GlassPanelProps) {
  return (
    <div className={cn("glass-panel rounded-[var(--radius-lg)]", className)} {...props}>
      {children}
    </div>
  );
}
