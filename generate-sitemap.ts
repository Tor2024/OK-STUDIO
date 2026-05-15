/**
 * Генератор sitemap.xml на основе данных проектов и статей
 * Запуск: npx tsx generate-sitemap.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = process.env.SITE_URL || 'https://ok-studio-umber.vercel.app';

interface Project { id: string; completedAt?: string; published?: boolean; }
interface Insight { id: string; date: string; published?: boolean; }
interface Landing { id: string; published?: boolean; }

// Читаем данные
const projectsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
) as Project[];

const insightsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
) as Insight[];

const landingsIndex = fs.existsSync(path.join(__dirname, 'public/data/landings.json')) 
  ? JSON.parse(fs.readFileSync(path.join(__dirname, 'public/data/landings.json'), 'utf-8')) as Landing[]
  : [];

// Конвертируем дату в ISO формат
function parseDate(dateStr: string): string {
  const months: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mrz': '03', 'Apr': '04', 'Mai': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Dez': '12',
    'JAN': '01', 'FEB': '02', 'MRZ': '03', 'APR': '04', 'MAI': '05', 'JUN': '06',
    'JUL': '07', 'AUG': '08', 'SEP': '09', 'OKT': '10', 'NOV': '11', 'DEZ': '12'
  };
  
  const match = dateStr.match(/(\w+)\s+(\d{4})/);
  if (match) {
    const month = months[match[1]] || '01';
    const year = match[2];
    return `${year}-${month}-01`;
  }
  
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
  return new Date().toISOString().split('T')[0];
}

// Генерируем XML
const urls: string[] = [];
const now = new Date().toISOString().split('T')[0];

// Статические страницы
[
  { path: '', prio: '1.0', freq: 'weekly' },
  { path: '/work', prio: '0.9', freq: 'weekly' },
  { path: '/insights', prio: '0.8', freq: 'weekly' },
  { path: '/capabilities', prio: '0.8', freq: 'monthly' },
  { path: '/approach', prio: '0.7', freq: 'monthly' },
  { path: '/contact', prio: '0.9', freq: 'monthly' },
].forEach(p => {
  urls.push(`  <url>
    <loc>${DOMAIN}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.prio}</priority>
  </url>`);
});

// Проекты
projectsIndex.filter(p => p.published !== false).forEach(project => {
  const lastmod = project.completedAt ? parseDate(project.completedAt) : now;
  urls.push(`  <url>
    <loc>${DOMAIN}/work/${project.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// Статьи
insightsIndex.filter(i => i.published !== false).forEach(insight => {
  const lastmod = parseDate(insight.date);
  urls.push(`  <url>
    <loc>${DOMAIN}/insights/${insight.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

// Landings
landingsIndex.filter(l => l.published !== false).forEach(l => {
  urls.push(`  <url>
    <loc>${DOMAIN}/local/${l.id}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);
});

// Юридические
['/impressum', '/privacy'].forEach(p => {
  urls.push(`  <url>
    <loc>${DOMAIN}${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`);
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), sitemap, 'utf-8');
console.log('✅ Sitemap сгенерирован!');
console.log(`📊 Всего URL: ${urls.length} (Landings: ${landingsIndex.length})`);
