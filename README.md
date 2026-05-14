<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Web Studio OK — Portfolio & CMS mit SEO-Automatisierung 🤖

Brutalistisches Portfolio-Website mit GitHub-basiertem CMS, automatischem Deployment und **vollautomatischer SEO-Optimierung**.

## 🚀 Features

### Core
- ✅ **React 19 + TypeScript** — Moderne Tech-Stack
- ✅ **GitHub als CMS** — Keine Datenbank, alle Daten in JSON
- ✅ **Auto-Deploy** — Jede Änderung triggert Vercel Deployment
- ✅ **Markdown Support** — Formatierung mit Live-Preview
- ✅ **Performance** — 87% weniger Traffic durch optimierte Datenstruktur
- ✅ **Admin-Panel** — Einfache Verwaltung von Projekten und Artikeln

### SEO & Marketing (NEU! 🤖)
- 📊 **Automatische Sitemap-Generierung** — Bei jedem Build aktualisiert
- 🖼️ **OG Image Generator** — Schöne Social Media Previews
- 📱 **Social Media Auto-Posting** — LinkedIn, Facebook, Twitter, XING
- ⭐ **Review-Request System** — Automatische Google-Bewertungs-Anfragen
- 📈 **Analytics Tracking** — Google Analytics 4 mit Custom Events
- 🔗 **Backlink Monitoring** — Überwacht alle Backlinks wöchentlich
- 🖼️ **Image Optimization** — WebP Konvertierung + Responsive Sizes
- 🌍 **Lokales SEO** — Optimiert für Kreuztal, Siegerland, NRW

## 📦 Installation

**Prerequisites:** Node.js 18+

1. Clone repository:
   ```bash
   git clone <repo-url>
   cd STUDIO-OK
   ```

2. Install dependencies:
   ```bash
   npm install
   
   # Optional: SEO-Tools installieren
   npm install sharp puppeteer @google-analytics/data
   ```

3. Create `.env` file:
   ```bash
   # Website
   SITE_URL=https://webstudio-ok.de
   
   # GitHub (für Admin-Panel)
   GITHUB_TOKEN=ghp_...
   GITHUB_OWNER=username
   GITHUB_REPO=studio-ok
   GITHUB_BRANCH=main
   
   # Google Analytics
   GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   GA4_PROPERTY_ID=123456789
   
   # Google My Business
   GOOGLE_REVIEW_LINK=https://g.page/r/YOUR_PLACE_ID/review
   
   # Email (Resend)
   RESEND_API_KEY=re_...
   
   # Social Media (optional)
   LINKEDIN_ACCESS_TOKEN=...
   FACEBOOK_ACCESS_TOKEN=...
   TWITTER_BEARER_TOKEN=...
   ```

4. Run locally:
   ```bash
   npm run dev
   ```

   Open http://localhost:3000

## 🏗️ Build & Deploy

```bash
npm run build    # Generiert Sitemap + Build
npm run preview  # Preview production build
```

**Auto-Deploy:**
- Push to `main` branch → GitHub Actions → Vercel Deploy

## 🤖 SEO Automatisierung

### Quick Commands

```bash
# Sitemap generieren
npm run sitemap

# OG Images erstellen
npm run og:generate

# Bilder optimieren
npm run images:optimize public/images/hero.jpg

# Social Media Post
npm run social:post:insight ki-im-mittelstand
npm run social:post:project kraftwerk-digital

# Review-Anfragen
npm run reviews:send "Max Müller" max@example.com "Website Relaunch"
npm run reviews:stats

# Analytics
npm run analytics:setup    # Tracking Code generieren
npm run analytics:report   # Wöchentlicher Report
npm run analytics:hook     # React Hook erstellen

# Backlinks
npm run backlinks:check    # Alle Backlinks prüfen
npm run backlinks:list     # Alle Backlinks anzeigen

# Alles auf einmal
npm run seo:full
```

### Detaillierte Dokumentation

