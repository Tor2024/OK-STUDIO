/**
 * Генератор robots.txt
 * Запуск: npx tsx generate-robots.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.SITE_URL || 'https://ok-studio-umber.vercel.app';

const content = `# Web Studio OK - Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${DOMAIN}/sitemap.xml

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
`;

fs.writeFileSync(path.join(__dirname, 'public/robots.txt'), content, 'utf-8');
console.log('✅ robots.txt сгенерирован!');
