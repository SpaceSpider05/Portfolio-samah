"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AiMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
};

type AiSettings = {
  locale: "en" | "fr" | "ar";
  stream: boolean;
};

type AiState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  sessionId: string | null;
  messages: AiMessage[];
  suggestions: string[];
  settings: AiSettings;
  sending: boolean;
  setOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setMaximized: (maximized: boolean) => void;
  setSessionId: (sessionId: string | null) => void;
  setSuggestions: (suggestions: string[]) => void;
  setSending: (sending: boolean) => void;
  setLocale: (locale: AiSettings["locale"]) => void;
  addMessage: (message: Omit<AiMessage, "id" | "createdAt"> & { id?: string }) => string;
  updateMessage: (id: string, content: string) => void;
  clearConversation: () => void;
};

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAiStore = create<AiState>()(
  persist(
    (set) => ({
      open: false,
      minimized: false,
      maximized: false,
      sessionId: null,
      messages: [],
      suggestions: [],
      settings: { locale: "en", stream: true },
      sending: false,
      setOpen: (open) =>
        set(
          open
            ? { open: true, minimized: false }
            : { open: false, minimized: false, maximized: false },
        ),
      setMinimized: (minimized) =>
        set(
          minimized
            ? { minimized: true, maximized: false, open: true }
            : { minimized: false },
        ),
      setMaximized: (maximized) =>
        set(
          maximized
            ? { maximized: true, minimized: false, open: true }
            : { maximized: false },
        ),
      setSessionId: (sessionId) => set({ sessionId }),
      setSuggestions: (suggestions) => set({ suggestions }),
      setSending: (sending) => set({ sending }),
      setLocale: (locale) =>
        set((state) => ({ settings: { ...state.settings, locale } })),
      addMessage: (message) => {
        const id = message.id ?? createId();
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id,
              role: message.role,
              content: message.content,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return id;
      },
      updateMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((item) =>
            item.id === id ? { ...item, content } : item,
          ),
        })),
      clearConversation: () =>
        set({
          sessionId: null,
          messages: [],
        }),
    }),
    {
      name: "samah-ai-chat",
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages.slice(-40),
        settings: state.settings,
        maximized: state.maximized,
      }),
    },
  ),
);