Siehe **[AUTOMATION_GUIDE.md](./AUTOMATION_GUIDE.md)** für:
- ✅ Setup-Anleitung für alle Tools
- ✅ Workflow-Automatisierung mit GitHub Actions
- ✅ 30-Tage SEO-Challenge
- ✅ ROI-Berechnung (500-1500%)
- ✅ Troubleshooting

Siehe **[COMPLETE_SEO_AUDIT.md](./COMPLETE_SEO_AUDIT.md)** für:
- ✅ Vollständiger SEO-Audit
- ✅ Was fehlt für Top-3 Ranking
- ✅ Prioritäten & Roadmap
- ✅ Erwartete Ergebnisse

## 📁 Datenstruktur

```
public/data/
├── projects/
│   ├── index.json              # Liste (ohne fullDescription)
│   └── projekt-slug.json       # Vollständiger Inhalt
├── insights/
│   ├── index.json              # Liste (ohne content)
│   └── artikel-slug.json       # Vollständiger Inhalt
├── clients.json
├── faqs.json
└── settings.json

automation/                      # SEO Automatisierungs-Tools
├── optimize-images.ts           # Bildoptimierung
├── generate-og-images-puppeteer.ts  # OG Image Generator
├── social-auto-post.ts          # Social Media Posting
├── review-request-system.ts     # Review-Anfragen
├── analytics-tracker.ts         # Analytics & Reporting
├── backlink-monitor.ts          # Backlink-Überwachung
└── generate-sitemap.ts          # Sitemap-Generator
```

**Vorteile:**
- 87% weniger Traffic beim Laden von Listen
- Besseres Caching
- Einfachere Git-Diffs

Siehe [DATA_STRUCTURE.md](DATA_STRUCTURE.md) für Details.

## 🎨 Admin-Panel

**URL:** `/admin`

**Sicherheit:**
- 🔐 **Passwortschutz** — Zweistufige Authentifizierung
- 🔑 **GitHub Token** — Sichere Repository-Verbindung
- 🛡️ **Rate Limiting** — Schutz vor Brute-Force
- 🚪 **Session-based** — Automatischer Logout

**Features:**
- GitHub Token Authentication
- Markdown Editor mit Live-Preview
- Syntax-Hilfe für Markdown
- Automatisches Sitemap-Update
- Direktes Commit zu GitHub

**Setup:**
1. **Passwort ändern** (WICHTIG!):
   ```bash
   npm run password:generate MeinSicheresPasswort123
   ```
   Siehe [ADMIN_PASSWORD_SETUP.md](ADMIN_PASSWORD_SETUP.md)

2. Erstelle GitHub Personal Access Token mit `repo` scope
3. Öffne `/admin`
4. Gib Passwort ein
5. Gib Token, Owner, Repo ein
6. Verwalte Inhalte

**Standard-Passwort:** `password` (⚠️ ÄNDERN!)

## 🔍 SEO Status

### ✅ Was bereits funktioniert:
- Technisches SEO (100%)
- On-Page SEO (90%)
- Performance (95%)
- Lokales SEO (90%)
- Automatisierung (70%)

### 🚧 Was noch fehlt (für Top-3):
- Mehr Content (20+ Artikel)
- Backlinks (50+ Links)
- Google Reviews (20+ Bewertungen)
- Google My Business Profil
- Zeit (6-12 Monate)

### 📈 Erwartete Ergebnisse:
- **Monat 3:** Top-20 für lokale Keywords
- **Monat 6:** Top-10 für lokale Keywords
- **Monat 12:** **TOP-3 für "webdesign kreuztal"** 🎯

**Automatisch generiert:**
- ✅ Sitemap.xml (14 URLs)
- ✅ Robots.txt
- ✅ Meta-Tags (Title, Description, OG)
- ✅ Schema.org (LocalBusiness, Article, FAQ)
- ✅ Security Headers (CSP, X-Frame-Options)
- ✅ OG Images für Social Media
- ✅ Responsive Bilder (WebP)

