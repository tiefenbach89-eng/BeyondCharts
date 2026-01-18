# News Feature Setup

BeyondCharts verwendet Finnhub für Asset-News, DeepL für automatische Übersetzungen ins Deutsche und Supabase für persistentes 14-Tage-Storage.

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
3. **Supabase** speichert übersetzte News persistent für 14 Tage
4. **Auto-Cleanup** löscht News älter als 14 Tage (täglich um 3 Uhr)
5. **ISR** regeneriert die Seite alle 2 Stunden (nur wenn keine frischen News im Storage)

### Vorteile des persistenten Storage:

- **Keine wiederholten Übersetzungen:** News werden einmal übersetzt und 14 Tage lang gespeichert
- **DeepL-Limit schonen:** Übersetzungen nur bei neuen News (~12x pro Tag statt 48x)
- **Schnellere Ladezeiten:** Zugriff auf Supabase-DB schneller als Finnhub + DeepL
- **News-Archiv:** Benutzer können bis zu 14 Tage alte News sehen

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

### Lösung: Supabase Storage

Mit persistentem Storage in Supabase:
- **Fetch Interval:** Alle 2 Stunden (wenn keine News im Storage)
- **Storage Duration:** 14 Tage
- **DeepL Usage:** ~12 Updates/Tag × 4.000 Zeichen = ~48.000 Zeichen/Tag
- **Monatlich:** ~1.440.000 Zeichen/Monat ⚠️ Über Limit!

**Optimierung:**
Da wir alte News 14 Tage lang behalten, holen wir nicht ständig neue News. Realistisch:
- Nur neue News werden übersetzt (nicht alle 20)
- Ca. 5-10 neue News pro 2-Stunden-Fenster
- ~12 Updates/Tag × 10 News × 200 Zeichen = ~24.000 Zeichen/Tag
- **~720.000 Zeichen/Monat** ✅ Innerhalb des Free Tiers!

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

## Supabase Setup

### 1. Migration ausführen

Die News-Tabelle muss in Supabase erstellt werden:

```bash
# Option 1: Via Supabase Dashboard
# Gehe zu SQL Editor → New query
# Kopiere den Inhalt von supabase/migrations/20260118_create_news_items_table.sql
# Führe die Query aus

# Option 2: Via Supabase CLI (falls installiert)
supabase db push
```

### 2. Tabelle verifizieren

Prüfe ob die Tabelle `news_items` erstellt wurde:
- Gehe zu Table Editor in Supabase Dashboard
- Suche nach `news_items` Tabelle
- Sollte Columns haben: id, title, description, url, published_at, etc.

## Vercel Deployment

1. Gehe zu deinem Vercel Projekt
2. Settings → Environment Variables
3. Füge hinzu:
   - `FINNHUB_API_KEY`: Dein Finnhub API Key
   - `DEEPL_API_KEY`: Dein DeepL API Key
   - `CRON_SECRET`: Zufälliger String für Cron-Auth (z.B. `openssl rand -base64 32`)
4. Redeploy

### Vercel Cron Job

Der Cron Job für Auto-Cleanup ist bereits konfiguriert (`vercel.json`):
- Läuft täglich um 3 Uhr morgens
- Löscht News älter als 14 Tage
- Endpoint: `/api/cron/cleanup-news`

**Manuell triggern:**
```bash
curl -X GET https://your-domain.com/api/cron/cleanup-news \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Fallback-Verhalten

Falls APIs nicht verfügbar sind:

- **Kein Supabase:** News werden aus Finnhub + DeepL geladen (funktioniert, aber nicht persistent)
- **Kein Finnhub Key:** Alte News aus Supabase werden angezeigt (wenn vorhanden)
- **Kein DeepL Key:** News werden auf Englisch angezeigt (mit Warning-Log)
- **DeepL Fehler:** News werden auf Englisch angezeigt
- **API Rate Limit:** Gespeicherte News aus Supabase werden weiter ausgeliefert

## Kosten-Übersicht

| Service | Plan | Kosten | Limit |
|---------|------|--------|-------|
| Finnhub | Free | €0 | 60 calls/min |
| DeepL | API Free | €0 | 500k chars/month |
| Vercel | Hobby | €0 | 100 GB bandwidth |
| **Total** | | **€0** | |

## Performance

- **First Load (cold):** ~2-3s (Finnhub + DeepL + Supabase Store)
- **Subsequent Loads:** ~100-200ms (Supabase Query)
- **Translation Time:** ~500ms (nur neue News)
- **Storage Hit Rate:** ~95% (News aus Supabase)

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
