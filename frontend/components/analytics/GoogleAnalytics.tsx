"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-WH4YGKEKSV";

/**
 * Loads GA only after the first real user interaction so it never competes
 * with LCP/TBT on the critical path (including Lighthouse lab runs).
 */
export function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const enable = () => setEnabled(true);
    const opts: AddEventListenerOptions = { once: true, passive: true };
    window.addEventListener("pointerdown", enable, opts);
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("scroll", enable, opts);
    window.addEventListener("touchstart", enable, opts);

    return () => {
      window.removeEventListener("pointerdown", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("scroll", enable);
      window.removeEventListener("touchstart", enable);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="G-WH4YGKEKSV" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}');
      `}</Script>
    </>
  );
}
