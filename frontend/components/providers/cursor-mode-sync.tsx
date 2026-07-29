"use client";

import { useEffect } from "react";
import { useAiStore } from "@/stores/ai-store";
import { useUiStore } from "@/stores/ui-store";

/**
 * Keeps system/custom cursor mode in sync with AI (and other) overlays.
 * While a blocking modal is open: show system cursor.
 * When closed: restore custom cursor mode (cursor: none + CustomCursor).
 */
export function CursorModeSync() {
  const modalOpen = useUiStore((state) => state.modalOpen);
  const aiOpen = useAiStore((state) => state.open);
  const aiMinimized = useAiStore((state) => state.minimized);
  const setModalOpen = useUiStore((state) => state.setModalOpen);

  // Keep ui.modalOpen aligned with a full AI overlay (not minimized).
  useEffect(() => {
    const blocking = aiOpen && !aiMinimized;
    setModalOpen(blocking);
  }, [aiOpen, aiMinimized, setModalOpen]);

  useEffect(() => {
    const root = document.querySelector(".cursor-none-desktop");
    const targets = [root, document.documentElement, document.body].filter(
      (node): node is Element => Boolean(node),
    );

    const apply = (open: boolean) => {
      for (const target of targets) {
        target.classList.toggle("modal-open", open);
      }
    };

    apply(modalOpen);

    return () => {
      // Only clear on unmount — not on every modalOpen toggle (that caused flicker/races).
    };
  }, [modalOpen]);

  useEffect(() => {
    return () => {
      document.querySelector(".cursor-none-desktop")?.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
    };
  }, []);

  return null;
}
