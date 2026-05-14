# Datenstruktur-Dokumentation

## Übersicht

Das Projekt verwendet eine optimierte Dateistruktur für bessere Performance und Skalierbarkeit.

## Struktur

```
public/data/
├── projects/
│   ├── index.json              # Liste aller Projekte (ohne fullDescription)
│   ├── kraftwerk-digital.json  # Vollständiges Projekt mit fullDescription
│   ├── medizin-nord.json
│   └── logistik-pro.json
├── insights/
│   ├── index.json              # Liste aller Artikel (ohne content)
│   ├── warum-die-meisten-websites-kein-geld-verdienen.json
│   ├── ki-im-mittelstand-wo-sie-wirklich-hilft.json
│   └── brutalist-webdesign-warum-weniger-mehr-ist.json
├── clients.json                # Kundenliste
├── faqs.json                   # FAQ-Liste
└── settings.json               # Website-Einstellungen
```

## Vorteile

### 1. Performance
- **Schnellere Ladezeiten**: Nur benötigte Daten werden geladen
- **Weniger Traffic**: Liste lädt ~5KB statt ~50KB
- **Besseres Caching**: Browser cached einzelne Dateien

### 2. Skalierbarkeit
- Unbegrenzte Anzahl von Projekten/Artikeln
- Keine Performance-Degradation bei Wachstum

### 3. Entwicklung
- Einfachere Git-Diffs (eine Datei pro Änderung)
- Bessere Versionskontrolle
- Parallele Bearbeitung möglich

## Verwendung

### Frontend

**Liste laden** (ohne vollständigen Inhalt):
```typescript
import { useCollection } from '../hooks/useData';

const { data: projects } = useCollection('projects');
// Lädt: /data/projects/index.json
```

**Einzelnes Item laden** (mit vollständigem Inhalt):
```typescript
import { useItem } from '../hooks/useData';

const { data: project } = useItem('projects', 'kraftwerk-digital');
// Lädt: /data/projects/kraftwerk-digital.json
```

### Admin-Panel

Das Admin-Panel verwaltet automatisch:
1. **Beim Hinzufügen**: Erstellt einzelne Datei + aktualisiert Index
2. **Beim Löschen**: Löscht einzelne Datei + aktualisiert Index
3. **Beim Bearbeiten**: Aktualisiert einzelne Datei + Index

## Markdown-Formatierung

Alle Artikel und Projektbeschreibungen unterstützen Markdown:

### Syntax

```markdown
## Überschrift (H2)
### Unterüberschrift (H3)

**Fetter Text**
*Kursiver Text*

- Listenpunkt 1
- Listenpunkt 2

> Blockzitat

[Link-Text](https://example.com)
```

### Im Admin-Panel

1. **Editor-Tab**: Markdown schreiben
2. **Vorschau-Tab**: Gerenderte Ansicht sehen
3. **Markdown Hilfe**: Syntax-Referenz anzeigen

## Dateiformat

### projects/index.json
```json
[
  {
    "id": "kraftwerk-digital",
    "title": "KRAFTWERK DIGITAL",
    "category": "Web Relaunch",
    "description": "Kurzbeschreibung...",
    "image": "https://...",
    "completedAt": "MRZ 2025",
    "order": 1
  }
]
```

### projects/kraftwerk-digital.json
```json
{
  "id": "kraftwerk-digital",
  "title": "KRAFTWERK DIGITAL",
  "category": "Web Relaunch",
  "description": "Kurzbeschreibung...",
  "fullDescription": "## Vollständiger Markdown-Inhalt...",
  "image": "https://...",
  "completedAt": "MRZ 2025",
  "order": 1
}
```

### insights/index.json
```json
[
  {
    "id": "artikel-slug",
    "title": "Artikeltitel",
    "date": "Mai 2025",
    "tag": "STRATEGIE",
    "author": "Oleh Kalchenko"
  }
]
```

### insights/artikel-slug.json
```json
{
  "id": "artikel-slug",
  "title": "Artikeltitel",
  "date": "Mai 2025",
  "tag": "STRATEGIE",
  "author": "Oleh Kalchenko",
  "content": "## Vollständiger Markdown-Inhalt..."
}
```

## Performance-Vergleich

### Vorher (monolithische Dateien)
- Liste laden: ~50KB (alle Projekte mit fullDescription)
- Detail laden: ~50KB (alle Projekte nochmal)
- **Total**: ~100KB

### Nachher (separate Dateien)
- Liste laden: ~5KB (nur Metadaten)
- Detail laden: ~8KB (nur ein Projekt)
- **Total**: ~13KB
- **Ersparnis**: ~87% weniger Traffic

## Migration

Die Migration ist bereits abgeschlossen. Alte Dateien wurden entfernt:
- ~~`projects.json`~~ → `projects/index.json` + einzelne Dateien
- ~~`insights.json`~~ → `insights/index.json` + einzelne Dateien

## Troubleshooting

### Problem: 404 beim Laden
**Lösung**: Stelle sicher, dass sowohl `index.json` als auch die einzelne Datei existieren.

### Problem: Änderungen nicht sichtbar
**Lösung**: Browser-Cache leeren oder Hard-Refresh (Ctrl+Shift+R).

### Problem: Admin-Panel zeigt Fehler
**Lösung**: GitHub-Token überprüfen und Repository-Zugriff sicherstellen.
