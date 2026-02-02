import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";

const fontSans = Geist({
    variable: "--font-sans",
    subsets: ["latin"],
});

const fontMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

const Jarkata = Plus_Jakarta_Sans({
    variable: "--font-jarkata",
    subsets: ['latin']
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark scheme-only-dark">
            <body
                className={`${fontSans.variable} ${fontMono.variable} ${Jarkata.variable} font-sans antialiased`}
            >
                <Providers attribute="class">
                    {children}
                </Providers>
            </body>
        </html>
    );
}
