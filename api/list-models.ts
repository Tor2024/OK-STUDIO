import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const apiKeysString = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKeysString) {
      return res.status(500).json({ error: 'No API keys configured' });
    }

    const apiKeys = apiKeysString.split(',').map((k: string) => k.trim()).filter(Boolean);
    const key = apiKeys[0]; // Use just the first key to check

    // List all available models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Failed to list models', details: errorText });
    }

    const data = await response.json();
    
    // Filter to only show models that support generateContent
    const generateModels = (data.models || [])
      .filter((m: any) => m.supportedGenerationMethods?.includes('generateContent'))
      .map((m: any) => ({
        name: m.name,
        displayName: m.displayName,
        methods: m.supportedGenerationMethods
      }));

    return res.status(200).json({
      totalModels: data.models?.length || 0,
      generateContentModels: generateModels,
      keyUsed: key.substring(0, 8) + '...' // Show just the start for verification
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
