/**
 * Generate favicon files from SVG
 * Run: npx tsx generate-favicon.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// For proper PNG generation, you would need sharp or similar library
// This is a placeholder script - the SVG favicon will work in modern browsers

console.log('✅ Favicon SVG created at public/favicon.svg');
console.log('');
console.log('📝 To generate proper ICO and PNG files:');
console.log('   1. Visit https://realfavicongenerator.net/');
console.log('   2. Upload public/favicon.svg');
console.log('   3. Download generated files');
console.log('   4. Replace files in public/ folder');
console.log('');
console.log('Or install sharp for automated generation:');
console.log('   npm install --save-dev sharp');
console.log('   npm install --save-dev @types/sharp');
