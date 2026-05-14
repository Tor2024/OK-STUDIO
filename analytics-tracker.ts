/**
 * Google Analytics 4 Integration & Automatisches Reporting
 * Trackt wichtige Events und generiert wöchentliche Reports
 * 
 * Setup:
 * 1. Erstelle GA4 Property in Google Analytics
 * 2. Füge Measurement ID zu .env hinzu
 * 3. Installiere: npm install @google-analytics/data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  timestamp: string;
}

interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: string;
}

interface ConversionEvent {
  type: 'contact_form' | 'project_view' | 'article_read' | 'cta_click';
  value?: number;
  metadata?: Record<string, any>;
  timestamp: string;
}

/**
 * Generiert Google Analytics 4 Tracking Code
 */
function generateGA4TrackingCode(measurementId: string): string {
  return `
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${measurementId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${measurementId}', {
    'send_page_view': true,
    'anonymize_ip': true, // DSGVO-konform
    'cookie_flags': 'SameSite=None;Secure'
  });

  // Custom Events
  window.trackEvent = function(eventName, params) {
    gtag('event', eventName, params);
  };

  // Conversion Tracking
  window.trackConversion = function(type, value) {
    gtag('event', 'conversion', {
      'event_category': type,
      'value': value || 0,
      'currency': 'EUR'
    });
  };

  // Scroll Tracking
  let scrollTracked = false;
  window.addEventListener('scroll', function() {
    if (!scrollTracked && window.scrollY > window.innerHeight * 0.75) {
      gtag('event', 'scroll_depth', { 'depth': '75%' });
      scrollTracked = true;
    }
  });

  // Outbound Link Tracking
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
      gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': link.href
      });
    }
  });
</script>
  `.trim();
}

/**
 * Generiert React Hook für Analytics
 */
function generateReactAnalyticsHook(): string {
  return `
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    trackEvent?: (name: string, params?: Record<string, any>) => void;
    trackConversion?: (type: string, value?: number) => void;
  }
}

/**
 * Hook für Google Analytics Tracking
 */
export function useAnalytics() {
  const location = useLocation();

  // Track Page Views
  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_title: document.title,
      });
    }
  }, [location]);

  // Track Custom Events
  const trackEvent = (name: string, params?: Record<string, any>) => {
    if (window.trackEvent) {
      window.trackEvent(name, params);
    }
  };

  // Track Conversions
  const trackConversion = (type: string, value?: number) => {
    if (window.trackConversion) {
      window.trackConversion(type, value);
    }
  };

  return { trackEvent, trackConversion };
}

/**
 * Beispiel-Verwendung in Komponenten:
 * 
 * import { useAnalytics } from './hooks/useAnalytics';
 * 
 * function ContactForm() {
 *   const { trackConversion } = useAnalytics();
 *   
 *   const handleSubmit = () => {
 *     // ... form logic
 *     trackConversion('contact_form', 100);
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
  `.trim();
}

/**
 * Generiert wöchentlichen Analytics Report
 */
async function generateWeeklyReport(): Promise<string> {
  console.log('📊 Generiere wöchentlichen Analytics Report...\n');

  // TODO: Implementiere mit Google Analytics Data API
  // Beispiel:
  
  // import { BetaAnalyticsDataClient } from '@google-analytics/data';
  // const analyticsDataClient = new BetaAnalyticsDataClient({
  //   credentials: JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS || '{}')
  // });
  // 
  // const [response] = await analyticsDataClient.runReport({
  //   property: `properties/${process.env.GA4_PROPERTY_ID}`,
  //   dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
  //   dimensions: [{ name: 'pagePath' }, { name: 'eventName' }],
  //   metrics: [
  //     { name: 'activeUsers' },
  //     { name: 'sessions' },
  //     { name: 'conversions' },
  //     { name: 'eventCount' }
  //   ],
  // });

  // Simulierte Daten für Demo
  const report = `
╔═══════════════════════════════════════════════════╗
║         WÖCHENTLICHER ANALYTICS REPORT            ║
║         ${new Date().toISOString().split('T')[0]}                        ║
╚═══════════════════════════════════════════════════╝

📈 TRAFFIC ÜBERSICHT
─────────────────────────────────────────────────────
  Besucher (gesamt):           1,234
  Neue Besucher:                 856 (69%)
  Wiederkehrende Besucher:       378 (31%)
  Sitzungen:                   1,456
  Durchschn. Sitzungsdauer:    3:24 min
  Absprungrate:                42%

📄 TOP SEITEN
─────────────────────────────────────────────────────
  1. /                         456 Aufrufe
  2. /insights                 234 Aufrufe
  3. /work                     189 Aufrufe
  4. /contact                  123 Aufrufe
  5. /capabilities              98 Aufrufe

📱 GERÄTE
─────────────────────────────────────────────────────
  Desktop:                     678 (55%)
  Mobile:                      456 (37%)
  Tablet:                      100 (8%)

🌍 TRAFFIC QUELLEN
─────────────────────────────────────────────────────
  Organische Suche:            567 (46%)
  Direkt:                      345 (28%)
  Social Media:                234 (19%)
  Referral:                     89 (7%)

🔍 TOP SUCHBEGRIFFE (Google Search Console)
─────────────────────────────────────────────────────
  1. webdesign kreuztal        89 Impressionen, 12 Klicks
  2. web agentur siegen        67 Impressionen, 8 Klicks
  3. website erstellen nrw     45 Impressionen, 5 Klicks

🎯 CONVERSIONS
─────────────────────────────────────────────────────
  Kontaktformular:             12 Submissions
  Projekt-Ansichten:           89 Views
  Artikel gelesen (>75%):      45 Reads
  CTA Klicks:                  67 Clicks
  
  Conversion Rate:             2.4%

📊 ENGAGEMENT
─────────────────────────────────────────────────────
  Durchschn. Scroll-Tiefe:     68%
  Artikel-Lesezeit:            4:12 min
  Video-Ansichten:             23
  Downloads:                   8

🚀 WACHSTUM (vs. Vorwoche)
─────────────────────────────────────────────────────
  Besucher:                    +15% ↑
  Sitzungen:                   +12% ↑
  Conversions:                 +8% ↑
  Absprungrate:                -5% ↓

💡 EMPFEHLUNGEN
─────────────────────────────────────────────────────
  ✅ Organischer Traffic wächst gut
  ⚠️  Mobile Absprungrate hoch (48%) → Optimieren
  ✅ Artikel-Engagement stark
  💡 Mehr Content zu "webdesign kreuztal" erstellen

═══════════════════════════════════════════════════

Nächster Report: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
  `.trim();

  return report;
}

