/**
 * Backlink Monitoring System
 * Überwacht Backlinks und benachrichtigt bei Änderungen
 * 
 * Setup:
 * 1. Konfiguriere Backlink-Quellen
 * 2. npm install node-fetch (für HTTP requests)
 * 3. Automatisiere mit Cron oder GitHub Actions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface BacklinkSource {
  id: string;
  name: string;
  url: string;
  type: 'directory' | 'social' | 'partner' | 'article' | 'other';
  addedDate: string;
  lastChecked?: string;
  status?: 'active' | 'broken' | 'nofollow' | 'removed';
  domainAuthority?: number;
}

interface BacklinkCheck {
  source: BacklinkSource;
  timestamp: string;
  status: 'active' | 'broken' | 'nofollow' | 'removed';
  responseTime?: number;
  error?: string;
}

/**
 * Wichtige Backlink-Quellen für OK Studio
 */
const BACKLINK_SOURCES: BacklinkSource[] = [
  // Business Directories
  {
    id: 'google-my-business',
    name: 'Google My Business',
    url: 'https://www.google.com/maps/place/OK+Studio',
    type: 'directory',
    addedDate: '2025-01-01',
    domainAuthority: 100,
  },
  {
    id: 'gelbe-seiten',
    name: 'Gelbe Seiten',
    url: 'https://www.gelbeseiten.de/...',
    type: 'directory',
    addedDate: '2025-01-01',
    domainAuthority: 75,
  },
  {
    id: 'das-oertliche',
    name: 'Das Örtliche',
    url: 'https://www.dasoertliche.de/...',
    type: 'directory',
    addedDate: '2025-01-01',
    domainAuthority: 70,
  },
  {
    id: '11880',
    name: '11880.com',
    url: 'https://www.11880.com/...',
    type: 'directory',
    addedDate: '2025-01-01',
    domainAuthority: 65,
  },
  {
    id: 'bing-places',
    name: 'Bing Places',
    url: 'https://www.bing.com/maps/...',
    type: 'directory',
    addedDate: '2025-01-01',
    domainAuthority: 90,
  },

  // Social Media
  {
    id: 'linkedin',
    name: 'LinkedIn Company Page',
    url: 'https://www.linkedin.com/company/ok-studio',
    type: 'social',
    addedDate: '2025-01-01',
    domainAuthority: 95,
  },
  {
    id: 'facebook',
    name: 'Facebook Business',
    url: 'https://www.facebook.com/okstudio',
    type: 'social',
    addedDate: '2025-01-01',
    domainAuthority: 95,
  },
  {
    id: 'xing',
    name: 'XING Company Profile',
    url: 'https://www.xing.com/pages/okstudio',
    type: 'social',
    addedDate: '2025-01-01',
    domainAuthority: 85,
  },

  // Local
  {
    id: 'ihk-siegen',
    name: 'IHK Siegen',
    url: 'https://www.ihk-siegen.de/...',
    type: 'partner',
    addedDate: '2025-01-01',
    domainAuthority: 70,
  },
];

/**
 * Prüft ob ein Backlink noch aktiv ist
 */
async function checkBacklink(source: BacklinkSource): Promise<BacklinkCheck> {
  const startTime = Date.now();
  
  try {
    // Simuliere HTTP Request
    // In Produktion: Nutze fetch() oder axios
    // const response = await fetch(source.url, {
    //   method: 'HEAD',
    //   headers: { 'User-Agent': 'OK-Studio-Backlink-Monitor/1.0' }
    // });
    
    // Simulierte Antwort
    const isActive = Math.random() > 0.1; // 90% aktiv
    const responseTime = Math.floor(Math.random() * 500) + 100;

    return {
      source,
      timestamp: new Date().toISOString(),
      status: isActive ? 'active' : 'broken',
      responseTime,
    };

  } catch (error: any) {
    return {
      source,
      timestamp: new Date().toISOString(),
      status: 'broken',
      error: error.message,
    };
  }
}

/**
 * Prüft alle Backlinks
 */
async function checkAllBacklinks(): Promise<BacklinkCheck[]> {
  console.log(`🔍 Prüfe ${BACKLINK_SOURCES.length} Backlinks...\n`);

  const checks = await Promise.all(
    BACKLINK_SOURCES.map(source => checkBacklink(source))
  );

  return checks;
}

