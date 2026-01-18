# News Feature Setup

BeyondCharts verwendet Finnhub für Asset-News (in Englisch) und Supabase für persistentes 14-Tage-Storage.

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


## Wie es funktioniert

1. **Finnhub** liefert englische Asset-News mit Bildern (20 Items pro Anfrage)
2. **Supabase** speichert News persistent für 14 Tage
3. **Auto-Cleanup** löscht News älter als 14 Tage (täglich um 3 Uhr)
4. **ISR** regeneriert die Seite alle 2 Stunden (nur wenn keine frischen News im Storage)
5. **Direct Links** News verlinken direkt zur Original-Quelle (keine Detail-Seite)

### Vorteile des persistenten Storage:

- **Keine wiederholten API-Calls:** News werden einmal gefetcht und 14 Tage lang gespeichert
- **Schnellere Ladezeiten:** Zugriff auf Supabase-DB schneller als Finnhub
- **News-Archiv:** Benutzer können bis zu 14 Tage alte News sehen
- **Kostenlos:** Nur Finnhub Free Tier nötig (60 calls/minute)

## API Rate Limits & Caching

### Finnhub
- **Limit:** 60 calls/minute
- **Nutzung:** ~2 calls alle 30 Minuten (Market News + Symbol News)
- **Täglich:** ~96 calls/Tag (weit unter dem Limit)

### Supabase Storage

Mit persistentem Storage in Supabase:
- **Fetch Interval:** Alle 2 Stunden (nur wenn keine News im Storage)
- **Storage Duration:** 14 Tage
- **Finnhub Usage:** ~12 Updates/Tag × 2 calls = ~24 calls/Tag
- **Monatlich:** ~720 calls/Monat ✅ Weit unter Limit!

## Monitoring

### Logs

Die News-Feature loggt alle wichtigen Events:

```bash
[News Storage] News are 120 minutes old - using stored
[API] Serving 50 news items from storage
[API] Fetching fresh news from Finnhub API...
[Unified News] Fetched 20 news items from Finnhub
[API] Stored 20 news items in Supabase
[Cron Cleanup] Deleted 5 old news items
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

- **Kein Supabase:** News werden direkt von Finnhub geladen (funktioniert, aber nicht persistent)
- **Kein Finnhub Key:** Alte News aus Supabase werden angezeigt (wenn vorhanden)
- **API Rate Limit:** Gespeicherte News aus Supabase werden weiter ausgeliefert

## Kosten-Übersicht

| Service | Plan | Kosten | Limit |
|---------|------|--------|-------|
| Finnhub | Free | €0 | 60 calls/min |
| Supabase | Free | €0 | 500 MB DB |
| Vercel | Hobby | €0 | 100 GB bandwidth |
| **Total** | | **€0** | |

## Performance

- **First Load (cold):** ~1-2s (Finnhub + Supabase Store)
- **Subsequent Loads:** ~100-200ms (Supabase Query)
- **Storage Hit Rate:** ~95% (News aus Supabase)

## Troubleshooting

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
