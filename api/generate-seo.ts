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
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

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
    // Shuffle keys to distribute load
    apiKeys.sort(() => Math.random() - 0.5);

    const prompt = `Du bist ein erstklassiger SEO-Experte. 
Analysiere den folgenden Text und generiere perfekte SEO-Metadaten auf Deutsch.
Regeln:
1. "keywords": 2-4 hochrelevante Suchbegriffe, komma-getrennt.
2. "seoTitle": max. 60 Zeichen. MUSS das wichtigste Keyword enthalten.
3. "seoDescription": max. 160 Zeichen. Spannend formuliert, weckt Klick-Interesse (CTR-optimiert).

Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt. Keine Markdown-Blöcke, nur reines JSON.

Text zur Analyse:
${content.substring(0, 4000)}`;

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    });

    let lastError: string = '';

    // Try each model with each key until we get a successful response
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
            console.warn(`[SEO] ${lastError}`);
            continue;
          }

          const data = await response.json();
          
          if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            lastError = `Model=${model}: Empty response from API`;
            console.warn(`[SEO] ${lastError}`);
            continue;
          }

          let text = data.candidates[0].content.parts[0].text;
          text = text.replace(/```json/g, '').replace(/```/g, '').trim();

          const parsed = JSON.parse(text);
          
          console.log(`[SEO] Success with model=${model}`);
          return res.status(200).json(parsed);

        } catch (err: any) {
          lastError = `Model=${model}: ${err.message}`;
          console.warn(`[SEO] ${lastError}`);
          continue;
        }
      }
    }

    // All models and keys failed
    return res.status(500).json({ 
      error: 'Alle Modelle und API-Keys haben fehlgeschlagen', 
      details: lastError 
    });

  } catch (error: any) {
    console.error('SEO Generation Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
