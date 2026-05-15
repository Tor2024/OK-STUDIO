import type { VercelRequest, VercelResponse } from '@vercel/node';

const MODELS_TO_TRY = [
  'gemini-2.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
  'gemini-2.0-flash',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const apiKeysString = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKeysString) {
      return res.status(500).json({ error: 'API Key not configured on Vercel' });
    }

    const apiKeys = apiKeysString.split(',').map((k: string) => k.trim()).filter(Boolean);
    apiKeys.sort(() => Math.random() - 0.5);

    const prompt = `Du bist ein erfahrener Redakteur und Markdown-Experte.
Formatiere den folgenden Text professionell mit Markdown-Syntax.

Regeln:
1. Verwende H2 (##) für Hauptüberschriften.
2. Verwende H3 (###) für Unterüberschriften.
3. Hebe wichtige Begriffe **fett** hervor.
4. Erstelle Listen (- Punkt) für Aufzählungen, wo es sinnvoll ist.
5. Der Text soll lesefreundlich und gut strukturiert sein.
6. Entferne unnötige Leerzeichen oder Zeilenumbrüche.
7. Ändere NICHT den Sinn des Textes, optimiere nur die Formatierung und Struktur.

Antworte NUR mit dem formatierten Markdown-Text. Keine Erklärungen, kein "Hier ist der Text".

Text zum Formatieren:
---
${content}
---`;

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1 } // Low temperature for consistent formatting
    });

    let lastError: string = '';

    for (const model of MODELS_TO_TRY) {
      for (const key of apiKeys) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
          });

          if (!response.ok) {
            const errText = await response.text();
            lastError = `Model=${model}, Status=${response.status}: ${errText.substring(0, 200)}`;
            continue;
          }

          const data = await response.json();
          
          if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            lastError = `Model=${model}: Empty response from API`;
            continue;
          }

          let text = data.candidates[0].content.parts[0].text;
          // Clean up any markdown blocks the AI might have added
          text = text.replace(/^```markdown\n/i, '').replace(/^```\n/i, '').replace(/\n```$/g, '').trim();

          return res.status(200).json({ formatted: text });

        } catch (err: any) {
          lastError = `Model=${model}: ${err.message}`;
          continue;
        }
      }
    }

    return res.status(500).json({ 
      error: 'Alle Modelle und API-Keys haben fehlgeschlagen', 
      details: lastError 
    });

  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
