import { create } from "zustand";

type NavState = {
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
};

export const useNavStore = create<NavState>((set) => ({
  activeSection: null,
  setActiveSection: (activeSection) => set({ activeSection }),
}));
