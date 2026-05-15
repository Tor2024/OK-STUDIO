import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
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

    const apiKeysString = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKeysString) {
      return res.status(500).json({ error: 'API Key not configured on Vercel' });
    }

    const apiKeys = apiKeysString.split(',').map((k: string) => k.trim()).filter(Boolean);
    const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

    const prompt = `Du bist ein erstklassiger SEO-Experte. 
Analysiere den folgenden Text und generiere perfekte SEO-Metadaten auf Deutsch.
Regeln:
1. "keywords": 2-4 hochrelevante Suchbegriffe, komma-getrennt.
2. "seoTitle": max. 60 Zeichen. MUSS das wichtigste Keyword enthalten.
3. "seoDescription": max. 160 Zeichen. Spannend formuliert, weckt Klick-Interesse (CTR-optimiert).

Antworte AUSSCHLIESSLICH mit einem gültigen JSON-Objekt. Keine Markdown-Blöcke, nur reines JSON.

Text zur Analyse:
${content.substring(0, 4000)}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${randomApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Google API Error', details: errorText });
    }

    const data = await response.json();
    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return res.status(200).json(JSON.parse(text));

  } catch (error: any) {
    console.error('SEO Generation Error:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
