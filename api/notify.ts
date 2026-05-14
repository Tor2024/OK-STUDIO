import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, projectType, budget, startDate, message, timestamp } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAMM_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAMM_ID || process.env.TELEGRAM_CHAT_ID;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.OFFICIAL_CONTACT_EMAIL || 'hello@webstudio-ok.de';

    const results = {
      telegram: false,
      email: false,
      errors: [] as string[],
    };

    // Send to Telegram
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        console.log('Telegram: Sending message to chat_id:', TELEGRAM_CHAT_ID);
        const telegramMessage = `🔔 Neue Kontaktanfrage

Name: ${name}
Email: ${email}
${subject ? `Betreff: ${subject}\n` : ''}${projectType ? `Kategorie: ${projectType}\n` : ''}${budget ? `Budget: ${budget}\n` : ''}${startDate ? `Start: ${startDate}\n` : ''}
Nachricht:
${message}

${new Date(timestamp).toLocaleString('de-DE')}`;

        const telegramResponse = await fetch(
          `https://api.telegram.com/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: telegramMessage,
            }),
          }
        );

        const responseData = await telegramResponse.text();
        console.log('Telegram API raw response (first 200 chars):', responseData.substring(0, 200));
        
        let parsedData;
        try {
          parsedData = JSON.parse(responseData);
          console.log('Telegram API response:', parsedData);
        } catch (parseError) {
          console.error('Failed to parse Telegram response. Telegram API may be blocked on Vercel.');
          throw new Error('Telegram API blocked or unavailable');
        }

        if (telegramResponse.ok && parsedData.ok) {
          results.telegram = true;
          console.log('Telegram: Message sent successfully');
        } else {
          console.error('Telegram API error:', parsedData);
          results.errors.push(`Telegram: ${parsedData.description || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Telegram error:', error);
        results.errors.push(`Telegram: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      console.error('Telegram: Missing credentials. BOT_TOKEN:', !!TELEGRAM_BOT_TOKEN, 'CHAT_ID:', !!TELEGRAM_CHAT_ID);
      results.errors.push('Telegram: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    }

    // Send Email via Resend
    if (RESEND_API_KEY) {
      try {
        const emailHtml = `
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
    .message { background: white; padding: 20px; border-left: 4px solid #616752; margin-top: 20px; }
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
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">E-Mail</div>
        <div class="value"><a href="mailto:${email}" style="color: #616752;">${email}</a></div>
      </div>
      ${subject ? `
      <div class="field">
        <div class="label">Betreff</div>
        <div class="value">${subject}</div>
      </div>
      ` : ''}
      ${projectType ? `
      <div class="field">
        <div class="label">Kategorie</div>
        <div class="value">${projectType}</div>
      </div>
      ` : ''}
      ${budget ? `
      <div class="field">
        <div class="label">Budget</div>
        <div class="value">${budget}</div>
      </div>
      ` : ''}
      ${startDate ? `
      <div class="field">
        <div class="label">Gewünschter Start</div>
        <div class="value">${startDate}</div>
      </div>
      ` : ''}
      <div class="message">
        <div class="label">Nachricht</div>
        <div class="value">${message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      <p>Gesendet am ${new Date(timestamp).toLocaleString('de-DE')}</p>
      <p style="margin-top: 10px; opacity: 0.6;">OK STUDIO — Webstudio Kalchenko Oleh</p>
    </div>
  </div>
</body>
</html>
        `.trim();

        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'OK Studio <onboarding@resend.dev>',
            to: [CONTACT_EMAIL],
            subject: `Neue Kontaktanfrage: ${name}`,
            html: emailHtml,
            reply_to: email,
          }),
        });

        if (emailResponse.ok) {
          results.email = true;
        } else {
          const errorData = await emailResponse.json();
          results.errors.push(`Email: ${errorData.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Email error:', error);
        results.errors.push(`Email: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else {
      results.errors.push('Email: Missing RESEND_API_KEY');
    }

    // Return success if at least one notification was sent
    if (results.telegram || results.email) {
      return res.status(200).json({ 
        success: true, 
        message: 'Notification sent',
        results 
      });
    } else {
      return res.status(500).json({ 
        success: false,
        error: 'Failed to send notifications',
        details: results.errors,
        hint: 'Please configure environment variables on Vercel: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, RESEND_API_KEY, OFFICIAL_CONTACT_EMAIL'
      });
    }

  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
