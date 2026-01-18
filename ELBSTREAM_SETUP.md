# Elbstream API Setup

## Übersicht
BeyondCharts nutzt die **Elbstream Stock News API**, um aktuelle Nachrichten zu beliebten Assets anzuzeigen.

## API-Key erhalten

1. Besuche [https://elbstream.com/](https://elbstream.com/)
2. Kontaktiere das Sales-Team: **sales@elbstream.com**
3. Fordere einen API-Key für die Stock News API an

## Konfiguration

### 1. Environment Variable setzen

Füge deinen API-Key zur `.env.local` Datei hinzu:

```bash
ELBSTREAM_API_KEY=dein_api_key_hier
```

### 2. Vercel Deployment

Wenn du auf Vercel deployst, füge die Environment Variable hinzu:

1. Gehe zu deinem Vercel Project Dashboard
2. Settings → Environment Variables
3. Füge hinzu:
   - **Name**: `ELBSTREAM_API_KEY`
   - **Value**: Dein API-Key
   - **Environment**: Production, Preview, Development

## Features

### Asset News Integration

Die Elbstream-Integration bietet:

- **Echtzeit-Nachrichten** zu beliebten Assets
- **Deutsche Lokalisierung** der News-Feeds
- **Asset-Logos** über die Logo-API
- **Automatische Updates** alle 5 Minuten

### Unterstützte Assets

Aktuell werden folgende beliebte Assets abgedeckt (definiert in `lib/elbstream.ts`):

**US-Aktien:**
- Apple (US0378331005)
- Microsoft (US5949181045)
- Tesla (US88160R1014)
- Amazon (US0231351067)
- Alphabet/Google (US02079K3059)

**Deutsche/Europäische Aktien:**
- Deutsche Bank (DE0005140008)
- BASF (DE000BASF111)
- SAP (DE0007164600)
- Deutsche Telekom (DE0005557508)
- Allianz (DE0008469008)
- Airbus (NL0000009538)
- Commerzbank (DE000CBK1001)
- Deutsche Börse (DE0005810055)

## Verwendung

### Server-Side (Empfohlen)

```typescript
import { fetchElbstreamNews, POPULAR_ASSET_ISINS } from '@/lib/elbstream';

// Fetch news for popular assets
const newsData = await fetchElbstreamNews('de', 10, POPULAR_ASSET_ISINS);
```

### API Route

Die News werden über `/api/asset-news` bereitgestellt:

```typescript
const response = await fetch('/api/asset-news');
const data = await response.json();
```

### Komponenten

Die `AssetNewsSection` Komponente zeigt die News an:

```tsx
import { AssetNewsSection } from '@/components/news/AssetNewsSection';

<AssetNewsSection initialNews={assetNewsData.data} />
```

## API-Limits

- Die Elbstream API hat möglicherweise Rate Limits
- News werden alle **5 Minuten** gecacht (Next.js Revalidation)
- Für Details zu Limits, kontaktiere Elbstream

## Troubleshooting

### Keine News werden angezeigt

1. **Prüfe API-Key**: Stelle sicher, dass `ELBSTREAM_API_KEY` gesetzt ist
2. **Prüfe Logs**: Schaue in der Konsole nach Fehlermeldungen
3. **Prüfe API-Status**: Teste den API-Endpoint manuell

### API-Fehler

Wenn die API einen Fehler zurückgibt:
- Prüfe, ob dein API-Key noch gültig ist
- Prüfe, ob du das Rate Limit erreicht hast
- Kontaktiere Elbstream Support

## Weitere Informationen

- **API-Dokumentation**: https://api.elbstream.com/docs
- **OpenAPI-Spec**: https://api.elbstream.com/openapi.json
- **Support**: sales@elbstream.com

## Optional: Erweiterte Konfiguration

### Mehr Assets hinzufügen

Bearbeite `lib/elbstream.ts` und füge ISINs zu `POPULAR_ASSET_ISINS` hinzu:

```typescript
export const POPULAR_ASSET_ISINS = [
  'US0378331005', // Apple
  'DE0005140008', // Deutsche Bank
  // ... mehr ISINs hinzufügen
];
```

### Asset-Logos verwenden

```typescript
import { getAssetLogoUrl } from '@/lib/elbstream';

const logoUrl = getAssetLogoUrl('US0378331005', 'svg', 128);
```

### Most Discussed Assets

```typescript
import { fetchMostDiscussedAssets } from '@/lib/elbstream';

const trending = await fetchMostDiscussedAssets();
```
