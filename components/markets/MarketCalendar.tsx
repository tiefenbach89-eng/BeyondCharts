"use client";

import { useEffect, useRef } from "react";

export function MarketCalendar() {
  const macroRef = useRef<HTMLDivElement>(null);
  const earningsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // ===== MAKRO =====
    if (macroRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        isTransparent: true,
        width: "100%",
        height: 520,
        locale: "de",
        importanceFilter: "1,2,3",
        countryFilter: "US,EU,DE,GB,JP,CN",
        showOnlyUpcomingEvents: true,
      });
      macroRef.current.appendChild(script);
    }

    // ===== EARNINGS =====
    if (earningsRef.current) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-earnings.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        isTransparent: true,
        width: "100%",
        height: 520,
        locale: "de",
        exchange: "US",
      });
      earningsRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="rounded-2xl border border-slate-200 overflow-hidden min-h-[520px]">
        <div className="px-4 py-3 border-b bg-slate-50 text-sm font-semibold">
          🌍 Makro & Wirtschaftsdaten
        </div>
        <div ref={macroRef} />
      </div>

      <div className="rounded-2xl border border-slate-200 overflow-hidden min-h-[520px]">
        <div className="px-4 py-3 border-b bg-slate-50 text-sm font-semibold">
          💰 Earnings & Unternehmenszahlen
        </div>
        <div ref={earningsRef} />
      </div>
    </div>
  );
}
