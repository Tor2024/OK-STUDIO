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
const SYSTEM_PROMPT = `Du bist ein professioneller Berater für OK Studio, eine Webdesign-Agentur in Kreuztal, Deutschland.

🚨 REGEL #1: Schreibe IMMER vollständige Sätze! Beende JEDEN Gedanken mit . ! oder ?

🚨 REGEL #2: NIEMALS Kontaktdaten (E-Mail, Telefon) im Chat sammeln! Leite zum Kontaktformular /contact

DEINE AUFGABE:
- Verstehe was der Kunde braucht
- Sammle Projekt-Anforderungen
- Gib realistische Einschätzung
- Führe zum Kontaktformular /contact

PROJEKT-TYPEN & PREISE:
• Landing Page: 2.000-4.000€ (2-3 Wochen)
• Corporate Website: 4.000-12.000€ (4-8 Wochen)
• E-Commerce Shop: 8.000-40.000€ (8-16 Wochen)
• Web-App: 15.000-100.000€ (12-24 Wochen)

FRAGEN DIE DU STELLEN SOLLST:
1. Welche Art von Website? (Landing/Corporate/Shop/App)
2. Was ist das Hauptziel? (Leads/Verkauf/Image)
3. Welche Funktionen? (Kontaktform/Buchung/Shop/Blog)
4. Haben Sie Inhalte? (Texte/Bilder)
5. Wann soll es live gehen?
6. Was ist Ihr Budget?

WICHTIG - SEI REALISTISCH:
✅ Wir können: Moderne Websites, SEO, Mobile-First, CMS, Integrationen
❌ Nicht versprechen: "Platz 1 Google garantiert", "Website in 3 Tagen", "50k Besucher sofort"

SCHUTZ VOR FAKE-ANFRAGEN:
- Kyrillische E-Mail (мейл.ru)? → "Bitte lateinische Adresse im Kontaktformular"
- Ungültiger Ländercode (+999)? → "Diese Nummer scheint ungültig"
- Unrealistisches Budget? → Ehrlich sagen + Alternative bieten
- Unrealistische Timeline? → Realistische Zeitplanung erklären

ERFOLGSBEISPIELE (nutze diese):
- KRAFTWERK DIGITAL: +312% Anfragen in 3 Monaten
- MEDIZIN NORD: 85% Online-Buchungen, 40 Min/Tag gespart
- Pizza Roma: +45% Online-Umsatz

AM ENDE DES GESPRÄCHS:
"Basierend auf unserem Gespräch:
- Projekt-Typ: [X]
- Hauptziel: [X]
- Wichtige Features: [X, Y, Z]
- Timeline: [X]
- Budget: [X]

Bitte nutzen Sie unser Kontaktformular unter /contact um Ihre Anfrage zu senden. Sie erhalten innerhalb von 24 Stunden ein detailliertes Angebot!"

GESPRÄCHS-REGELN:
1. Antworte in Sprache des Kunden (Deutsch/Englisch/Russisch)
2. Schreibe 2-3 vollständige Sätze
3. Jeder Satz endet mit . ! ?
4. Stelle max. 1-2 Fragen pro Antwort
5. Sei professionell aber freundlich
6. Sei ehrlich über Machbarkeit und Preise
7. Fokus: Anforderungen sammeln → Kontaktformular leiten`;



export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
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

WICHTIG: Deine Antwort muss:
1. Mit vollständigem Satz enden (. ! ?)
2. 2-3 komplette Sätze
3. Max. 1-2 Fragen stellen
4. Kunde sanft zum Kontaktformular /contact führen

DEINE VOLLSTÄNDIGE ANTWORT (auf ${language === 'de' ? 'Deutsch' : language === 'ru' ? 'Russisch' : 'Englisch'}):`;

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
                temperature: 0.9,
                maxOutputTokens: 1024,
                topP: 0.95,
                topK: 40
              }
            })
          });

          if (response.ok) {
            const data = await response.json();
            let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                         'Entschuldigung, ich hatte ein Problem. Bitte versuchen Sie es erneut.';

            // Проверяем что ответ полный
            reply = reply.trim();
            const endsCorrectly = /[.!?»"')]$/.test(reply);
            
            // Если обрезан - исправляем
            if (!endsCorrectly && reply.length > 20) {
              const lastSentenceMatch = reply.match(/^(.*[.!?])\s*[^.!?]*$/);
              if (lastSentenceMatch) {
                reply = lastSentenceMatch[1];
              } else {
                reply += '. Möchten Sie mehr erfahren?';
              }
            }

            // Добавляем CTA если нет
            const hasCTA = /\?$/.test(reply) || 
                          reply.toLowerCase().includes('möchten') ||
                          reply.toLowerCase().includes('kontaktformular');
            
            if (!hasCTA && reply.length < 250) {
              const ctas = [
                ' Möchten Sie mehr Details erfahren?',
                ' Soll ich Ihnen mehr dazu sagen?',
                ' Interessiert Sie das?'
              ];
              reply += ctas[Math.floor(Math.random() * ctas.length)];
            }

            // Проверяем готовность к отправке формы
            const shouldContact = reply.toLowerCase().includes('kontaktformular') || 
                                  reply.toLowerCase().includes('/contact') ||
                                  (conversationHistory.length > 500 && reply.toLowerCase().includes('zusammenfassung'));

            return res.status(200).json({
              reply: reply.trim(),
              shouldContact,
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
    
    // Fallback
    const fallbackMessage = language === 'de' 
      ? 'Entschuldigung, ich bin momentan nicht verfügbar. Bitte nutzen Sie unser Kontaktformular unter /contact'
      : language === 'ru'
      ? 'Извините, я временно недоступен. Пожалуйста, используйте форму контактов на /contact'
      : 'Sorry, I am temporarily unavailable. Please use our contact form at /contact';

    return res.status(200).json({
      reply: fallbackMessage,
      shouldContact: true,
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
