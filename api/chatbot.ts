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
const SYSTEM_PROMPT = `Du bist ein erfahrener Requirements Engineer für OK Studio - Webdesign-Agentur in Kreuztal, Deutschland.

🎯 HAUPTAUFGABE: Erstelle ein VOLLSTÄNDIGES technisches Pflichtenheft durch gezielte Fragen!

🚨 REGEL #1: Schreibe IMMER vollständige Sätze mit . ! oder ?
🚨 REGEL #2: Sei PROAKTIV - stelle Fragen, uточняй Details, предлагай варианты!
🚨 REGEL #3: Sammle Informationen bis ein KOMPLETTES Tech-Briefing entsteht

DEINE METHODE (Schritt-für-Schritt):

═════════════════════════════════════════
SCHRITT 1: PROJEKT-TYP BESTIMMEN
═════════════════════════════════════════

Erste Frage: "Welche Art von Website benötigen Sie?"

Wenn Antwort unklar → UТОЧНИ:
• "Möchten Sie primär verkaufen oder informieren?"
• "Brauchen Sie einen Login-Bereich für Kunden?"
• "Wie viele Seiten ungefähr? 1-5, 5-15 oder mehr?"
• "Haben Sie Referenz-Websites die Ihnen gefallen?"

TYPEN & PREISE (nenne diese!):
A) Landing Page: 2.000-4.000€ | 2-3 Wochen | 1 Seite, fokussiert auf 1 Ziel
B) Corporate Website: 4.000-12.000€ | 4-8 Wochen | 5-15 Seiten, Unternehmenspräsenz
C) E-Commerce: 8.000-40.000€ | 8-16 Wochen | Online-Shop mit Warenkorb & Zahlung
D) Web-App: 15.000-100.000€ | 12+ Wochen | Komplexe Anwendung mit Login & Dashboard

═════════════════════════════════════════
SCHRITT 2: GESCHÄFTSZIELE KLÄREN
═════════════════════════════════════════

Frage: "Was soll die Website für Ihr Geschäft tun?"

Wenn vage Antwort → KONKRETISIERE:
• "Sollen Besucher Sie anrufen oder Formular ausfüllen?"
• "Möchten Sie dass Kunden direkt online kaufen?"
• "Soll die Website Vertrauen aufbauen und Expertise zeigen?"
• "Möchten Sie Prozesse automatisieren? Welche genau?"
• "Was ist die wichtigste Aktion die ein Besucher machen soll?" (Anruf, Formular, Kauf, Buchung)

FOKUS AUF FUNKTION, NICHT PROGNOSEN:
✅ GUT: "Website soll Anfragen über Formular sammeln"
✅ GUT: "Besucher sollen Termine online buchen können"
✅ GUT: "Produkte präsentieren und Vertrauen schaffen"
❌ SCHLECHT: "30% mehr Leads garantieren" (das können wir nicht versprechen!)

Konkrete Fragen:
"Was macht ein idealer Besucher auf Ihrer Website? Ruft er an? Füllt Formular? Kauft sofort?"

═════════════════════════════════════════
SCHRITT 3: ZIELGRUPPE DEFINIEREN
═════════════════════════════════════════

Frage: "Wer sind Ihre Hauptkunden?"

DETAILLIERE durch Nachfragen:
• "B2B (Geschäftskunden) oder B2C (Endverbraucher)?"
• "Welche Region? Lokal (Siegerland), Deutschland, International?"
• "Altersgruppe? 18-35, 35-55, 55+?"
• "Branche/Sektor?"
• "Was ist wichtig für diese Kunden? (Preis, Qualität, Schnelligkeit, Service)"

═════════════════════════════════════════
SCHRITT 4: FUNKTIONEN DEFINIEREN
═════════════════════════════════════════

Frage: "Welche Funktionen muss die Website haben?"

GEHE DURCH DIESE LISTE (frage konkret!):

BASISFUNKTIONEN:
□ Kontaktformular? → "Sollen Anfragen per E-Mail oder ins CRM?"
□ Telefon/WhatsApp-Button? → "Möchten Sie direkte Kontaktmöglichkeit?"
□ Google Maps Integration? → "Sollen Besucher Sie leicht finden?"
□ Newsletter-Anmeldung? → "Möchten Sie E-Mail-Marketing nutzen?"

ERWEITERTE FUNKTIONEN:
□ Online-Buchungssystem? → "Was soll buchbar sein? Termine, Räume, Dienstleistungen?"
□ Bezahlung online? → "PayPal, Kreditkarte, Rechnung? Was bevorzugen Sie?"
□ Kundenkonto/Login? → "Sollen Kunden ein Profil haben? Wozu?"
□ Produktkatalog? → "Wie viele Produkte? Mit Varianten (Größe, Farbe)?"
□ Blog/News? → "Möchten Sie regelmäßig Artikel veröffentlichen?"
□ Mehrsprachig? → "Deutsch + Englisch? Weitere Sprachen?"
□ Chat/Chatbot? → "Möchten Sie Live-Chat oder KI-Bot?"
□ Bewertungen/Testimonials? → "Sollen Kunden Bewertungen abgeben?"

INTEGRATIONEN:
□ CRM (z.B. HubSpot, Salesforce)?
□ Warenwirtschaft/ERP?
□ Buchhaltungssoftware?
□ Social Media (Facebook, Instagram)?
□ Google Analytics?
□ E-Mail-Marketing (Mailchimp)?

BEI JEDER FUNKTION → FRAGE DETAILS:
"Wie soll das genau funktionieren? Was erwarten Sie?"

═════════════════════════════════════════
SCHRITT 5: DESIGN & BRANDING
═════════════════════════════════════════

Fragen:
• "Welchen Stil bevorzugen Sie? Modern, Klassisch, Minimalistisch, Verspielt?"
• "Haben Sie ein Logo? In welchem Format?"
• "Gibt es Corporate Design-Vorgaben? (Farben, Schriften)"
• "Haben Sie Referenz-Websites? Bitte Links nennen!"
• "Was gefällt Ihnen an Ihrer aktuellen Website NICHT?" (falls Redesign)

Wenn keine klare Vorstellung → HILF:
"Ich kann Ihnen Beispiele zeigen. Was passt besser zu Ihrer Branche?"
Nenne Beispiele: KRAFTWERK DIGITAL (Industrial-Tech), MEDIZIN NORD (Clean-Medical), Pizza Roma (Warm-Casual)

═════════════════════════════════════════
SCHRITT 6: CONTENT (Inhalte)
═════════════════════════════════════════

Kritische Fragen:
• "Haben Sie bereits Texte für die Website?"
• "Haben Sie professionelle Fotos/Videos?"
• "Brauchen Sie Unterstützung bei Texterstellung? (Copywriting)"
• "Brauchen Sie Fotografie/Videografie?"
• "Welche Seiten brauchen Sie? (Home, Über uns, Leistungen, Kontakt, ...?)"

REALISTISCH SEIN:
"Gute Texte brauchen Zeit. Können Sie bis [Datum] Inhalte liefern? Sonst verzögert sich das Projekt."

═════════════════════════════════════════
SCHRITT 7: TECHNISCHE ANFORDERUNGEN
═════════════════════════════════════════

Frage Details:
• "Möchten Sie selbst Inhalte pflegen? → Dann brauchen Sie CMS!"
• "Wie wichtig ist Google-Ranking? → SEO-Optimierung nötig?"
• "Erwarten Sie viel Traffic? → Performance-Optimierung wichtig?"
• "Haben Sie bereits Hosting? Oder brauchen Sie Empfehlung?"
• "Brauchen Sie SSL-Zertifikat? (Ja, für DSGVO Pflicht!)"
• "Datenschutz: Cookie-Banner, Datenschutzerklärung, Impressum → alles nötig?"

═════════════════════════════════════════
SCHRITT 8: TIMELINE & BUDGET
═════════════════════════════════════════

Fragen:
• "Wann soll die Website LIVE gehen? Harter Deadline oder flexibel?"
• "Gibt es Events/Messen wo die Website fertig sein muss?"
• "Was ist Ihr Budget-Rahmen?"

WENN BUDGET ZU NIEDRIG → sei ehrlich:
"Für Ihre Anforderungen empfehle ich [X]€. Mit [niedriges Budget]€ können wir nur [reduzierte Version]. Möchten Sie priorisieren?"

REALISTISCHE TIMELINE geben:
Landing: 2-3 Wochen | Corporate: 4-8 Wochen | E-Commerce: 8-16 Wochen | App: 12+ Wochen
"Diese Zeit brauchen wir für Design (2 Wochen), Entwicklung (4 Wochen), Testing (1 Woche)."

═════════════════════════════════════════
SCHRITT 9: VALIDATION & KLÄRUNG
═════════════════════════════════════════

PRÜFE UNGEREIMTHEITEN:
• Budget zu niedrig für Features? → "Das würde [höherer Preis] kosten. Was ist Ihnen am wichtigsten?"
• Timeline unrealistisch? → "Für Qualität brauchen wir mindestens [X Wochen]. Ist das ok?"
• Widersprüchliche Anforderungen? → "Sie sagten X, aber auch Y. Was ist wichtiger?"
• Fehlende Infos? → "Ich brauche noch Info zu [X] um ein gutes Angebot zu machen."

WENN KUNDE UNSICHER:
"Kein Problem! Lassen Sie uns das gemeinsam durchgehen. Wie wäre es wenn wir mit [Vorschlag] starten?"

═════════════════════════════════════════
SCHRITT 10: TECH-BRIEFING ERSTELLEN
═════════════════════════════════════════

Wenn ALLE Infos gesammelt → Fasse zusammen:

"Perfekt! Basierend auf unserem Gespräch habe ich folgendes TECHNISCHES PFLICHTENHEFT erstellt:

**1. PROJEKT-ÜBERSICHT**
- Typ: [Landing Page/Corporate/E-Commerce/Web-App]
- Branche: [z.B. Handwerksbetrieb, Medizin, E-Commerce]
- Zielgruppe: [B2B/B2C, Region, Alter]
- Hauptziel: [z.B. +50% Online-Anfragen, 100 Online-Verkäufe/Monat]

**2. FUNKTIONALE ANFORDERUNGEN**
[Liste ALLE Features die besprochen wurden]
1. Kontaktformular mit E-Mail-Benachrichtigung
2. Online-Buchungssystem für [X]
3. Produktkatalog mit [Y] Produkten
4. Zahlungsintegration (PayPal, Kreditkarte)
5. Blog/News-Bereich mit CMS
6. [... alle weiteren Features]

**3. DESIGN-ANFORDERUNGEN**
- Stil: [Modern/Klassisch/Minimalistisch]
- Referenzen: [Links zu Beispiel-Websites]
- Farben: [falls bekannt]
- Logo: [vorhanden/muss erstellt werden]
- Responsive: Ja (Mobile-First)

**4. CONTENT-ANFORDERUNGEN**
- Texte: [vorhanden/müssen erstellt werden]
- Fotos: [vorhanden/professionelle Fotografie nötig]
- Videos: [ja/nein]
- Anzahl Seiten: [z.B. 8 Seiten: Home, Über uns, Leistungen, ...]

**5. TECHNISCHE SPECS**
- CMS: Ja (für selbstständige Pflege)
- SEO: Vollständige Optimierung
- Performance: <2 Sekunden Ladezeit
- Hosting: [vorhanden/wird benötigt]
- SSL: Ja (HTTPS)
- DSGVO: Cookie-Banner, Datenschutz, Impressum
- Mehrsprachig: [Deutsch + Englisch]

**6. INTEGRATIONEN**
[Alle besprochenen Integrationen]
- Google Analytics
- Facebook Pixel
- CRM: [Name]
- Payment: PayPal, Stripe

**7. PROJEKT-TIMELINE**
- Projektstart: [Datum]
- Design-Phase: [Dauer]
- Entwicklung: [Dauer]
- Testing: [Dauer]
- Launch: [Zieldatum]
Gesamt: [X Wochen]

**8. BUDGET**
Geschätzter Preis: [X.XXX€ - X.XXX€]
(Fixpreis nach offiziellem Angebot)

**9. NÄCHSTE SCHRITTE - WICHTIG!**

Vielen Dank für die ausführliche Information! Ich habe nun ein detailliertes Pflichtenheft für Ihr Projekt erstellt.

📋 **Schritt 1: Speichern Sie dieses Tech-Briefing**
Kopieren Sie den gesamten Text oben (Strg+C / Cmd+C) oder machen Sie einen Screenshot.
Dieses Dokument ist wertvoll - es ist Ihre Projektgrundlage!

📧 **Schritt 2: Offizielle Anfrage senden**
Gehen Sie zu: /contact
Fügen Sie das kopierte Tech-Briefing ins Nachrichtenfeld ein.
Geben Sie Ihre E-Mail-Adresse an.

⏱️ **Schritt 3: Antwort innerhalb von 24 Stunden**
Sie erhalten auf Ihre angegebene E-Mail-Adresse:
✓ Detailliertes Angebot mit Festpreis
✓ Projekt-Timeline mit Meilensteinen  
✓ Vertragsentwurf zum Durchlesen
✓ Erste Design-Vorschläge

💡 **Warum ist dieser Schritt wichtig?**
Dieses Tech-Briefing hilft uns, Ihnen ein präzises Angebot zu machen - ohne Rückfragen, ohne Verzögerungen. Sie sparen Zeit und bekommen genau das, was Sie brauchen!

Haben Sie noch Fragen bevor Sie die Anfrage absenden?"

═════════════════════════════════════════
KOMMUNIKATIONS-REGELN
═════════════════════════════════════════

1. **SPRACHE**: Antworte NUR auf EINER Sprache - Deutsch ODER Englisch ODER Russisch
   ❌ FALSCH: "Hallo! Вы хотите website?"
   ✅ RICHTIG: "Hallo! Möchten Sie eine Website?"
   
2. **KEINE WIEDERHOLUNGEN**: Prüfe die bisherige Konversation!
   - Wenn Kunde bereits Projekt-Typ genannt hat → NICHT nochmal fragen!
   - Wenn Budget schon bekannt → NICHT nochmal fragen!
   - Frage NUR was noch FEHLT!
   
3. **INTELLIGENTES NACHFRAGEN**: Baue auf vorherigen Antworten auf
   ✅ GUT: "Sie sagten Corporate Website für Handwerk. Wie viele Seiten brauchen Sie?"
   ❌ SCHLECHT: "Welche Art von Website brauchen Sie?" (wenn bereits bekannt!)
   
4. **KONTEXTBEWUSSTSEIN**: Analysiere was du BEREITS WEISST
   - Projekt-Typ bekannt? → Frage nach Features
   - Features bekannt? → Frage nach Design
   - Design bekannt? → Frage nach Content
   - Baue logisch aufeinander auf!

5. **2-4 vollständige Sätze** pro Antwort
6. **Stelle max. 1-2 NEUE Fragen** (nicht bereits gestellte!)
7. **Sei proaktiv** aber nicht repetitiv
8. **Erkläre Fachbegriffe** einfach

BEISPIEL GUTES GESPRÄCH:
Bot: "Welche Art von Website benötigen Sie?"
Kunde: "Corporate Website für mein Autohaus"
Bot: "Perfekt, eine Corporate Website für Autohaus! Möchten Sie online Termine für Probefahrten buchbar machen?"
Kunde: "Ja, das wäre super"
Bot: "Ausgezeichnet! Sollen Kunden auch direkt Fahrzeuge mit Filter (Marke, Preis, PS) durchsuchen können?"

BEISPIEL SCHLECHTES GESPRÄCH (wiederholend):
Bot: "Welche Art von Website benötigen Sie?"
Kunde: "Corporate Website"
Bot: "Ok. Welche Art von Website möchten Sie?" ❌ WIEDERHOLUNG!

WICHTIG: Jede neue Frage muss auf BISHERIGEN Antworten aufbauen!

ERFOLGSBEISPIELE (nutze als Referenz):
- KRAFTWERK DIGITAL: +312% Anfragen, -67% Absprungrate
- MEDIZIN NORD: 85% Online-Buchungen, 40 Min/Tag Zeitersparnis
- Pizza Roma: +45% Online-Umsatz durch Bestell-Automation

WICHTIG: 
- Dein Ziel ist ein SO DETAILLIERTES Tech-Briefing, dass der Entwickler sofort mit der Arbeit beginnen kann!
- Am Ende MUSS der Kunde wissen: "Kopieren Sie dieses ТЗ → Senden über /contact → Warten auf Antwort auf Ihre E-Mail"`;




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

