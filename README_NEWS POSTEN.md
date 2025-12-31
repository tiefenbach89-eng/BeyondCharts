# 📰 News Template Guide

## Übersicht

Dieses System verwendet strukturierte Markdown-Formatierung für konsistente, professionelle News-Artikel.

## Datenstruktur

### Haupt-Felder (Pflicht)

```json
{
  "title": "Tesla kündigt neue Gigafactory in Europa an",
  "summary": "Tesla plant den Bau einer weiteren Produktionsstätte in Deutschland, um die europäische Nachfrage nach Elektrofahrzeugen zu decken.",
  "content": "## Hintergrund\n\nContent...",
  
  "category": "Automotive",
  "source": "Tesla Investor Relations",
  "sourceType": "external",
  "impact": "High",
  "tags": ["Tesla", "EV", "Manufacturing"],
  "isPremium": false,
  "status": "published"
}
```

### News-Spezifische Felder

```json
{
  "source": "Bloomberg",
  "sourceUrl": "https://bloomberg.com/...",
  "sourceType": "external",  // "own" oder "external"
  "impact": "High",           // "Low", "Medium", "High"
  
  "author": "John Doe",       // optional
  "imageUrl": "https://..."   // optional
}
```

---

## Impact Levels

### 🔴 **High Impact**
- Marktbewegende Nachrichten
- Regulatorische Änderungen
- Große M&A Deals
- Earnings Surprises
- Geopolitische Events

**Beispiele:**
- Fed Zinsentscheidungen
- Major Tech Layoffs
- Bankruptcy Announcements

### 🔵 **Medium Impact**
- Produktankündigungen
- Partnerships
- Executive Changes
- Guidance Updates

**Beispiele:**
- Apple kündigt neue iPhone-Modelle an
- Google Cloud Partnership mit SAP
- CFO Wechsel bei Fortune 500

### ⚪ **Low Impact**
- Minor Updates
- Feature Releases
- Company Blogs
- Industry Reports

**Beispiele:**
- Software Update Release
- New Brand Ambassador
- Office Opening

---

## Content Format

### ✅ **Struktur mit ## Headers**

```markdown
## Hintergrund

Tesla hat heute den Bau einer neuen Gigafactory in Berlin angekündigt. 
Die Anlage soll bis Ende 2025 in Betrieb gehen.

Die Investitionssumme beläuft sich auf 5 Milliarden Euro und schafft 
über 12.000 neue Arbeitsplätze.

## Was bedeutet das für Investoren?

---
Die neue Produktionskapazität könnte Teslas Marktanteil in Europa 
von aktuell 15% auf über 25% steigern.
---

Drei zentrale Punkte:
- Senkung der Produktionskosten um 20%
- Reduzierung der Lieferzeiten auf unter 4 Wochen
- Unabhängigkeit von asiatischen Lieferketten

## Watchpoints

Investoren sollten folgende Entwicklungen beobachten:
- Baufortschritt und Timeline-Einhaltung
- Lokale Genehmigungsverfahren
- Wettbewerbsreaktionen von VW und BMW
```

---

## Formatierungs-Regeln

### 📌 **News-Spezifische Sections**

**Standard-Struktur für Breaking News:**
```markdown
## Was ist passiert?
[Kernfakten in 2-3 Sätzen]

## Hintergrund
[Kontext und Historie]

## Impact für Investoren
[Was bedeutet das für Stakeholder?]

## Watchpoints
[Was sollte beobachtet werden?]
```

**Für Earnings/Zahlen:**
```markdown
## Die Zahlen im Überblick
- Umsatz: $X.X Mrd. (+Y% YoY)
- Gewinn: $X.X Mrd.
- Guidance: ...

## Highlights & Misses
[Beat/Miss Analyse]

## Management Commentary
[Key Quotes vom Call]

## Analyst Reaktionen
[Was sagen die Analysten?]
```

### 📌 **Listen mit `-`**
```markdown
- Produktionskapazität: +50%
- Investition: €5 Mrd.
- Arbeitsplätze: 12.000
```
→ Wird zu stylischen Bullet Points

### 📌 **Highlights mit `---`**
```markdown
---
Key Takeaway: Dies könnte Teslas Marktposition in Europa fundamental verändern.
---
```
→ Wird zu einer emerald-grünen Highlight-Box

---

## Best Practices

### ✅ DO's

1. **Kurz und präzise**
   - News sollten schnell konsumierbar sein
   - 5-10 Minuten Lesezeit maximum
   - Bullet Points für Fakten nutzen

2. **Klare Struktur**
   ```markdown
   ## Was ist passiert?
   [Facts]
   
   ## Warum ist das relevant?
   [Context]
   
   ## Was sollte man tun/beobachten?
   [Actionable Insights]
   ```

3. **Impact Level korrekt setzen**
   ```json
   {
     "impact": "High",  // Nur für wirklich marktbewegende News
     "impact": "Medium", // Default für relevante Updates
     "impact": "Low"    // Für FYI-Meldungen
   }
   ```

4. **Source Attribution**
   ```json
   {
     "source": "Bloomberg",
     "sourceUrl": "https://...",
     "sourceType": "external"
   }
   ```

### ❌ DON'Ts

