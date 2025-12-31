// app/analysen/[slug]/layout.tsx

import type { ReactNode } from "react";

export default function AnalyseSlugLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className="
        analysis-root
        w-screen
        min-h-[100svh]
        bg-slate-50
        text-slate-900
        overflow-x-hidden
      "
    >
      {/* Scroll-Container */}
      <div
        className="
          analysis-scroll
          min-h-[100svh]
          overscroll-contain
          touch-pan-y
        "
      >
        {children}
      </div>
    </div>
  );
}
