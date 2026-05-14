# 🚀 Quick Start — SEO Automatisierung

Schnelleinstieg in 30 Minuten.

---

## ✅ Schritt 1: Installation (5 Minuten)

```bash
# Repository klonen
git clone <repo-url>
cd STUDIO-OK

# Dependencies installieren
npm install

# SEO-Tools installieren
npm install sharp puppeteer @google-analytics/data
```

---

## ✅ Schritt 2: Konfiguration (10 Minuten)

### 2.1 Environment Variables

```bash
# .env Datei erstellen
cp .env.example .env
```

**Minimale Konfiguration für Start:**
```env
SITE_URL=https://webstudio-ok.de
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=username
GITHUB_REPO=studio-ok
```

**Vollständige Konfiguration später:**
- Google Analytics (für Tracking)
- Resend API (für Review-Emails)
- Social Media APIs (für Auto-Posting)

### 2.2 GitHub Token erstellen

1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. Scope: `repo` (voller Zugriff)
4. Token kopieren → In `.env` einfügen

---

## ✅ Schritt 3: Erste Tests (10 Minuten)

### 3.1 Development Server starten

```bash
npm run dev
```

Öffne: http://localhost:3000

### 3.2 Admin-Panel testen

**⚠️ WICHTIG: Ändere zuerst das Passwort!**

```bash
# Generiere Hash für neues Passwort
npm run password:generate MeinNeuesPasswort123

# Kopiere Hash und ersetze in src/pages/Admin.tsx
# Finde: const ADMIN_PASSWORD_HASH = '...'
```

**Testing:**

1. Öffne: http://localhost:3000/admin

2. **Screen 1: Passwort**
   - Standard-Passwort: `password` (ändere es!)
   - Gib Passwort ein
   - Klicke "ZUGANG GEWÄHREN"

3. **Screen 2: GitHub**
   - Gib GitHub Token ein
   - Gib Owner, Repo, Branch ein
   - Klicke "VERBINDEN"

4. Erstelle Test-Artikel
5. Prüfe: Automatischer Commit zu GitHub ✅

**Mehr Info:** Siehe [ADMIN_PASSWORD_SETUP.md](ADMIN_PASSWORD_SETUP.md)

### 3.3 SEO-Tools testen

```bash
# Sitemap generieren
npm run sitemap

# Keyword Research
npm run keywords:research

# OG Images generieren (benötigt Puppeteer)
npm run og:generate

# Backlinks prüfen
npm run backlinks:check
```

---

## ✅ Schritt 4: Google Setup (5 Minuten)

### 4.1 Google My Business

**Wichtigste Aufgabe für lokales SEO!**

1. Gehe zu: https://business.google.com/
2. Erstelle Profil für "OK Studio"
3. Adresse: Kreuztal, Siegerland
4. Kategorie: Webdesigner
5. Verifizierung: Per Postkarte (dauert 5-7 Tage)

### 4.2 Google Search Console

1. Gehe zu: https://search.google.com/search-console
2. Property hinzufügen: `https://webstudio-ok.de`
3. Verifizierung: HTML-Tag oder DNS
4. Sitemap einreichen: `https://webstudio-ok.de/sitemap.xml`

### 4.3 Google Analytics (optional, aber empfohlen)

1. Gehe zu: https://analytics.google.com/
2. Property erstellen (GA4)
3. Measurement ID kopieren
4. In `.env` einfügen: `GA4_MEASUREMENT_ID=G-XXXXXXXXXX`
5. Tracking Code generieren:
   ```bash
   npm run analytics:setup
   ```
6. Code in `index.html` einfügen

---

## 🎯 Was jetzt funktioniert

### ✅ Sofort verfügbar:
- Admin-Panel mit GitHub CMS
- Markdown-Editor mit Live-Preview
- Automatische Sitemap-Generierung
- Keyword Research Tool
- Backlink-Monitoring (Demo-Modus)

### ⚠️ Benötigt Setup:
- OG Image-Generierung (Puppeteer installiert?)
- Social Media Posting (API Keys fehlen)
- Review-Anfragen (Resend API fehlt)
- Analytics-Tracking (GA4 nicht konfiguriert)

---

## 📅 Nächste 7 Tage

### Tag 1-2: Content
- [ ] 2 neue Artikel schreiben
- [ ] Bilder optimieren
- [ ] OG Images generieren

### Tag 3-4: Google
- [ ] Google My Business verifizieren
- [ ] Google Analytics einrichten
- [ ] Search Console konfigurieren

### Tag 5-6: Backlinks
- [ ] 5 Business Directories eintragen
  - Gelbe Seiten
  - Das Örtliche
  - 11880.com
  - Bing Places
  - Yelp
- [ ] Social Media Profile erstellen
  - LinkedIn Company Page
  - Facebook Business
  - XING

### Tag 7: Automation
- [ ] GitHub Actions einrichten
- [ ] Erste Review-Anfrage senden
- [ ] Wöchentlichen Report testen

---

## 🆘 Troubleshooting

### Problem: "npm run og:generate" schlägt fehl
**Lösung:**
```bash
npm install puppeteer
# Warte auf Installation (kann 2-3 Minuten dauern)
npm run og:generate
```

### Problem: Admin-Panel zeigt "Token ungültig"
**Lösung:**
1. Prüfe Token in `.env`
2. Prüfe Scope: Muss `repo` sein
3. Erstelle neuen Token falls nötig

### Problem: "Module not found: sharp"
**Lösung:**
```bash
npm install sharp
```

### Problem: Sitemap ist leer
**Lösung:**
```bash
# Prüfe ob Daten vorhanden sind
ls public/data/insights/
ls public/data/projects/

# Sitemap neu generieren
npm run sitemap
```

---

## 📚 Nächste Schritte

### Für Entwickler:
1. Lies: [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)
2. Konfiguriere: GitHub Actions
3. Teste: Alle Automatisierungs-Tools

### Für Content-Ersteller:
1. Lies: [COMPLETE_SEO_AUDIT.md](COMPLETE_SEO_AUDIT.md)
2. Nutze: Keyword Research Tool
3. Schreibe: 2-3 Artikel pro Monat

### Für Marketing:
1. Lies: [LOCAL_SEO_GUIDE.md](LOCAL_SEO_GUIDE.md)
2. Setup: Google My Business
3. Sammle: Erste 5 Reviews

---

## 🎉 Fertig!

Du hast jetzt:
- ✅ Funktionierendes Admin-Panel
- ✅ SEO-Tools installiert
- ✅ Erste Tests durchgeführt
- ✅ Google-Setup begonnen

**Nächster Schritt:** Schreibe deinen ersten Artikel! 📝

---

## 💡 Tipps

### Content-Erstellung:
- Nutze Keyword Research Tool für Ideen
- Schreibe 1500-2000 Wörter pro Artikel
- Verwende Markdown für Formatierung
- Füge Bilder hinzu (werden automatisch optimiert)

### SEO-Optimierung:
- Fokus auf Long-Tail Keywords (niedrige Konkurrenz)
- Lokale Keywords verwenden (Kreuztal, Siegen)
- Fragen beantworten (Was kostet...? Wie funktioniert...?)
- Interne Links setzen

### Backlink-Aufbau:
- Starte mit Business Directories (einfach!)
- Erstelle Social Media Profile
- Schreibe Gastbeiträge (später)
- Baue Partnerschaften auf

---

## 📞 Hilfe benötigt?

- **Dokumentation:** Siehe [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)
- **CLI-Hilfe:** `npx tsx <tool-name>.ts --help`
- **Issues:** Öffne GitHub Issue

---

**Viel Erfolg! 🚀**