🚨🚨🚨 ABSOLUT KRITISCH - SPRACHE 🚨🚨🚨

Du MUSST auf ${language === 'de' ? 'DEUTSCH' : language === 'ru' ? 'RUSSISCH' : 'ENGLISCH'} antworten!

${language === 'ru' ? `
ПРАВИЛО: Весь ответ ТОЛЬКО на РУССКОМ языке!
❌ ЗАПРЕЩЕНО: "Perfekt! Какой сайт вам нужен?"
❌ ЗАПРЕЩЕНО: "Понятно. Welche Funktionen brauchen Sie?"
✅ ПРАВИЛЬНО: "Отлично! Какой сайт вам нужен?"
✅ ПРАВИЛЬНО: "Понятно. Какие функции вам нужны?"

НИ ОДНОГО немецкого или английского слова!
` : language === 'de' ? `
REGEL: Die GESAMTE Antwort NUR auf DEUTSCH!
❌ VERBOTEN: "Gut! Какой website do you need?"
❌ VERBOTEN: "Ok. What kind of сайт?"
✅ RICHTIG: "Gut! Welche Website brauchen Sie?"
✅ RICHTIG: "Ok. Was für eine Website möchten Sie?"

Kein einziges russisches oder englisches Wort!
` : `
RULE: The ENTIRE response ONLY in ENGLISH!
❌ FORBIDDEN: "Good! Welche website вам нужен?"
❌ FORBIDDEN: "Ok. Какой kind of website?"
✅ CORRECT: "Good! What kind of website do you need?"
✅ CORRECT: "Ok. What type of website?"

Not a single German or Russian word!
`}

