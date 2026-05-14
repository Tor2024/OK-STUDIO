/**
 * Keyword Research Tool
 * Generiert Keyword-Ideen für Content-Erstellung
 * 
 * Basiert auf:
 * - Seed Keywords
 * - Lokale Modifikatoren
 * - Long-Tail Variationen
 * - Fragen-Keywords
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Keyword {
  keyword: string;
  type: 'primary' | 'secondary' | 'long-tail' | 'question';
  difficulty: 'low' | 'medium' | 'high';
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  localModifier?: string;
  estimatedVolume?: string;
}

interface KeywordCluster {
  topic: string;
  primaryKeyword: string;
  keywords: Keyword[];
  contentIdeas: string[];
}

// Seed Keywords für OK Studio
const SEED_KEYWORDS = [
  'webdesign',
  'website erstellen',
  'web agentur',
  'homepage',
  'web relaunch',
  'digitalisierung',
  'ki integration',
  'online präsenz',
  'webentwicklung',
  'responsive design',
];

// Lokale Modifikatoren
const LOCAL_MODIFIERS = [
  'kreuztal',
  'siegen',
  'siegerland',
  'nrw',
  'nordrhein-westfalen',
  'südwestfalen',
  'in der nähe',
];

// Service-Modifikatoren
const SERVICE_MODIFIERS = [
  'für kleine unternehmen',
  'für mittelstand',
  'für kmu',
  'günstig',
  'professionell',
  'modern',
  'individuell',
  'maßgeschneidert',
];

// Fragen-Präfixe
const QUESTION_PREFIXES = [
  'was kostet',
  'wie viel kostet',
  'was ist',
  'wie funktioniert',
  'warum',
  'wann brauche ich',
  'welche',
  'wo finde ich',
];

/**
 * Generiert Keyword-Variationen
 */
function generateKeywordVariations(seed: string): Keyword[] {
  const keywords: Keyword[] = [];

  // Primary: Seed + Lokale Modifikatoren
  LOCAL_MODIFIERS.forEach(location => {
    keywords.push({
      keyword: `${seed} ${location}`,
      type: 'primary',
      difficulty: 'medium',
      intent: 'commercial',
      localModifier: location,
      estimatedVolume: '10-100',
    });
  });

  // Secondary: Seed + Service-Modifikatoren
  SERVICE_MODIFIERS.forEach(service => {
    keywords.push({
      keyword: `${seed} ${service}`,
      type: 'secondary',
      difficulty: 'medium',
      intent: 'commercial',
      estimatedVolume: '10-100',
    });
  });

  // Long-Tail: Seed + Service + Lokal
  LOCAL_MODIFIERS.slice(0, 3).forEach(location => {
    SERVICE_MODIFIERS.slice(0, 3).forEach(service => {
      keywords.push({
        keyword: `${seed} ${service} ${location}`,
        type: 'long-tail',
        difficulty: 'low',
        intent: 'transactional',
        localModifier: location,
        estimatedVolume: '0-10',
      });
    });
  });

  // Fragen-Keywords
  QUESTION_PREFIXES.forEach(prefix => {
    keywords.push({
      keyword: `${prefix} ${seed}`,
      type: 'question',
      difficulty: 'low',
      intent: 'informational',
      estimatedVolume: '10-100',
    });
  });

  return keywords;
}

/**
 * Erstellt Keyword-Cluster nach Themen
 */
