# 🖼️ Красивые превью ссылок для Facebook

## 🎯 Что такое Rich Preview?

Когда вы публикуете ссылку на Facebook, он автоматически создаёт красивую карточку:

```
┌─────────────────────────────────────────┐
│  OK Studio                               │
│  Just now · 🌐                           │
│                                          │
│  📰 KI im Mittelstand: Wo sie wirklich  │
│  hilft                                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │                                    │ │
│  │     [КРАСИВОЕ ИЗОБРАЖЕНИЕ]        │ │
│  │                                    │ │
│  ├────────────────────────────────────┤ │
│  │ KI im Mittelstand: Wo sie...      │ │
│  │ Künstliche Intelligenz ist nicht  │ │
│  │ mehr nur für Tech-Giganten...     │ │
│  │ ok-studio-umber.vercel.app        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Что уже работает:

Ваш сайт **уже настроен** для красивых превью! 

В `src/hooks/useMeta.ts` есть все нужные Open Graph теги:
- ✅ `og:title` - заголовок
- ✅ `og:description` - описание
- ✅ `og:image` - изображение
- ✅ `og:url` - ссылка
- ✅ `og:type` - тип контента

---

## 🖼️ Что нужно добавить:

### Вариант 1: Использовать существующие изображения проектов

Для каждой статьи и проекта уже есть изображения в `public/images/`.

**Обновим скрипт**, чтобы использовать их:

```typescript
// Для статей
const imageUrl = `${baseUrl}/images/insights/${insight.id}.jpg`;

// Для проектов  
const imageUrl = `${baseUrl}/images/projects/${project.id}.jpg`;
```

---

### Вариант 2: Создать специальные OG изображения (1200x630px)

Facebook рекомендует размер: **1200x630 пикселей**

#### Способ A: Вручную в Figma/Canva (10 минут на изображение)

1. Откройте Canva: https://www.canva.com/
2. Выберите шаблон "Facebook Post" (1200x630)
3. Добавьте:
   - Фон в стиле OK Studio (чёрный/белый)
   - Заголовок статьи крупным шрифтом
   - Логотип OK Studio
   - Минималистичный дизайн
4. Экспортируйте как JPG
5. Сохраните в `public/og-images/[id].jpg`

#### Способ B: Автоматически через скрипт (уже есть!)

У вас есть скрипт `generate-og-images-simple.ts`, который генерирует OG изображения.

**Запустите:**
```bash
npm run og:simple
```

Это создаст изображения для всех статей и проектов в `public/og-images/`.

---

### Вариант 3: Использовать дефолтное изображение

Создайте одно универсальное изображение `public/og-default.jpg` (1200x630px) с:
- Логотипом OK Studio
- Слоганом: "Web-Design & Relaunch für den Mittelstand"
- Минималистичным дизайном

Facebook будет использовать его для всех ссылок.

---

## 🚀 Рекомендация:

**Используйте Вариант 2B** - автоматическая генерация:

```bash
npm run og:simple
```

Это создаст красивые изображения для всех статей и проектов автоматически!

---

## 🧪 Как проверить превью:

### Способ 1: Facebook Sharing Debugger
1. Откройте: https://developers.facebook.com/tools/debug/
2. Вставьте ссылку: `https://ok-studio-umber.vercel.app/insights/ki-im-mittelstand-wo-sie-wirklich-hilft`
3. Нажмите **"Debug"**
4. Увидите превью, которое будет на Facebook

### Способ 2: Опубликуйте тестовый пост
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

Проверьте на Facebook - должна появиться красивая карточка!

---

## 📐 Требования Facebook к изображениям:

| Параметр | Значение |
|----------|----------|
| Рекомендуемый размер | 1200x630 пикселей |
| Минимальный размер | 600x315 пикселей |
| Соотношение сторон | 1.91:1 |
| Формат | JPG или PNG |
| Максимальный размер | 8 МБ |

---

## 🎨 Дизайн рекомендации:

### Для статей:
- Заголовок крупным шрифтом (60-80px)
- Логотип OK Studio в углу
- Минималистичный фон (чёрный/белый)
- Иконка или символ темы статьи

### Для проектов:
- Скриншот проекта
- Название проекта
- Логотип OK Studio
- Категория проекта

---

## 🔧 Обновление скрипта для использования изображений:

Я уже обновил `facebook-auto-post.ts`, чтобы Facebook автоматически подтягивал изображения с вашего сайта через Open Graph теги.

**Как это работает:**

