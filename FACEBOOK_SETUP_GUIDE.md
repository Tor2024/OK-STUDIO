# 📘 Инструкция по настройке Facebook Auto-Posting

## 🎯 Что это даёт?

Автоматическая публикация новых статей и проектов на вашу страницу Facebook одной командой:
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

---

## 📋 Шаг 1: Создайте Facebook App

### 1.1 Перейдите на Facebook Developers
🔗 https://developers.facebook.com/

### 1.2 Создайте приложение
1. Нажмите **"My Apps"** (Мои приложения) в правом верхнем углу
2. Нажмите **"Create App"** (Создать приложение)
3. Выберите тип: **"Business"** (Бизнес)
4. Заполните форму:
   - **App Display Name:** `OK Studio Auto Post`
   - **App Contact Email:** ваш email
   - **Business Account:** выберите или создайте
5. Нажмите **"Create App"** (Создать приложение)

---

## 📋 Шаг 2: Добавьте продукт Facebook Login

### 2.1 Добавьте Facebook Login
1. В левом меню найдите **"Add Product"** (Добавить продукт)
2. Найдите **"Facebook Login"** → нажмите **"Set Up"** (Настроить)
3. Выберите платформу: **"Web"**

### 2.2 Настройте OAuth Redirect URIs
1. В левом меню: **"Facebook Login"** → **"Settings"** (Настройки)
2. В поле **"Valid OAuth Redirect URIs"** добавьте:
   ```
   https://ok-studio-umber.vercel.app/
   https://localhost:3000/
   ```
3. Нажмите **"Save Changes"** (Сохранить изменения)

---

## 📋 Шаг 3: Получите Access Token

### 3.1 Откройте Graph API Explorer
1. В верхнем меню нажмите **"Tools"** (Инструменты)
2. Выберите **"Graph API Explorer"**
3. 🔗 Или перейдите: https://developers.facebook.com/tools/explorer/

### 3.2 Настройте разрешения
1. В правом верхнем углу выберите ваше приложение: **"OK Studio Auto Post"**
2. Нажмите **"Generate Access Token"** (Сгенерировать токен доступа)
3. В появившемся окне выберите разрешения:
   - ✅ `pages_manage_posts` (управление постами)
   - ✅ `pages_read_engagement` (чтение вовлечённости)
   - ✅ `pages_show_list` (показ списка страниц)
4. Нажмите **"Generate Access Token"**
5. Подтвердите доступ

### 3.3 Получите Page Access Token
1. В поле **"User or Page"** выберите вашу **страницу Facebook** (не личный профиль!)
2. Токен автоматически обновится на **Page Access Token**
3. Нажмите кнопку **"Copy"** рядом с токеном
4. **Сохраните этот токен** - он понадобится для `.env`

⚠️ **ВАЖНО:** Используйте именно **Page Access Token**, а не User Access Token!

---

## 📋 Шаг 4: Получите Page ID

### Способ 1: Через Graph API Explorer
1. В Graph API Explorer в поле запроса введите:
   ```
   me?fields=id,name
   ```
2. Нажмите **"Submit"**
3. В ответе будет ваш **Page ID**

### Способ 2: Через настройки страницы
1. Откройте вашу страницу Facebook
2. Нажмите **"About"** (О странице)
3. Прокрутите вниз до раздела **"Page Transparency"**
4. Найдите **"Page ID"** и скопируйте

---

## 📋 Шаг 5: Добавьте токены в .env

Откройте файл `.env` и добавьте:

```env
# Facebook Auto-Posting
FACEBOOK_ACCESS_TOKEN=ваш_page_access_token_здесь
FACEBOOK_PAGE_ID=ваш_page_id_здесь
SITE_URL=https://ok-studio-umber.vercel.app
```

**Пример:**
```env
FACEBOOK_ACCESS_TOKEN=EAABsbCS1iHgBO7ZC8ZBfkQZBZCZCZC...
FACEBOOK_PAGE_ID=123456789012345
SITE_URL=https://ok-studio-umber.vercel.app
```

---

## 📋 Шаг 6: Добавьте токены на Vercel

Для автоматической публикации через GitHub Actions нужно добавить токены на Vercel:

1. Откройте: https://vercel.com/
2. Выберите проект **ok-studio-umber**
3. Перейдите в **Settings** → **Environment Variables**
4. Добавьте переменные:
   - **Name:** `FACEBOOK_ACCESS_TOKEN`
   - **Value:** ваш токен
   - **Environment:** Production, Preview, Development
   - Нажмите **Save**
   
   - **Name:** `FACEBOOK_PAGE_ID`
   - **Value:** ваш page ID
   - **Environment:** Production, Preview, Development
   - Нажмите **Save**

---

## 🧪 Шаг 7: Протестируйте публикацию

### 7.1 Локальный тест
```bash
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
```