function createKeywordClusters(): KeywordCluster[] {
  const clusters: KeywordCluster[] = [];

  // Cluster 1: Webdesign Services
  clusters.push({
    topic: 'Webdesign Services',
    primaryKeyword: 'webdesign kreuztal',
    keywords: [
      ...generateKeywordVariations('webdesign'),
      ...generateKeywordVariations('website erstellen'),
      ...generateKeywordVariations('homepage'),
    ],
    contentIdeas: [
      'Webdesign in Kreuztal: Was Sie wissen müssen',
      'Website erstellen lassen: Der komplette Guide',
      'Moderne Homepage für Ihr Unternehmen',
      'Webdesign-Trends 2026 für KMU',
      'Was kostet eine professionelle Website?',
    ],
  });

  // Cluster 2: Web Relaunch
  clusters.push({
    topic: 'Website Relaunch',
    primaryKeyword: 'web relaunch mittelstand',
    keywords: [
      ...generateKeywordVariations('web relaunch'),
      ...generateKeywordVariations('website modernisieren'),
      ...generateKeywordVariations('homepage überarbeiten'),
    ],
    contentIdeas: [
      'Website Relaunch: Schritt-für-Schritt Anleitung',
      'Wann braucht Ihre Website einen Relaunch?',
      'Web Relaunch ohne Traffic-Verlust',
      'Kosten eines Website Relaunch',
      'Relaunch-Checkliste für Unternehmen',
    ],
  });

  // Cluster 3: KI Integration
  clusters.push({
    topic: 'KI & Digitalisierung',
    primaryKeyword: 'ki integration kmu',
    keywords: [
      ...generateKeywordVariations('ki integration'),
      ...generateKeywordVariations('digitalisierung'),
      ...generateKeywordVariations('automatisierung'),
    ],
    contentIdeas: [
      'KI im Mittelstand: Wo sie wirklich hilft',
      'Digitalisierung für kleine Unternehmen',
      'Automatisierung im Geschäftsalltag',
      'KI-Tools für KMU im Überblick',
      'Digitalisierung Schritt für Schritt',
    ],
  });

  // Cluster 4: Lokales SEO
  clusters.push({
    topic: 'Lokale Dienstleistungen',
    primaryKeyword: 'web agentur siegen',
    keywords: [
      ...generateKeywordVariations('web agentur'),
      ...generateKeywordVariations('webdesigner'),
      ...generateKeywordVariations('internetagentur'),
    ],
    contentIdeas: [
      'Die beste Web Agentur in Siegen finden',
      'Webdesigner in Kreuztal: Worauf achten?',
      'Lokale vs. Remote Web Agentur',
      'Web Agentur Preise im Vergleich',
      'Referenzen einer guten Web Agentur',
    ],
  });

  return clusters;
}

/**
 * Generiert Content-Kalender
 */
function generateContentCalendar(clusters: KeywordCluster[]): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  let calendar = `
╔═══════════════════════════════════════════════════╗
║           CONTENT-KALENDER 2026                   ║
╚═══════════════════════════════════════════════════╝

`;

  clusters.forEach((cluster, clusterIndex) => {
    calendar += `\n## ${cluster.topic}\n`;
    calendar += `Primary Keyword: ${cluster.primaryKeyword}\n`;
    calendar += `${'─'.repeat(53)}\n\n`;

    cluster.contentIdeas.forEach((idea, ideaIndex) => {
      const monthIndex = (clusterIndex * cluster.contentIdeas.length + ideaIndex) % 12;
      calendar += `📅 ${months[monthIndex]}: ${idea}\n`;
      calendar += `   Keyword: ${cluster.keywords[ideaIndex]?.keyword || cluster.primaryKeyword}\n`;
      calendar += `   Typ: ${cluster.keywords[ideaIndex]?.type || 'primary'}\n\n`;
    });
  });

  return calendar;
}

/**
 * Exportiert Keywords als CSV
 */
function exportKeywordsCSV(clusters: KeywordCluster[]): string {
  let csv = 'Keyword,Type,Difficulty,Intent,Local Modifier,Estimated Volume,Topic\n';

  clusters.forEach(cluster => {
    cluster.keywords.forEach(kw => {
      csv += `"${kw.keyword}",${kw.type},${kw.difficulty},${kw.intent},${kw.localModifier || ''},${kw.estimatedVolume || ''},${cluster.topic}\n`;
    });
  });

  return csv;
}

/**
 * Generiert Keyword-Report
 */