/**
 * Sendet Report per Email
 */
async function sendReportEmail(report: string): Promise<void> {
  console.log('📧 Sende Report per Email...\n');

  // TODO: Implementiere mit Email Service
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // await resend.emails.send({
  //   from: 'Analytics <analytics@webstudio-ok.de>',
  //   to: ['oleh@webstudio-ok.de'],
  //   subject: `📊 Wöchentlicher Analytics Report - ${new Date().toISOString().split('T')[0]}`,
  //   text: report,
  // });

  console.log(report);
  console.log('\n✅ Report generiert!\n');
}

/**
 * Speichert Report als Datei
 */
function saveReport(report: string): void {
  const reportsDir = path.join(__dirname, 'analytics-reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filename = `report-${new Date().toISOString().split('T')[0]}.txt`;
  const filepath = path.join(reportsDir, filename);
  
  fs.writeFileSync(filepath, report, 'utf-8');
  console.log(`💾 Report gespeichert: ${filepath}`);
}

/**
 * Hauptfunktion: Generiert und versendet Report
 */
async function runWeeklyReport(): Promise<void> {
  const report = await generateWeeklyReport();
  saveReport(report);
  await sendReportEmail(report);
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║       GOOGLE ANALYTICS 4 TRACKING SYSTEM          ║
╚═══════════════════════════════════════════════════╝

Verwendung:
  npx tsx analytics-tracker.ts setup
  npx tsx analytics-tracker.ts report
  npx tsx analytics-tracker.ts hook

Befehle:
  setup   - Generiert GA4 Tracking Code
  report  - Erstellt wöchentlichen Report
  hook    - Generiert React Analytics Hook

Setup (.env):
  GA4_MEASUREMENT_ID=G-XXXXXXXXXX
  GA4_PROPERTY_ID=123456789
  GOOGLE_ANALYTICS_CREDENTIALS={"type":"service_account",...}

Installation:
  npm install @google-analytics/data

Automatisierung:
  - GitHub Actions: Wöchentlicher Report
  - Cron Job: Täglich um 9:00 Uhr
  - Webhook: Bei wichtigen Events

Events die getrackt werden:
  ✅ Page Views (automatisch)
  ✅ Scroll Depth (75%)
  ✅ Outbound Links
  ✅ Contact Form Submissions
  ✅ Project Views
  ✅ Article Reads
  ✅ CTA Clicks
  `);
  process.exit(0);
}

const command = args[0];

if (command === 'setup') {
  const measurementId = process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
  const trackingCode = generateGA4TrackingCode(measurementId);
  
  console.log('📋 Google Analytics 4 Tracking Code:\n');
  console.log(trackingCode);
  console.log('\n💡 Füge diesen Code in index.html <head> ein\n');

} else if (command === 'report') {
  runWeeklyReport().catch(console.error);

} else if (command === 'hook') {
  const hookCode = generateReactAnalyticsHook();
  const hookPath = path.join(__dirname, 'src/hooks/useAnalytics.ts');
  
  fs.writeFileSync(hookPath, hookCode, 'utf-8');
  console.log(`✅ React Hook erstellt: ${hookPath}\n`);
  console.log('💡 Importiere in App.tsx und nutze in Komponenten\n');

} else {
  console.error('❌ Ungültiger Befehl');
  console.log('Nutze: npx tsx analytics-tracker.ts --help');
  process.exit(1);
}
