"use client";

import {
  forwardRef,
  useRef,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  cursorLabel?: "View" | "Play" | "Book";
  asChild?: boolean;
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      className,
      variant = "primary",
      cursorLabel = "Book",
      children,
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
      ...props
    },
    ref,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const setCursorLabel = useUiStore((s) => s.setCursorLabel);

    const assignRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
      const el = localRef.current;
      if (!el) {
        return;
      }

      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
      onMouseMove?.(event);
    };

    const handleLeave = (event: MouseEvent<HTMLButtonElement>) => {
      const el = localRef.current;
      if (el) {
        el.style.transform = "translate3d(0, 0, 0)";
      }
      setCursorLabel(null);
      onMouseLeave?.(event);
    };

    const handleEnter = (event: MouseEvent<HTMLButtonElement>) => {
      setCursorLabel(cursorLabel);
      onMouseEnter?.(event);
    };

    return (
      <button
        ref={assignRef}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[box-shadow,background-color,color] duration-300 will-change-transform",
          variant === "primary" &&
            "bg-rose-400 text-tobago-800 shadow-[0_10px_30px_color-mix(in_oklab,var(--rose-400)_35%,transparent)] hover:bg-rose-500",
          variant === "secondary" &&
            "glass-panel text-foreground hover:border-rose-300",
          variant === "ghost" &&
            "bg-transparent text-fantasy-200 hover:bg-tobago-600/50",
          className,
        )}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onMouseEnter={handleEnter}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-active:opacity-100" />
        {children}
      </button>
    );
  },
);
