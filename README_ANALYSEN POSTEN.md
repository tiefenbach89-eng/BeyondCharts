# 📝 Analyse Template Guide

## Übersicht

Dieses System verwendet strukturierte Markdown-Formatierung für konsistente, professionelle Analysen.

## Datenstruktur

### Haupt-Felder (Pflicht)

```json
{
  "title": "Amazon AWS Geschäftsmodell Analyse",
  "summary": "Eine tiefgehende Analyse des AWS-Geschäftsmodells und seiner Bedeutung für Amazons Unternehmenswert.",
  "content": "## Section 1\n\nContent here...",
  
  "category": "Cloud Computing",
  "tags": ["AWS", "Cloud", "Amazon"],
  "isPremium": false,
  "status": "published"
}
```

### Optional aber empfohlen

```json
{
  "ticker": "AMZN",
  "author": "Max Mustermann, CFA",
  "imageUrl": "https://...",
  
  "snapshot": {
    "thesis": "Strukturelle Cloud-Dominanz",
    "profitability": "AWS Margenprofil",
    "substance": "90%+ Marktanteil GPU",
    "risk": "Regulierung & Konkurrenz"
  }
}
```

---

## Content Format

### ✅ **Struktur mit ## Headers**

```markdown
## Einordnung & zentrale These

Amazon wird an der Börse häufig wie ein klassischer Onlinehändler bewertet. 
Diese Sicht greift zu kurz.

Der langfristige Unternehmenswert hängt primär vom Cloud-Geschäft AWS ab, 
das strukturell höhere Margen und planbare Umsätze liefert.

## Wie verdient Amazon sein Geld?

Amazon gliedert sich operativ in mehrere Geschäftsbereiche:

- Onlinehandel (1P & 3P)
- AWS (Cloud-Infrastruktur)
- Werbung & Abonnements
- Logistik & Fulfillment-Services

Der Onlinehandel generiert den größten Umsatz, arbeitet jedoch mit 
niedrigen oder teilweise negativen Margen.

## Wo entsteht der eigentliche Unternehmenswert?

---
AWS bietet skalierbare Cloud-Dienste für Unternehmen, Startups und 
staatliche Institutionen. Kunden binden sich langfristig an die 
Infrastruktur, was zu wiederkehrenden Umsätzen führt.
---

Die Gewinne aus AWS ermöglichen:
- Investitionen in Logistik
- Preiskämpfe im Handel
- Expansion in neue Geschäftsfelder
```

---

## Formatierungs-Regeln

### 📌 **Headers mit `##`**
```markdown
## Investment Thesis
```
→ Wird zu einer großen Section-Überschrift mit Trennlinie

### 📌 **Listen mit `-`**
```markdown
- AWS (Cloud-Infrastruktur)
- Werbung & Abonnements
- Logistik & Fulfillment-Services
```
→ Wird zu stylischen Bullet Points mit blauen Pfeilen (→)

### 📌 **Highlights mit `---`**
```markdown
---
Dies ist ein wichtiger Key Takeaway, der hervorgehoben werden soll.
---
```
→ Wird zu einer blauen Highlight-Box (Quote-Style)

### 📌 **Normale Paragraphen**
```markdown
Der Onlinehandel generiert den größten Umsatz, arbeitet jedoch mit 
niedrigen oder teilweise negativen Margen.
```
→ Wird zu gut lesbaren Absätzen mit Spacing

---

## Best Practices

### ✅ DO's

1. **Verwende klare Section-Titel**
   ```markdown
   ## Investmentthese
   ## Geschäftsmodell
   ## Risiken & Chancen
   ```

2. **Gruppiere verwandte Informationen**
   ```markdown
   ## Umsatzquellen
   
   Amazon generiert Umsätze aus mehreren Bereichen:
   
   - Onlinehandel (60% des Umsatzes)
   - AWS (15% des Umsatzes, 70% des Gewinns)
   - Werbung (10% des Umsatzes)
   ```

3. **Nutze Highlights für Key Takeaways**
   ```markdown
   ---
   AWS ist nicht nur ein Geschäftszweig, sondern das finanzielle 
   Fundament des gesamten Konzerns.
   ---
   ```

4. **Halte Paragraphen kurz und prägnant**
   - 2-4 Sätze pro Paragraph
   - Doppelte Zeilenumbrüche zwischen Paragraphen

### ❌ DON'Ts

1. **Keine HTML-Tags verwenden**
   ```markdown
   ❌ <p>Text</p>
   ✅ Einfacher Text
   ```

