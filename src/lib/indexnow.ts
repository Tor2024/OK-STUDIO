/**
 * IndexNow API Integration
 * Мгновенное уведомление поисковиков о новых/обновлённых страницах
 */

const INDEXNOW_KEY = '4434f77f70e8d53b46114b675ea5783c';
const SITE_URL = 'https://ok-studio-umber.vercel.app';

interface IndexNowResponse {
  success: boolean;
  message: string;
}

/**
 * Отправляет URL в IndexNow для быстрой индексации
 * Использует серверную функцию для обхода CORS
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResponse> {
  try {
    const fullUrls = urls.map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`);
    
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        urls: fullUrls,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      message: `❌ Ошибка сети: ${error}`,
    };
  }
}

/**
 * Получает все URL сайта для индексации
 */
export async function getAllSiteUrls(): Promise<string[]> {
  const urls: string[] = [
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
    // Добавляем проекты
    const projectsResponse = await fetch(`${SITE_URL}/data/projects/index.json`);
    if (projectsResponse.ok) {
      const projects = await projectsResponse.json();
      projects.forEach((project: any) => {
        urls.push(`/work/${project.id}`);
      });
    }

    // Добавляем статьи
    const insightsResponse = await fetch(`${SITE_URL}/data/insights/index.json`);
    if (insightsResponse.ok) {
      const insights = await insightsResponse.json();
      insights.forEach((insight: any) => {
        urls.push(`/insights/${insight.id}`);
      });
    }

    // Добавляем локальные лендинги
    const landingsResponse = await fetch(`${SITE_URL}/data/landings.json`);
    if (landingsResponse.ok) {
      const landings = await landingsResponse.json();
      landings.forEach((landing: any) => {
        if (landing.published !== false) {
          urls.push(`/local/${landing.id}`);
        }
      });
    }
  } catch (error) {
    console.error('Ошибка загрузки URL:', error);
  }

  return urls.map(url => `${SITE_URL}${url}`);
}

/**
 * Переиндексирует весь сайт
 */
export async function reindexEntireSite(): Promise<IndexNowResponse> {
  const urls = await getAllSiteUrls();
  return submitToIndexNow(urls);
}

/**
 * Отправляет одну страницу в IndexNow
 */
export async function submitSinglePage(path: string): Promise<IndexNowResponse> {
  const url = path.startsWith('http') ? path : `${SITE_URL}${path}`;
  return submitToIndexNow([url]);
}
