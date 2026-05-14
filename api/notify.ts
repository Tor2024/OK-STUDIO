import type { VercelRequest, VercelResponse } from '@vercel/node';

const OWNER_EMAIL = process.env.OFFICIAL_CONTACT_EMAIL || process.env.CONTACT_EMAIL || 'hello@webstudio-ok.de';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'OK Studio <onboarding@resend.dev>';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

async function sendTelegram({ name, email, subject, message, projectType, budget, startDate }: any) {
  const token = process.env.TELEGRAMM_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAMM_ID || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log('Telegram: Missing credentials');
    return { ok: false, skipped: true, reason: 'telegram credentials missing' };
  }

  console.log('Telegram: Sending to chat_id:', chatId);

  const text = [
    '<b>🔔 Neue Kontaktanfrage</b>',
    '',
    `<b>👤 Name:</b> ${escapeHtml(name)}`,
    `<b>📧 E-Mail:</b> ${escapeHtml(email)}`,
    subject ? `<b>📝 Betreff:</b> ${escapeHtml(subject)}` : null,
    projectType ? `<b>📂 Kategorie:</b> ${escapeHtml(projectType)}` : null,
    budget ? `<b>💰 Budget:</b> ${escapeHtml(budget)}` : null,
    startDate ? `<b>📅 Start:</b> ${escapeHtml(startDate)}` : null,
    '',
    '<b>💬 Nachricht:</b>',
    escapeHtml(message),
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Telegram API error:', res.status, body);
      return { ok: false, status: res.status, body };
    }

    console.log('Telegram: Message sent successfully');
    return { ok: true };
  } catch (error) {
    console.error('Telegram error:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendEmail({ name, email, subject, message, projectType, budget, startDate }: any) {
  const apiKey = process.env.RESEND_API_KEY || process.env.resendapikey;

  if (!apiKey) {
    console.log('Email: Missing API key');
    return { ok: false, skipped: true, reason: 'resend api key missing' };
  }

  const safeSubject = subject
    ? `Neue Kontaktanfrage: ${name} - ${subject}`
    : `Neue Kontaktanfrage: ${name}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #141414; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #616752; color: white; padding: 30px; text-align: center; }
    .content { background: #F1F3EA; padding: 30px; }
    .field { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #C5C5C5; }
    .label { font-family: monospace; font-size: 11px; color: #616752; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 5px; }
    .value { font-size: 15px; color: #141414; }
    .message { background: white; padding: 20px; border-left: 4px solid #616752; margin-top: 20px; white-space: pre-wrap; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #616752; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px; font-weight: 900;">🔔 NEUE KONTAKTANFRAGE</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">OK STUDIO — Kontaktformular</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${escapeHtml(name)}</div>
      </div>
      <div class="field">
        <div class="label">E-Mail</div>
        <div class="value"><a href="mailto:${escapeHtml(email)}" style="color: #616752;">${escapeHtml(email)}</a></div>
      </div>
      ${subject ? `
      <div class="field">
        <div class="label">Betreff</div>
        <div class="value">${escapeHtml(subject)}</div>
      </div>
      ` : ''}
      ${projectType ? `
      <div class="field">
        <div class="label">Kategorie</div>
        <div class="value">${escapeHtml(projectType)}</div>
      </div>
      ` : ''}
      ${budget ? `
      <div class="field">
        <div class="label">Budget</div>
        <div class="value">${escapeHtml(budget)}</div>
      </div>
      ` : ''}
      ${startDate ? `
      <div class="field">
        <div class="label">Gewünschter Start</div>
        <div class="value">${escapeHtml(startDate)}</div>
      </div>
      ` : ''}
      <div class="message">
        <div class="label">Nachricht</div>
        <div class="value">${escapeHtml(message)}</div>
      </div>
    </div>
    <div class="footer">
      <p>Gesendet am ${new Date().toLocaleString('de-DE')}</p>
      <p style="margin-top: 10px; opacity: 0.6;">OK STUDIO — Webstudio Kalchenko Oleh</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [OWNER_EMAIL],
        reply_to: email,
        subject: safeSubject,
        html,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || '-'}\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('Email API error:', res.status, body);
      return { ok: false, status: res.status, body };
    }

    console.log('Email: Sent successfully');
    return { ok: true };
  } catch (error) {
    console.error('Email error:', error);
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const { name, email, subject, message, projectType, budget, startDate, website } = body;

    // Honeypot: real users don't fill `website`
    if (website) {
      return res.status(200).json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (String(message).length > 4000 || String(name).length > 200) {
      return res.status(400).json({ error: 'Message or name too long.' });
    }

    // Send to both Telegram and Email
    const [telegram, email_] = await Promise.all([
      sendTelegram({ name, email, subject, message, projectType, budget, startDate }).catch((e) => ({
        ok: false,
        error: e?.message,
      })),
      sendEmail({ name, email, subject, message, projectType, budget, startDate }).catch((e) => ({
        ok: false,
        error: e?.message,
      })),
    ]);

    if (!telegram.ok && !email_.ok) {
      return res.status(502).json({
        error: 'Unable to deliver message, please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification sent',
      results: {
        telegram: telegram.ok,
        email: email_.ok,
      },
    });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