/**
 * Generiert Backlink Report
 */
function generateBacklinkReport(checks: BacklinkCheck[]): string {
  const active = checks.filter(c => c.status === 'active').length;
  const broken = checks.filter(c => c.status === 'broken').length;
  const total = checks.length;
  const healthScore = ((active / total) * 100).toFixed(1);

  let report = `
╔═══════════════════════════════════════════════════╗
║           BACKLINK MONITORING REPORT              ║
║           ${new Date().toISOString().split('T')[0]}                        ║
╚═══════════════════════════════════════════════════╝

📊 ÜBERSICHT
─────────────────────────────────────────────────────
  Gesamt Backlinks:            ${total}
  Aktiv:                       ${active} (${healthScore}%)
  Defekt:                      ${broken}
  Health Score:                ${healthScore}%

`;

  // Gruppiere nach Typ
  const byType = checks.reduce((acc, check) => {
    const type = check.source.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(check);
    return acc;
  }, {} as Record<string, BacklinkCheck[]>);

  for (const [type, typeChecks] of Object.entries(byType)) {
    const typeActive = typeChecks.filter(c => c.status === 'active').length;
    const typeLabel = {
      directory: '📁 VERZEICHNISSE',
      social: '📱 SOCIAL MEDIA',
      partner: '🤝 PARTNER',
      article: '📝 ARTIKEL',
      other: '🔗 ANDERE',
    }[type] || type.toUpperCase();

    report += `\n${typeLabel}\n${'─'.repeat(53)}\n`;

    typeChecks.forEach(check => {
      const icon = check.status === 'active' ? '✅' : '❌';
      const time = check.responseTime ? `${check.responseTime}ms` : 'N/A';
      const da = check.source.domainAuthority ? `DA${check.source.domainAuthority}` : '';
      
      report += `  ${icon} ${check.source.name.padEnd(25)} ${time.padEnd(8)} ${da}\n`;
    });
  }

  // Warnungen
  if (broken > 0) {
    report += `\n⚠️  WARNUNGEN\n${'─'.repeat(53)}\n`;
    checks.filter(c => c.status === 'broken').forEach(check => {
      report += `  ❌ ${check.source.name}\n`;
      report += `     URL: ${check.source.url}\n`;
      if (check.error) {
        report += `     Fehler: ${check.error}\n`;
      }
    });
  }

  // Empfehlungen
  report += `\n💡 EMPFEHLUNGEN\n${'─'.repeat(53)}\n`;
  
  if (broken > 0) {
    report += `  ⚠️  ${broken} defekte Links reparieren\n`;
  }
  if (total < 20) {
    report += `  📈 Mehr Backlinks aufbauen (Ziel: 50+)\n`;
  }
  if (active >= total * 0.9) {
    report += `  ✅ Backlink-Gesundheit ist gut!\n`;
  }

  report += `\n${'═'.repeat(53)}\n`;
  report += `Nächste Prüfung: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}\n`;

  return report;
}

/**
 * Speichert Backlink-Daten
 */
