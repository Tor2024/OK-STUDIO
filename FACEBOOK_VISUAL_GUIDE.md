# 📸 Facebook Auto-Post - Визуальная инструкция

## 🎬 Шаг за шагом со скриншотами

---

## 📍 ШАГ 1: Создание Facebook App

### 1.1 Откройте Facebook Developers
```
🔗 https://developers.facebook.com/
```

**Что вы увидите:**
```
┌─────────────────────────────────────────┐
│  Facebook for Developers                │
│  ┌─────────────────┐                    │
│  │   My Apps   ▼   │  [Create App]      │
│  └─────────────────┘                    │
└─────────────────────────────────────────┘
```

**Действие:** Нажмите **"Create App"** (зелёная кнопка справа)

---

### 1.2 Выберите тип приложения
```
┌─────────────────────────────────────────┐
│  What do you want your app to do?       │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │ Consumer │  │ Business │ ← Выберите │
│  └──────────┘  └──────────┘            │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │  Gaming  │  │  Other   │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
```

**Действие:** Выберите **"Business"**

---

### 1.3 Заполните форму
```
┌─────────────────────────────────────────┐
│  Create an app                           │
│                                          │
│  App display name *                      │
│  ┌────────────────────────────────────┐ │
│  │ OK Studio Auto Post                │ │
│  └────────────────────────────────────┘ │
│                                          │
│  App contact email *                     │
│  ┌────────────────────────────────────┐ │
│  │ ваш@email.com                      │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Business Account (optional)             │
│  ┌────────────────────────────────────┐ │
│  │ Select or create...            ▼  │ │
│  └────────────────────────────────────┘ │
│                                          │
│         [Cancel]  [Create App]           │
└─────────────────────────────────────────┘
```

**Действие:** 
- Введите название: `OK Studio Auto Post`
- Введите ваш email
- Нажмите **"Create App"**

---

## 📍 ШАГ 2: Добавление Facebook Login

### 2.1 Добавьте продукт
```
┌─────────────────────────────────────────┐
│  OK Studio Auto Post                     │
│  ┌─────────────┐                         │
│  │ Dashboard   │                         │
│  │ Add Product │ ← Нажмите               │
│  │ Settings    │                         │
│  └─────────────┘                         │
│                                          │
│  Add products to your app                │
│  ┌──────────────────────────────────┐   │
│  │ Facebook Login      [Set Up]     │   │
│  │ Share content to Facebook        │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ Instagram Basic Display          │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

**Действие:** Найдите **"Facebook Login"** → нажмите **"Set Up"**

---

### 2.2 Выберите платформу
```
┌─────────────────────────────────────────┐
│  Quickstart                              │
│                                          │
│  Select a platform to get started        │
│                                          │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │  iOS   │  │Android │  │  Web   │ ←  │
│  └────────┘  └────────┘  └────────┘    │
│                                          │
│  ┌────────┐  ┌────────┐                 │
│  │Windows │  │  Other │                 │
│  └────────┘  └────────┘                 │
└─────────────────────────────────────────┘
```

**Действие:** Выберите **"Web"**

---

### 2.3 Настройте OAuth
```
┌─────────────────────────────────────────┐
│  Facebook Login → Settings               │
│                                          │
│  Client OAuth Settings                   │
│                                          │
│  Valid OAuth Redirect URIs               │
│  ┌────────────────────────────────────┐ │
│  │ https://ok-studio-umber.vercel.app/│ │
│  │ https://localhost:3000/            │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [Save Changes]                          │
└─────────────────────────────────────────┘
```

**Действие:** 
- Добавьте URL: `https://ok-studio-umber.vercel.app/`
- Нажмите **"Save Changes"**

---

## 📍 ШАГ 3: Получение Access Token

### 3.1 Откройте Graph API Explorer
```
🔗 https://developers.facebook.com/tools/explorer/
```

```
┌─────────────────────────────────────────┐
│  Graph API Explorer                      │
│  ┌────────────────┐  ┌────────────────┐ │
│  │ OK Studio... ▼ │  │ Generate Token │ │
│  └────────────────┘  └────────────────┘ │
│                                          │
│  GET  ┌──────────────────────────────┐  │
│       │ me?fields=id,name            │  │
│       └──────────────────────────────┘  │
│                                          │
│  Access Token:                           │
│  ┌────────────────────────────────────┐ │
│  │ EAABsbCS1iHgBO7ZC8ZBfkQZBZCZCZC... │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Действие:** Нажмите **"Generate Access Token"**

---

### 3.2 Выберите разрешения
```
┌─────────────────────────────────────────┐
│  Select Permissions                      │
│                                          │
│  Search permissions...                   │
│  ┌────────────────────────────────────┐ │
│  │ pages                              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ☑ pages_manage_posts                   │
│  ☑ pages_read_engagement                │
│  ☑ pages_show_list                      │
│  ☐ pages_manage_metadata                │
│                                          │
│  [Cancel]  [Generate Access Token]       │
└─────────────────────────────────────────┘
```

**Действие:** 
- Отметьте: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`
- Нажмите **"Generate Access Token"**

