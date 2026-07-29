"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function ToastHost() {
  const toast = useUiStore((state) => state.toast);
  const clearToast = useUiStore((state) => state.clearToast);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer = window.setTimeout(() => {
      clearToast();
    }, toast.durationMs ?? 4500);

    return () => window.clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[max(5.5rem,env(safe-area-inset-top))] z-[120] flex justify-center px-4 md:top-24"
    >
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            role="status"
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.35)]",
              toast.type === "success"
                ? "border-silver-400/30 bg-tobago-800/95 text-fantasy-100"
                : "border-rose-400/40 bg-tobago-800/95 text-rose-100",
            )}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" aria-hidden />
            ) : null}
            <div className="min-w-0 flex-1">
              {toast.title ? (
                <p className="text-sm font-medium text-heading">{toast.title}</p>
              ) : null}
              <p className={cn("text-sm text-muted", toast.title && "mt-0.5")}>{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="rounded-full p-1 text-fantasy-200/60 transition hover:bg-fantasy-200/10 hover:text-fantasy-100 active:scale-95"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
