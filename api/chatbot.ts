import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { message, language, history, settings } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Формируем контекст из истории
    const contextMessages = history?.slice(-6).map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.text
    })) || [];

    // API запрос к OpenAI-совместимому сервису
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...contextMessages,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!aiResponse.ok) {
      console.error('AI API error:', await aiResponse.text());
      throw new Error('AI service unavailable');
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0]?.message?.content || 'Entschuldigung, ich hatte ein Problem. Bitte versuchen Sie es erneut.';

    // Проверяем, нужно ли связаться с клиентом
    const shouldContact = reply.toLowerCase().includes('e-mail') || 
                          reply.toLowerCase().includes('kontaktdaten') ||
                          reply.toLowerCase().includes('терmin') ||
                          message.toLowerCase().includes('@');

    // Извлекаем email если есть
    const emailMatch = message.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const email = emailMatch ? emailMatch[0] : null;

    return res.status(200).json({
      reply,
      shouldContact,
      email,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chatbot error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