function saveBacklinkData(checks: BacklinkCheck[]): void {
  const dataDir = path.join(__dirname, 'backlink-data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filename = `backlinks-${new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(dataDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(checks, null, 2), 'utf-8');
  console.log(`💾 Daten gespeichert: ${filepath}`);
}

/**
 * Vergleicht mit vorheriger Prüfung
 */
function compareWithPrevious(current: BacklinkCheck[]): void {
  const dataDir = path.join(__dirname, 'backlink-data');
  if (!fs.existsSync(dataDir)) return;

  const files = fs.readdirSync(dataDir).sort().reverse();
  if (files.length < 2) return;

  const previousFile = path.join(dataDir, files[1]);
  const previous: BacklinkCheck[] = JSON.parse(fs.readFileSync(previousFile, 'utf-8'));

  console.log('\n📊 ÄNDERUNGEN SEIT LETZTER PRÜFUNG:\n');

  let changes = 0;
  current.forEach(curr => {
    const prev = previous.find(p => p.source.id === curr.source.id);
    if (prev && prev.status !== curr.status) {
      const icon = curr.status === 'active' ? '✅' : '❌';
      console.log(`  ${icon} ${curr.source.name}: ${prev.status} → ${curr.status}`);
      changes++;
    }
  });

  if (changes === 0) {
    console.log('  ✅ Keine Änderungen');
  }
  console.log('');
}

/**
 * Sendet Benachrichtigung bei Problemen
 */
async function sendAlert(checks: BacklinkCheck[]): Promise<void> {
  const broken = checks.filter(c => c.status === 'broken');
  
  if (broken.length === 0) return;

  console.log(`⚠️  ${broken.length} defekte Backlinks gefunden!\n`);

  // TODO: Sende Email oder Slack Notification
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // await resend.emails.send({
  //   from: 'Backlink Monitor <monitor@webstudio-ok.de>',
  //   to: ['oleh@webstudio-ok.de'],
  //   subject: `⚠️ ${broken.length} defekte Backlinks gefunden`,
  //   text: broken.map(b => `${b.source.name}: ${b.source.url}`).join('\n'),
  // });

  broken.forEach(b => {
    console.log(`  ❌ ${b.source.name}`);
    console.log(`     ${b.source.url}\n`);
  });
}

/**
 * Hauptfunktion: Führt Backlink-Check durch
 */
async function runBacklinkMonitor(): Promise<void> {
  const checks = await checkAllBacklinks();
  const report = generateBacklinkReport(checks);
  
  console.log(report);
  
  saveBacklinkData(checks);
  compareWithPrevious(checks);
  await sendAlert(checks);
}

/**
 * Fügt neuen Backlink hinzu
 */
function addBacklink(source: Omit<BacklinkSource, 'addedDate'>): void {
  const newSource: BacklinkSource = {
    ...source,
    addedDate: new Date().toISOString().split('T')[0],
  };

  BACKLINK_SOURCES.push(newSource);
  
  // Speichere in Datei
  const sourcesFile = path.join(__dirname, 'backlink-sources.json');
  fs.writeFileSync(sourcesFile, JSON.stringify(BACKLINK_SOURCES, null, 2), 'utf-8');
  
  console.log(`✅ Backlink hinzugefügt: ${newSource.name}`);
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║          BACKLINK MONITORING SYSTEM               ║
╚═══════════════════════════════════════════════════╝

Verwendung:
  npx tsx backlink-monitor.ts check
  npx tsx backlink-monitor.ts add <name> <url> <type>
  npx tsx backlink-monitor.ts list

Befehle:
  check  - Prüft alle Backlinks
  add    - Fügt neuen Backlink hinzu
  list   - Zeigt alle Backlinks

Beispiele:
  npx tsx backlink-monitor.ts check
  npx tsx backlink-monitor.ts add "Medium" "https://medium.com/@okstudio" "article"
  npx tsx backlink-monitor.ts list

Typen:
  - directory (Verzeichnisse)
  - social (Social Media)
  - partner (Partner-Websites)
  - article (Gastbeiträge)
  - other (Sonstige)

Automatisierung:
  - GitHub Actions: Wöchentliche Prüfung
  - Cron Job: Täglich um 8:00 Uhr
  - Alert: Email bei defekten Links

Metriken:
  ✅ Backlink Status (aktiv/defekt)
  ⏱️  Response Time
  📊 Domain Authority
  📈 Trend-Analyse
  `);
  process.exit(0);
}

const command = args[0];

if (command === 'check') {
  runBacklinkMonitor().catch(console.error);

} else if (command === 'add' && args.length >= 4) {
  const [, name, url, type] = args;
  addBacklink({
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    url,
    type: type as any,
  });

} else if (command === 'list') {
  console.log('\n📋 ALLE BACKLINKS:\n');
  BACKLINK_SOURCES.forEach((source, i) => {
    console.log(`${i + 1}. ${source.name}`);
    console.log(`   URL: ${source.url}`);
    console.log(`   Typ: ${source.type}`);
    console.log(`   Hinzugefügt: ${source.addedDate}`);
    if (source.domainAuthority) {
      console.log(`   DA: ${source.domainAuthority}`);
    }
    console.log('');
  });

} else {
  console.error('❌ Ungültiger Befehl');
  console.log('Nutze: npx tsx backlink-monitor.ts --help');
  process.exit(1);
}
