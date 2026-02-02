import {create} from "zustand";

interface AppStore {
    isOnline: boolean;
    setIsOnline: (isOnline: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    isOnline: false,
    setIsOnline: (isOnline) => set({isOnline}),
}));

export const useApp = () => {
    return useAppStore();
};