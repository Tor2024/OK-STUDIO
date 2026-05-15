/**
 * Facebook Auto-Posting для OK Studio
 * Автоматически публикует новые статьи и проекты на Facebook
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
  excerpt?: string;
  content?: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
}

/**
 * Публикует пост на Facebook Page с красивым превью ссылки
 */
async function postToFacebook(
  message: string,
  link: string,
  accessToken: string,
  pageId: string
): Promise<boolean> {
  try {
    // Используем link вместо message + link для красивого превью
    // Facebook автоматически создаст карточку с изображением, заголовком и описанием
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          link: link,
          access_token: accessToken,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.id) {
      console.log('✅ Успешно опубликовано на Facebook!');
      console.log(`📝 Post ID: ${data.id}`);
      console.log(`🔗 Ссылка на пост: https://www.facebook.com/${data.id}`);
      return true;
    } else {
      console.error('❌ Ошибка публикации:', data.error?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка сети:', error);
    return false;
  }
}

/**
 * Генерирует текст поста для статьи
 */
function generateInsightPost(insight: Insight, baseUrl: string): { message: string; link: string } {
  const link = `${baseUrl}/insights/${insight.id}`;
  
  // Используем excerpt если есть, иначе первые 200 символов контента
  let teaser = insight.excerpt || '';
  if (!teaser && insight.content) {
    teaser = insight.content
      .replace(/[#*]/g, '')
      .split('\n\n')[0]
      .slice(0, 200) + '...';
  }

  const message = `📰 ${insight.title}

${teaser}

#WebDesign #Digitalisierung #${insight.tag}`;

  return { message, link };
}

/**
 * Генерирует текст поста для проекта
 */
function generateProjectPost(project: Project, baseUrl: string): { message: string; link: string } {
  const link = `${baseUrl}/work/${project.id}`;

  const message = `✨ Новый проект в портфолио: ${project.title}

${project.description}

Категория: ${project.category}

#WebDesign #Portfolio #${project.category.replace(/\s+/g, '')}`;

  return { message, link };
}

/**
 * Публикует статью на Facebook
 */
async function postInsight(insightId: string): Promise<void> {
  console.log('🚀 Публикация статьи на Facebook...\n');

  // Проверяем переменные окружения
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const baseUrl = process.env.SITE_URL || 'https://ok-studio-umber.vercel.app';

  if (!accessToken || !pageId) {
    console.error('❌ Ошибка: Не заданы FACEBOOK_ACCESS_TOKEN или FACEBOOK_PAGE_ID');
    console.log('\nДобавьте в .env файл:');
    console.log('FACEBOOK_ACCESS_TOKEN=ваш_токен');
    console.log('FACEBOOK_PAGE_ID=ваш_page_id');
    return;
  }

  // Загружаем статью
  const insightPath = path.join(__dirname, `public/data/insights/${insightId}.json`);
  if (!fs.existsSync(insightPath)) {
    console.error(`❌ Статья не найдена: ${insightId}`);
    return;
  }

  const insight: Insight = JSON.parse(fs.readFileSync(insightPath, 'utf-8'));

  console.log(`📄 Статья: ${insight.title}`);
  console.log(`🏷️  Тег: ${insight.tag}`);
  console.log(`📅 Дата: ${insight.date}\n`);

  // Генерируем пост
  const { message, link } = generateInsightPost(insight, baseUrl);

  console.log('📝 Текст поста:');
  console.log('─────────────────────────────────────');
  console.log(message);
  console.log('─────────────────────────────────────');
  console.log(`🔗 Ссылка: ${link}\n`);

  // Публикуем
  const success = await postToFacebook(message, link, accessToken, pageId);

  if (success) {
    console.log('\n✅ Статья успешно опубликована на Facebook!');
  } else {
    console.log('\n❌ Не удалось опубликовать статью');
  }
}

/**
 * Публикует проект на Facebook
 */
async function postProject(projectId: string): Promise<void> {
  console.log('🚀 Публикация проекта на Facebook...\n');

  // Проверяем переменные окружения
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  const baseUrl = process.env.SITE_URL || 'https://ok-studio-umber.vercel.app';

  if (!accessToken || !pageId) {
    console.error('❌ Ошибка: Не заданы FACEBOOK_ACCESS_TOKEN или FACEBOOK_PAGE_ID');
    console.log('\nДобавьте в .env файл:');
    console.log('FACEBOOK_ACCESS_TOKEN=ваш_токен');
    console.log('FACEBOOK_PAGE_ID=ваш_page_id');
    return;
  }

  // Загружаем проект
  const projectPath = path.join(__dirname, `public/data/projects/${projectId}.json`);
  if (!fs.existsSync(projectPath)) {
    console.error(`❌ Проект не найден: ${projectId}`);
    return;
  }

  const project: Project = JSON.parse(fs.readFileSync(projectPath, 'utf-8'));

  console.log(`📁 Проект: ${project.title}`);
  console.log(`🏷️  Категория: ${project.category}\n`);

  // Генерируем пост
  const { message, link } = generateProjectPost(project, baseUrl);

  console.log('📝 Текст поста:');
  console.log('─────────────────────────────────────');
  console.log(message);
  console.log('─────────────────────────────────────');
  console.log(`🔗 Ссылка: ${link}\n`);

  // Публикуем
  const success = await postToFacebook(message, link, accessToken, pageId);

  if (success) {
    console.log('\n✅ Проект успешно опубликован на Facebook!');
  } else {
    console.log('\n❌ Не удалось опубликовать проект');
  }
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║       FACEBOOK AUTO-POSTING для OK STUDIO         ║
╚═══════════════════════════════════════════════════╝

Использование:
  npm run fb:post insight <id>
  npm run fb:post project <id>

Примеры:
  npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
  npm run fb:post project kraftwerk-digital

Настройка (.env):
  FACEBOOK_ACCESS_TOKEN=ваш_токен_доступа
  FACEBOOK_PAGE_ID=ваш_page_id
  SITE_URL=https://ok-studio-umber.vercel.app

Доступные статьи:
  - warum-die-meisten-websites-kein-geld-verdienen
  - ki-im-mittelstand-wo-sie-wirklich-hilft
  - brutalist-webdesign-warum-weniger-mehr-ist
  - kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet
  - digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft
  - die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung

Доступные проекты:
  - kraftwerk-digital
  - medizin-nord
  - logistik-pro
  - kreuztaler-werkstatt
  `);
  process.exit(0);
}

const [type, id] = args;

if (type === 'insight' && id) {
  postInsight(id).catch(console.error);
} else if (type === 'project' && id) {
  postProject(id).catch(console.error);
} else {
  console.error('❌ Неверные аргументы');
  console.log('Используйте: npm run fb:post insight <id>');
  console.log('        или: npm run fb:post project <id>');
  process.exit(1);
}
