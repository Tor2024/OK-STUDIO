/**
 * Генератор OG изображений для статей и проектов
 * Создает красивые превью для социальных сетей
 * 
 * TODO: Требует установки canvas или sharp для генерации изображений
 * npm install canvas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Insight {
  id: string;
  title: string;
  date: string;
  tag: string;
  author: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
}

// Читаем данные
const insightsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
) as Insight[];

const projectsIndex = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
) as Project[];

/**
 * Генерирует HTML для OG изображения
 * Можно использовать с puppeteer для создания скриншота
 */
function generateOGImageHTML(type: 'insight' | 'project', data: Insight | Project): string {
  const isInsight = type === 'insight';
  const insight = isInsight ? data as Insight : null;
  const project = !isInsight ? data as Project : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1200px;
      height: 630px;
      background: #F1F3EA;
      font-family: 'Arial', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .container {
      width: 100%;
      height: 100%;
      padding: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 2;
    }
    .tag {
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 3px;
      color: #616752;
      text-transform: uppercase;
      font-family: monospace;
    }
    .title {
      font-size: 64px;
      font-weight: 900;
      line-height: 1.1;
      color: #141414;
      max-width: 900px;
      text-transform: uppercase;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .author {
      font-size: 20px;
      color: #616752;
      font-family: monospace;
    }
    .logo {
      font-size: 32px;
      font-weight: 900;
      color: #616752;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .pattern {
      position: absolute;
      top: 0;
      right: 0;
      width: 400px;
      height: 100%;
      background: linear-gradient(135deg, #616752 25%, transparent 25%),
                  linear-gradient(225deg, #616752 25%, transparent 25%),
                  linear-gradient(45deg, #616752 25%, transparent 25%),
                  linear-gradient(315deg, #616752 25%, transparent 25%);
      background-size: 40px 40px;
      background-position: 0 0, 20px 0, 20px -20px, 0px 20px;
      opacity: 0.05;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="pattern"></div>
  <div class="container">
    <div class="tag">${isInsight ? insight!.tag : project!.category}</div>
    <div class="title">${isInsight ? insight!.title : project!.title}</div>
    <div class="meta">
      <div class="author">${isInsight ? `${insight!.author} // ${insight!.date}` : 'CASE STUDY'}</div>
      <div class="logo">OK STUDIO</div>
    </div>
  </div>
</body>
</html>
  `;
}

// Создаем директорию для OG изображений
const ogDir = path.join(__dirname, 'public/og-images');
if (!fs.existsSync(ogDir)) {
  fs.mkdirSync(ogDir, { recursive: true });
}

// Генерируем HTML для каждой статьи
insightsIndex.forEach(insight => {
  const html = generateOGImageHTML('insight', insight);
  const filename = `${insight.id}.html`;
  fs.writeFileSync(path.join(ogDir, filename), html, 'utf-8');
});

// Генерируем HTML для каждого проекта
projectsIndex.forEach(project => {
  const html = generateOGImageHTML('project', project);
  const filename = `${project.id}.html`;
  fs.writeFileSync(path.join(ogDir, filename), html, 'utf-8');
});

console.log('✅ OG Image HTML сгенерированы!');
console.log(`📊 Создано файлов: ${insightsIndex.length + projectsIndex.length}`);
console.log(`📁 Директория: ${ogDir}`);
console.log('');
console.log('ℹ️  Для генерации PNG изображений используйте:');
console.log('   - Puppeteer (автоматически)');
console.log('   - Или откройте HTML в браузере и сделайте скриншот');
console.log('');
console.log('💡 Пример с Puppeteer:');
console.log('   npx tsx generate-og-images-puppeteer.ts');
