# Настройка формы контактов

Форма контактов отправляет уведомления в **Telegram** и на **Email**.

---

## 📧 1. Настройка Email (Resend)

### Шаг 1: Регистрация на Resend
1. Зайдите на https://resend.com
2. Sign Up (бесплатно: 100 писем/день, 3000/месяц)
3. Подтвердите email

### Шаг 2: Получение API ключа
1. Dashboard → API Keys
2. Create API Key
3. Скопируйте ключ (начинается с `re_`)

### Шаг 3: Добавление домена (опционально)
Для отправки с вашего домена:
1. Dashboard → Domains → Add Domain
2. Введите `webstudio-ok.de`
3. Добавьте DNS записи (SPF, DKIM, DMARC)
4. Verify Domain

Без домена письма будут отправляться с `onboarding@resend.dev`

### Шаг 4: Добавление в .env
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=hello@webstudio-ok.de
```

---

## 💬 2. Настройка Telegram

### Шаг 1: Создание бота
1. Откройте Telegram
2. Найдите @BotFather
3. Отправьте `/newbot`
4. Введите имя бота: `OK Studio Notifications`
5. Введите username: `okstudio_notify_bot` (должен заканчиваться на `_bot`)
6. Скопируйте **Bot Token** (например: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Шаг 2: Получение Chat ID
**Вариант A: Личный чат**
1. Найдите вашего бота в Telegram
2. Нажмите Start
3. Отправьте любое сообщение
4. Откройте в браузере:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
5. Найдите `"chat":{"id":123456789}` - это ваш Chat ID

**Вариант B: Группа/канал**
1. Создайте группу в Telegram
2. Добавьте бота в группу (как администратора)
3. Отправьте сообщение в группу
4. Откройте:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
5. Chat ID будет отрицательным (например: `-987654321`)

### Шаг 3: Добавление в .env
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

---

## 🚀 3. Деплой на Vercel

### Шаг 1: Подключение репозитория
1. Зайдите на https://vercel.com
2. New Project → Import Git Repository
3. Выберите `Tor2024/OK-STUDIO`

### Шаг 2: Настройка проекта
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Шаг 3: Добавление Environment Variables
Settings → Environment Variables → Add:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=hello@webstudio-ok.de
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### Шаг 4: Deploy
Нажмите Deploy → подождите 2-3 минуты

---

## ✅ 4. Тестирование

### Локально (без деплоя)
```bash
# Установите Vercel CLI
npm install -g vercel

# Запустите локально
vercel dev
```

Откройте http://localhost:3000/contact и отправьте тестовую форму.

### На продакшене
1. Откройте ваш сайт
2. Перейдите на страницу Kontakt
3. Заполните форму
4. Отправьте

Проверьте:
- ✅ Telegram: должно прийти сообщение боту
- ✅ Email: должно прийти письмо на CONTACT_EMAIL

---

## 🔧 Что отправляется

### Telegram сообщение:
```
🔔 Neue Kontaktanfrage

👤 Name: Max Mustermann
📧 Email: max@example.com
📋 Betreff: Projekt Anfrage

💼 Projekttyp: Web-Design
💰 Budget: Tier 2 (5k-15k)
📅 Startdatum: März 2025

💬 Nachricht:
Ich interessiere mich für einen Website-Relaunch...

⏰ Zeitstempel: 14.05.2026, 15:30:45
```

### Email:
Красиво оформленное HTML письмо с:
- Заголовком "Neue Kontaktanfrage"
- Всеми полями формы
- Зеленым дизайном (#616752)
- Reply-To на email клиента

---

## 🛠️ Troubleshooting

### Форма не отправляется
1. Проверьте консоль браузера (F12)
2. Проверьте что API endpoint доступен: `/api/notify`
3. Проверьте Environment Variables на Vercel

### Telegram не получает сообщения
1. Проверьте Bot Token: https://api.telegram.org/bot<TOKEN>/getMe
2. Проверьте Chat ID правильный
3. Убедитесь что бот не заблокирован

### Email не приходит
1. Проверьте Resend Dashboard → Logs
2. Проверьте спам папку
3. Проверьте что домен верифицирован (если используете свой)

---

## 💰 Стоимость

### Resend (Email)
- **Free**: 100 писем/день, 3000/месяц
- **Pro**: $20/месяц - 50,000 писем

### Telegram
- **Бесплатно** навсегда

### Vercel (хостинг)
- **Hobby**: Бесплатно (достаточно для малого бизнеса)
- **Pro**: $20/месяц (если нужно больше)

---

**Готово!** Теперь каждая заявка с сайта будет приходить вам в Telegram и на Email.
