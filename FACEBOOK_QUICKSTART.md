# ⚡ Facebook Auto-Post - Быстрый старт

## 🎯 Цель
Публиковать статьи и проекты на Facebook одной командой:
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

---

## 📋 Что нужно (10 минут):

### 1. Создать Facebook App
🔗 https://developers.facebook.com/
- My Apps → Create App → Business
- Название: `OK Studio Auto Post`

### 2. Добавить Facebook Login
- Add Product → Facebook Login → Web
- OAuth Redirect: `https://ok-studio-umber.vercel.app/`

### 3. Получить токены
🔗 https://developers.facebook.com/tools/explorer/
- Generate Access Token
- Разрешения: `pages_manage_posts`, `pages_read_engagement`
- Выбрать вашу страницу (не профиль!)
- Скопировать токен

### 4. Получить Page ID
В Graph API Explorer:
```
me?fields=id,name
```
Скопировать ID из ответа

### 5. Добавить в .env
```env
FACEBOOK_ACCESS_TOKEN=ваш_токен
FACEBOOK_PAGE_ID=ваш_page_id
SITE_URL=https://ok-studio-umber.vercel.app
```

### 6. Тест
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

---

## ✅ Готово!

Теперь можете публиковать:

**Статьи:**
```bash
npm run fb:post insight warum-die-meisten-websites-kein-geld-verdienen
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
npm run fb:post insight brutalist-webdesign-warum-weniger-mehr-ist
```

**Проекты:**
```bash
npm run fb:post project kraftwerk-digital
npm run fb:post project medizin-nord
npm run fb:post project logistik-pro
npm run fb:post project kreuztaler-werkstatt
```

---

## 📚 Подробные инструкции:

- **Русский:** `FACEBOOK_SETUP_RU.md`
- **Полная:** `FACEBOOK_SETUP_GUIDE.md`

---

**Вопросы? Проблемы?**
Смотрите раздел "Решение проблем" в `FACEBOOK_SETUP_GUIDE.md`
