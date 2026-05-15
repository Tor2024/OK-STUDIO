# 📱 Facebook Auto-Posting для OK Studio

Автоматическая публикация статей и проектов на Facebook одной командой.

---

## 🚀 Быстрый старт

```bash
# 1. Настройте токены (см. инструкции ниже)
# 2. Опубликуйте статью
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft

# 3. Опубликуйте проект
npm run fb:post project kraftwerk-digital
```

---

## 📚 Инструкции

Выберите подходящую инструкцию:

### 🎯 [Быстрый старт](FACEBOOK_QUICKSTART.md)
**5 минут** - Минимальная инструкция для быстрой настройки

### 🇷🇺 [Русская инструкция](FACEBOOK_SETUP_RU.md)
**10 минут** - Пошаговая инструкция на русском языке

### 📘 [Полная инструкция](FACEBOOK_SETUP_GUIDE.md)
**15 минут** - Подробная инструкция с решением проблем и автоматизацией

### 📸 [Визуальная инструкция](FACEBOOK_VISUAL_GUIDE.md)
**10 минут** - Инструкция с текстовыми "скриншотами" каждого шага

---

## 📋 Что нужно для настройки

1. **Facebook Page** (страница, не личный профиль)
2. **Facebook App** (создаётся за 5 минут)
3. **Access Token** (получается в Graph API Explorer)
4. **Page ID** (получается там же)

---

## 🎯 Доступные команды

### Опубликовать статью
```bash
npm run fb:post insight <id-статьи>
```

**Доступные статьи:**
- `warum-die-meisten-websites-kein-geld-verdienen`
- `ki-im-mittelstand-wo-sie-wirklich-hilft`
- `brutalist-webdesign-warum-weniger-mehr-ist`
- `kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet`
- `digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft`
- `die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung`

### Опубликовать проект
```bash
npm run fb:post project <id-проекта>
```

**Доступные проекты:**
- `kraftwerk-digital`
- `medizin-nord`
- `logistik-pro`
- `kreuztaler-werkstatt`

---

## 🔧 Настройка

### 1. Получите токены
Следуйте одной из инструкций выше для получения:
- `FACEBOOK_ACCESS_TOKEN`
- `FACEBOOK_PAGE_ID`

### 2. Добавьте в .env
```env
FACEBOOK_ACCESS_TOKEN=ваш_токен
FACEBOOK_PAGE_ID=ваш_page_id
SITE_URL=https://ok-studio-umber.vercel.app
```

### 3. Протестируйте
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

---

## 📊 Что публикуется

### Для статей:
```
📰 [Заголовок статьи]

[Краткое описание из excerpt или первые 200 символов]

#WebDesign #Digitalisierung #[Тег]

🔗 Ссылка на статью
```

### Для проектов:
```
✨ Новый проект в портфолио: [Название]

[Описание проекта]

Категория: [Категория]

#WebDesign #Portfolio #[Категория]

🔗 Ссылка на проект
```

---

## 🤖 Автоматизация

Для автоматической публикации при добавлении нового контента:

1. Добавьте токены в GitHub Secrets
2. Создайте `.github/workflows/facebook-auto-post.yml`
3. Подробности в [полной инструкции](FACEBOOK_SETUP_GUIDE.md)

---

## ⚠️ Важные замечания

### Токены
- Используйте **Page Access Token**, а не User Token
- Токен может истечь через 60 дней
- Получите долгосрочный токен через Access Token Tool

### Безопасность
- ⚠️ Никогда не коммитьте токены в Git
- ✅ Храните токены только в `.env`
- ✅ `.env` уже добавлен в `.gitignore`

### Лимиты
- 200 запросов в час на пользователя
- 600 запросов в час на приложение
- Для нескольких постов в день этого достаточно

---

## 🐛 Решение проблем

### "Invalid OAuth access token"
→ Токен истёк, получите новый в Graph API Explorer

### "Permissions error"
→ Добавьте разрешение `pages_manage_posts`

### "Page ID not found"
→ Проверьте Page ID через `me?fields=id,name`

### Пост не появляется
→ Убедитесь, что используете Page Access Token

**Подробнее:** [FACEBOOK_SETUP_GUIDE.md](FACEBOOK_SETUP_GUIDE.md)

---

## 📞 Полезные ссылки

- **Facebook Developers:** https://developers.facebook.com/
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/
- **Access Token Tool:** https://developers.facebook.com/tools/accesstoken/
- **Facebook API Docs:** https://developers.facebook.com/docs/graph-api/

---

## 📁 Файлы проекта

```
facebook-auto-post.ts          # Основной скрипт
FACEBOOK_README.md             # Этот файл
FACEBOOK_QUICKSTART.md         # Быстрый старт (5 мин)
FACEBOOK_SETUP_RU.md           # Русская инструкция (10 мин)
FACEBOOK_SETUP_GUIDE.md        # Полная инструкция (15 мин)
FACEBOOK_VISUAL_GUIDE.md       # Визуальная инструкция (10 мин)
```

---

## ✅ Чеклист

- [ ] Создано Facebook App
- [ ] Добавлен Facebook Login
- [ ] Получен Page Access Token
- [ ] Получен Page ID
- [ ] Токены добавлены в `.env`
- [ ] Протестирована публикация
- [ ] Пост появился на Facebook

---

**🎉 Готово! Начните с [быстрого старта](FACEBOOK_QUICKSTART.md)!**
