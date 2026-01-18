# News Feature Setup

BeyondCharts verwendet Finnhub für Asset-News und DeepL für automatische Übersetzungen ins Deutsche.

## Benötigte API Keys

### 1. Finnhub API Key (Pflicht)

**Anbieter:** [Finnhub](https://finnhub.io/)
**Free Tier:** 60 API calls/minute
**Kosten:** Kostenlos

1. Gehe zu https://finnhub.io/
2. Erstelle ein kostenloses Konto
3. Kopiere deinen API Key
4. Füge ihn in `.env.local` ein:
   ```
   FINNHUB_API_KEY=your_key_here
   ```

### 2. DeepL API Key (Pflicht für deutsche Übersetzungen)

**Anbieter:** [DeepL](https://www.deepl.com/pro-api)
**Free Tier:** 500.000 Zeichen/Monat
**Kosten:** Kostenlos (Free Tier reicht für ~125 News-Updates/Monat)

1. Gehe zu https://www.deepl.com/pro-api
2. Erstelle ein kostenloses "DeepL API Free" Konto
3. Kopiere deinen Authentication Key
4. Füge ihn in `.env.local` ein:
   ```
   DEEPL_API_KEY=your_key_here
   ```

**Wichtig:** Verwende den "API Free" Plan, nicht den "API Pro" Plan!

## Wie es funktioniert

1. **Finnhub** liefert englische Asset-News (20 Items pro Anfrage)
2. **DeepL** übersetzt Titel + Beschreibung automatisch ins Deutsche
3. **Server-Cache** speichert übersetzte News für 30 Minuten
4. **ISR** (Incremental Static Regeneration) regeneriert die Seite alle 30 Minuten

## API Rate Limits & Caching

### Finnhub
- **Limit:** 60 calls/minute
- **Nutzung:** ~2 calls alle 30 Minuten (Market News + Symbol News)
- **Täglich:** ~96 calls/Tag (weit unter dem Limit)

### DeepL
- **Limit:** 500.000 Zeichen/Monat
- **Pro News-Update:** ~4.000 Zeichen (20 News × ~200 Zeichen)
- **Maximale Updates:** ~125 Updates/Monat
- **Mit 30-Min-Cache:** ~48 Updates/Tag = ~1.440 Updates/Monat
- **Problem:** Free Tier reicht nicht für 48 Updates/Tag!

### Lösung: Extended Cache

Um innerhalb des DeepL Free Tiers zu bleiben, haben wir:
- **Cache Duration:** 30 Minuten (aktuell)
- **Empfehlung:** Erhöhe auf 2-4 Stunden für Production

**Cache auf 2 Stunden setzen:**
```typescript
// lib/news-cache.ts
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours
```

**Vergleich:**
- 30 Min Cache: ~48 Updates/Tag = 1.440 Updates/Monat ❌ Zu viel
- 2 Std Cache: ~12 Updates/Tag = 360 Updates/Monat ⚠️ Grenzwertig
- 4 Std Cache: ~6 Updates/Tag = 180 Updates/Monat ✅ Sicher

## Monitoring

### DeepL Usage überprüfen

Du kannst deine DeepL-Nutzung programmatisch abrufen:

```typescript
import { checkUsage } from '@/lib/deepl';

const usage = await checkUsage();
console.log(`Characters used: ${usage.character_count}/${usage.character_limit}`);
```

Oder im DeepL Dashboard: https://www.deepl.com/account/usage

### Logs

Die News-Feature loggt alle wichtigen Events:

```bash
[News Cache] Returning cached news (age: 1234s)
[News Cache] Cache expired
[Finnhub] Fetching market news...
[DeepL] Translated 20 texts (3842 characters)
[Unified News] Translated 20 news items
[News Cache] Cached 20 news items
```

## Vercel Deployment

1. Gehe zu deinem Vercel Projekt
2. Settings → Environment Variables
3. Füge hinzu:
   - `FINNHUB_API_KEY`: Dein Finnhub API Key
   - `DEEPL_API_KEY`: Dein DeepL API Key
4. Redeploy

## Fallback-Verhalten

Falls APIs nicht verfügbar sind:

- **Kein Finnhub Key:** Keine News werden geladen
- **Kein DeepL Key:** News werden auf Englisch angezeigt (mit Warning-Log)
- **DeepL Fehler:** News werden auf Englisch angezeigt
- **API Rate Limit:** Gecachte News werden weiter ausgeliefert

## Kosten-Übersicht

| Service | Plan | Kosten | Limit |
|---------|------|--------|-------|
| Finnhub | Free | €0 | 60 calls/min |
| DeepL | API Free | €0 | 500k chars/month |
| Vercel | Hobby | €0 | 100 GB bandwidth |
| **Total** | | **€0** | |

## Performance

- **First Load:** ~2-3s (Finnhub + DeepL + Rendering)
- **Cached Load:** ~200ms (Nur Cache-Lookup)
- **Translation Time:** ~500ms (20 News-Items)
- **Cache Hit Rate:** ~95% (bei 30-Min-Cache)

## Troubleshooting

### News werden auf Englisch angezeigt

1. Überprüfe ob `DEEPL_API_KEY` gesetzt ist
2. Überprüfe Vercel Logs für Fehler
3. Überprüfe DeepL Character Limit

### Keine News werden geladen

1. Überprüfe ob `FINNHUB_API_KEY` gesetzt ist
2. Überprüfe Finnhub API Status
3. Überprüfe Browser Console für Fehler

### "429 Too Many Requests"

1. DeepL Character Limit erreicht → Warte bis nächster Monat
2. Oder: Erhöhe Cache Duration auf 4+ Stunden

## Alternativen

Falls DeepL Free Tier nicht reicht:

1. **LibreTranslate** (selbst hosten, komplett kostenlos)
2. **Google Translate API** (kostenpflichtig, ~20€/1M Zeichen)
3. **Nur englische News** (DEEPL_API_KEY weglassen)
4. **Hybrid:** Marketaux (3 deutsche News) + Finnhub (17 englische News)
