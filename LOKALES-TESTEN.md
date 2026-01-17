# Lokales Testen - Anleitung

## Lokale Entwicklungsumgebung einrichten

### 1. Environment Variables prüfen

Die `.env.local` Datei sollte bereits existieren mit:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `FINNHUB_API_KEY`

**Wichtig:** Diese Datei ist in `.gitignore` und wird NICHT committet!

### 2. Lokalen Dev Server starten

```bash
npm run dev
```

Die App läuft dann auf `http://localhost:3000`

### 3. Mit Production-Datenbank verbunden

**WICHTIG:** Die lokale Entwicklung ist mit der **GLEICHEN** Supabase-Datenbank verbunden wie Production!

Das bedeutet:
- ✅ Du siehst die gleichen Daten wie auf Vercel
- ✅ Änderungen an Daten wirken sich auf Production aus
- ⚠️ Sei vorsichtig beim Testen von Admin-Funktionen!

### 4. Admin-Zugang lokal testen

1. Stelle sicher, dass dein Account Admin-Rechte hat (siehe `set-admin.sql`)
2. Starte den Dev Server: `npm run dev`
3. Gehe zu `http://localhost:3000/konto` und logge dich ein
4. Gehe zu `http://localhost:3000/admin`
5. Du solltest das Admin-Dashboard sehen

### 5. Lokale Änderungen testen OHNE Production zu beeinflussen

**Option A: Separate Supabase Projekt für Development**

1. Erstelle ein neues Supabase Projekt für Development
2. Kopiere `.env.local` zu `.env.development.local`
3. Setze die Development-Keys in `.env.development.local`
4. Starte mit: `npm run dev` (Next.js lädt automatisch `.env.development.local`)

**Option B: Test-Branch verwenden**

1. Erstelle einen Test-Branch: `git checkout -b test-feature`
2. Mache deine Änderungen
3. Teste lokal
4. Wenn alles funktioniert → Merge in main

### 6. Typische Workflows

**Neue Feature entwickeln:**
```bash
# 1. Neuen Branch erstellen
git checkout -b feature/neue-funktion

# 2. Änderungen machen
# ... code ändern ...

# 3. Lokal testen
npm run dev

# 4. Committen und pushen
git add .
git commit -m "Add neue Funktion"
git push origin feature/neue-funktion

# 5. Auf Vercel testen (automatisches Preview Deployment)
# 6. Wenn OK → In main mergen
```

**Hotfix für Production:**
```bash
# 1. Direkt auf main arbeiten (in Worktree)
cd C:\Users\loel\.claude-worktrees\3.0\sweet-ramanujan

# 2. Änderungen machen und testen
npm run dev

# 3. Committen und pushen
git add .
git commit -m "Fix critical bug"
git push origin HEAD:main

# 4. Vercel deployed automatisch
```

### 7. Wichtige Hinweise

- **Build lokal testen:** `npm run build` vor dem Push
- **Type Checks:** `npm run type-check` (falls vorhanden)
- **Lint:** `npm run lint`
- **Production Build lokal starten:**
  ```bash
  npm run build
  npm start
  ```

### 8. Troubleshooting

**"Session abgelaufen" im Admin:**
- Lösche Cookies und logge dich neu ein
- Prüfe ob `.env.local` die richtigen Supabase Keys hat

**"Zugriff verweigert: Admin-Rechte erforderlich":**
- Führe `set-admin.sql` in Supabase aus
- Logge dich neu ein

**API Routes funktionieren nicht:**
- Prüfe ob `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` gesetzt ist
- Starte den Dev Server neu

## Zusammenfassung

- ✅ Lokale Entwicklung ist **mit Production-DB** verbunden
- ✅ Für isoliertes Testen → Separates Supabase Projekt
- ✅ Vercel erstellt automatisch Preview Deployments für Branches
- ✅ Main Branch = Production
