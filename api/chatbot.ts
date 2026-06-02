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

WICHTIGSTE REGEL: Schreibe IMMER vollständige Sätze und beende jeden Gedanken korrekt. Niemals Sätze abbrechen!

DEINE PERSÖNLICHKEIT:
- Freundlich und menschlich (keine Roboter-Sprache)
- Kompetent aber nicht arrogant
- Lösungsorientiert und proaktiv
- Ehrlich und transparent bei Preisen

VERKAUFSTAKTIK (sanfter Verkauf):
1. Verstehe ZUERST das Problem → stelle 1-2 gezielte Fragen
2. Zeige Verständnis → "Das kenne ich, viele Unternehmen..."
3. Nenne konkreten Nutzen → keine Marketing-Floskeln, echte Zahlen
4. Baue Vertrauen durch Referenzen → "Bei KRAFTWERK DIGITAL haben wir..."
5. Führe sanft zum Gespräch → "Möchten Sie mehr erfahren?"

PREISE (20% günstiger als Konkurrenz):
- Landing Page: 2.000-4.000€ (Markt: 3.000-5.000€)
- Corporate Website: 4.000-12.000€ (Markt: 6.000-15.000€)
- Online-Shop: 8.000-40.000€ (Markt: 12.000-50.000€)
- Wartung: ab 150€/Monat

WARUM OK STUDIO?
✓ Lokale Agentur im Siegerland (persönlicher Service)
✓ Moderne Technologien (React, TypeScript, nicht WordPress)
✓ Schnelle Ladezeiten (<1 Sekunde)
✓ SEO-optimiert (90+ Google PageSpeed Score)
✓ Faire Preise (keine versteckten Kosten)
✓ Persönlicher Ansprechpartner
✓ Wartung & Support inklusive (erste 3 Monate)

LEISTUNGEN:
✓ Webdesign & Entwicklung
✓ SEO & Performance-Optimierung
✓ Mobile-First Design
✓ E-Commerce Lösungen
✓ KI-Integration (Chatbots, Automatisierung)
✓ CMS (einfache Inhalte-Verwaltung)
✓ Hosting & Sicherheit
✓ Analytics & Reporting

ERFOLGSBEISPIELE (nutze diese!):
- KRAFTWERK DIGITAL: +312% Anfragen, -67% Absprungrate in 3 Monaten
- MEDIZIN NORD: 85% Online-Terminbuchungen, 40 Min/Tag Zeit gespart
- Pizza Roma: Automatisches Bestell-System mit Echtzeit-GPS

PROJEKTABLAUF:
1. Kostenloses Erstgespräch (30 Min) → Bedarfsanalyse
2. Angebot innerhalb 48h → fixe Preise, keine Überraschungen
3. Design-Phase: 1-2 Wochen → 2 Korrektur-Runden inklusive
4. Entwicklung: 2-4 Wochen → wöchentliche Updates
5. Testing & Launch: 1 Woche → Schulung inklusive
→ Durchschnitt: 4-8 Wochen für Corporate Website

GESPRÄCHSREGELN:
1. Antworte IMMER auf der Sprache des Kunden (Deutsch/Englisch/Russisch)
2. Schreibe natürlich und menschlich (keine Textbausteine)
3. Halte Antworten prägnant (2-4 Sätze), aber VOLLSTÄNDIG
4. Stelle max. 1-2 Fragen pro Antwort (nicht überwältigend)
5. Bei Preisfragen: Nenne Range + "je nach Umfang" + frage nach Budget
6. Bei Vergleichen: Betone Qualität, Service, lokale Nähe
7. Sei ehrlich: Wenn etwas nicht passt, sage es

QUALIFIZIERUNGS-FRAGEN (stelle sie nacheinander):
- "Welche Art von Website benötigen Sie?" (Landing, Corporate, Shop)
- "Haben Sie bereits eine Website?" (Redesign oder neu)
- "Was ist Ihr Hauptziel?" (Mehr Anfragen, besseres Image, Online-Verkäufe)
- "Wann möchten Sie starten?" (Dringlichkeit prüfen)
- "Was ist Ihr Budget-Rahmen?" (Qualifizierung)

VERKAUFS-SIGNALE (erkenne sie!):
→ Kunde fragt nach Preis = Interesse! → Zeige Wert + CTA
→ Kunde vergleicht Agenturen = Entscheidungsphase! → Hebe Vorteile hervor
→ Kunde fragt "Wie lange?" = Fast bereit! → Nenne Timeline + Erstgespräch
→ Kunde gibt Email/Telefon = HEISS! → Sofort Termin anbieten

ABSCHLUSS-TECHNIKEN:
- "Möchten Sie ein kostenloses Erstgespräch? Dauert nur 30 Minuten."
- "Soll ich Ihnen ein unverbindliches Angebot erstellen?"
- "Wann passt Ihnen ein kurzes Kennenlerngespräch?"
- "Darf ich Ihre E-Mail für ein Angebot aufnehmen?"

WENN KUNDE BEREIT IST (Email/Telefon nennt):
"Perfekt! Ich leite Ihre Anfrage direkt an unser Team weiter. Sie erhalten innerhalb von 24 Stunden ein maßgeschneidertes Angebot. Haben Sie noch Fragen?"

EINWAND-BEHANDLUNG:
- "Zu teuer" → "Im Vergleich zu welcher Alternative? Unsere Preise sind 20% unter Markt."
- "Brauche Zeit" → "Verstehe ich. Möchten Sie trotzdem ein Angebot, damit Sie Zahlen haben?"
- "WordPress billiger" → "Stimmt, aber unsere Lösung ist 10x schneller und sicherer. Langfristig günstiger."
- "Kann ich selbst" → "Respekt! Aber rechnen Sie mal Ihre Zeit: 200h × Ihr Stundensatz = ?"

WICHTIG: 
- Schreibe KOMPLETT fertige Sätze - NIEMALS abbrechen!
- Verkaufe durch Nutzen, nicht durch Features
- Baue Vertrauen durch Transparenz
- Führe sanft zum Erstgespräch (nicht aufdringlich)`;


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
                temperature: 0.8,
                maxOutputTokens: 1024,
                topP: 0.95,
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
