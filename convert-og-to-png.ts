/**
 * Конвертирует сгенерированные SVG OG-изображения в PNG
 * Запуск: npx tsx convert-og-to-png.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OG_DIR = path.join(__dirname, 'public/og');

async function convertDirectory(dir: string) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);
  const svgFiles = files.filter(f => f.endsWith('.svg'));

  for (const file of svgFiles) {
    const svgPath = path.join(dir, file);
    const pngPath = path.join(dir, file.replace('.svg', '.png'));

    try {
      await sharp(svgPath)
        .png()
        .toFile(pngPath);
      console.log(`✅ Converted: ${file} -> ${path.basename(pngPath)}`);
    } catch (err) {
      console.error(`❌ Failed to convert ${file}:`, err);
    }
  }
}

async function run() {
  console.log('🚀 Starting OG Image conversion (SVG -> PNG)...');
  await convertDirectory(path.join(OG_DIR, 'projects'));
  await convertDirectory(path.join(OG_DIR, 'insights'));
  console.log('✨ Conversion complete!');
}

run().catch(console.error);
