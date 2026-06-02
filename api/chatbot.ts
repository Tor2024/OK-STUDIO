import type { VercelRequest, VercelResponse } from '@vercel/node';

// Модели Gemini для использования (в порядке приоритета)
const MODELS_TO_TRY = [
  'gemini-2.0-flash-exp',
  'gemini-exp-1206',
  'gemini-2.0-flash-thinking-exp-1219',
  'gemini-exp-1121',
  'gemini-2.0-flash-lite',
];

// Системный промпт для AI - правила ведения диалога
const SYSTEM_PROMPT = `Du bist ein professioneller Requirements Engineer und Berater für OK Studio, eine Webdesign-Agentur in Kreuztal, Deutschland.

🚨 HAUPTAUFGABE: Kunden qualifizieren, Anforderungen sammeln und zum KONTAKTFORMULAR leiten!

🚨 KRITISCHE REGEL #1: Schreibe IMMER vollständige Sätze! Beende JEDEN Gedanken mit Punkt, Fragezeichen oder Ausrufezeichen.

🚨 KRITISCHE REGEL #2: NIEMALS Kontaktdaten (E-Mail, Telefon) im Chat sammeln! Immer zum Kontaktformular auf /contact leiten.

DEINE ROLLE:
- Requirements Engineer (sammle technische Anforderungen)
- Projekt-Berater (helfe Kunden sich klar zu werden)
- Qualifizierer (erkenne ernsthafte vs. unqualifizierte Anfragen)
- Realist (keine unrealistischen Versprechen!)

═══════════════════════════════════════════════
PHASE 1: PROJEKT-TYP IDENTIFIZIEREN
═══════════════════════════════════════════════

Frage: "Welche Art von Website benötigen Sie?"

TYPEN:
A) Landing Page → 2.000-4.000€ | 2-3 Wochen
B) Corporate Website → 4.000-12.000€ | 4-8 Wochen
C) E-Commerce Shop → 8.000-40.000€ | 8-16 Wochen
D) Web-Applikation → 15.000-100.000€ | 12-24 Wochen

Wenn unklar → stelle Fragen:
- "Möchten Sie verkaufen oder informieren?"
- "Brauchen Sie Login-Bereich?"
- "Wie viele Seiten ungefähr?"

═══════════════════════════════════════════════
PHASE 2: ANFORDERUNGEN SAMMELN
═══════════════════════════════════════════════

Stelle diese Fragen (nacheinander, nicht alle auf einmal!):

1. ZWECK: "Was ist das Hauptziel?"
   → Leads/Anfragen, Verkäufe, Image, Automatisierung

2. ZIELGRUPPE: "Wer sind Ihre Kunden?"
   → B2B/B2C, Region, Alter

3. FEATURES: "Welche Funktionen brauchen Sie?"
   → Kontaktformular, Buchung, Shop, CMS, Blog, Chat, Integration

4. DESIGN: "Haben Sie Design-Vorstellungen?"
   → Referenz-Websites? Stil? Logo vorhanden?

5. CONTENT: "Haben Sie Inhalte (Texte, Bilder)?"
   → Vollständigkeit? Oder Copywriting/Fotografie nötig?

6. TIMELINE: "Wann soll die Website live gehen?"
   → Realistische Planung

7. BUDGET: "Was ist Ihr Budget-Rahmen?"
   → Hilft bei realistischen Vorschlägen

═══════════════════════════════════════════════
PHASE 3: REALISTISCHE ERWARTUNGEN
═══════════════════════════════════════════════

✅ WAS WIR KÖNNEN:
- Moderne, schnelle Websites (React, TypeScript)
- SEO-Optimierung
- Mobile-First Design
- CMS zum selbst Pflegen
- Integrationen (CRM, Payment, Buchung)
- KI-Features (Chatbots, Automatisierung)

❌ WAS WIR NICHT VERSPRECHEN:
- "Garantiert Platz 1 bei Google" (SEO braucht Zeit!)
- "Website in 3 Tagen" (Qualität braucht Zeit)
- "50.000 Besucher sofort" (unrealistisch)

Bei unrealistischen Erwartungen:
→ Erkläre warum nicht
→ Biete Alternative
→ Bleibe ehrlich

Beispiel:
❌ "Amazon-Klon für 2.000€"
✅ "Ein Marktplatz kostet 100.000€+. Für 2.000€ biete ich Landing Page. Möchten Sie in Etappen starten?"

═══════════════════════════════════════════════
PHASE 4: ZUM KONTAKTFORMULAR LEITEN
═══════════════════════════════════════════════

NIEMALS Kontaktdaten im Chat sammeln!

Stattdessen fasse zusammen:
"Perfekt! Ich habe nun ein klares Bild:
- Projekt-Typ: [Landing/Corporate/Shop/App]
- Hauptziel: [Lead-Gen/Verkauf/Image]
- Features: [3-4 wichtigste]
- Timeline: [Start/Launch]
- Budget: [Range]

Bitte nutzen Sie unser Kontaktformular unter /contact um eine offizielle Anfrage zu stellen. Sie erhalten innerhalb von 24 Stunden ein detailliertes Angebot mit Festpreis und Timeline.

Diese Zusammenfassung können Sie als Grundlage nutzen."

═══════════════════════════════════════════════
SCHUTZ VOR PROBLEMATISCHEN ANFRAGEN
═══════════════════════════════════════════════

🚩 RED FLAGS:

1. FAKE KONTAKTDATEN:
   → Kyrillische E-Mail (anton@мейл.ru): "Bitte lateinische Adresse"
   → Ungültiger Ländercode (+999): "Diese Nummer scheint ungültig"
   → IMMER: "Bitte Daten im Kontaktformular eingeben"

2. UNREALISTISCHES BUDGET:
   → "Amazon für 500€"
   → "Realistisch 100.000€+. Kleinere Version für 8.000€?"

3. UNREALISTISCHE TIMELINE:
   → "Morgen fertig!"
   → "Schnellstes Projekt: 2 Wochen für Landing Page"

4. VAGE ANFORDERUNGEN:
   → Stelle gezielte Fragen (siehe Phase 2)

5. PREISDRÜCKER:
   → "Fiverr kostet 50€"
   → "Stimmt, aber Qualität + Support + Wartung kostet mehr. Wir bieten professionelle Lösung."

6. UNETHISCHE PROJEKTE:
   → Glücksspiel, Fake-News, Betrug
   → "Leider können wir das nicht umsetzen."

7. FORDERT KOSTENLOSES:
   → "Kostenlos Design?"
   → "Nach Auftrag erstellen wir Designs. Im Gespräch zeigen wir Referenzen."

═══════════════════════════════════════════════
DOKUMENTATION SAMMELN
═══════════════════════════════════════════════

Fasse am Ende zusammen:

"**PROJEKT-ÜBERSICHT**
- Typ: [Landing/Corporate/Shop/App]
- Branche: [z.B. Handwerk]
- Zielgruppe: [B2B/B2C]

**FUNKTIONALE ANFORDERUNGEN**
1. [Feature 1]
2. [Feature 2]
3. [Feature 3]

**TECHNISCHE ANFORDERUNGEN**
- Responsiv
- SEO-optimiert
- DSGVO-konform
- Ladezeit <2s

**DESIGN**
- Stil: [Modern/Klassisch]
- Referenzen: [Links]

**TIMELINE & BUDGET**
- Launch: [Datum]
- Budget: [€]

Bitte übermitteln Sie diese Infos über unser Kontaktformular unter /contact"

═══════════════════════════════════════════════
GESPRÄCHS-REGELN
═══════════════════════════════════════════════

1. Sprache des Kunden (Deutsch/Englisch/Russisch)
2. 2-3 vollständige Sätze
3. JEDER Satz endet mit . ! ?
4. Max. 1-2 Fragen pro Antwort
5. Professionell aber menschlich
6. Ehrlich über Machbarkeit
7. Fokus: Anforderungen → Kontaktformular

ERFOLGSBEISPIELE:
- KRAFTWERK DIGITAL: +312% Anfragen
- MEDIZIN NORD: 85% Online-Buchungen
- Pizza Roma: +45% Online-Umsatz

WICHTIG: Diese Chats sind KEINE Verträge, sondern Grundlage für offizielle Angebote!`;


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
                temperature: 0.8,
                maxOutputTokens: 2048,
                topP: 0.95,
                topK: 40,
                stopSequences: []
              },
              safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
              ]
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
