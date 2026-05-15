# 🚀 Быстрая настройка Facebook Auto-Posting

## Что нужно сделать:

### 1️⃣ Создать Facebook App (5 минут)

1. Откройте: **https://developers.facebook.com/**
2. Нажмите **"My Apps"** → **"Create App"**
3. Выберите **"Business"**
4. Название: `OK Studio Auto Post`
5. Email: ваш email
6. Нажмите **"Create App"**

---

### 2️⃣ Добавить Facebook Login (2 минуты)

1. В меню слева: **"Add Product"**
2. Найдите **"Facebook Login"** → **"Set Up"**
3. Выберите **"Web"**
4. В **"Valid OAuth Redirect URIs"** добавьте:
   ```
   https://ok-studio-umber.vercel.app/
   ```
5. Сохраните

---

### 3️⃣ Получить токены (3 минуты)

#### Получить Access Token:
1. Откройте: **https://developers.facebook.com/tools/explorer/**
2. Выберите ваше приложение: **"OK Studio Auto Post"**
3. Нажмите **"Generate Access Token"**
4. Выберите разрешения:
   - ✅ `pages_manage_posts`
   - ✅ `pages_read_engagement`
   - ✅ `pages_show_list`
5. Подтвердите
6. В поле **"User or Page"** выберите **вашу страницу Facebook**
7. **Скопируйте токен** (это Page Access Token)

#### Получить Page ID:
1. В том же Graph API Explorer введите:
   ```
   me?fields=id,name
   ```
2. Нажмите **"Submit"**
3. **Скопируйте ID** из ответа

---

### 4️⃣ Добавить в .env (1 минута)

Откройте файл `.env` и добавьте:

```env
FACEBOOK_ACCESS_TOKEN=ваш_токен_здесь
FACEBOOK_PAGE_ID=ваш_page_id_здесь
SITE_URL=https://ok-studio-umber.vercel.app
```

---

### 5️⃣ Протестировать (1 минута)

Запустите команду:

```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

Если увидите:
```
✅ Успешно опубликовано на Facebook!
📝 Post ID: 123456789_987654321
```

**Значит всё работает!** 🎉

Проверьте вашу страницу Facebook - там должен появиться пост.

---

## 📚 Как использовать:

### Опубликовать статью:
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

### Опубликовать проект:
```bash
npm run fb:post project <id-проекта>
```

**Доступные проекты:**
- `kraftwerk-digital`
- `medizin-nord`
- `logistik-pro`
- `kreuztaler-werkstatt`

---

## ⚠️ Важно:

1. **Используйте Page Access Token**, а не User Token
2. **Не коммитьте токены в Git** - они уже в `.gitignore`
3. **Токен может истечь через 60 дней** - тогда нужно получить новый

---

## 🐛 Если не работает:

### "Invalid OAuth access token"
→ Получите новый токен в Graph API Explorer

### "Permissions error"
→ Добавьте разрешение `pages_manage_posts`

### "Page ID not found"
→ Проверьте Page ID через Graph API Explorer

---

**Всё! Теперь можете публиковать на Facebook одной командой! 🚀**

Подробная инструкция: `FACEBOOK_SETUP_GUIDE.md`
