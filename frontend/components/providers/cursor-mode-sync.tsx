"use client";

import { useLayoutEffect } from "react";
import { useAiStore } from "@/stores/ai-store";
import { useUiStore } from "@/stores/ui-store";

/** Syncs AI overlay open state into ui.modalOpen (drives cursor mode). */
export function CursorModeSync() {
  const aiOpen = useAiStore((state) => state.open);
  const aiMinimized = useAiStore((state) => state.minimized);
  const setModalOpen = useUiStore((state) => state.setModalOpen);

  useLayoutEffect(() => {
    const blocking = aiOpen && !aiMinimized;
    setModalOpen(blocking);
  }, [aiOpen, aiMinimized, setModalOpen]);

  return null;
}
