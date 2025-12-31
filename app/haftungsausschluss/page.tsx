import React from "react";
import { Card } from "@/components/ui/Card";
import { ShieldAlert, Info, Scale, TrendingUp, AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER BEREICH */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Haftungsausschluss
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Transparenz ist uns wichtig. Bitte lies dir diese Hinweise aufmerksam durch, 
            bevor du die Inhalte auf BeyondCharts nutzt.
          </p>
        </div>

        {/* CONTENT SECTIONS */}
        <div className="space-y-6">
          
          {/* Sektion 1: Keine Beratung */}
          <Card className="p-8 border-none ring-1 ring-slate-200 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Info className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">1. Keine Anlageberatung</h2>
                <p className="text-slate-600 leading-relaxed">
                  Alle auf <strong>BeyondCharts</strong> bereitgestellten Inhalte (Analysen, News, Echtgeld-Depot-Einblicke) dienen ausschließlich der Information, Bildung und persönlichen Unterhaltung. Sie stellen keine Anlageberatung, keine Rechts- oder Steuerberatung und keine Aufforderung zum Kauf oder Verkauf von Wertpapieren oder Finanzprodukten dar.
                </p>
              </div>
            </div>
          </Card>

          {/* Sektion 2: Risiko */}
          <Card className="p-8 border-none ring-1 ring-slate-200 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">2. Eigenverantwortung & Risiko</h2>
                <p className="text-slate-600 leading-relaxed">
                  Investitionen in Wertpapiere, Kryptowährungen oder andere Finanzinstrumente sind grundsätzlich mit Risiken verbunden. Es besteht jederzeit das Risiko erheblicher Wertschwankungen bis hin zum <strong>Totalverlust</strong> des eingesetzten Kapitals. BeyondCharts übernimmt keinerlei Haftung für finanzielle Verluste. Jede Investitionsentscheidung triffst du in voller Eigenverantwortung.
                </p>
              </div>
            </div>
          </Card>

          {/* Sektion 3: Interessenkonflikte */}
          <Card className="p-8 border-none ring-1 ring-slate-200 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">3. Transparenz & Interessenkonflikte</h2>
                <p className="text-slate-600 leading-relaxed">
                  Wir praktizieren <strong>"Skin in the Game"</strong>. Autoren von BeyondCharts halten zum Zeitpunkt der Veröffentlichung möglicherweise Positionen in den besprochenen Wertpapieren (insbesondere innerhalb des Real-Money-Portfolios). Es kann daher ein Interessenkonflikt vorliegen. Wir berichten nach bestem Wissen und Gewissen, weisen jedoch darauf hin, dass unsere Ansichten subjektiv sind.
                </p>
              </div>
            </div>
          </Card>

          {/* Sektion 4: Performance */}
          <Card className="p-8 border-none ring-1 ring-slate-200 shadow-sm">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">4. Performance-Hinweis</h2>
                <p className="text-slate-600 leading-relaxed">
                  Vergangene Wertentwicklungen, Simulationen oder Prognosen sind kein verlässlicher Indikator für die künftige Wertentwicklung. Ergebnisse, die wir mit unserem Real-Money-Portfolio erzielen, lassen sich nicht eins zu eins auf andere Depots übertragen.
                </p>
              </div>
            </div>
          </Card>

        </div>

        {/* FOOTER HINWEIS AUF DER SEITE */}
        <div className="mt-12 p-6 bg-slate-100 rounded-2xl border border-slate-200">
          <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-medium">
            Stand: Dezember 2025 • BeyondCharts
          </p>
        </div>
      </div>
    </div>
  );
}