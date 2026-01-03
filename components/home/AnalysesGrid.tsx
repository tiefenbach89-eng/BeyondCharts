"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { PremiumIcon } from "@/components/PremiumIcon";

export function AnalysesGrid({ analyses }: { analyses: any[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleAnalyses = showAll ? analyses : analyses.slice(0, 3);

  return (
    <>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {visibleAnalyses.map((a) => (
          <Link
            key={a.id}
            href={a.slug ? `/analysen/${a.slug}` : "/analysen"}
            className="group block h-full"
          >
            {/* HOVER LOGIK: Schatten + Anheben */}
            <Card className="relative flex h-full flex-col overflow-hidden border-none ring-1 ring-slate-200 bg-white transition-all duration-300 hover:shadow-xl hover:translate-y-[-4px]">
              
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                {a.imageUrl ? (
                  <Image
                    src={a.imageUrl}
                    alt={a.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 text-xs uppercase font-semibold">
                    Beyond Charts Insights
                  </div>
                )}

                {a.isPremium && (
                  <div className="absolute right-3 top-3 z-10">
                    <PremiumIcon />
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold leading-tight text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {a.title}
                </h3>
                
                <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 flex-grow">
                  {a.summary}
                </p>
                
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    {new Date(
                      a.publishedAt || a.createdAt
                    ).toLocaleDateString("de-DE")}
                  </span>
                  
                  {/* PFEIL LOGIK: Jetzt unsichtbar im Ruhezustand und gleitet beim Hover rein */}
                  <ArrowRight className="h-4 w-4 text-blue-600 transition-all duration-300 translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          {showAll ? (
            <>
              Weniger anzeigen <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Mehr Analysen laden <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
