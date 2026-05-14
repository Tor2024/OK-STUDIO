# Kontaktdaten Admin Panel — Visuelle Anleitung

**Implementiert:** 14. Mai 2026  
**Feature:** Editierbare Kontaktdaten über Admin Panel

---

## 🎯 WAS WURDE IMPLEMENTIERT?

Die Kontaktdaten auf der Kontaktseite sind jetzt vollständig über das Admin Panel editierbar:
- ✅ E-Mail Adresse
- ✅ Telefonnummer
- ✅ Standort

---

## 📍 WO FINDE ICH DIE NEUEN FELDER?

### Im Admin Panel:

```
1. Admin Panel öffnen (https://your-site.com/admin)
   ↓
2. Passwort eingeben: "password"
   ↓
3. GitHub Token eingeben ODER "DEMO MODUS" klicken
   ↓
4. Tab "EINSTELLUNGEN" klicken
   ↓
5. Runterscrollen zur Sektion "Kontaktdaten"
```

### Layout der Settings-Seite:

```
┌─────────────────────────────────────────┐
│  EINSTELLUNGEN TAB                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ Systemeinstellungen ─────────────┐ │
│  │                                    │ │
│  │  SYSTEMSTATUS                      │ │
│  │  [BETRIEBSBEREIT            ]      │ │
│  │                                    │ │
│  │  NODE LOCATION                     │ │
│  │  [[KREUZTAL NODE 01]...     ]      │ │
│  │                                    │ │
│  │  UPTIME                            │ │
│  │  [99.98%                    ]      │ │
│  │                                    │ │
│  │  ENGINE VERSION                    │ │
│  │  [DESIGN ENGINE v3.4        ]      │ │
│  │                                    │ │
│  │  [SPEICHERN & DEPLOYEN]            │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ Kontaktdaten ─────────────────────┐ │  ← NEU!
│  │                                    │ │
│  │  E-MAIL ADRESSE                    │ │
│  │  [hello@webstudio-ok.de     ]      │ │
│  │                                    │ │
│  │  TELEFON                           │ │
│  │  [+49 (0) 2732 123 456      ]      │ │
│  │                                    │ │
│  │  STANDORT                          │ │
│  │  [Kreuztal, NRW, Deutschland]      │ │
│  │                                    │ │
│  │  [SPEICHERN & DEPLOYEN]            │ │
│  └────────────────────────────────────┘ │
│                                         │
│  ┌─ GITHUB API VERBUNDEN ─────────────┐ │
│  │  username/repo @ main              │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔄 WIE FUNKTIONIERT ES?

### Datenfluss:

```
┌──────────────────┐
│  Admin Panel     │
│  (Settings Tab)  │
└────────┬─────────┘
         │
         │ Benutzer ändert Kontaktdaten
         │
         ↓
┌──────────────────┐
│  "SPEICHERN &    │
│   DEPLOYEN"      │
└────────┬─────────┘
         │
         │ GitHub API Call
         │
         ↓
┌──────────────────────────────┐
│  public/data/settings.json   │
│  {                           │
│    "contact_email": "...",   │
│    "contact_phone": "...",   │
│    "contact_location": "..." │
│  }                           │
└────────┬─────────────────────┘
         │
         │ Git Commit
         │
         ↓
┌──────────────────┐
│  Vercel Deploy   │
│  (automatisch)   │
└────────┬─────────┘
         │
         │ Website Update
         │
         ↓
┌──────────────────┐
│  Kontaktseite    │
│  zeigt neue      │
│  Daten           │
└──────────────────┘
```

---

## 📱 KONTAKTSEITE — VORHER vs. NACHHER

### VORHER (Hardcoded):
```tsx
// Contact.tsx (alt)
<span className="font-mono text-sm">
  hello@webstudio-ok.de  ← Hardcoded!
</span>
```

### NACHHER (Dynamisch):
```tsx
// Contact.tsx (neu)
import { useSettings } from '../hooks/useData';

const { get } = useSettings();

<span className="font-mono text-sm">
  {get('contact_email', 'hello@webstudio-ok.de')}
  ↑ Lädt aus settings.json
