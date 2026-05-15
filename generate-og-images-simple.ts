/**
 * Генератор Open Graph изображений для проектов и статей
 * Создает простые OG изображения с текстом
 * Запуск: npx tsx generate-og-images-simple.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Project {
  id: string;
  title: string;
  category?: string;
}

interface Insight {
  id: string;
  title: string;
  tag?: string;
}

// Читаем данные
const projectsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
) as Project[];

const insightsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
) as Insight[];

// Создаем папки для OG изображений
const ogDir = path.join(__dirname, 'public/og');
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true });
}

const projectsOgDir = path.join(ogDir, 'projects');
if (!fs.existsSync(projectsOgDir)) {
  fs.mkdirSync(projectsOgDir, { recursive: true });
}

const insightsOgDir = path.join(ogDir, 'insights');
if (!fs.existsSync(insightsOgDir)) {
  fs.mkdirSync(insightsOgDir, { recursive: true });
}

// Экранирование спецсимволов для XML
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&"']/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return c;
    }
  });
}

// Генерируем SVG изображения
function generateOgSvg(title: string, subtitle: string, color: string): string {
  const safeTitle = escapeXml(title);
  const safeSubtitle = escapeXml(subtitle.toUpperCase());
  
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Фон -->
  <rect width="1200" height="630" fill="#F1F3EA"/>
  
  <!-- Рамка -->
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="#141414" stroke-width="4"/>
  
  <!-- Цветной акцент -->
  <rect x="60" y="60" width="8" height="510" fill="${color}"/>
  
  <!-- Логотип -->
  <text x="100" y="120" font-family="Arial, sans-serif" font-size="32" font-weight="900" fill="#141414">OK STUDIO</text>
  
  <!-- Категория/Тег -->
  <text x="100" y="180" font-family="monospace" font-size="14" fill="#616752" letter-spacing="2">${safeSubtitle}</text>
  
  <!-- Заголовок -->
  <text x="100" y="250" font-family="Arial, sans-serif" font-size="48" font-weight="700" fill="#141414">
    <tspan x="100" dy="0">${safeTitle.substring(0, 40)}</tspan>
    ${safeTitle.length > 40 ? `<tspan x="100" dy="60">${safeTitle.substring(40, 80)}</tspan>` : ''}
    ${safeTitle.length > 80 ? `<tspan x="100" dy="60">${safeTitle.substring(80, 120)}...</tspan>` : ''}
  </text>
  
  <!-- Футер -->
  <text x="100" y="560" font-family="monospace" font-size="12" fill="#737373">webstudio-ok.de</text>
</svg>`;
}

// Генерируем OG изображения для проектов
console.log('🎨 Генерация OG изображений для проектов...');
projectsIndex.forEach(project => {
  const svg = generateOgSvg(
    project.title,
    project.category || 'PROJECT',
    '#616752'
  );
  
  fs.writeFileSync(
    path.join(projectsOgDir, `${project.id}.svg`),
    svg,
    'utf-8'
  );
});

// Генерируем OG изображения для статей
console.log('🎨 Генерация OG изображений для статей...');
insightsIndex.forEach(insight => {
  const svg = generateOgSvg(
    insight.title,
    insight.tag || 'INSIGHT',
    '#616752'
  );
  
  fs.writeFileSync(
    path.join(insightsOgDir, `${insight.id}.svg`),
    svg,
    'utf-8'
  );
});

console.log('✅ OG изображения сгенерированы!');
console.log(`   - Проекты: ${projectsIndex.length} SVG файлов`);
console.log(`   - Статьи: ${insightsIndex.length} SVG файлов`);
console.log(`   - Папка: public/og/`);
console.log('');
console.log('💡 Для конвертации в PNG используйте:');
console.log('   npm install --save-dev sharp');
console.log('   или онлайн: https://cloudconvert.com/svg-to-png');
