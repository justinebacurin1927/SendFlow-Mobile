import { create } from "zustand";
import { authApi } from "../api/auth";
import type { User } from "../types";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  register: async (name, email, password) => {
    const { data } = await authApi.register(name, email, password);
    set({ token: data.token, user: data.user, isAuthenticated: true });
  },

  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      const { data } = await authApi.user();
      set({ user: data, isAuthenticated: true });
    } catch {
      set({ token: null, user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