**Nach Deploy:**
1. Google Search Console registrieren
2. Sitemap einreichen: `https://webstudio-ok.de/sitemap.xml`
3. Indexierung anfordern

Siehe [SEO_AUDIT.md](SEO_AUDIT.md) und [COMPLETE_SEO_AUDIT.md](COMPLETE_SEO_AUDIT.md) für vollständigen Audit.

## 💡 Quick Start für SEO

### Woche 1: Setup (2-3 Stunden)
```bash
# 1. Google My Business erstellen
# 2. Google Analytics einrichten
npm run analytics:setup

# 3. Erste Backlinks aufbauen
npm run backlinks:add "Google My Business" "https://..." "directory"

# 4. Review-System aktivieren
npm run reviews:send "Erster Kunde" kunde@example.com "Projekt"
```

### Woche 2: Content (10-15 Stunden)
```bash
# 1. 2 neue Artikel schreiben (Admin-Panel)
# 2. OG Images generieren
npm run og:generate

# 3. Social Media posten
npm run social:post:insight neuer-artikel
```

### Woche 3: Automation (5-8 Stunden)
```bash
# 1. GitHub Actions einrichten
# 2. Wöchentliche Reports aktivieren
npm run analytics:report
npm run backlinks:check

# 3. Monitoring Dashboard erstellen
```

## 📝 Scripts

```bash
# Development
npm run dev       # Development server
npm run build     # Production build (mit Sitemap)
npm run lint      # TypeScript check

# SEO Automation
npm run sitemap                  # Sitemap generieren
npm run og:generate              # OG Images erstellen
npm run images:optimize          # Bilder optimieren
npm run social:post:insight      # Social Media Post (Artikel)
npm run social:post:project      # Social Media Post (Projekt)
npm run reviews:send             # Review-Anfrage senden
npm run reviews:batch            # Batch Review-Anfragen
npm run reviews:stats            # Review Statistiken
npm run analytics:setup          # Analytics Setup
npm run analytics:report         # Analytics Report
npm run analytics:hook           # Analytics Hook erstellen
npm run backlinks:check          # Backlinks prüfen
npm run backlinks:add            # Backlink hinzufügen
npm run backlinks:list           # Backlinks auflisten
npm run seo:full                 # Alle SEO-Tasks
```

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Routing:** React Router v7
- **Animation:** Motion (Framer Motion)
- **Markdown:** react-markdown + remark-gfm
- **Build:** Vite 6
- **Deploy:** Vercel
- **CMS:** GitHub API
- **SEO Tools:** Sharp, Puppeteer, Google Analytics Data API

## 📚 Dokumentation

- **[AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md)** — Vollständiger Automatisierungs-Guide
- **[COMPLETE_SEO_AUDIT.md](COMPLETE_SEO_AUDIT.md)** — SEO-Audit & Roadmap
- **[LOCAL_SEO_GUIDE.md](LOCAL_SEO_GUIDE.md)** — Lokales SEO für Kreuztal
- **[DATA_STRUCTURE.md](DATA_STRUCTURE.md)** — Datenstruktur & API
- **[SEO_AUDIT.md](SEO_AUDIT.md)** — Basis SEO-Audit
- **[security_spec.md](security_spec.md)** — Security Spezifikation

## 🎯 Ziele

### Kurzfristig (3 Monate):
- 30+ Backlinks
- 10+ Artikel
- 10+ Google Reviews
- Top-20 für "webdesign kreuztal"

### Mittelfristig (6 Monate):
- 50+ Backlinks
- 20+ Artikel
- 20+ Reviews
- Top-10 für lokale Keywords

### Langfristig (12 Monate):
- 100+ Backlinks
- 40+ Artikel
- 50+ Reviews
- **TOP-3 für "webdesign kreuztal"** 🏆

### ROI: **500-1500%** 🚀

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📄 License

Private project — All rights reserved

---

**Entwickelt mit ❤️ in Kreuztal, Siegerland, NRW**