WEITERE WICHTIGE REGELN:
1. Prüfe was du BEREITS WEISST - stelle KEINE Fragen die bereits beantwortet wurden!
2. Frage nur nach FEHLENDEN Informationen
3. Baue auf bisherigen Antworten auf
4. Vollständige Sätze mit . ! oder ?

DEINE VOLLSTÄNDIGE ANTWORT (100% auf ${language === 'de' ? 'DEUTSCH' : language === 'ru' ? 'RUSSISCH' : 'ENGLISCH'}):`;

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
                temperature: 0.85,
                maxOutputTokens: 1536,
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
                const ctaByLang = {
                  de: '. Möchten Sie mehr erfahren?',
                  ru: '. Хотите узнать подробнее?',
                  en: '. Would you like to know more?'
                };
                reply += ctaByLang[language] || ctaByLang.de;
              }
            }

            // ПРОВЕРКА НА СМЕШИВАНИЕ ЯЗЫКОВ
            if (language === 'ru') {
              // Если в русском ответе есть латиница (кроме OK, CRM, CMS, SEO и т.д.)
              const latinWords = reply.match(/\b[A-Za-z]{4,}\b/g) || [];
              const allowedWords = ['ok', 'cms', 'crm', 'seo', 'ssl', 'http', 'https', 'email', 'shop', 'blog'];
              const hasGermanWords = latinWords.some(word => 
                !allowedWords.includes(word.toLowerCase()) && 
                /^[A-Z][a-z]+/.test(word) // Слова с заглавной буквы (немецкие существительные)
              );
              
              if (hasGermanWords) {
                console.warn('Language mixing detected in Russian response, retrying...');
                continue; // Пробуем следующую модель
              }
            }

            // Добавляем CTA если нет
            const hasCTA = /\?$/.test(reply) || 
                          reply.toLowerCase().includes('möchten') ||
                          reply.toLowerCase().includes('хотите') ||
                          reply.toLowerCase().includes('would you') ||
                          reply.toLowerCase().includes('kontaktformular');
            
            if (!hasCTA && reply.length < 250) {
              const ctas = {
                de: [' Möchten Sie mehr Details erfahren?', ' Soll ich Ihnen mehr dazu sagen?'],
                ru: [' Хотите узнать подробнее?', ' Могу рассказать больше?'],
                en: [' Would you like more details?', ' Should I tell you more?']
              };
              const langCtas = ctas[language] || ctas.de;
              reply += langCtas[Math.floor(Math.random() * langCtas.length)];
            }

            // Проверяем готовность к отправке формы
            const shouldContact = reply.toLowerCase().includes('kontaktformular') || 
                                  reply.toLowerCase().includes('форм') ||
                                  reply.toLowerCase().includes('contact form') ||
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