---

### 3.3 Выберите страницу
```
┌─────────────────────────────────────────┐
│  Graph API Explorer                      │
│                                          │
│  User or Page:                           │
│  ┌────────────────────────────────────┐ │
│  │ User: Ваше Имя              ▼     │ │
│  │ ─────────────────────────────────  │ │
│  │ Page: OK Studio             ← !!!  │ │
│  │ Page: Другая страница              │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Access Token: (Page Access Token)       │
│  ┌────────────────────────────────────┐ │
│  │ EAABsbCS1iHgBO7ZC8ZBfkQZBZCZCZC... │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Действие:** 
- Выберите **вашу страницу** (не User!)
- Токен автоматически обновится
- **Скопируйте токен** (это Page Access Token)

---

### 3.4 Получите Page ID
```
┌─────────────────────────────────────────┐
│  Graph API Explorer                      │
│                                          │
│  GET  ┌──────────────────────────────┐  │
│       │ me?fields=id,name            │  │
│       └──────────────────────────────┘  │
│       [Submit]                           │
│                                          │
│  Response:                               │
│  {                                       │
│    "id": "123456789012345",  ← Это ID!  │
│    "name": "OK Studio"                   │
│  }                                       │
└─────────────────────────────────────────┘
```

**Действие:** 
- Введите: `me?fields=id,name`
- Нажмите **"Submit"**
- **Скопируйте ID** из ответа

---

## 📍 ШАГ 4: Настройка .env

### 4.1 Откройте файл .env
```
C:\STUDIO-OK\.env
```

### 4.2 Добавьте токены
```env
# Facebook Auto-Posting
FACEBOOK_ACCESS_TOKEN=EAABsbCS1iHgBO7ZC8ZBfkQZBZCZCZC...
FACEBOOK_PAGE_ID=123456789012345
SITE_URL=https://ok-studio-umber.vercel.app
```

**Действие:** 
- Вставьте ваш токен
- Вставьте ваш Page ID
- Сохраните файл

---

## 📍 ШАГ 5: Тестирование

### 5.1 Откройте терминал
```
C:\STUDIO-OK>
```

### 5.2 Запустите команду
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

### 5.3 Ожидаемый результат
```
🚀 Публикация статьи на Facebook...

📄 Статья: KI im Mittelstand: Wo sie wirklich hilft
🏷️  Тег: KI
📅 Дата: 2025-04-01

📝 Текст поста:
─────────────────────────────────────
📰 KI im Mittelstand: Wo sie wirklich hilft

Künstliche Intelligenz ist nicht mehr nur für Tech-Giganten...

#WebDesign #Digitalisierung #KI
─────────────────────────────────────
🔗 Ссылка: https://ok-studio-umber.vercel.app/insights/...

✅ Успешно опубликовано на Facebook!
📝 Post ID: 123456789_987654321
```

---

## 📍 ШАГ 6: Проверка на Facebook

### 6.1 Откройте вашу страницу Facebook
```
🔗 https://www.facebook.com/ваша-страница
```

### 6.2 Проверьте пост
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
│  │ [Превью ссылки с изображением]     │ │
│  │ KI im Mittelstand: Wo sie...       │ │
│  │ ok-studio-umber.vercel.app         │ │
│  └────────────────────────────────────┘ │
│                                          │
│  👍 Like  💬 Comment  ↗ Share           │
└─────────────────────────────────────────┘
```

**Действие:** Убедитесь, что пост появился!

---

## ✅ Готово!

Теперь вы можете публиковать контент одной командой:

```bash
# Статьи
npm run fb:post insight <id>

# Проекты
npm run fb:post project <id>
```

---

## 🎯 Доступные команды:

### Статьи:
```bash
npm run fb:post insight warum-die-meisten-websites-kein-geld-verdienen
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
npm run fb:post insight brutalist-webdesign-warum-weniger-mehr-ist
npm run fb:post insight kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet
npm run fb:post insight digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft
npm run fb:post insight die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung
```

### Проекты:
```bash
npm run fb:post project kraftwerk-digital
npm run fb:post project medizin-nord
npm run fb:post project logistik-pro
npm run fb:post project kreuztaler-werkstatt
```

---

**🎉 Поздравляем! Автопостинг настроен!**