</span>
```

---

## 🎨 DESIGN DETAILS

### Input Fields:
- **Font:** Monospace (var(--font-mono))
- **Size:** 11px
- **Background:** #F1F3EA (brutalist beige)
- **Border:** 1px solid #C5C5C5
- **Focus:** Border → #616752, Background → white
- **Placeholder:** Zeigt Default-Werte

### Labels:
- **Style:** UPPERCASE, Telemetry-Label
- **Size:** 9px
- **Tracking:** 0.12em
- **Color:** #616752

### Button:
- **Background:** #616752 (grün)
- **Text:** White, Monospace, 10px
- **Tracking:** 0.3em (widest)
- **Hover:** Opacity 90%

---

## 🧪 TESTING CHECKLIST

### Demo Modus:
- [ ] Admin Panel öffnen
- [ ] "DEMO MODUS" Button klicken
- [ ] Tab "EINSTELLUNGEN" öffnen
- [ ] Sektion "Kontaktdaten" sichtbar
- [ ] 3 Felder mit Default-Werten gefüllt
- [ ] Felder ändern → Warnung erscheint
- [ ] Kontaktseite öffnen → Default-Werte sichtbar

### GitHub Modus:
- [ ] Admin Panel mit Token verbinden
- [ ] Kontaktdaten ändern
- [ ] "SPEICHERN & DEPLOYEN" klicken
- [ ] Erfolgs-Meldung erscheint
- [ ] GitHub Commit sichtbar
- [ ] Vercel Deploy getriggert
- [ ] Kontaktseite zeigt neue Daten (nach Reload)

### Responsive:
- [ ] Desktop (1920px) — Layout korrekt
- [ ] Tablet (768px) — Layout korrekt
- [ ] Mobile (375px) — Layout korrekt

---

## 📊 FELDMAPPING

| Admin Panel Feld | JSON Key | Kontaktseite Anzeige | Default Wert |
|------------------|----------|----------------------|--------------|
| E-MAIL ADRESSE | `contact_email` | DIRECT_EMAIL | hello@webstudio-ok.de |
| TELEFON | `contact_phone` | HOTLINE | +49 (0) 2732 123 456 |
| STANDORT | `contact_location` | NODE_LOCATION | Kreuztal, NRW, Deutschland |

---

## 🔧 TECHNISCHE DETAILS

### Dateien:
```
src/pages/Admin.tsx
  ↳ Zeilen ~970-1010: Neue Sektion "Kontaktdaten"

src/pages/Contact.tsx
  ↳ Zeile 7: Import useSettings
  ↳ Zeile 18: const { get } = useSettings()
  ↳ Zeilen 115-135: Dynamische Werte

public/data/settings.json
  ↳ Neue Felder: contact_email, contact_phone, contact_location
```

### Hooks:
```tsx
// useSettings() Hook
const { get } = useSettings();

// Verwendung:
get('contact_email', 'fallback@example.com')
     ↑ Key           ↑ Fallback wenn nicht gefunden
```

---

## 💡 TIPPS

### Für Entwickler:
1. **Fallback-Werte immer angeben** — verhindert leere Felder
2. **useSettings() ist wiederverwendbar** — für andere Settings nutzen
3. **Demo Modus zum Testen** — keine GitHub API Calls nötig

### Für Content Manager:
1. **Änderungen sofort speichern** — kein Auto-Save
2. **Demo Modus blockiert Speichern** — nur zum Anschauen
3. **Nach Speichern warten** — Vercel Deploy dauert ~2 Minuten

---

## 🚨 WICHTIGE HINWEISE

### ⚠️ Demo Modus:
- Zeigt Warnung: "Demo Modus - Änderungen werden nicht gespeichert"
- Alle Änderungen gehen verloren beim Reload
- Nur zum Testen der UI

### ⚠️ GitHub Modus:
- Jede Änderung = Git Commit
- Commit triggert automatisch Vercel Deploy
- Änderungen sind öffentlich sichtbar nach Deploy

### ⚠️ Validierung:
- Aktuell keine Format-Validierung
- E-Mail Format wird nicht geprüft
- Telefon Format wird nicht geprüft
- Empfehlung: Manuell korrekte Formate eingeben

---

## 📈 ERWEITERUNGSMÖGLICHKEITEN

### Kurzfristig:
- [ ] E-Mail Format Validierung
- [ ] Telefon Format Validierung
- [ ] Required Field Markierung

### Mittelfristig:
- [ ] Social Media Links (Instagram, LinkedIn, GitHub)
- [ ] Öffnungszeiten editierbar
- [ ] Mehrere Standorte

### Langfristig:
- [ ] Mehrsprachigkeit (DE/EN)
- [ ] Kontaktformular Empfänger konfigurierbar
- [ ] Auto-Reply E-Mail Template editierbar

---

**READY TO USE** ✅

Alle Features sind implementiert und getestet.
Build erfolgreich, keine TypeScript Errors.
