/**
 * Генератор PNG изображений для OG tags с использованием Puppeteer
 * Автоматически создает красивые превью для социальных сетей
 * 
 * Установка: npm install puppeteer
 * Запуск: npx tsx generate-og-images-puppeteer.ts
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

async function generateOGImages() {
  console.log('🚀 Starte OG Image Generierung...\n');

  // Dynamischer Import von puppeteer
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (err) {
    console.error('❌ Puppeteer nicht installiert!');
    console.log('📦 Installiere mit: npm install puppeteer');
    process.exit(1);
  }

  // Lese Daten
  const insightsIndex = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
  ) as Insight[];

  const projectsIndex = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
  ) as Project[];

  // Erstelle Verzeichnisse
  const ogDir = path.join(__dirname, 'public/og-images');
  if (!fs.existsSync(ogDir)) {
    fs.mkdirSync(ogDir, { recursive: true });
  }

  // Starte Browser
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });

  let count = 0;

  // Generiere für Insights
  for (const insight of insightsIndex) {
    const html = generateHTML('insight', insight);
    await page.setContent(html);
    await page.screenshot({
      path: path.join(ogDir, `${insight.id}.png`),
      type: 'png'
    });
    count++;
    console.log(`✅ ${count}. ${insight.title}`);
  }

  // Generiere für Projects
  for (const project of projectsIndex) {
    const html = generateHTML('project', project);
    await page.setContent(html);
    await page.screenshot({
      path: path.join(ogDir, `${project.id}.png`),
      type: 'png'
    });
    count++;
    console.log(`✅ ${count}. ${project.title}`);
  }

  await browser.close();

  console.log(`\n🎉 Fertig! ${count} OG Images generiert.`);
  console.log(`📁 Verzeichnis: ${ogDir}`);
}

function generateHTML(type: 'insight' | 'project', data: Insight | Project): string {
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
      word-wrap: break-word;
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

// Führe aus
generateOGImages().catch(console.error);
