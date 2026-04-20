import { BaseUser } from "@/types/common";
import {
  decodeJwtPayload,
  getAccountTypeFromPayload,
  getEmailFromPayload,
  getUserIdStringFromPayload,
} from "@/lib/jwtPayload";
import { create } from "zustand";

interface AuthStore {
    token: string | null;
    user: BaseUser | null;
    isAuthenticated: boolean;
    setAuth: (token: string | null, user: BaseUser | null) => void;
    rehydrate: () => void;
    logout: () => void;
}

function decodeJwtUserId(token: string): number | null {
    const payload = decodeJwtPayload(token);
    const idStr = getUserIdStringFromPayload(payload);
    if (!idStr) return null;
    const n = Number(idStr);
    return Number.isFinite(n) ? n : null;
}

function userFromToken(token: string): BaseUser | null {
    const payload = decodeJwtPayload(token);
    const userId = decodeJwtUserId(token);
    if (userId == null) return null;
    const accountType = getAccountTypeFromPayload(payload);
    return {
        id: String(userId),
        email: getEmailFromPayload(payload) || "",
        accountType: accountType || undefined,
    };
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,
    setAuth: (token, user) =>
        set({
            token,
            user,
            isAuthenticated: !!(token && user),
        }),
    rehydrate: () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        if (!token) return;
        const user = userFromToken(token);
        if (user != null)
            set({
                token,
                user,
                isAuthenticated: true,
            });
    },
    logout: () => set({ token: null, user: null, isAuthenticated: false }),
}));

export const useAuth = () => {
    return useAuthStore();
};
