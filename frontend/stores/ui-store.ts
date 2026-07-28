import { create } from "zustand";

type CursorLabel = "View" | "Play" | "Book" | null;

type UiState = {
  introComplete: boolean;
  cursorLabel: CursorLabel;
  modalOpen: boolean;
  setIntroComplete: (value: boolean) => void;
  setCursorLabel: (label: CursorLabel) => void;
  setModalOpen: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  introComplete: false,
  cursorLabel: null,
  modalOpen: false,
  setIntroComplete: (introComplete) => set({ introComplete }),
  setCursorLabel: (cursorLabel) => set({ cursorLabel }),
  setModalOpen: (modalOpen) => set({ modalOpen, cursorLabel: null }),
}));
