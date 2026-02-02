import { BaseUser } from "@/types/common";
import { create } from "zustand";

interface AuthStore {
    token: string | null;
    user: BaseUser | null;
    isAuthenticated: boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    logout: () => set({ user: null, isAuthenticated: false }),
}));

export const useAuth = () => {
    return useAuthStore();
}
