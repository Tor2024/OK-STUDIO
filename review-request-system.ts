/**
 * Automatisches Review-Request System
 * Sendet automatisch Anfragen für Google Bewertungen nach Projektabschluss
 * 
 * Setup:
 * 1. Konfiguriere Email Service (Resend, SendGrid, etc.)
 * 2. Erstelle Google Review Link
 * 3. npm install resend (bereits installiert)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Client {
  name: string;
  email: string;
  projectName: string;
  completedDate: string;
}

interface ReviewRequest {
  client: Client;
  sentDate: string;
  status: 'pending' | 'sent' | 'reviewed' | 'declined';
  reviewUrl?: string;
}

/**
 * Generiert personalisierten Email-Text für Review-Anfrage
 */
function generateReviewEmail(client: Client, reviewLink: string): { subject: string; html: string; text: string } {
  const subject = `Kurzes Feedback zu Ihrem Projekt "${client.projectName}"?`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #141414; background: #F1F3EA; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: white; border: 2px solid #C5C5C5; }
    .header { background: #616752; color: #F1F3EA; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
    .content { padding: 40px 30px; }
    .content p { margin: 0 0 15px; }
    .cta { text-align: center; margin: 30px 0; }
    .cta a { display: inline-block; background: #616752; color: white; padding: 15px 40px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; font-size: 14px; }
    .cta a:hover { opacity: 0.9; }
    .footer { background: #F1F3EA; padding: 20px 30px; font-size: 12px; color: #616752; border-top: 1px solid #C5C5C5; }
    .stars { font-size: 32px; color: #FFD700; text-align: center; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>OK STUDIO</h1>
    </div>
    <div class="content">
      <p>Hallo ${client.name},</p>
      
      <p>vielen Dank für Ihr Vertrauen bei der Umsetzung von <strong>"${client.projectName}"</strong>!</p>
      
      <p>Wir hoffen, dass Sie mit dem Ergebnis zufrieden sind und Ihre neue Website bereits erste Erfolge zeigt.</p>
      
      <div class="stars">⭐⭐⭐⭐⭐</div>
      
      <p><strong>Würden Sie uns mit einer kurzen Google-Bewertung helfen?</strong></p>
      
      <p>Ihre Meinung ist uns wichtig und hilft anderen Unternehmen, die richtige Entscheidung zu treffen. Die Bewertung dauert nur 2 Minuten.</p>
      
      <div class="cta">
        <a href="${reviewLink}" target="_blank">JETZT BEWERTEN</a>
      </div>
      
      <p style="font-size: 14px; color: #616752; margin-top: 30px;">
        Falls Sie Feedback oder Verbesserungsvorschläge haben, können Sie auch direkt auf diese Email antworten. Wir freuen uns über jede Rückmeldung!
      </p>
      
      <p style="margin-top: 30px;">Beste Grüße,<br><strong>Oleh Kalchenko</strong><br>OK Studio</p>
    </div>
    <div class="footer">
      <p>OK Studio – Webdesign & Digitalisierung<br>
      Kreuztal, Siegerland, NRW<br>
      <a href="https://webstudio-ok.de" style="color: #616752;">webstudio-ok.de</a></p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Hallo ${client.name},

vielen Dank für Ihr Vertrauen bei der Umsetzung von "${client.projectName}"!

Wir hoffen, dass Sie mit dem Ergebnis zufrieden sind und Ihre neue Website bereits erste Erfolge zeigt.

Würden Sie uns mit einer kurzen Google-Bewertung helfen?

Ihre Meinung ist uns wichtig und hilft anderen Unternehmen, die richtige Entscheidung zu treffen. Die Bewertung dauert nur 2 Minuten.

Jetzt bewerten: ${reviewLink}

Falls Sie Feedback oder Verbesserungsvorschläge haben, können Sie auch direkt auf diese Email antworten. Wir freuen uns über jede Rückmeldung!

Beste Grüße,
Oleh Kalchenko
OK Studio

---
OK Studio – Webdesign & Digitalisierung
Kreuztal, Siegerland, NRW
webstudio-ok.de
  `.trim();

  return { subject, html, text };
}

/**
 * Sendet Review-Anfrage per Email
 */
async function sendReviewRequest(client: Client, reviewLink: string): Promise<boolean> {
  console.log(`📧 Sende Review-Anfrage an ${client.name} (${client.email})...`);

  const { subject, html, text } = generateReviewEmail(client, reviewLink);

  // TODO: Implementiere mit echtem Email Service
  // Beispiel mit Resend (bereits installiert):
  
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // 
  // try {
  //   const { data, error } = await resend.emails.send({
  //     from: 'OK Studio <noreply@webstudio-ok.de>',
  //     to: [client.email],
  //     subject,
  //     html,
  //     text,
  //   });
  //   
  //   if (error) {
  //     console.error('❌ Email-Fehler:', error);
  //     return false;
  //   }
  //   
  //   console.log('✅ Email gesendet:', data.id);
  //   return true;
  // } catch (err) {
  //   console.error('❌ Fehler beim Senden:', err);
  //   return false;
  // }

  // Für Demo: Zeige Email-Vorschau
  console.log('\n' + '═'.repeat(60));
  console.log('EMAIL VORSCHAU:');
  console.log('═'.repeat(60));
  console.log(`An: ${client.email}`);
  console.log(`Betreff: ${subject}`);
  console.log('─'.repeat(60));
  console.log(text);
  console.log('═'.repeat(60) + '\n');

  return true; // Simuliert Erfolg
}

/**
 * Automatische Review-Anfrage nach Projektabschluss
 * Wartet 2 Wochen nach Abschluss, dann sendet Email
 */
async function scheduleReviewRequest(client: Client, reviewLink: string, delayDays: number = 14): Promise<void> {
  const completedDate = new Date(client.completedDate);
  const sendDate = new Date(completedDate);
  sendDate.setDate(sendDate.getDate() + delayDays);

  const now = new Date();
  const daysUntilSend = Math.ceil((sendDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  console.log(`📅 Projekt abgeschlossen: ${client.completedDate}`);
  console.log(`📅 Review-Anfrage geplant für: ${sendDate.toISOString().split('T')[0]}`);
  console.log(`⏳ Tage bis zum Versand: ${daysUntilSend}\n`);

  if (daysUntilSend <= 0) {
    console.log('✅ Zeitpunkt erreicht! Sende jetzt...\n');
    await sendReviewRequest(client, reviewLink);
  } else {
    console.log(`⏰ Warte noch ${daysUntilSend} Tage...\n`);
    console.log('💡 Tipp: Nutze Cron Job oder GitHub Actions für automatisches Scheduling');
  }
}

/**
 * Batch-Versand für mehrere Kunden
 */
async function sendBatchReviewRequests(clients: Client[], reviewLink: string): Promise<void> {
  console.log(`🚀 Starte Batch-Versand für ${clients.length} Kunden...\n`);

  const results = await Promise.all(
    clients.map(async client => {
      try {
        const success = await sendReviewRequest(client, reviewLink);
        return { client: client.name, success };
      } catch (err) {
        console.error(`❌ Fehler bei ${client.name}:`, err);
        return { client: client.name, success: false };
      }
    })
  );

  // Zusammenfassung
  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 ERGEBNIS:');
  const successful = results.filter(r => r.success).length;
  console.log(`   ✅ Erfolgreich: ${successful}/${clients.length}`);
  console.log(`   ❌ Fehlgeschlagen: ${clients.length - successful}/${clients.length}`);
  results.forEach(r => {
    const icon = r.success ? '✅' : '❌';
    console.log(`   ${icon} ${r.client}`);
  });
  console.log('═══════════════════════════════════════════════════\n');
}

/**
 * Tracking: Speichert gesendete Anfragen
 */
function saveReviewRequest(request: ReviewRequest): void {
  const trackingFile = path.join(__dirname, 'review-requests.json');
  
  let requests: ReviewRequest[] = [];
  if (fs.existsSync(trackingFile)) {
    requests = JSON.parse(fs.readFileSync(trackingFile, 'utf-8'));
  }

  requests.push(request);
  fs.writeFileSync(trackingFile, JSON.stringify(requests, null, 2), 'utf-8');
  
  console.log(`💾 Anfrage gespeichert in: ${trackingFile}`);
}

/**
 * Statistiken: Zeigt Review-Request Performance
 */
function showStats(): void {
  const trackingFile = path.join(__dirname, 'review-requests.json');
  
  if (!fs.existsSync(trackingFile)) {
    console.log('📊 Noch keine Daten vorhanden.');
    return;
  }

  const requests: ReviewRequest[] = JSON.parse(fs.readFileSync(trackingFile, 'utf-8'));
  
  const total = requests.length;
  const sent = requests.filter(r => r.status === 'sent').length;
  const reviewed = requests.filter(r => r.status === 'reviewed').length;
  const conversionRate = total > 0 ? ((reviewed / total) * 100).toFixed(1) : '0';

  console.log('\n═══════════════════════════════════════════════════');
  console.log('📊 REVIEW REQUEST STATISTIKEN');
  console.log('═══════════════════════════════════════════════════');
  console.log(`   Gesamt gesendet: ${total}`);
  console.log(`   Erfolgreich versendet: ${sent}`);
  console.log(`   Bewertungen erhalten: ${reviewed}`);
  console.log(`   Conversion Rate: ${conversionRate}%`);
  console.log('═══════════════════════════════════════════════════\n');
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║      AUTOMATISCHES REVIEW-REQUEST SYSTEM          ║
╚═══════════════════════════════════════════════════╝

Verwendung:
  npx tsx review-request-system.ts send <name> <email> <projekt>
  npx tsx review-request-system.ts batch <json-file>
  npx tsx review-request-system.ts stats

Beispiele:
  npx tsx review-request-system.ts send "Max Müller" max@example.com "Website Relaunch"
  npx tsx review-request-system.ts batch clients.json
  npx tsx review-request-system.ts stats

Setup (.env):
  RESEND_API_KEY=re_...
  GOOGLE_REVIEW_LINK=https://g.page/r/...

Google Review Link erstellen:
  1. Google My Business öffnen
  2. "Bewertungen erhalten" → "Link teilen"
  3. Link kopieren und in .env speichern

Automatisierung:
  - GitHub Actions: Täglich prüfen und senden
  - Cron Job: Wöchentliche Batch-Versendung
  - Webhook: Nach Projekt-Abschluss triggern

Tracking:
  Alle Anfragen werden in review-requests.json gespeichert
  `);
  process.exit(0);
}

const command = args[0];

// Google Review Link (aus .env oder Fallback)
const GOOGLE_REVIEW_LINK = process.env.GOOGLE_REVIEW_LINK || 'https://g.page/r/YOUR_PLACE_ID/review';

if (command === 'send' && args.length >= 4) {
  const [, name, email, projectName] = args;
  const client: Client = {
    name,
    email,
    projectName,
    completedDate: new Date().toISOString().split('T')[0],
  };
  
  sendReviewRequest(client, GOOGLE_REVIEW_LINK)
    .then(success => {
      if (success) {
        saveReviewRequest({
          client,
          sentDate: new Date().toISOString(),
          status: 'sent',
        });
      }
    })
    .catch(console.error);

} else if (command === 'batch' && args[1]) {
  const jsonFile = args[1];
  if (!fs.existsSync(jsonFile)) {
    console.error(`❌ Datei nicht gefunden: ${jsonFile}`);
    process.exit(1);
  }
  
  const clients: Client[] = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
  sendBatchReviewRequests(clients, GOOGLE_REVIEW_LINK).catch(console.error);

} else if (command === 'stats') {
  showStats();

} else {
  console.error('❌ Ungültige Argumente');
  console.log('Nutze: npx tsx review-request-system.ts --help');
  process.exit(1);
}