Вы должны увидеть:
```
🚀 Публикация статьи на Facebook...

📄 Статья: KI im Mittelstand: Wo sie wirklich hilft
🏷️  Тег: KI
📅 Дата: 2025-04-01

📝 Текст поста:
─────────────────────────────────────
📰 KI im Mittelstand: Wo sie wirklich hilft
...
─────────────────────────────────────
🔗 Ссылка: https://ok-studio-umber.vercel.app/insights/...

✅ Успешно опубликовано на Facebook!
📝 Post ID: 123456789_987654321
```

### 7.2 Проверьте на Facebook
Откройте вашу страницу Facebook и проверьте, что пост появился!

---

## 📚 Использование

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

## 🤖 Автоматизация через GitHub Actions

Чтобы публикация происходила автоматически при добавлении новой статьи/проекта, создайте файл:

`.github/workflows/facebook-auto-post.yml`

```yaml
name: Facebook Auto Post

on:
  push:
    paths:
      - 'public/data/insights/*.json'
      - 'public/data/projects/*.json'

jobs:
  post-to-facebook:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Detect new content
        id: detect
        run: |
          # Определяем какой файл изменился
          CHANGED_FILE=$(git diff --name-only HEAD~1 HEAD | grep -E 'public/data/(insights|projects)/.*.json' | head -1)
          
          if [[ $CHANGED_FILE == *"insights"* ]]; then
            TYPE="insight"
            ID=$(basename $CHANGED_FILE .json)
          elif [[ $CHANGED_FILE == *"projects"* ]]; then
            TYPE="project"
            ID=$(basename $CHANGED_FILE .json)
          else
            echo "No content changes detected"
            exit 0
          fi
          
          echo "type=$TYPE" >> $GITHUB_OUTPUT
          echo "id=$ID" >> $GITHUB_OUTPUT
      
      - name: Post to Facebook
        if: steps.detect.outputs.type != ''
        env:
          FACEBOOK_ACCESS_TOKEN: ${{ secrets.FACEBOOK_ACCESS_TOKEN }}
          FACEBOOK_PAGE_ID: ${{ secrets.FACEBOOK_PAGE_ID }}
          SITE_URL: https://ok-studio-umber.vercel.app
        run: |
          npm run fb:post ${{ steps.detect.outputs.type }} ${{ steps.detect.outputs.id }}
```

Затем добавьте секреты в GitHub:
1. Откройте: https://github.com/Tor2024/OK-STUDIO/settings/secrets/actions
2. Нажмите **"New repository secret"**
3. Добавьте:
   - `FACEBOOK_ACCESS_TOKEN`
   - `FACEBOOK_PAGE_ID`

---

## ⚠️ Важные замечания

### Срок действия токена
- **Short-lived tokens** (краткосрочные) действуют 1-2 часа
- **Long-lived tokens** (долгосрочные) действуют 60 дней
- **Page tokens** могут не истекать, если страница активна

**Чтобы получить долгосрочный токен:**
1. В Graph API Explorer нажмите на иконку **"i"** рядом с токеном
2. Нажмите **"Open in Access Token Tool"**
3. Нажмите **"Extend Access Token"**
4. Скопируйте новый токен

### Лимиты Facebook API
- **200 запросов в час** на пользователя
- **600 запросов в час** на приложение
- Для вашего случая (несколько постов в день) этого более чем достаточно

### Безопасность
- ⚠️ **Никогда не коммитьте токены в Git!**
- ✅ Храните токены только в `.env` (файл в `.gitignore`)
- ✅ На Vercel и GitHub используйте секреты/переменные окружения

---

## 🐛 Решение проблем

### Ошибка: "Invalid OAuth access token"
- Токен истёк → получите новый долгосрочный токен
- Используете User Token вместо Page Token → переключитесь на страницу в Graph API Explorer

### Ошибка: "Permissions error"
- Не хватает разрешений → добавьте `pages_manage_posts` в Graph API Explorer

### Ошибка: "Page ID not found"
- Неверный Page ID → проверьте ID через Graph API Explorer

### Пост не появляется на странице
- Проверьте, что используете **Page Access Token**, а не User Token
- Убедитесь, что у вас есть права администратора страницы

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи в консоли
2. Проверьте токены в `.env`
3. Проверьте разрешения в Graph API Explorer
4. Проверьте статус приложения в Facebook Developers

---

## ✅ Чеклист настройки

- [ ] Создано Facebook App
- [ ] Добавлен Facebook Login
- [ ] Настроены OAuth Redirect URIs
- [ ] Получен Page Access Token
- [ ] Получен Page ID
- [ ] Токены добавлены в `.env`
- [ ] Токены добавлены на Vercel
- [ ] Протестирована публикация локально
- [ ] Пост появился на Facebook
- [ ] (Опционально) Настроена автоматизация через GitHub Actions

---

**Готово! Теперь вы можете публиковать контент на Facebook одной командой! 🚀**
