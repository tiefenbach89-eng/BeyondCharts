// components/admin/ContentTemplate.tsx
'use client';

import { Card } from "@/components/ui/Card";
import { FileText, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface ContentTemplateProps {
  type: 'news' | 'analyses';
}

export function ContentTemplate({ type }: ContentTemplateProps) {
  const [copied, setCopied] = useState(false);

  const templates = {
    news: {
      title: "Fed senkt Leitzins um 0,25% – Märkte reagieren verhalten",
      summary: "Die US-Notenbank hat den Leitzins wie erwartet um 25 Basispunkte gesenkt. Die Reaktion an den Märkten fiel jedoch verhalten aus, da Investoren auf weitere Signale zur Zinspolitik warten.",
      content: `## Hintergrund

Die Federal Reserve hat heute den Leitzins um 0,25 Prozentpunkte auf eine Spanne von 4,25% bis 4,50% gesenkt. Diese Entscheidung war weitgehend erwartet worden.

## Marktreaktion

Die Aktienmärkte zeigten eine gemischte Reaktion:

- S&P 500: +0,3%
- Nasdaq: -0,1%
- Dow Jones: +0,5%

---
Die verhaltene Reaktion deutet darauf hin, dass die Zinssenkung bereits eingepreist war.
---

## Ausblick

Fed-Chef Jerome Powell betonte in der anschließenden Pressekonferenz, dass weitere Zinssenkungen datenabhängig bleiben werden. Die nächste Sitzung findet im März statt.

## Auswirkungen

Für Investoren bedeutet dies:

- Niedrigere Kreditkosten
- Potenziell höhere Bewertungen für Growth-Aktien
- Druck auf den US-Dollar`,
      source: "Reuters",
      sourceUrl: "https://reuters.com/...",
      impact: "High" as const,
    },
    analyses: {
      title: "Nvidia: KI-Boom trifft auf Bewertungsfragen",
      summary: "Nvidia profitiert massiv vom KI-Boom, doch die Bewertung wirft Fragen auf. Wir analysieren das Geschäftsmodell, Risiken und mögliche Szenarien.",
      content: `## Executive Summary

Nvidia dominiert den KI-Chip-Markt mit einem geschätzten Marktanteil von 80-90% bei Datacenter-GPUs. Das Unternehmen profitiert vom exponentiellen Wachstum der KI-Infrastruktur.

## Geschäftsmodell

### Datacenter-Segment
Das Herzstück des Geschäfts:

- H100 und A100 GPUs für Training
- Inference-Chips für Anwendungen
- CUDA-Software-Ökosystem als Burggraben

---
Der Software-Lock-in durch CUDA ist der entscheidende Wettbewerbsvorteil.
---

### Gaming
Traditionelles Standbein mit:

- GeForce RTX-Serie für Consumer
- Stabile Margen von 60-65%
- Zyklisches, aber profitables Geschäft

## Wettbewerbsumfeld

Die Konkurrenz wächst:

- AMD mit MI300-Serie
- Eigene Chips von Google, Amazon, Microsoft
- Intel als potentieller Disruptor

## Bewertung

Bei einem KGV von ~35-40 ist Nvidia nicht günstig, aber:

- Wachstum von 100%+ rechtfertigt Premium
- Margen bleiben außergewöhnlich hoch
- Pricing Power intakt

## Risiken

### Kurzfristig
- Lieferengpässe bei Chips
- Export-Restriktionen nach China
- Makro-Abschwächung

### Langfristig  
- Commoditisierung von KI-Chips
- Eigene Chip-Entwicklung der Kunden
- Regulatorische Eingriffe

## Szenarien

### Bull Case (40% Wahrscheinlichkeit)
KI-Nachfrage übertrifft Erwartungen, Marktanteil bleibt stabil
→ Kursziel: $800+

### Base Case (45% Wahrscheinlichkeit)
Solides Wachstum, leichter Margendruck
→ Kursziel: $500-600

### Bear Case (15% Wahrscheinlichkeit)
KI-Investitionen verlangsamen sich, Wettbewerb intensiviert
→ Kursziel: $300-400`,
      overview: "Nvidia dominiert KI-Chips mit 80-90% Marktanteil. CUDA-Ökosystem bietet starken Burggraben.",
      businessModel: "Verkauf von High-End GPUs für KI-Training/Inference plus Software-Plattform. 60-70% Margen im Datacenter-Segment.",
      risks: "Wachsende Konkurrenz (AMD, Custom-Chips), Export-Beschränkungen, Commoditisierung",
      scenarios: "Bull: $800+ | Base: $500-600 | Bear: $300-400",
    },
  };

  const template = type === 'news' ? templates.news : templates.analyses;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 border-blue-200 bg-blue-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-slate-900">
            📋 Vorlage: {type === 'news' ? 'News-Artikel' : 'Analyse'}
          </h3>
        </div>
        <button
          onClick={() => copyToClipboard(JSON.stringify(template, null, 2))}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="h-3.5 w-3.5" />
              Kopiert!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Daten kopieren
            </>
          )}
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Title */}
        <div>
          <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">
            Titel
          </label>
          <div className="p-3 bg-white rounded-lg border border-slate-200 font-medium text-slate-900">
            {template.title}
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">
            Summary
          </label>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
            {template.summary}
          </div>
        </div>

        {/* Content Preview */}
        <div>
          <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">
            Content (Markdown)
          </label>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono text-slate-600 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {template.content}
          </div>
        </div>

        {/* Type-specific fields */}
        {type === 'news' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">
                Quelle
              </label>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
                {template.source}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide block mb-1">
                Impact
              </label>
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
                {template.impact}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-4 bg-white rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              📊 Deep Dive Metriken
            </p>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-medium text-slate-700">Overview:</span>
                <p className="text-slate-600 mt-1">{template.overview}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Business Model:</span>
                <p className="text-slate-600 mt-1">{template.businessModel}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Risks:</span>
                <p className="text-slate-600 mt-1">{template.risks}</p>
              </div>
              <div>
                <span className="font-medium text-slate-700">Scenarios:</span>
                <p className="text-slate-600 mt-1">{template.scenarios}</p>
              </div>
            </div>
          </div>
        )}

        {/* Markdown Guide */}
        <div className="p-4 bg-white rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
            📝 Markdown Formatierung
          </p>
          <div className="space-y-1 text-xs text-slate-600 font-mono">
            <div><span className="text-blue-600">##</span> Große Überschrift</div>
            <div><span className="text-blue-600">###</span> Kleine Überschrift</div>
            <div><span className="text-blue-600">---</span> Highlight Box <span className="text-blue-600">---</span></div>
            <div><span className="text-blue-600">-</span> Liste Item</div>
            <div><span className="text-blue-600">**fett**</span> → <strong>fett</strong></div>
            <div><span className="text-blue-600">*kursiv*</span> → <em>kursiv</em></div>
          </div>
        </div>
      </div>
    </Card>
  );
}