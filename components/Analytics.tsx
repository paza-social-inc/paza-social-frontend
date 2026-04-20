"use client";

import Script from "next/script";

/**
 * Analytics placeholder. When an ID is provided, injects the script.
 *
 * Google Analytics 4: set NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX)
 * Optional: set NEXT_PUBLIC_APP_URL for consent / config
 */
const GA_ID = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID : undefined;

export function Analytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
            send_page_view: true
          });
        `}
      </Script>
    </>
  );
}
