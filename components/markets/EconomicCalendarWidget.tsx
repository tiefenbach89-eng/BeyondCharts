"use client";

import { useEffect, useRef } from "react";

export function EconomicCalendarWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // verhindert doppeltes Laden bei Route-Wechsel
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "light",
      isTransparent: true,
      width: "100%",
      height: "600",
      locale: "de",
      importanceFilter: "0,1,2",
      countryFilter: "US,EU,DE,GB,JP,CN",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white">
      <div ref={containerRef} />
    </div>
  );
}
