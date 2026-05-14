/**
 * Seed script — заполняет Firestore тестовыми данными
 * Запуск: npx tsx seed.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "sprachsprung-rvd4m",
  appId: "1:108138934796:web:10256342c3b07a2dd57429",
  apiKey: "AIzaSyChQLVZ3ahPcjTotvHLJ3iguH6F_Fgc444",
  authDomain: "sprachsprung-rvd4m.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-aurelisstudios-bac47105-56c8-45df-9593-65fc1ef66667",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// ─── PROJECTS ────────────────────────────────────────────────────────────────

const projects = [
  {
    title: 'KRAFTWERK DIGITAL',
    category: 'Web Relaunch',
    description: 'Kompletter digitaler Relaunch für einen mittelständischen Industriebetrieb aus dem Siegerland. Neue Markenidentität, Lead-Generierung und Performance-Optimierung.',
    fullDescription: `## Ausgangslage

Der Kunde betrieb seit 2011 eine veraltete Website ohne mobile Optimierung und ohne messbare Conversion-Ziele. Die Absprungrate lag bei 78%.

## Lösung

Wir entwickelten ein vollständig neues digitales System — von der Markenarchitektur bis zur technischen Infrastruktur.

### Kernleistungen

- Neue visuelle Identität mit industriellem Charakter
- Responsives Design-System mit 40+ Komponenten
- Integriertes CRM-System für Lead-Tracking
- Performance-Score: 98/100 (Lighthouse)

## Ergebnis

> "Die neue Website hat unsere Anfragen innerhalb von 3 Monaten verdreifacht." — Geschäftsführer

- **+312%** qualifizierte Leads im ersten Quartal
- **-67%** Absprungrate
- **2,1s** durchschnittliche Ladezeit
`,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200',
    completedAt: 'MRZ 2025',
    order: 1,
  },
  {
    title: 'MEDIZIN NORD',
    category: 'System Dev',
    description: 'Patientenportal und Buchungssystem für eine Facharztpraxis in NRW. Vollständig DSGVO-konform mit Ende-zu-Ende-Verschlüsselung.',
    fullDescription: `## Herausforderung

Eine Facharztpraxis mit 3 Standorten benötigte ein einheitliches digitales System für Terminbuchung, Patientenkommunikation und interne Prozesse.

## Technische Architektur

Das System wurde als Progressive Web App entwickelt — funktioniert auf allen Geräten ohne App-Installation.

### Technologie-Stack

- React 19 + TypeScript Frontend
- Firebase Firestore (DSGVO-konform, EU-Region)
- End-to-End-Verschlüsselung für Patientendaten
- Automatische Erinnerungen via SMS/Email

## Ergebnisse

- **85%** der Termine werden jetzt online gebucht
- **40min** täglich gespart pro Mitarbeiter
- **0** Datenschutzvorfälle seit Launch
`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200',
    completedAt: 'JAN 2025',
    order: 2,
  },
  {
    title: 'LOGISTIK PRO',
    category: 'AI & Automation',
    description: 'KI-gestützte Routenoptimierung und automatisiertes Reporting für ein regionales Logistikunternehmen mit 120 Fahrzeugen.',
    fullDescription: `## Kontext

Ein Logistikunternehmen aus dem Ruhrgebiet verlor täglich Stunden durch manuelle Routenplanung und Excel-basiertes Reporting.

## KI-Integration

Wir integrierten Google Gemini AI in den bestehenden Workflow — ohne Systemwechsel, direkt in die vorhandene Infrastruktur.

### Automatisierte Prozesse

- Tägliche Routenoptimierung für 120 Fahrzeuge
- Automatisches Reporting an Kunden (PDF + Email)
- Anomalie-Erkennung bei Lieferverzögerungen
- Dashboard mit Echtzeit-Telemetrie

## ROI nach 6 Monaten

> Die Automatisierung hat sich in 4 Monaten amortisiert.

- **23%** Kraftstoffeinsparung durch optimierte Routen
- **6h** täglich gespart im Büro
- **99.2%** Pünktlichkeitsrate (vorher: 91%)
`,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200',
    completedAt: 'NOV 2024',
    order: 3,
  },
];

// ─── INSIGHTS ─────────────────────────────────────────────────────────────────

const insights = [
  {
    title: 'Warum die meisten Websites kein Geld verdienen (und wie Sie das ändern)',
    date: 'Mai 2025',
    tag: 'STRATEGIE',
    author: 'Oleh Kalchenko',
    content: '## Das Problem\n\nDie meisten mittelständischen Unternehmen haben eine Website. Aber nur wenige haben ein digitales System, das aktiv Umsatz generiert.\n\nDer Unterschied ist fundamental: Eine Website ist ein Dokument. Ein digitales System ist ein Verkäufer, der 24/7 arbeitet.\n\n## Die 3 häufigsten Fehler\n\n### 1. Kein klares Conversion-Ziel\n\nBesucher landen auf der Startseite und wissen nicht, was sie als nächstes tun sollen. Kein klarer Call-to-Action, keine Führung durch den Kaufprozess.\n\n**Lösung:** Jede Seite braucht genau ein primäres Ziel. Alles andere ist Ablenkung.\n\n### 2. Ladezeit über 3 Sekunden\n\n> 53% der mobilen Nutzer verlassen eine Seite, die länger als 3 Sekunden lädt.\n\nEine langsame Website ist kein technisches Problem — es ist ein Umsatzproblem.\n\n### 3. Kein Tracking, keine Optimierung\n\nOhne Daten optimiert man blind. Welche Seiten konvertieren? Wo springen Besucher ab?\n\n## Was wirklich funktioniert\n\n- **Performance first:** Ladezeit unter 2 Sekunden als nicht verhandelbare Anforderung\n- **Mobile first:** 70%+ des Traffics kommt vom Smartphone\n- **Conversion-Architektur:** Jedes Element dient einem Zweck\n\nDie beste Website ist nicht die schönste — sondern die, die am meisten verkauft.',
  },
  {
    title: 'KI im Mittelstand: Wo sie wirklich hilft und wo sie überschätzt wird',
    date: 'Apr 2025',
    tag: 'KI',
    author: 'Oleh Kalchenko',
    content: '## Der KI-Hype und die Realität\n\nSeit ChatGPT ist KI in aller Munde. Jedes zweite Startup verspricht "KI-gestützte" Lösungen. Aber was bedeutet das konkret für ein mittelständisches Unternehmen?\n\n## Wo KI echten Mehrwert schafft\n\n### Automatisierung repetitiver Aufgaben\n\nDas ist der größte Quick Win. Aufgaben, die täglich gleich ablaufen:\n\n- **Angebotserstellung aus Vorlagen:** KI kann strukturierte Angebote in Sekunden generieren, basierend auf Kundendaten und Produktkatalogen\n- **Reporting und Zusammenfassungen:** Automatische Erstellung von Management-Reports aus Rohdaten\n- **E-Mail-Klassifizierung und -Weiterleitung:** Intelligente Sortierung eingehender Anfragen an die richtigen Abteilungen\n- **Dateneingabe und -validierung:** Automatische Prüfung und Korrektur von Eingaben\n\n**Realistisches Einsparpotenzial:** 2-6 Stunden pro Mitarbeiter pro Woche.\n\n### Kundenservice-Unterstützung\n\nKI-Assistenten können 60-70% der häufigen Kundenanfragen automatisch beantworten — rund um die Uhr.\n\n**Beispiel aus der Praxis:** Ein Maschinenbau-Unternehmen mit 50 Mitarbeitern hat einen KI-Chatbot für technische Standardfragen implementiert. Ergebnis: 40% weniger Support-Tickets, schnellere Reaktionszeiten, zufriedenere Kunden.\n\n### Datenanalyse und Mustererkennung\n\nKI kann große Datenmengen analysieren und Muster erkennen, die Menschen übersehen würden:\n\n- Vorhersage von Wartungsbedarf (Predictive Maintenance)\n- Erkennung von Umsatztrends und Anomalien\n- Optimierung von Lagerbeständen\n\n## Wo KI überschätzt wird\n\n### Kreative Strategie\n\nKI kann Texte generieren. Aber Positionierung, Markenstrategie und echtes Verständnis für Ihre Kunden — das bleibt menschliche Arbeit.\n\n**Warum?** Strategie erfordert Intuition, Erfahrung und das Verständnis von Nuancen, die KI nicht erfassen kann.\n\n### Komplexe Entscheidungen\n\nKI kann Optionen aufzeigen, aber die finale Entscheidung — besonders bei ethischen oder strategischen Fragen — muss der Mensch treffen.\n\n### Beziehungsaufbau\n\nB2B-Geschäft basiert auf Vertrauen. KI kann unterstützen, aber echte Beziehungen entstehen zwischen Menschen.\n\n## Unser Ansatz\n\nWir integrieren KI dort, wo sie messbar Zeit und Geld spart — und lassen Menschen dort arbeiten, wo Urteilsvermögen gefragt ist.\n\n**Konkret bedeutet das:**\n\n1. **Analyse:** Welche Prozesse sind repetitiv und regelbasiert?\n2. **Pilotprojekt:** Klein starten, schnell lernen\n3. **Messung:** ROI nach 3 Monaten evaluieren\n4. **Skalierung:** Erfolgreiche Lösungen ausweiten\n\nKI ist kein Selbstzweck. Sie ist ein Werkzeug — und wie jedes Werkzeug muss man wissen, wann und wie man es einsetzt.',
  },
  {
    title: 'Brutalist Webdesign: Warum weniger mehr ist',
    date: 'Mrz 2025',
    tag: 'DESIGN',
    author: 'Oleh Kalchenko',
    content: '## Was ist Brutalismus im Web?\n\nBrutalismus in der Architektur bedeutet: Materialien zeigen, was sie sind. Beton bleibt Beton. Stahl bleibt Stahl. Keine Verkleidung, keine Täuschung.\n\nIm Webdesign übersetzt sich das in: Struktur ist sichtbar. Raster sind explizit. Typografie ist funktional.\n\n## Warum es für B2B funktioniert\n\nMittelständische Unternehmen kommunizieren mit anderen Unternehmen. Ihre Kunden sind Entscheider, die täglich Dutzende von Websites sehen.\n\nWas bleibt im Gedächtnis? Nicht die 47. Website mit Stock-Fotos und Gradient-Buttons.\n\n> Struktur ist die ultimative Form von Schönheit.\n\n**Der Unterschied:**\n\n- **Konventionelles Design:** Versucht zu gefallen, verschwindet in der Masse\n- **Brutalistisches Design:** Polarisiert, bleibt im Gedächtnis\n\nFür B2B ist Wiedererkennungswert wichtiger als universelle Beliebtheit.\n\n## Die Prinzipien unseres Design-Systems\n\n### 1. Typografie als Architektur\n\n- **Oswald** für Struktur und Hierarchie — klare, geometrische Formen schaffen visuelle Ordnung\n- **Playfair Display** für Kontrast und Eleganz — Serifen bringen Autorität und Lesbarkeit\n- **JetBrains Mono** für Präzision und Technik — Monospace signalisiert Professionalität und Transparenz\n\nJede Schrift hat eine Funktion. Keine dekorativen Elemente.\n\n### 2. Farbe mit Bedeutung\n\nUnser Grün (#616752) verbindet industrielle Stärke mit organischer Verlässlichkeit.\n\n**Farbpsychologie:**\n- Grün = Wachstum, Stabilität, Vertrauen\n- Gedämpfter Ton = Professionalität, keine Übertreibung\n- Kontrast mit Beige (#F1F3EA) = Klarheit ohne Härte\n\nWeniger Farben = mehr Fokus auf Inhalt.\n\n### 3. Raster als Kommunikation\n\nDas 12-Spalten-Raster ist nicht versteckt. Es ist das Design.\n\n**Warum sichtbare Struktur funktioniert:**\n\n- Schafft Vorhersagbarkeit (Nutzer wissen, wo sie Informationen finden)\n- Reduziert kognitive Last (weniger Entscheidungen = schnellere Navigation)\n- Kommuniziert Ordnung und Systematik (wichtig für technische B2B-Kunden)\n\n### 4. Whitespace als aktives Element\n\nLeere ist nicht verschwendeter Platz. Sie ist Fokus.\n\n**Praktisch bedeutet das:**\n- Großzügige Abstände zwischen Sektionen\n- Keine Angst vor "leeren" Bereichen\n- Jedes Element bekommt Raum zum Atmen\n\n## Was Brutalismus NICHT ist\n\n❌ Absichtlich hässlich\n❌ Benutzerunfreundlich\n❌ Technisch schlecht umgesetzt\n\n✅ Ehrlich\n✅ Funktional\n✅ Reduziert auf das Wesentliche\n\n## Fazit\n\nBrutalismus ist nicht roh. Es ist ehrlich. Und Ehrlichkeit baut Vertrauen.\n\nIn einer Welt voller überladener Websites mit austauschbaren Designs ist Klarheit der größte Luxus.\n\n**Für wen eignet sich brutalistisches Design?**\n\n- Unternehmen, die sich von der Konkurrenz abheben wollen\n- B2B-Firmen mit technisch versierten Kunden\n- Marken, die Authentizität über Konformität stellen\n\nWenn Ihre Website aussieht wie alle anderen, kommuniziert sie: "Wir sind wie alle anderen."\n\nBrutalismus sagt: "Wir sind anders. Und das ist gut so."',
  },
];

// ─── CLIENTS ──────────────────────────────────────────────────────────────────

const clients = [
  { name: 'Kraftwerk GmbH', link: '', order: 1 },
  { name: 'Medizin Nord', link: '', order: 2 },
  { name: 'Logistik Pro', link: '', order: 3 },
  { name: 'Bau & Technik AG', link: '', order: 4 },
];

// ─── SEED FUNCTION ────────────────────────────────────────────────────────────

async function clearCollection(name: string) {
  const snap = await getDocs(collection(db, name));
  for (const doc of snap.docs) {
    await deleteDoc(doc.ref);
  }
  console.log(`✓ Cleared ${name} (${snap.size} docs)`);
}

async function seed() {
  console.log('\n🌱 Starting seed...\n');

  // Clear existing
  await clearCollection('projects');
  await clearCollection('insights');
  await clearCollection('clients');

  // Seed projects
  for (const p of projects) {
    await addDoc(collection(db, 'projects'), p);
    console.log(`✓ Project: ${p.title}`);
  }

  // Seed insights
  for (const i of insights) {
    await addDoc(collection(db, 'insights'), i);
    console.log(`✓ Insight: ${i.title.substring(0, 50)}...`);
  }

  // Seed clients
  for (const c of clients) {
    await addDoc(collection(db, 'clients'), c);
    console.log(`✓ Client: ${c.name}`);
  }

  console.log('\n✅ Seed complete!\n');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
