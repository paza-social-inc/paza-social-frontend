"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function useActiveTab(name: string, defaultTab: string) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const currentTab = searchParams.get(name) || defaultTab;

    const setTab = (tab: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set(name, tab);

        // update the URL without reload
        router.replace(`?${newParams.toString()}`);
    };

    return [currentTab, setTab] as const;
}
