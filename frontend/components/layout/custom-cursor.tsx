"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const lastPointer = { x: 0, y: 0, seen: false };

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const label = useUiStore((s) => s.cursorLabel);
  const modalOpen = useUiStore((s) => s.modalOpen);
  const labelRef = useRef(label);
  const modalOpenRef = useRef(modalOpen);
  const pressedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  labelRef.current = label;
  modalOpenRef.current = modalOpen;

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (!finePointer) {
      document.documentElement.removeAttribute("data-custom-cursor");
      return;
    }

    // System cursor while modal is open; custom cursor otherwise.
    if (modalOpen) {
      document.documentElement.removeAttribute("data-custom-cursor");
      document.documentElement.classList.add("modal-open");
      document.body.classList.add("modal-open");
      document.querySelector(".cursor-none-desktop")?.classList.add("modal-open");
    } else {
      document.documentElement.setAttribute("data-custom-cursor", "on");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.querySelector(".cursor-none-desktop")?.classList.remove("modal-open");
    }
  }, [finePointer, modalOpen]);

  useEffect(() => {
    if (!finePointer) {
      return;
    }

    const paint = () => {
      rafRef.current = null;
      const { x, y } = lastPointer;
      const pressed = pressedRef.current;
      const hidden = modalOpenRef.current;
      const hasLabel = Boolean(labelRef.current);

      if (dotRef.current) {
        const scale = pressed ? 0.5 : 1;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        dotRef.current.style.opacity = hidden ? "0" : "1";
      }

      if (ringRef.current) {
        // Base ring is 32px; labeled state visually ~80px via scale(2.5).
        const labelScale = hasLabel ? 2.5 : 1;
        const pressScale = pressed ? (hasLabel ? 0.9 : 0.75) : 1;
        const scale = labelScale * pressScale;
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = hidden ? "0" : "1";
        ringRef.current.style.backgroundColor = hasLabel
          ? "color-mix(in oklab, var(--rose-400) 25%, transparent)"
          : "transparent";
      }
    };

    const schedulePaint = () => {
      if (rafRef.current !== null) {
        return;
      }
      rafRef.current = window.requestAnimationFrame(paint);
    };

    const move = (event: MouseEvent) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      lastPointer.seen = true;
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

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    schedulePaint();
    const kick = window.requestAnimationFrame(() => {
      schedulePaint();
    });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.cancelAnimationFrame(kick);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [finePointer]);

  // Re-paint when label / modal state changes without rebinding pointer listeners.
  useEffect(() => {
    if (!finePointer) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      const { x, y } = lastPointer;
      const pressed = pressedRef.current;
      const hidden = modalOpen;
      const hasLabel = Boolean(label);

      if (dotRef.current) {
        const scale = pressed ? 0.5 : 1;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        dotRef.current.style.opacity = hidden ? "0" : "1";
      }

      if (ringRef.current) {
        const labelScale = hasLabel ? 2.5 : 1;
        const pressScale = pressed ? (hasLabel ? 0.9 : 0.75) : 1;
        const scale = labelScale * pressScale;
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.style.opacity = hidden ? "0" : "1";
        ringRef.current.style.backgroundColor = hasLabel
          ? "color-mix(in oklab, var(--rose-400) 25%, transparent)"
          : "transparent";
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [finePointer, label, modalOpen]);

  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-custom-cursor");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
      document.querySelector(".cursor-none-desktop")?.classList.remove("modal-open");
    };
  }, []);

  if (!finePointer) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-rose-400 opacity-0 shadow-[0_0_18px_6px_color-mix(in_oklab,var(--rose-400)_55%,transparent)] will-change-transform"
        style={{ opacity: modalOpen ? 0 : 1 }}
      />
      <div
        ref={ringRef}
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-[100] flex h-8 w-8 items-center justify-center rounded-full border border-rose-400/70 text-[10px] font-medium tracking-[0.2em] text-fantasy-100 uppercase opacity-0 will-change-transform",
          "transition-[background-color] duration-200",
        )}
        style={{ opacity: modalOpen ? 0 : 1 }}
      >
        {/* Counter-scale text so label stays readable when ring grows */}
        <span
          className="will-change-transform"
          style={{ transform: label ? "scale(0.4)" : "scale(1)" }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
