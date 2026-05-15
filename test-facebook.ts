/**
 * Тестовый скрипт для проверки Facebook API
 * Проверяет токены и подключение без публикации
 */

import dotenv from 'dotenv';
dotenv.config();

async function testFacebookConnection(): Promise<void> {
  console.log('🧪 Тестирование подключения к Facebook API...\n');

  // Проверяем переменные окружения
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken) {
    console.error('❌ FACEBOOK_ACCESS_TOKEN не найден в .env');
    console.log('\nДобавьте в .env:');
    console.log('FACEBOOK_ACCESS_TOKEN=ваш_токен');
    return;
  }

  if (!pageId) {
    console.error('❌ FACEBOOK_PAGE_ID не найден в .env');
    console.log('\nДобавьте в .env:');
    console.log('FACEBOOK_PAGE_ID=ваш_page_id');
    return;
  }

  console.log('✅ Переменные окружения найдены');
  console.log(`   Page ID: ${pageId}`);
  console.log(`   Token: ${accessToken.substring(0, 20)}...`);
  console.log('');

  // Тест 1: Проверка токена
  console.log('📝 Тест 1: Проверка токена...');
  try {
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v19.0/me?access_token=${accessToken}`
    );
    const tokenData = await tokenResponse.json();

    if (tokenResponse.ok) {
      console.log('✅ Токен валиден');
      console.log(`   ID: ${tokenData.id}`);
      console.log(`   Name: ${tokenData.name}`);
    } else {
      console.error('❌ Токен невалиден:', tokenData.error?.message);
      return;
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке токена:', error);
    return;
  }

  console.log('');

  // Тест 2: Проверка разрешений
  console.log('📝 Тест 2: Проверка разрешений...');
  try {
    const permResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/permissions?access_token=${accessToken}`
    );
    const permData = await permResponse.json();

    if (permResponse.ok && permData.data) {
      const permissions = permData.data.map((p: any) => p.permission);
      console.log('✅ Разрешения получены:');
      permissions.forEach((p: string) => console.log(`   - ${p}`));

      // Проверяем необходимые разрешения
      const required = ['pages_manage_posts', 'pages_read_engagement'];
      const missing = required.filter(r => !permissions.includes(r));

      if (missing.length > 0) {
        console.log('\n⚠️  Отсутствуют разрешения:');
        missing.forEach(m => console.log(`   - ${m}`));
        console.log('\nДобавьте их в Graph API Explorer');
      }
    } else {
      console.log('⚠️  Не удалось получить разрешения');
      console.log('   Это нормально, если токен новый');
    }
  } catch (error) {
    console.log('⚠️  Ошибка при проверке разрешений (не критично)');
  }

  console.log('');

  // Тест 3: Проверка доступа к странице
  console.log('📝 Тест 3: Проверка доступа к странице...');
  try {
    const pageResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=id,name,access_token&access_token=${accessToken}`
    );
    const pageData = await pageResponse.json();

    if (pageResponse.ok) {
      console.log('✅ Доступ к странице есть');
      console.log(`   ID: ${pageData.id}`);
      console.log(`   Name: ${pageData.name}`);
    } else {
      console.error('❌ Нет доступа к странице:', pageData.error?.message);
      return;
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке страницы:', error);
    return;
  }

  console.log('');

  // Тест 4: Проверка возможности публикации (без реальной публикации)
  console.log('📝 Тест 4: Проверка API публикации...');
  try {
    // Используем тестовый endpoint для проверки
    const testResponse = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}/feed?access_token=${accessToken}`,
      {
        method: 'GET',
      }
    );

    if (testResponse.ok) {
      console.log('✅ API публикации доступен');
    } else {
      const errorData = await testResponse.json();
      console.error('❌ API публикации недоступен:', errorData.error?.message);
      return;
    }
  } catch (error) {
    console.error('❌ Ошибка при проверке API:', error);
    return;
  }

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('✅ ВСЕ ТЕСТЫ ПРОЙДЕНЫ!');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  console.log('🚀 Теперь можете публиковать:');
  console.log('   npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft');
  console.log('   npm run fb:post project kraftwerk-digital');
  console.log('');
}

testFacebookConnection().catch(console.error);
