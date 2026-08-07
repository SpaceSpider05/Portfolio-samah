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
  /** Pull toward pointer. Disable inside hover-expand cards to avoid stuck cursor. */
  magnetic?: boolean;
  /** When false, parent owns cursor label lifecycle. */
  manageCursorLabel?: boolean;
  asChild?: boolean;
};

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  function MagneticButton(
    {
      className,
      variant = "primary",
      cursorLabel = "Book",
      magnetic = true,
      manageCursorLabel = true,
      children,
      onMouseMove,
      onMouseLeave,
      onMouseEnter,
      ...props
    },
    ref,
  ) {
    const localRef = useRef<HTMLButtonElement | null>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const rafMoveRef = useRef<number | null>(null);
    const pendingPoint = useRef<{ x: number; y: number } | null>(null);
    const setCursorLabel = useUiStore((s) => s.setCursorLabel);

    const assignRef = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const applyMagnetic = () => {
      rafMoveRef.current = null;
      const el = localRef.current;
      const point = pendingPoint.current;
      const rect = rectRef.current;
      if (!el || !point || !rect) {
        return;
      }

      const x = point.x - rect.left - rect.width / 2;
      const y = point.y - rect.top - rect.height / 2;
      el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.22}px, 0)`;
    };

    const handleMove = (event: MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || window.matchMedia("(pointer: coarse)").matches) {
        onMouseMove?.(event);
        return;
      }

      pendingPoint.current = { x: event.clientX, y: event.clientY };
      if (rafMoveRef.current === null) {
        rafMoveRef.current = window.requestAnimationFrame(applyMagnetic);
      }
      onMouseMove?.(event);
    };

    const handleLeave = (event: MouseEvent<HTMLButtonElement>) => {
      const el = localRef.current;
      if (el) {
        el.style.transform = "translate3d(0, 0, 0)";
      }
      rectRef.current = null;
      pendingPoint.current = null;
      if (rafMoveRef.current !== null) {
        window.cancelAnimationFrame(rafMoveRef.current);
        rafMoveRef.current = null;
      }
      if (manageCursorLabel) {
        setCursorLabel(null);
      }
      onMouseLeave?.(event);
    };

    const handleEnter = (event: MouseEvent<HTMLButtonElement>) => {
      rectRef.current = localRef.current?.getBoundingClientRect() ?? null;
      if (manageCursorLabel) {
        setCursorLabel(cursorLabel);
      }
      onMouseEnter?.(event);
    };

    return (
      <button
        ref={assignRef}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[background-color,color,transform] duration-300 will-change-transform active:scale-[0.97]",
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
        <span className="pointer-events-none absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-active:opacity-100" />
        {children}
      </button>
    );
  },
);
