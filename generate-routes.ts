/**
 * Генератор списка роутов для prerendering
 * Используется в vite.config.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Project {
  id: string;
}

interface Insight {
  id: string;
}

export function generateRoutes(): string[] {
  const routes: string[] = [
    '/',
    '/work',
    '/insights',
    '/capabilities',
    '/approach',
    '/contact',
    '/impressum',
    '/privacy',
  ];

  try {
    // Читаем проекты
    const projectsIndex = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/data/projects/index.json'), 'utf-8')
    ) as Project[];
    
    projectsIndex.forEach(project => {
      routes.push(`/work/${project.id}`);
    });

    // Читаем статьи
    const insightsIndex = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public/data/insights/index.json'), 'utf-8')
    ) as Insight[];
    
    insightsIndex.forEach(insight => {
      routes.push(`/insights/${insight.id}`);
    });
  } catch (err) {
    console.warn('Warning: Could not read data files for route generation', err);
  }

  return routes;
}

// Если запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  const routes = generateRoutes();
  console.log('Generated routes:');
  routes.forEach(route => console.log(`  ${route}`));
  console.log(`\nTotal: ${routes.length} routes`);
}