2. **Keine verschachtelten Listen**
   ```markdown
   ❌ - Item 1
        - Sub Item
   ✅ - Item 1 (mit Kontext)
      - Item 2 (separater Punkt)
   ```

3. **Keine `#` für Hauptüberschrift**
   ```markdown
   ❌ # Haupttitel (kommt aus title-Feld)
   ✅ ## Erste Section
   ```

---

## Vollständiges Beispiel

```json
{
  "id": "a_1234567",
  "slug": "amazon-aws-analyse",
  "title": "Amazon: Warum AWS das Geschäftsmodell dominiert",
  "summary": "Eine Analyse der strukturellen Vorteile von AWS und deren Bedeutung für Amazons Bewertung.",
  
  "ticker": "AMZN",
  "author": "Research Team",
  "category": "Technology",
  "tags": ["Cloud", "AWS", "Amazon"],
  
  "isPremium": false,
  "status": "published",
  
  "snapshot": {
    "thesis": "Cloud-first Investment Case",
    "profitability": "AWS Margenprofil (30%+)",
    "substance": "Recurring Revenue Model",
    "risk": "Regulierung & Competition"
  },
  
  "content": "## Einordnung & zentrale These\n\nAmazon wird an der Börse häufig wie ein klassischer Onlinehändler bewertet. Diese Sicht greift zu kurz.\n\nDer langfristige Unternehmenswert hängt primär vom Cloud-Geschäft AWS ab, das strukturell höhere Margen und planbare Umsätze liefert.\n\n---\nDie zentrale These: Nicht der Handel, sondern AWS bestimmt die Investitionsqualität von Amazon.\n---\n\n## Wie verdient Amazon sein Geld?\n\nAmazon gliedert sich operativ in mehrere Geschäftsbereiche:\n\n- Onlinehandel (1P & 3P)\n- AWS (Cloud-Infrastruktur)\n- Werbung & Abonnements\n- Logistik & Fulfillment-Services\n\nDer Onlinehandel generiert den größten Umsatz, arbeitet jedoch mit niedrigen oder teilweise negativen Margen.\n\nAWS hingegen liefert einen überproportionalen Anteil am operativen Gewinn.\n\n## Wo entsteht der eigentliche Unternehmenswert?\n\nAWS bietet skalierbare Cloud-Dienste für Unternehmen, Startups und staatliche Institutionen.\n\nKunden binden sich langfristig an die Infrastruktur, was zu wiederkehrenden Umsätzen und hoher Preissetzungsmacht führt.\n\nDie Gewinne aus AWS ermöglichen:\n- Investitionen in Logistik\n- Preiskämpfe im Handel\n- Expansion in neue Geschäftsfelder\n\nAWS fungiert damit als finanzielles Fundament des Gesamtkonzerns."
}
```

---

## Workflow

### 1. Neue Analyse erstellen

```typescript
// Via Admin-Interface oder direkt in analyses.json
{
  "title": "Dein Titel",
  "summary": "Kurze Zusammenfassung (1-2 Sätze)",
  "content": "## Section 1\n\nContent...",
  "category": "Technology",
  "status": "published"
}
```

### 2. Content schreiben

- Schreibe in deinem Editor mit Markdown-Formatierung
- Verwende `##` für Sections
- Verwende `-` für Listen
- Verwende `---` für Highlights

### 3. Testen

```bash
npm run dev
# Besuche: http://localhost:3000/analysen/dein-slug
```

### 4. Veröffentlichen

```typescript
{
  "status": "published",
  "publishedAt": "2024-12-30T10:00:00Z"
}
```

---

## Snapshot Guidelines

Die `snapshot`-Felder erscheinen als Card-Grid am Anfang:

```json
{
  "snapshot": {
    "thesis": "1-2 Zeilen: Was ist die Kernthese?",
    "profitability": "1-2 Zeilen: Hauptkatalysator oder Driver",
    "substance": "1-2 Zeilen: Fundamentale Stärke",
    "risk": "1-2 Zeilen: Hauptrisiken"
  }
}
```

**Beispiele:**

```json
{
  "thesis": "Strukturelle KI-Infrastruktur Dominanz",
  "profitability": "Hyperscaler Capex Supercycle",
  "substance": "90%+ GPU Marktanteil + CUDA Moat",
  "risk": "Export Controls & Custom Silicon Threat"
}
```

---

## Support

Bei Fragen oder Problemen:
1. Prüfe die TypeScript Types in `types/analyse.ts`
2. Schau dir Beispiele in `data/analyses.json` an
3. Teste lokal mit `npm run dev`

**Happy Writing! 🚀**