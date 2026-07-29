import { create } from "zustand";

type CursorLabel = "View" | "Play" | "Book" | null;

export type ToastPayload = {
  id: string;
  title?: string;
  message: string;
  type?: "success" | "error";
  durationMs?: number;
};

type ShowToastInput = Omit<ToastPayload, "id"> & { id?: string };

type UiState = {
  introComplete: boolean;
  cursorLabel: CursorLabel;
  modalOpen: boolean;
  toast: ToastPayload | null;
  setIntroComplete: (value: boolean) => void;
  setCursorLabel: (label: CursorLabel) => void;
  setModalOpen: (value: boolean) => void;
  showToast: (toast: ShowToastInput) => void;
  clearToast: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  introComplete: false,
  cursorLabel: null,
  modalOpen: false,
  toast: null,
  setIntroComplete: (introComplete) => set({ introComplete }),
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
  setModalOpen: (modalOpen) => set({ modalOpen, cursorLabel: null }),
  showToast: (toast) =>
    set({
      toast: {
        id: toast.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: "success",
        ...toast,
      },
    }),
  clearToast: () => set({ toast: null }),
}));