1. **Keine langen Essays**
   ```markdown
   ❌ 20-seitige Deep Dives (→ dafür sind Analysen da)
   ✅ Kompakte 500-1000 Wörter mit Key Points
   ```

2. **Keine Meinungen ohne Kennzeichnung**
   ```markdown
   ❌ "Tesla wird die Konkurrenz vernichten"
   ✅ "Analysten erwarten einen Marktanteilsgewinn von X%"
   ```

3. **Keine veralteten News**
   ```json
   ❌ "publishedAt": "2022-01-01"
   ✅ Aktuelle, relevante Meldungen
   ```

---

## Vollständiges Beispiel

```json
{
  "id": "n_1234567",
  "slug": "tesla-gigafactory-berlin",
  "title": "Tesla kündigt neue Gigafactory in Berlin an",
  "summary": "Tesla investiert €5 Milliarden in eine neue europäische Produktionsstätte. Die Anlage könnte Teslas Marktposition fundamental stärken.",
  
  "category": "Automotive",
  "source": "Tesla Investor Relations",
  "sourceUrl": "https://ir.tesla.com/...",
  "sourceType": "external",
  "impact": "High",
  
  "tags": ["Tesla", "EV", "Manufacturing", "Europe"],
  "isPremium": false,
  "status": "published",
  
  "author": "Sarah Chen",
  "imageUrl": "https://images.unsplash.com/tesla-factory",
  
  "content": "## Was ist passiert?\n\nTesla hat heute den Bau einer neuen Gigafactory in Berlin angekündigt. Die Anlage soll bis Ende 2025 in Betrieb gehen und über 500.000 Fahrzeuge pro Jahr produzieren.\n\nDie Investitionssumme beläuft sich auf €5 Milliarden und schafft über 12.000 neue Arbeitsplätze in der Region.\n\n## Hintergrund\n\nDies ist Teslas zweite europäische Produktionsstätte nach der bestehenden Gigafactory in Grünheide. Die Entscheidung folgt auf:\n\n- Steigende Nachfrage in Europa (+45% YoY)\n- EU-Subventionen für grüne Technologie\n- Lieferkettenoptimierung nach Corona\n\nDie neue Anlage wird ausschließlich mit erneuerbarer Energie betrieben und setzt neue Standards in der Automobilproduktion.\n\n## Was bedeutet das für Investoren?\n\n---\nDie neue Produktionskapazität könnte Teslas Marktanteil in Europa von aktuell 15% auf über 25% bis 2026 steigern.\n---\n\nDrei zentrale Investment-Thesen:\n\n- Produktionskosten sinken um 20% durch Skaleneffekte\n- Lieferzeiten reduzieren sich auf unter 4 Wochen\n- Unabhängigkeit von volatilen Lieferketten\n\nAnalysten von Morgan Stanley heben ihr Kursziel auf $350 an (zuvor: $310).\n\n## Watchpoints\n\nInvestoren sollten folgende Entwicklungen im Auge behalten:\n\n- Baufortschritt und Timeline-Einhaltung\n- Lokale Genehmigungsverfahren (Umweltauflagen)\n- Reaktionen der deutschen Autobauer (VW, BMW, Mercedes)\n- Potenzielle Arbeitskräfteengpässe in der Region\n\nDie Q4 Earnings (Januar 2025) könnten weitere Details zur Finanzierung liefern."
}
```

---

## Kategorien

Typische News-Kategorien:

- **Markets** - Marktbewegungen, Indices, Makro
- **Technology** - Tech-Unternehmen, Software, Hardware
- **Finance** - Banking, FinTech, Krypto
- **Automotive** - EV, Traditional Auto
- **Energy** - Oil, Gas, Renewables
- **Healthcare** - Pharma, Biotech, MedTech
- **Regulatory** - Policies, Laws, Compliance
- **M&A** - Mergers, Acquisitions, Deals

---

## Workflow

### 1. Breaking News erfassen

```json
{
  "title": "...",
  "summary": "...",
  "content": "...",
  "category": "Markets",
  "impact": "High",
  "source": "...",
  "status": "draft"
}
```

### 2. Content strukturieren

```markdown
## Was ist passiert?
[Facts]

## Hintergrund
[Context]

## Investment Impact
[Analysis]

## Watchpoints
[What to monitor]
```

### 3. Review & Publish

```json
{
  "status": "published",
  "auditStatus": "approved",
  "publishedAt": "2024-12-30T14:30:00Z"
}
```

---

## Integration mit Analysen

Wenn eine News tiefere Analyse benötigt:

```markdown
## Für weitere Analyse

Diese Entwicklung verdient eine tiefere Betrachtung. 
Lesen Sie unsere [vollständige Analyse zu Tesla's Europa-Strategie](/analysen/tesla-europa-expansion).
```

---

## Quick Reference

| Element | Verwendung | Beispiel |
|---------|------------|----------|
| `##` | Section Headers | `## Hintergrund` |
| `-` | Bullet Lists | `- Point 1` |
| `---` | Highlights | `---Key Point---` |
| Impact | Relevanz-Level | `"High"`, `"Medium"`, `"Low"` |
| Source Type | Quelle | `"own"` oder `"external"` |

---

**Happy News Writing! 📰**