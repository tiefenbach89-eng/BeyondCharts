# Marketaux API Setup

## Übersicht
BeyondCharts nutzt die **Marketaux Stock News API**, um aktuelle Nachrichten zu beliebten Assets anzuzeigen. Marketaux ist eine **kostenlose API** ohne Kreditkarte erforderlich.

## API-Key erhalten

1. Besuche [https://www.marketaux.com/](https://www.marketaux.com/)
2. Klicke auf **"GET FREE API KEY"**
3. Registriere dich mit deiner E-Mail-Adresse
4. Erhalte sofort deinen kostenlosen API-Token (keine Kreditkarte erforderlich!)

## Konfiguration

### 1. Environment Variable setzen

Füge deinen API-Token zur `.env.local` Datei hinzu:

```bash
MARKETAUX_API_TOKEN=dein_api_token_hier
```

### 2. Vercel Deployment

Wenn du auf Vercel deployst, füge die Environment Variable hinzu:

1. Gehe zu deinem Vercel Project Dashboard
2. Settings → Environment Variables
3. Füge hinzu:
   - **Name**: `MARKETAUX_API_TOKEN`
   - **Value**: Dein API-Token
   - **Environment**: Production, Preview, Development

## Features

### Asset News Integration

Die Marketaux-Integration bietet:

- **Echtzeit-Nachrichten** zu beliebten Assets (keine 24h Verzögerung!)
- **5,000+ Quellen** in 30+ Sprachen
- **80+ globale Märkte** (US, DE, EU, etc.)
- **Sentiment-Analyse** für jedes Asset (-1 bis +1)
- **Entity-Erkennung** mit Match-Score
- **Automatische Updates** alle 5 Minuten

### Unterstützte Assets

Aktuell werden folgende beliebte Assets abgedeckt (definiert in `lib/marketaux.ts`):

**US Tech Giants:**
- Apple (AAPL)
- Microsoft (MSFT)
- Tesla (TSLA)
- Amazon (AMZN)
- Alphabet/Google (GOOGL)
- Meta (META)
- NVIDIA (NVDA)

**Deutsche DAX Unternehmen:**
- SAP (SAP)
- Siemens (SIE.DE)
- Volkswagen (VOW3.DE)
- Deutsche Telekom (DTE.DE)
- Deutsche Bank (DBK.DE)
- Allianz (ALV.DE)
- BASF (BAS.DE)
- BMW (BMW.DE)

## Verwendung

### Server-Side (Empfohlen)

```typescript
import { fetchMarketauxNews, POPULAR_STOCK_SYMBOLS, EUROPEAN_COUNTRIES } from '@/lib/marketaux';

// Fetch news for popular assets
const newsData = await fetchMarketauxNews(
  POPULAR_STOCK_SYMBOLS,
  10,
  'de',
  EUROPEAN_COUNTRIES
);
```

### API Route

Die News werden über `/api/asset-news` bereitgestellt:

```typescript
const response = await fetch('/api/asset-news');
const data = await response.json();
// data.news = Array<MarketauxNewsItem>
// data.meta = { found, returned, limit, page }
```

### Komponenten

Die `AssetNewsSection` Komponente zeigt die News an:

```tsx
import { AssetNewsSection } from '@/components/news/AssetNewsSection';

<AssetNewsSection initialNews={assetNewsData.data} />
```

## API-Limits (Kostenlose Version)

- Die kostenlose Version hat **großzügige Limits**
- Genaue Limits werden nach der Registrierung angezeigt
- **Viel besser als Alpha Vantage** (25 Requests/Tag) oder NewsAPI (24h Verzögerung)
- News werden alle **5 Minuten** gecacht (Next.js Revalidation)

## Sentiment-Analyse

Marketaux bietet automatische Sentiment-Analyse für jedes Asset:

- **Positiv**: Score > 0.1 (grüner Pfeil ↑)
- **Negativ**: Score < -0.1 (roter Pfeil ↓)
- **Neutral**: Score zwischen -0.1 und 0.1 (grauer Strich -)

Das Sentiment wird direkt in den News-Cards angezeigt.

## Troubleshooting

### Keine News werden angezeigt

1. **Prüfe API-Token**: Stelle sicher, dass `MARKETAUX_API_TOKEN` gesetzt ist
2. **Prüfe Logs**: Schaue in der Konsole nach Fehlermeldungen
3. **Prüfe API-Status**: Teste den API-Endpoint manuell

### API-Fehler

Wenn die API einen Fehler zurückgibt:

```bash
# Test manuell mit curl
curl "https://api.marketaux.com/v1/news/all?api_token=DEIN_TOKEN&limit=3&language=de"
```

Mögliche Fehler:
- `invalid_api_token` (401): API-Token ist ungültig
- `usage_limit_reached` (402): Monatliches Limit erreicht
- `rate_limit_reached` (429): Zu viele Anfragen pro Minute

## Weitere Informationen

- **API-Dokumentation**: https://www.marketaux.com/documentation
- **Kostenlos registrieren**: https://www.marketaux.com/ (GET FREE API KEY)
- **5,000+ Quellen** in 30+ Sprachen
- **80+ Märkte** weltweit

## Optional: Erweiterte Konfiguration

### Mehr Assets hinzufügen

Bearbeite `lib/marketaux.ts` und füge Ticker-Symbole zu `POPULAR_STOCK_SYMBOLS` hinzu:

```typescript
export const POPULAR_STOCK_SYMBOLS = [
  'AAPL',   // Apple
  'MSFT',   // Microsoft
  // ... mehr Symbole hinzufügen
  'NFLX',   // Netflix
  'AMD',    // AMD
];
```

### Länder-Filter anpassen

```typescript
export const EUROPEAN_COUNTRIES = ['de', 'fr', 'gb', 'nl', 'ch', 'at'];
```

### Trending Assets abrufen

```typescript
import { fetchTrendingEntities } from '@/lib/marketaux';

const trending = await fetchTrendingEntities();
```

## Vorteile gegenüber Elbstream

✅ **Kostenlos** - Keine Kreditkarte, keine Sales-Anfrage
✅ **Sofortiger Zugriff** - API-Token in Sekunden
✅ **Großzügige Limits** - Viel mehr als 25 Requests/Tag
✅ **Echtzeit-Daten** - Keine 24h Verzögerung
✅ **Sentiment-Analyse** - Automatisch inklusive
✅ **80+ Märkte** - Globale Abdeckung
✅ **5,000+ Quellen** - Breite News-Abdeckung
