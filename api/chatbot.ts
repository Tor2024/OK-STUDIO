import type { VercelRequest, VercelResponse } from '@vercel/node';

// Модели Gemini для использования (в порядке приоритета)
const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-2.0-flash',
  'gemini-flash',
];

// Системный промпт для AI - правила ведения диалога
const SYSTEM_PROMPT = `Du bist ein professioneller Verkaufsassistent für OK Studio, eine Webdesign-Agentur in Kreuztal, Deutschland.

DEINE PERSÖNLICHKEIT:
- Freundlich, aber professionell
- Hilfsbereit und proaktiv
- Direkt und konkret (keine langen Monologe)
- Fokussiert auf Verkauf, aber nicht aufdringlich

VERKAUFSSTRATEGIE (WICHTIG!):
1. Verstehe das Problem/Bedürfnis des Kunden
2. Zeige, wie OK Studio helfen kann
3. Nenne konkrete Vorteile und Zahlen
4. Führe zum kostenlosen Erstgespräch

PREISE (20% UNTER MARKTPREIS):
- Landing Page: 2.000-4.000€
- Corporate Website: 4.000-12.000€
- E-Commerce: 8.000-40.000€
- Hourly Rate: 60-100€/Std

LEISTUNGEN:
✓ Web-Design & Entwicklung (React, TypeScript, Modern Stack)
✓ SEO-Optimierung (Google, Yandex, Bing)
✓ Responsives Design (Mobile-First)
✓ CMS Integration (einfache Verwaltung)
✓ Hosting & Wartung
✓ Performance-Optimierung
✓ KI-Integration
✓ Lead-Generierung

PROJEKTABLAUF:
1. Kostenloses Erstgespräch (30 Min)
2. Angebot innerhalb 48h
3. Design-Phase: 1-2 Wochen
4. Entwicklung: 2-4 Wochen
5. Testing & Launch: 1 Woche
→ Gesamt: 4-8 Wochen für Corporate Website

ERFOLGSGESCHICHTEN:
- KRAFTWERK DIGITAL: +312% Leads, -67% Absprungrate
- MEDIZIN NORD: 85% Online-Buchungen, 40 Min/Tag gespart
- Pizza Roma: Automatisierte Lieferung mit GPS

REGELN:
1. Antworte IMMER auf der Sprache des Kunden (Deutsch, Englisch, Russisch)
2. Halte Antworten kurz (max 3-4 Sätze)
3. Stelle Fragen um zu qualifizieren
4. Bei Interesse → sammle Email/Telefon → leite zu Erstgespräch
5. Bei Preisfragen → nenne Range + "abhängig von Features"
6. Bei Vergleichen → betone: lokale Agentur, persönlicher Service, faire Preise
7. Sei ehrlich: wenn du etwas nicht weißt, sage es

CALL-TO-ACTION VARIATIONEN:
- "Möchten Sie ein kostenloses Erstgespräch vereinbaren?"
- "Soll ich Ihnen ein unverbindliches Angebot erstellen?"
- "Darf ich Ihre Kontaktdaten für ein Angebot aufnehmen?"
- "Wann passt Ihnen ein 30-minütiges Kennenlerngespräch?"

QUALIFIZIERUNG:
Stelle diese Fragen um zu qualifizieren:
- "Welche Art von Website benötigen Sie?"
- "Haben Sie bereits eine Website?"
- "Was ist Ihr Hauptziel? (Mehr Leads, besseres Image, Online-Verkäufe?)"
- "Wann möchten Sie starten?"
- "Was ist Ihr Budget-Rahmen?"

WENN KUNDE BEREIT IST:
Antworte mit: "Perfekt! Um Ihnen ein maßgeschneidertes Angebot zu erstellen, benötige ich:
1. Ihre E-Mail-Adresse
2. Kurze Beschreibung Ihres Projekts
3. Gewünschter Start-Termin

Dann melde ich mich innerhalb von 24 Stunden bei Ihnen."

Und setze im Response: shouldContact: true

WICHTIG: Verkaufe subtil! Baue Vertrauen auf, zeige Expertise, dann führe zum Gespräch.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, language, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKeysString = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKeysString) {
      return res.status(500).json({ error: 'API Key not configured' });
    }

    const apiKeys = apiKeysString.split(',').map(k => k.trim());

    // Формируем контекст из истории
    let conversationHistory = '';
    if (history && history.length > 0) {
      conversationHistory = history.slice(-6).map((msg: any) => 
        `${msg.sender === 'user' ? 'Kunde' : 'Assistent'}: ${msg.text}`
      ).join('\n');
    }

    const fullPrompt = `${SYSTEM_PROMPT}

BISHERIGE KONVERSATION:
${conversationHistory}

NEUE NACHRICHT VOM KUNDEN:
${message}

DEINE ANTWORT (auf ${language === 'de' ? 'Deutsch' : language === 'ru' ? 'Russisch' : 'Englisch'}):`;

    let lastError = null;

    // Пробуем модели по очереди
    for (const model of MODELS_TO_TRY) {
      for (const key of apiKeys) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: fullPrompt }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300,
                topP: 0.8,
                topK: 40
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'Entschuldigung, ich hatte ein Problem. Bitte versuchen Sie es erneut.';

            // Проверяем, нужно ли связаться с клиентом
            const shouldContact = reply.toLowerCase().includes('e-mail') || 
                                  reply.toLowerCase().includes('kontaktdaten') ||
                                  reply.toLowerCase().includes('терmin') ||
                                  message.toLowerCase().includes('@');

            // Извлекаем email если есть
            const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
            const email = emailMatch ? emailMatch[0] : null;

            return res.status(200).json({
              reply: reply.trim(),
              shouldContact,
              email,
              model,
              timestamp: new Date().toISOString()
            });
          }

          lastError = await response.text();
        } catch (error: any) {
          lastError = error.message;
          continue;
        }
      }
    }

    console.error('All models failed. Last error:', lastError);
    
    // Fallback ответ
    const fallbackMessage = language === 'de' 
      ? 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte kontaktieren Sie uns direkt per E-Mail oder Telefon.'
      : language === 'ru'
      ? 'Извините, я временно недоступен. Пожалуйста, свяжитесь с нами напрямую по email или телефону.'
      : 'Sorry, I am temporarily unavailable. Please contact us directly via email or phone.';

    return res.status(200).json({
      reply: fallbackMessage,
      shouldContact: false,
      email: null,
      fallback: true
    });

  } catch (error: any) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
