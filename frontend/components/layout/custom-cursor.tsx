"use client";

import { useEffect, useRef, useState } from "react";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const lastPointer = { x: 0, y: 0, seen: false };

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const label = useUiStore((s) => s.cursorLabel);
  const modalOpen = useUiStore((s) => s.modalOpen);
  const labelRef = useRef(label);
  const posRef = useRef({ x: lastPointer.x, y: lastPointer.y });
  const pressedRef = useRef(false);
  const visibleRef = useRef(lastPointer.seen);
  const rafRef = useRef<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  labelRef.current = label;

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    setFinePointer(mq.matches);

    const onChange = () => setFinePointer(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!finePointer || modalOpen) {
      return;
    }

    const paint = () => {
      rafRef.current = null;
      const { x, y } = posRef.current;
      const pressed = pressedRef.current;
      const visible = visibleRef.current;
      const hasLabel = Boolean(labelRef.current);

      if (dotRef.current) {
        const scale = pressed ? 0.5 : 1;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        dotRef.current.style.opacity = visible ? "1" : "0";
      }

      if (ringRef.current) {
        const scale = pressed ? (hasLabel ? 0.9 : 0.75) : 1;
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = visible ? "1" : "0";
      }
    };

    const schedulePaint = () => {
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(paint);
    };

    const move = (event: MouseEvent) => {
      posRef.current = { x: event.clientX, y: event.clientY };
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      lastPointer.seen = true;
      visibleRef.current = true;
      schedulePaint();
    };

    const hide = () => {
      visibleRef.current = false;
      pressedRef.current = false;
      schedulePaint();
    };

    const onDown = () => {
      pressedRef.current = true;
      schedulePaint();
    };

    const onUp = () => {
      pressedRef.current = false;
      schedulePaint();
    };

    // Restore immediately after modal close (don't wait for next mousemove).
    if (lastPointer.seen) {
      posRef.current = { x: lastPointer.x, y: lastPointer.y };
      visibleRef.current = true;
    }

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", hide);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    schedulePaint();

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [finePointer, modalOpen]);

  // Keep tracking pointer position even while modal is open, so cursor returns instantly.
  useEffect(() => {
    if (!finePointer || !modalOpen) {
      return;
    }

    const track = (event: MouseEvent) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      lastPointer.seen = true;
    };

    window.addEventListener("mousemove", track, { passive: true });
    return () => window.removeEventListener("mousemove", track);
  }, [finePointer, modalOpen]);

  if (!finePointer || modalOpen) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-rose-400 opacity-0 shadow-[0_0_18px_6px_color-mix(in_oklab,var(--rose-400)_55%,transparent)] will-change-transform"
      />
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border border-rose-400/70 text-[10px] font-medium uppercase tracking-[0.2em] text-fantasy-100 opacity-0 will-change-transform",
          "transition-[width,height,background-color] duration-200",
          label ? "h-20 w-20 bg-rose-400/25" : "h-8 w-8 bg-transparent",
        )}
      >
        {label}
      </div>
    </>
  );
}
