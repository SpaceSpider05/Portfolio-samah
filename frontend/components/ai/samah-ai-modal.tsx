"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Maximize2,
  Minimize2,
  Minus,
  Settings2,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { AiTypingIndicator } from "@/components/ai/ai-typing-indicator";
import { SuggestedPrompts } from "@/components/ai/suggested-prompts";
import { GlassPanel } from "@/components/ui/glass-panel";
import { fetchAiSuggestions, sendAiChat } from "@/services/api/ai";
import { useAiStore } from "@/stores/ai-store";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

function formatTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function SamahAiModal() {
  const open = useAiStore((state) => state.open);
  const minimized = useAiStore((state) => state.minimized);
  const maximized = useAiStore((state) => state.maximized);
  const setOpen = useAiStore((state) => state.setOpen);
  const setMinimized = useAiStore((state) => state.setMinimized);
  const setMaximized = useAiStore((state) => state.setMaximized);
  const messages = useAiStore((state) => state.messages);
  const suggestions = useAiStore((state) => state.suggestions);
  const setSuggestions = useAiStore((state) => state.setSuggestions);
  const sessionId = useAiStore((state) => state.sessionId);
  const setSessionId = useAiStore((state) => state.setSessionId);
  const settings = useAiStore((state) => state.settings);
  const setLocale = useAiStore((state) => state.setLocale);
  const sending = useAiStore((state) => state.sending);
  const setSending = useAiStore((state) => state.setSending);
  const addMessage = useAiStore((state) => state.addMessage);
  const updateMessage = useAiStore((state) => state.updateMessage);
  const clearConversation = useAiStore((state) => state.clearConversation);
  const showToast = useUiStore((state) => state.showToast);

  const [draft, setDraft] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const visible = open && !minimized;

  const close = () => {
    setOpen(false);
    setShowSettings(false);
  };

  const minimize = () => {
    setMinimized(true);
    setShowSettings(false);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    let cancelled = false;

    fetchAiSuggestions(settings.locale)
      .then((result) => {
        if (!cancelled) {
          setSuggestions(result.suggestions);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSuggestions([
            "Which marketing service fits my business?",
            "Generate captions for my business.",
            "Book a consultation.",
          ]);
        }
      });

    window.setTimeout(() => inputRef.current?.focus(), 180);

    return () => {
      cancelled = true;
    };
  }, [visible, settings.locale, setSuggestions]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const node = scrollerRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [visible, messages, sending]);

  const send = async (text: string) => {
    let message = text.trim();
    if (!message || sending) {
      return;
    }

    if (/^\/book\b/i.test(message)) {
      message =
        "/book — I want to book a consultation. Please collect any missing details (name, email, phone, service, business) one by one, then create the booking.";
    }

    setError(null);
    setDraft("");
    addMessage({ role: "user", content: text.trim() });
    const assistantId = addMessage({ role: "assistant", content: "" });
    setSending(true);

    let assembled = "";

    try {
      await sendAiChat({
        message,
        sessionId,
        locale: settings.locale,
        stream: settings.stream,
        onMeta: (meta) => {
          setSessionId(meta.sessionId);
          if (meta.suggestions?.length) {
            setSuggestions(meta.suggestions);
          }
        },
        onToken: (token) => {
          assembled += token;
          updateMessage(
            assistantId,
            assembled.replace(/\[\[(PROFILE|LEAD|MEMORY):\{[\s\S]*?\}\]\]/g, "").trimStart(),
          );
        },
        onDone: (result) => {
          setSessionId(result.sessionId);
          updateMessage(assistantId, result.reply);
          if (result.suggestions?.length) {
            setSuggestions(result.suggestions);
          }
          if (result.bookingCreated) {
            showToast({
              type: "success",
              title: "Booking created",
              message: "Your request is saved. Check your email — we’ll follow up within 24 hours.",
            });
          }
        },
      });
    } catch (err) {
      updateMessage(
        assistantId,
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again or book a consultation.",
      );
      setError("Samah AI is unavailable right now.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && minimized ? (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => setMinimized(false)}
            className={cn(
              "glass-panel fixed z-[80] flex items-center gap-3 rounded-full px-4 py-3 text-left",
              "right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(5.75rem+env(safe-area-inset-bottom))] md:bottom-8 md:right-8",
              "border-fantasy-200/15 bg-tobago-900/95 shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
            )}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span>
              <span className="block text-sm text-heading">Samah AI</span>
              <span className="block text-xs text-muted">
                {sending ? "Typing…" : "Minimized — click to restore"}
              </span>
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible ? (
          <motion.div
            className={cn(
              "fixed inset-0 z-[80] flex p-3 sm:p-6",
              maximized ? "items-stretch justify-stretch" : "items-end justify-center sm:items-center",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Close Samah AI backdrop"
              className="absolute inset-0 bg-tobago-900/70 backdrop-blur-sm"
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="samah-ai-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative z-10 w-full",
                maximized ? "h-full max-w-none" : "max-w-lg",
              )}
            >
              <GlassPanel
                className={cn(
                  "flex flex-col overflow-hidden border-fantasy-200/15 bg-tobago-900/95 p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)]",
                  maximized ? "h-full rounded-3xl" : "h-[min(72vh,640px)]",
                )}
              >
                <header className="flex items-center justify-between gap-3 border-b border-fantasy-200/10 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-400/20 text-rose-300">
                      <Sparkles className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <h2 id="samah-ai-title" className="truncate text-sm font-medium text-heading">
                        Samah AI
                      </h2>
                      <p className="truncate text-xs text-muted">Digital marketing consultant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => setShowSettings((value) => !value)}
                      className="rounded-full p-2 text-fantasy-200/70 transition hover:bg-fantasy-200/10 hover:text-fantasy-100"
                      aria-label="AI settings"
                    >
                      <Settings2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={minimize}
                      className="rounded-full p-2 text-fantasy-200/70 transition hover:bg-fantasy-200/10 hover:text-fantasy-100"
                      aria-label="Minimize chat"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaximized(!maximized)}
                      className="rounded-full p-2 text-fantasy-200/70 transition hover:bg-fantasy-200/10 hover:text-fantasy-100"
                      aria-label={maximized ? "Restore chat size" : "Maximize chat"}
                    >
                      {maximized ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-full p-2 text-fantasy-200/70 transition hover:bg-fantasy-200/10 hover:text-fantasy-100"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </header>

                {showSettings ? (
                  <div className="border-b border-fantasy-200/10 px-4 py-3">
                    <p className="type-caption mb-2 text-muted">AI settings</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {([
                        ["en", "English"],
                        ["fr", "Français"],
                        ["ar", "العربية"],
                      ] as const).map(([code, label]) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setLocale(code)}
                          className={cn(
                            "rounded-full px-3 py-1.5 text-xs transition",
                            settings.locale === code
                              ? "bg-rose-400/20 text-rose-200"
                              : "bg-tobago-800 text-fantasy-200/80 hover:text-rose-200",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          clearConversation();
                          setError(null);
                        }}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-fantasy-200/80 transition hover:bg-fantasy-200/10 hover:text-rose-200"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear history
                      </button>
                    </div>
                  </div>
                ) : null}

                <div ref={scrollerRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="rounded-2xl border border-fantasy-200/10 bg-tobago-800/50 px-4 py-3">
                        <p className="text-sm text-heading">
                          Hi — I’m Samah AI, your digital marketing consultant.
                        </p>
                        <p className="mt-2 text-sm text-muted">
                          Ask about services, get recommendations, generate captions, or book a consultation.
                        </p>
                      </div>
                      <SuggestedPrompts
                        prompts={suggestions}
                        disabled={sending}
                        onSelect={(prompt) => void send(prompt)}
                      />
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex flex-col gap-1",
                          message.role === "user" ? "items-end" : "items-start",
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            maximized && "max-w-[70%]",
                            message.role === "user"
                              ? "bg-rose-400 text-tobago-900"
                              : "border border-fantasy-200/10 bg-tobago-800/70 text-fantasy-100",
                          )}
                        >
                          {message.content || (sending ? <AiTypingIndicator /> : null)}
                        </div>
                        <span className="px-1 text-[10px] uppercase tracking-wider text-muted">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    ))
                  )}

                  {messages.length > 0 && !sending ? (
                    <SuggestedPrompts
                      prompts={suggestions.slice(0, 4)}
                      disabled={sending}
                      onSelect={(prompt) => void send(prompt)}
                    />
                  ) : null}

                  {error ? (
                    <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-xs text-rose-200">
                      {error}{" "}
                      <Link href="/book" className="underline" onClick={close}>
                        Book instead
                      </Link>
                    </p>
                  ) : null}
                </div>

                <form
                  className="border-t border-fantasy-200/10 p-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void send(draft);
                  }}
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-fantasy-200/15 bg-tobago-800/70 p-2">
                    <textarea
                      ref={inputRef}
                      value={draft}
                      rows={1}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          void send(draft);
                        }
                      }}
                      placeholder="Ask Samah AI…"
                      className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fantasy-100 outline-none placeholder:text-fantasy-200/40"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !draft.trim()}
                      className="rounded-full bg-rose-400 px-4 py-2 text-xs font-medium text-tobago-900 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </GlassPanel>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