function generateKeywordReport(): string {
  const clusters = createKeywordClusters();
  
  let report = `
╔═══════════════════════════════════════════════════╗
║         KEYWORD RESEARCH REPORT                   ║
║         OK Studio — Kreuztal                      ║
╚═══════════════════════════════════════════════════╝

📊 ÜBERSICHT
─────────────────────────────────────────────────────
  Keyword-Cluster:         ${clusters.length}
  Gesamt Keywords:         ${clusters.reduce((sum, c) => sum + c.keywords.length, 0)}
  Content-Ideen:           ${clusters.reduce((sum, c) => sum + c.contentIdeas.length, 0)}

`;

  clusters.forEach((cluster, index) => {
    report += `\n${index + 1}. ${cluster.topic.toUpperCase()}\n`;
    report += `${'═'.repeat(53)}\n`;
    report += `Primary Keyword: ${cluster.primaryKeyword}\n\n`;

    // Top 10 Keywords
    report += `Top Keywords:\n`;
    cluster.keywords.slice(0, 10).forEach((kw, i) => {
      const icon = kw.difficulty === 'low' ? '🟢' : kw.difficulty === 'medium' ? '🟡' : '🔴';
      report += `  ${icon} ${kw.keyword}\n`;
      report += `     Typ: ${kw.type} | Schwierigkeit: ${kw.difficulty} | Intent: ${kw.intent}\n`;
    });

    report += `\nContent-Ideen:\n`;
    cluster.contentIdeas.forEach((idea, i) => {
      report += `  ${i + 1}. ${idea}\n`;
    });

    report += '\n';
  });

  // Empfehlungen
  report += `\n💡 EMPFEHLUNGEN\n`;
  report += `${'═'.repeat(53)}\n`;
  report += `1. Starte mit Long-Tail Keywords (🟢 niedrige Schwierigkeit)\n`;
  report += `2. Fokus auf lokale Keywords (Kreuztal, Siegen)\n`;
  report += `3. Beantworte Fragen-Keywords in Blog-Artikeln\n`;
  report += `4. Erstelle 2-3 Artikel pro Monat\n`;
  report += `5. Optimiere bestehende Seiten für Primary Keywords\n\n`;

  // Priorisierung
  report += `\n🎯 PRIORISIERUNG (Erste 3 Monate)\n`;
  report += `${'═'.repeat(53)}\n`;
  report += `Monat 1:\n`;
  report += `  - "webdesign kreuztal" (Primary)\n`;
  report += `  - "was kostet webdesign" (Question)\n`;
  report += `  - "website erstellen lassen kreuztal" (Long-Tail)\n\n`;
  report += `Monat 2:\n`;
  report += `  - "web relaunch mittelstand" (Primary)\n`;
  report += `  - "wann brauche ich web relaunch" (Question)\n`;
  report += `  - "web agentur siegen" (Local)\n\n`;
  report += `Monat 3:\n`;
  report += `  - "ki integration kmu" (Primary)\n`;
  report += `  - "digitalisierung für kleine unternehmen" (Secondary)\n`;
  report += `  - "ki im mittelstand" (Trending)\n\n`;

  return report;
}

/**
 * Hauptfunktion
 */
function runKeywordResearch(): void {
  console.log('🔍 Starte Keyword Research...\n');

  const clusters = createKeywordClusters();
  const report = generateKeywordReport();
  const calendar = generateContentCalendar(clusters);
  const csv = exportKeywordsCSV(clusters);

  // Speichere Report
  const reportsDir = path.join(__dirname, 'keyword-research');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(reportsDir, 'keyword-report.txt'), report, 'utf-8');
  fs.writeFileSync(path.join(reportsDir, 'content-calendar.txt'), calendar, 'utf-8');
  fs.writeFileSync(path.join(reportsDir, 'keywords.csv'), csv, 'utf-8');

  console.log(report);
  console.log(calendar);

  console.log('\n✅ Keyword Research abgeschlossen!');
  console.log(`📁 Dateien gespeichert in: ${reportsDir}`);
  console.log('   - keyword-report.txt');
  console.log('   - content-calendar.txt');
  console.log('   - keywords.csv\n');
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help') {
  console.log(`
╔═══════════════════════════════════════════════════╗
║           KEYWORD RESEARCH TOOL                   ║
╚═══════════════════════════════════════════════════╝

Generiert Keyword-Ideen für Content-Erstellung.

Verwendung:
  npx tsx keyword-research.ts

Output:
  - keyword-report.txt    (Vollständiger Report)
  - content-calendar.txt  (12-Monats Content-Plan)
  - keywords.csv          (Alle Keywords als CSV)

Features:
  ✅ 4 Keyword-Cluster
  ✅ 100+ Keyword-Variationen
  ✅ Lokale Keywords (Kreuztal, Siegen)
  ✅ Long-Tail Keywords
  ✅ Fragen-Keywords
  ✅ Content-Ideen
  ✅ 12-Monats Content-Kalender

Keyword-Typen:
  - Primary: Haupt-Keywords (hohe Konkurrenz)
  - Secondary: Neben-Keywords (mittlere Konkurrenz)
  - Long-Tail: Spezifische Keywords (niedrige Konkurrenz)
  - Question: Fragen-Keywords (informational)

Schwierigkeit:
  🟢 Low: Einfach zu ranken
  🟡 Medium: Mittlerer Aufwand
  🔴 High: Schwierig zu ranken

Empfehlung:
  Starte mit 🟢 Low-Difficulty Keywords!
  `);
  process.exit(0);
}

runKeywordResearch();
