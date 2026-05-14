/**
 * Automatische Bildoptimierung
 * Konvertiert Bilder zu WebP, erstellt responsive Größen, komprimiert
 * 
 * Installiere: npm install sharp
 * Nutze: npx tsx optimize-images.ts <pfad-zum-bild>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface OptimizationResult {
  original: { path: string; size: number };
  optimized: Array<{ path: string; size: number; width: number }>;
  savings: number;
  savingsPercent: number;
}

/**
 * Optimiert ein Bild: WebP Konvertierung + responsive Größen
 */
async function optimizeImage(inputPath: string): Promise<OptimizationResult> {
  console.log(`🖼️  Optimiere: ${inputPath}\n`);

  // Dynamischer Import von sharp
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    console.error('❌ Sharp nicht installiert!');
    console.log('📦 Installiere mit: npm install sharp');
    process.exit(1);
  }

  const originalSize = fs.statSync(inputPath).size;
  const ext = path.extname(inputPath);
  const basename = path.basename(inputPath, ext);
  const dirname = path.dirname(inputPath);

  // Responsive Größen
  const sizes = [
    { width: 1920, suffix: '-xl' },
    { width: 1280, suffix: '-lg' },
    { width: 768, suffix: '-md' },
    { width: 480, suffix: '-sm' },
  ];

  const optimized: Array<{ path: string; size: number; width: number }> = [];

  for (const { width, suffix } of sizes) {
    const outputPath = path.join(dirname, `${basename}${suffix}.webp`);

    await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const size = fs.statSync(outputPath).size;
    optimized.push({ path: outputPath, size, width });

    console.log(`  ✅ ${width}px → ${(size / 1024).toFixed(1)} KB`);
  }

  const totalOptimizedSize = optimized.reduce((sum, o) => sum + o.size, 0);
  const savings = originalSize - totalOptimizedSize;
  const savingsPercent = (savings / originalSize) * 100;

  console.log(`\n💾 Original: ${(originalSize / 1024).toFixed(1)} KB`);
  console.log(`💾 Optimiert (gesamt): ${(totalOptimizedSize / 1024).toFixed(1)} KB`);
  console.log(`✨ Ersparnis: ${(savings / 1024).toFixed(1)} KB (${savingsPercent.toFixed(1)}%)\n`);

  return {
    original: { path: inputPath, size: originalSize },
    optimized,
    savings,
    savingsPercent,
  };
}

/**
 * Generiert HTML <picture> Tag für responsive Bilder
 */
function generatePictureTag(basename: string, alt: string): string {
  return `
<picture>
  <source media="(min-width: 1280px)" srcset="/images/${basename}-xl.webp" />
  <source media="(min-width: 768px)" srcset="/images/${basename}-lg.webp" />
  <source media="(min-width: 480px)" srcset="/images/${basename}-md.webp" />
  <img src="/images/${basename}-sm.webp" alt="${alt}" loading="lazy" />
</picture>
  `.trim();
}

/**
 * Batch-Optimierung eines Verzeichnisses
 */
async function optimizeDirectory(dirPath: string): Promise<void> {
  console.log(`📁 Optimiere alle Bilder in: ${dirPath}\n`);

  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (imageFiles.length === 0) {
    console.log('⚠️  Keine Bilder gefunden (nur .jpg, .jpeg, .png werden unterstützt)');
    return;
  }

  let totalSavings = 0;
  let totalOriginalSize = 0;

  for (const file of imageFiles) {
    const fullPath = path.join(dirPath, file);
    const result = await optimizeImage(fullPath);
    totalSavings += result.savings;
    totalOriginalSize += result.original.size;
  }

  const totalSavingsPercent = (totalSavings / totalOriginalSize) * 100;

  console.log('═══════════════════════════════════════════════════');
  console.log(`🎉 Fertig! ${imageFiles.length} Bilder optimiert`);
  console.log(`💾 Gesamt-Ersparnis: ${(totalSavings / 1024 / 1024).toFixed(2)} MB (${totalSavingsPercent.toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════');
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║         AUTOMATISCHE BILDOPTIMIERUNG              ║
╚═══════════════════════════════════════════════════╝

Verwendung:
  npx tsx optimize-images.ts <pfad>

Beispiele:
  npx tsx optimize-images.ts public/images/hero.jpg
  npx tsx optimize-images.ts public/images/

Features:
  ✅ WebP Konvertierung (85% Qualität)
  ✅ Responsive Größen (480px, 768px, 1280px, 1920px)
  ✅ Automatische Kompression
  ✅ 60-80% kleinere Dateien

Ausgabe:
  hero.jpg → hero-sm.webp (480px)
           → hero-md.webp (768px)
           → hero-lg.webp (1280px)
           → hero-xl.webp (1920px)
  `);
  process.exit(0);
}

const inputPath = args[0];

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Pfad nicht gefunden: ${inputPath}`);
  process.exit(1);
}

const stats = fs.statSync(inputPath);

if (stats.isDirectory()) {
  optimizeDirectory(inputPath).catch(console.error);
} else if (stats.isFile()) {
  optimizeImage(inputPath).catch(console.error);
} else {
  console.error('❌ Ungültiger Pfad');
  process.exit(1);
}
