"use client";

import { create } from "zustand";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
};

type AdminAuthState = {
  email: string | null;
  name: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  email: null,
  name: null,
  isAuthenticated: false,

  hydrate: async () => {
    try {
      const response = await fetch("/api/admin/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        set({ isAuthenticated: false, email: null, name: null });
        return;
      }

      const user = (await response.json()) as AdminUser;
      set({
        isAuthenticated: true,
        email: user.email,
        name: user.name,
      });
    } catch {
      set({ isAuthenticated: false, email: null, name: null });
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        message?: string;
        user?: AdminUser;
      };

      if (!response.ok || !payload.user) {
        return {
          ok: false,
          error: payload.message ?? "Invalid email or password.",
        };
      }

      set({
        isAuthenticated: true,
        email: payload.user.email,
        name: payload.user.name,
      });

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "Cannot reach auth service. Is Laravel running?",
      };
    }
  },

  logout: async () => {
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        cache: "no-store",
      });
    } catch {
      // ignore
    }

    set({ isAuthenticated: false, email: null, name: null });
  },
}));
