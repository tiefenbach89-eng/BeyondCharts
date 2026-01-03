import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, Info, Scale, TrendingUp, AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      
      {/* Hero Header */}
      <div className="border-b border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-8">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                Rechtliche Hinweise
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 mb-8">
              Haftungsausschluss
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl">
              Transparenz ist uns wichtig. Bitte lies dir diese Hinweise <span className="font-semibold text-slate-900">aufmerksam</span> durch, 
              bevor du die Inhalte auf BeyondCharts nutzt.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="max-w-4xl space-y-6">
          
          {/* Sektion 1: Keine Beratung */}
          <Card className="relative overflow-hidden border-none ring-1 ring-slate-200 bg-white transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Info className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    1. Keine Anlageberatung
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Alle auf <strong className="text-slate-900">BeyondCharts</strong> bereitgestellten Inhalte (Analysen, News, Echtgeld-Depot-Einblicke) dienen ausschließlich der Information, Bildung und persönlichen Unterhaltung. Sie stellen keine Anlageberatung, keine Rechts- oder Steuerberatung und keine Aufforderung zum Kauf oder Verkauf von Wertpapieren oder Finanzprodukten dar.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Sektion 2: Risiko */}
          <Card className="relative overflow-hidden border-none ring-1 ring-slate-200 bg-white transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600" />
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    2. Eigenverantwortung & Risiko
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Investitionen in Wertpapiere, Kryptowährungen oder andere Finanzinstrumente sind grundsätzlich mit Risiken verbunden. Es besteht jederzeit das Risiko erheblicher Wertschwankungen bis hin zum <strong className="text-slate-900">Totalverlust</strong> des eingesetzten Kapitals. BeyondCharts übernimmt keinerlei Haftung für finanzielle Verluste. Jede Investitionsentscheidung triffst du in voller Eigenverantwortung.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Sektion 3: Interessenkonflikte */}
          <Card className="relative overflow-hidden border-none ring-1 ring-slate-200 bg-white transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-violet-600" />
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Scale className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    3. Transparenz & Interessenkonflikte
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Wir praktizieren <strong className="text-slate-900">{'Skin in the Game'}</strong>. Autoren von BeyondCharts halten zum Zeitpunkt der Veröffentlichung möglicherweise Positionen in den besprochenen Wertpapieren (insbesondere innerhalb des Real-Money-Portfolios). Es kann daher ein Interessenkonflikt vorliegen. Wir berichten nach bestem Wissen und Gewissen, weisen jedoch darauf hin, dass unsere Ansichten subjektiv sind.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Sektion 4: Performance */}
          <Card className="relative overflow-hidden border-none ring-1 ring-slate-200 bg-white transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-emerald-600" />
            <div className="p-8 md:p-10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                    4. Performance-Hinweis
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Vergangene Wertentwicklungen, Simulationen oder Prognosen sind kein verlässlicher Indikator für die künftige Wertentwicklung. Ergebnisse, die wir mit unserem Real-Money-Portfolio erzielen, lassen sich nicht eins zu eins auf andere Depots übertragen.
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* Footer Notice */}
        <div className="max-w-4xl mt-16">
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="relative">
              <p className="text-sm text-slate-400 font-medium mb-2">
                Letzte Aktualisierung
              </p>
              <p className="text-lg font-semibold text-white">
                Dezember 2025
              </p>
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-500">
                  © {new Date().getFullYear()} BeyondCharts • Alle Rechte vorbehalten
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
