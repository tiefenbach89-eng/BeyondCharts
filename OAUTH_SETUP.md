# OAuth Setup - Google & Apple

## Übersicht
Dieses Dokument erklärt, wie Sie Google und Apple OAuth für BeyondCharts in Supabase konfigurieren.

---

## 1. Google OAuth einrichten

### Schritt 1: Google Cloud Console
1. Gehen Sie zu [Google Cloud Console](https://console.cloud.google.com/)
2. Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus
3. Navigieren Sie zu **APIs & Services** > **Credentials**

### Schritt 2: OAuth 2.0 Client ID erstellen
1. Klicken Sie auf **+ CREATE CREDENTIALS** > **OAuth client ID**
2. Wählen Sie **Application type**: Web application
3. Name: `BeyondCharts`
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://yourdomain.com
   ```
5. **Authorized redirect URIs**:
   ```
   https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   ```
   Ersetzen Sie `[YOUR_SUPABASE_PROJECT_ID]` mit Ihrer tatsächlichen Supabase Project ID

6. Klicken Sie auf **CREATE**
7. Kopieren Sie **Client ID** und **Client Secret**

### Schritt 3: In Supabase konfigurieren
1. Gehen Sie zu Ihrem Supabase Dashboard
2. **Authentication** > **Providers** > **Google**
3. Aktivieren Sie Google
4. Fügen Sie die **Client ID** und **Client Secret** ein
5. Speichern Sie die Änderungen

---

## 2. Apple OAuth einrichten

### Schritt 1: Apple Developer Account
1. Gehen Sie zu [Apple Developer](https://developer.apple.com/)
2. Navigieren Sie zu **Certificates, Identifiers & Profiles**

### Schritt 2: Services ID erstellen
1. Klicken Sie auf **Identifiers** > **+** (neues hinzufügen)
2. Wählen Sie **Services IDs** > Continue
3. **Description**: `BeyondCharts`
4. **Identifier**: `com.beyondcharts.web` (oder Ihre eigene)
5. Aktivieren Sie **Sign in with Apple**
6. Klicken Sie auf **Configure**

### Schritt 3: Domains und Redirect URLs konfigurieren
1. **Domains and Subdomains**:
   ```
   [YOUR_SUPABASE_PROJECT_ID].supabase.co
   ```
2. **Return URLs**:
   ```
   https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   ```
3. Speichern Sie die Konfiguration

### Schritt 4: Private Key erstellen
1. Navigieren Sie zu **Keys** > **+** (neue Key erstellen)
2. **Key Name**: `BeyondCharts Sign in with Apple`
3. Aktivieren Sie **Sign in with Apple**
4. Klicken Sie auf **Configure** und wählen Sie Ihre Services ID
5. **Download** die Private Key (.p8 Datei)
6. Notieren Sie sich die **Key ID**

### Schritt 5: Team ID finden
1. Gehen Sie zu Ihrem [Apple Developer Account](https://developer.apple.com/account)
2. Ihre **Team ID** finden Sie oben rechts unter Ihrem Namen

### Schritt 6: In Supabase konfigurieren
1. Gehen Sie zu Ihrem Supabase Dashboard
2. **Authentication** > **Providers** > **Apple**
3. Aktivieren Sie Apple
4. Fügen Sie folgende Informationen ein:
   - **Services ID**: `com.beyondcharts.web` (Ihre Services ID)
   - **Team ID**: Ihre Team ID
   - **Key ID**: Die Key ID vom Private Key
   - **Private Key**: Öffnen Sie die .p8 Datei und kopieren Sie den gesamten Inhalt
5. Speichern Sie die Änderungen

---

## 3. Datenbank-Migration ausführen

Führen Sie das SQL-Script aus, um das Name-Feld zur Profiles-Tabelle hinzuzufügen:

1. Gehen Sie zu Supabase Dashboard > **SQL Editor**
2. Öffnen Sie `supabase/add-name-to-profiles.sql`
3. Führen Sie das Script aus

```sql
-- Add name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Update the handle_new_user function to support name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, name)
  VALUES (
    NEW.id,
    NEW.email,
    'user',
    COALESCE(NEW.raw_user_meta_data->>'name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 4. Testen

### Registrierung testen:
1. Gehen Sie zu `/register`
2. Testen Sie:
   - ✅ E-Mail + Passwort Registrierung (mehrstufig)
   - ✅ Google OAuth
   - ✅ Apple OAuth

### Login testen:
1. Gehen Sie zu `/login`
2. Testen Sie:
   - ✅ E-Mail + Passwort Login
   - ✅ Google OAuth Login
   - ✅ Apple OAuth Login

### Account-Seite testen:
1. Gehen Sie zu `/konto`
2. Überprüfen Sie, ob der Name angezeigt wird
3. Testen Sie das Ändern des Namens

---

## Troubleshooting

### Google OAuth funktioniert nicht
- Stellen Sie sicher, dass die Redirect URI exakt mit Ihrer Supabase URL übereinstimmt
- Überprüfen Sie, ob Client ID und Secret korrekt eingefügt wurden
- Prüfen Sie die Browser-Konsole auf Fehler

### Apple OAuth funktioniert nicht
- Stellen Sie sicher, dass die Private Key (.p8) vollständig kopiert wurde
- Team ID und Key ID müssen exakt übereinstimmen
- Die Services ID muss mit der in Supabase konfigurierten übereinstimmen

### Benutzer wird nicht in profiles Tabelle erstellt
- Überprüfen Sie, ob der Trigger `on_auth_user_created` aktiv ist
- Führen Sie `supabase-setup.sql` erneut aus
- Prüfen Sie die Supabase Logs auf Fehler

---

## Nächste Schritte

1. ✅ Datenbank-Migration ausführen (`add-name-to-profiles.sql`)
2. ⏳ Google OAuth in Supabase konfigurieren
3. ⏳ Apple OAuth in Supabase konfigurieren
4. ✅ Registrierung und Login testen
5. ✅ Account-Seite testen

---

**Wichtig:** Ohne OAuth-Konfiguration werden die Google/Apple Login-Buttons einen Fehler werfen. Die E-Mail/Passwort-Registrierung funktioniert bereits jetzt!
