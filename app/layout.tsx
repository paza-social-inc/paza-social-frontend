import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import Providers from "@/providers/Providers";
import { Analytics } from "@/components/Analytics";
import { siteConfig, absoluteUrl } from "@/lib/seo";

export const metadata = {
    metadataBase: new URL(siteConfig.url),
    title: {
        default: siteConfig.name,
        template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    openGraph: {
        type: "website",
        locale: "en_US",
        url: siteConfig.url,
        siteName: siteConfig.name,
        title: siteConfig.name,
        description: siteConfig.description,
        images: siteConfig.ogImagePath
            ? [{ url: absoluteUrl(siteConfig.ogImagePath), width: 1200, height: 630, alt: siteConfig.name }]
            : [],
    },
    twitter: {
        card: "summary_large_image",
        title: siteConfig.name,
        description: siteConfig.description,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className="font-sans antialiased"
            >
                <Providers
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                    storageKey="paza-theme"
                >
                    {children}
                </Providers>
                <Analytics />
            </body>
        </html>
    );
}