1. Вы публикуете ссылку: `npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft`
2. Facebook получает ссылку: `https://ok-studio-umber.vercel.app/insights/...`
3. Facebook читает Open Graph теги со страницы
4. Facebook берёт изображение из `og:image`
5. Facebook создаёт красивую карточку автоматически!

---

## ✅ Что делать прямо сейчас:

### Шаг 1: Сгенерируйте OG изображения
```bash
npm run og:simple
```

### Шаг 2: Проверьте, что изображения созданы
```bash
dir public\og-images
```

Должны появиться файлы:
- `ki-im-mittelstand-wo-sie-wirklich-hilft.jpg`
- `kraftwerk-digital.jpg`
- и т.д.

### Шаг 3: Закоммитьте и задеплойте
```bash
git add public/og-images
git commit -m "Add OG images for social media"
git push
```

### Шаг 4: Очистите кеш Facebook
1. Откройте: https://developers.facebook.com/tools/debug/
2. Вставьте ссылку на статью
3. Нажмите **"Scrape Again"** (Обновить)

### Шаг 5: Опубликуйте пост
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

### Шаг 6: Проверьте на Facebook
Откройте вашу страницу - должна быть красивая карточка с изображением!

---

## 🐛 Если изображение не появляется:

### Проблема 1: Facebook не видит изображение
**Решение:** Очистите кеш через Sharing Debugger

### Проблема 2: Изображение слишком маленькое
**Решение:** Убедитесь, что размер минимум 600x315px

### Проблема 3: Изображение не загружается
**Решение:** Проверьте, что файл доступен по ссылке:
```
https://ok-studio-umber.vercel.app/og-images/ki-im-mittelstand-wo-sie-wirklich-hilft.jpg
```

---

## 💡 Дополнительные улучшения:

### 1. Добавьте изображение в текст поста
Можно загрузить изображение напрямую в пост (не через ссылку):

```typescript
// В будущем можно добавить загрузку изображения
const formData = new FormData();
formData.append('message', message);
formData.append('url', imageUrl);
formData.append('access_token', accessToken);
```

### 2. Используйте видео превью
Для проектов можно добавить короткое видео (до 240 минут):

```typescript
{
  message: message,
  source: videoUrl,
  access_token: accessToken
}
```

### 3. Добавьте кнопку призыва к действию
```typescript
{
  message: message,
  link: link,
  call_to_action: {
    type: 'LEARN_MORE',
    value: { link: link }
  },
  access_token: accessToken
}
```

---

## 📊 Примеры красивых постов:

### Статья с изображением:
```
┌─────────────────────────────────────────┐
│  OK Studio                               │
│  Just now · 🌐                           │
│                                          │
│  📰 KI im Mittelstand: Wo sie wirklich  │
│  hilft                                   │
│                                          │
│  Künstliche Intelligenz ist nicht mehr  │
│  nur für Tech-Giganten...               │
│                                          │
│  #WebDesign #Digitalisierung #KI        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Изображение: AI иконка + текст]  │ │
│  ├────────────────────────────────────┤ │
│  │ KI im Mittelstand: Wo sie...      │ │
│  │ Künstliche Intelligenz ist nicht  │ │
│  │ ok-studio-umber.vercel.app        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  👍 Like  💬 Comment  ↗ Share           │
└─────────────────────────────────────────┘
```

### Проект с скриншотом:
```
┌─────────────────────────────────────────┐
│  OK Studio                               │
│  Just now · 🌐                           │
│                                          │
│  ✨ Новый проект в портфолио:           │
│  Kraftwerk Digital                       │
│                                          │
│  Moderne Website für Industrieunter...  │
│                                          │
│  #WebDesign #Portfolio #ECommerce       │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  [Скриншот сайта Kraftwerk]        │ │
│  ├────────────────────────────────────┤ │
│  │ Kraftwerk Digital - OK Studio     │ │
│  │ Moderne Website für Industrie...  │ │
│  │ ok-studio-umber.vercel.app        │ │
│  └────────────────────────────────────┘ │
│                                          │
│  👍 Like  💬 Comment  ↗ Share           │
└─────────────────────────────────────────┘
```

---

## ✅ Итого:

1. **Сгенерируйте изображения:** `npm run og:simple`
2. **Задеплойте:** `git push`
3. **Опубликуйте:** `npm run fb:post insight <id>`
4. **Наслаждайтесь** красивыми карточками! 🎉

---

**Facebook автоматически создаст красивое превью с изображением, заголовком и описанием!**
