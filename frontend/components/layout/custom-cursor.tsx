"use client";

import { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const label = useUiStore((s) => s.cursorLabel);
  const modalOpen = useUiStore((s) => s.modalOpen);
  const [visible, setVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFinePointer(mq.matches);

    const onChange = () => setFinePointer(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!finePointer) {
      return;
    }

    const move = (event: MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      setVisible(true);
    };

    const hide = () => setVisible(false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseleave", hide);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", hide);
    };
  }, [finePointer]);

  if (!finePointer || modalOpen) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-[0_0_18px_6px_color-mix(in_oklab,var(--rose-400)_55%,transparent)] transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-rose-400/70 text-[10px] font-medium uppercase tracking-[0.2em] text-fantasy-100 transition-[width,height,background-color,opacity] duration-300",
          label
            ? "h-20 w-20 bg-rose-400/30 backdrop-blur-sm"
            : "h-8 w-8 bg-transparent",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </div>
    </>
  );
}
