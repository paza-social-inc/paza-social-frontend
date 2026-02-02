"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { Toaster } from "react-hot-toast";


export const queryClient = new QueryClient();

export default function Providers({ children, ...props }: ThemeProviderProps) {



    return (
        <ThemeProvider {...props}>
            <QueryClientProvider client={queryClient}>
                <TanStackDevtools />
                {children}
            </QueryClientProvider>
            <Toaster position="top-center" toastOptions={{
                className : "!px-6 p-4 min-h-14 dark:bg-black justify-start bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
            }}/>
        </ThemeProvider>
    )
}
