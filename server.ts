import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { Resend } from 'resend';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  
  // CORS: restrict to production domain in production
  const corsOptions = process.env.NODE_ENV === 'production' 
    ? { origin: ['https://webstudio-ok.de', 'https://www.webstudio-ok.de'], methods: ['GET', 'POST'], credentials: true }
    : {};
  app.use(cors(corsOptions));

  // Helper: sanitize HTML to prevent XSS
  const sanitize = (str: string) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Notification Endpoint
  app.post('/api/notify', async (req, res) => {
    const { name, email, subject, projectType, budget, message } = req.body;
    
    // Sanitize all inputs
    const safeName = sanitize(name);
    const safeEmail = sanitize(email);
    const safeSubject = sanitize(subject);
    const safeProjectType = sanitize(projectType);
    const safeBudget = sanitize(budget);
    const safeMessage = sanitize(message);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const resendKey = process.env.RESEND_API_KEY;

    let telegramSent = false;
    let emailSent = false;

    // 1. Telegram Notification
    if (botToken && chatId) {
      try {
        const text = `
🆕 *NEUE ANFRAGE: WEB STUDIO // OK*
────────────────────
👤 *Name:* ${safeName}
📧 *Email:* ${safeEmail}
📁 *Typ:* ${safeProjectType}
💰 *Budget:* ${safeBudget}
💬 *Betreff:* ${safeSubject}
────────────────────
📝 *Nachricht:*
${safeMessage}
        `;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown'
          })
        });
        telegramSent = true;
      } catch (err) {
        console.error('Telegram Error:', err);
      }
    }

    // 2. Email Notification (using Resend)
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: 'Lead Generator <onboarding@resend.dev>',
          to: process.env.OFFICIAL_CONTACT_EMAIL || 'info@webstudio-ok.de',
          subject: `Neue Anfrage von ${safeName}: ${safeSubject}`,
          html: `
            <h2>System-Benachrichtigung: Neue Kontaktanfrage</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Projekt:</strong> ${safeProjectType} (${safeBudget})</p>
            <hr/>
            <p>${safeMessage}</p>
          `
        });
        emailSent = true;
      } catch (err) {
        console.error('Email Error:', err);
      }
    }

    res.json({
      success: true,
      telegram: telegramSent,
      email: emailSent,
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
