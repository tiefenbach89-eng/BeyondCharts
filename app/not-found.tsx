"use client";

import { Button } from "@/components/ui/Button";
import { Construction, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Dekorativer Hintergrund-Blur */}
      <div className="absolute -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
      
      <div className="space-y-6">
        {/* Visuelles Element */}
        <div className="flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-2xl shadow-blue-200/50 border border-slate-100">
            <Construction className="h-10 w-10 text-blue-600" />
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white shadow-lg">
              404
            </div>
          </div>
        </div>

        {/* Text-Inhalt (Allgemein gehalten) */}
        <div className="max-w-md space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase sm:text-4xl">
            In Vorbereitung
          </h1>
          <p className="text-base font-medium leading-relaxed text-slate-500">
            Diese Seite oder dieses Feature befindet sich aktuell noch in der Entwicklung. Wir bauen hier bald etwas Spannendes für dich auf.
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/" className="bg-slate-900 text-white shadow-xl hover:scale-105 transition-transform px-12">
            <Home className="mr-2 h-4 w-4" /> Zur Startseite
          </Button>
        </div>
      </div>

      {/* Status-Anzeige unten */}
      <div className="mt-16 flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/50 px-4 py-1.5">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
          BeyondCharts Development Unit
        </span>
      </div>
    </div>
  );
}