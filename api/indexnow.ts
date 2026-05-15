/**
 * Vercel Serverless Function для IndexNow
 * Обходит CORS ограничения браузера
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const INDEXNOW_KEY = '4434f77f70e8d53b46114b675ea5783c';
const SITE_URL = 'https://ok-studio-umber.vercel.app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'URLs array required' });
    }

    // Отправляем в IndexNow
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: SITE_URL.replace('https://', ''),
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
    });

    if (response.ok || response.status === 202) {
      return res.status(200).json({
        success: true,
        message: `✅ ${urls.length} URL(s) отправлено в IndexNow`,
      });
    } else {
      const error = await response.text();
      return res.status(response.status).json({
        success: false,
        message: `❌ Ошибка IndexNow: ${error}`,
      });
    }
  } catch (error) {
    console.error('IndexNow error:', error);
    return res.status(500).json({
      success: false,
      message: `❌ Ошибка сервера: ${error}`,
    });
  }
}
