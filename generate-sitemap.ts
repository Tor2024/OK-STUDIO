/**
 * Генератор sitemap.xml на основе данных проектов и статей
 * Запуск: npx tsx generate-sitemap.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://webstudio-ok.de';

interface Project {
  id: string;
  completedAt?: string;
}

interface Insight {
  id: string;
  date: string;
}

// Читаем данные
const projectsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
) as Project[];

const insightsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
) as Insight[];

// Конвертируем дату в ISO формат
function parseDate(dateStr: string): string {
  const months: Record<string, string> = {
    'Jan': '01', 'Feb': '02', 'Mrz': '03', 'Apr': '04', 'Mai': '05', 'Jun': '06',
    'Jul': '07', 'Aug': '08', 'Sep': '09', 'Okt': '10', 'Nov': '11', 'Dez': '12',
    'JAN': '01', 'FEB': '02', 'MRZ': '03', 'APR': '04', 'MAI': '05', 'JUN': '06',
    'JUL': '07', 'AUG': '08', 'SEP': '09', 'OKT': '10', 'NOV': '11', 'DEZ': '12'
  };
  
  // Формат: "MRZ 2025" или "Mai 2025"
  const match = dateStr.match(/(\w+)\s+(\d{4})/);
  if (match) {
    const month = months[match[1]] || '01';
    const year = match[2];
    return `${year}-${month}-01`;
  }
  
  // Если уже в формате YYYY-MM-DD
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  return new Date().toISOString().split('T')[0];
}

// Генерируем XML
const urls: string[] = [];

// Статические страницы
urls.push(`  <url>
    <loc>${DOMAIN}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/work</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/insights</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/capabilities</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/approach</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/contact</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);

// Проекты (детальные страницы)
projectsIndex.forEach(project => {
  const lastmod = project.completedAt ? parseDate(project.completedAt) : new Date().toISOString().split('T')[0];
  urls.push(`  <url>
    <loc>${DOMAIN}/work/${project.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
});

// Статьи (детальные страницы)
insightsIndex.forEach(insight => {
  const lastmod = parseDate(insight.date);
  urls.push(`  <url>
    <loc>${DOMAIN}/insights/${insight.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
});

// Юридические страницы
urls.push(`  <url>
    <loc>${DOMAIN}/impressum</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`);

urls.push(`  <url>
    <loc>${DOMAIN}/privacy</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`);

// Формируем финальный XML
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

// Сохраняем
fs.writeFileSync(path.join(__dirname, 'public/sitemap.xml'), sitemap, 'utf-8');

console.log('✅ Sitemap сгенерирован!');
console.log(`📊 Всего URL: ${urls.length}`);
console.log(`   - Проекты: ${projectsIndex.length}`);
console.log(`   - Статьи: ${insightsIndex.length}`);
console.log(`   - Статические: ${urls.length - projectsIndex.length - insightsIndex.length}`);
