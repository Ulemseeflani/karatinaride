import { create } from "zustand";
import type { Role } from "../backend";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  role: Role | null;
  principal: string | null;
  isRegistered: boolean;
  setUser: (user: User) => void;
  setRole: (role: Role) => void;
  setPrincipal: (principal: string) => void;
  setRegistered: (registered: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  principal: null,
  isRegistered: false,
  setUser: (user) => set({ user, role: user.role, isRegistered: true }),
  setRole: (role) => set({ role }),
  setPrincipal: (principal) => set({ principal }),
  setRegistered: (isRegistered) => set({ isRegistered }),
  logout: () =>
    set({ user: null, role: null, principal: null, isRegistered: false }),
}));
