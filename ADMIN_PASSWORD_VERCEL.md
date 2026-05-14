# Настройка пароля админ-панели через Vercel

Теперь пароль можно задавать через Environment Variables на Vercel! Не нужно менять код.

---

## 🔐 Шаг 1: Сгенерируйте хеш пароля

```bash
npm run password:generate
```

**Введите ваш пароль**, например: `MySecurePass2026!`

Скрипт выдаст SHA-256 хеш:
```
Введите новый пароль: MySecurePass2026!

✅ SHA-256 хеш сгенерирован:
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

📋 Скопируйте этот хеш и добавьте в Vercel Environment Variables
```

**Скопируйте хеш!**

---

## ☁️ Шаг 2: Добавьте в Vercel

1. Откройте https://vercel.com
2. Выберите ваш проект **OK-STUDIO**
3. Settings → Environment Variables
4. Нажмите **Add New**

**Добавьте переменную:**
```
Name:  VITE_ADMIN_PASSWORD_HASH
Value: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

5. Выберите **All Environments** (Production, Preview, Development)
6. Нажмите **Save**

---

## 🔄 Шаг 3: Redeploy

После добавления переменной:

1. Deployments → ... (три точки) → **Redeploy**
2. Подождите 1-2 минуты

Готово! Теперь новый пароль активен.

---

## 🎯 Как войти в админ-панель

1. Откройте ваш сайт
2. Перейдите на `/admin`
3. Введите **ваш новый пароль** (не хеш!)
4. Введите GitHub Token

---

## 🔒 Текущий пароль (по умолчанию)

Если вы **НЕ** добавили `VITE_ADMIN_PASSWORD_HASH` в Vercel:

**Пароль:** `password`  
**Хеш:** `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8`

⚠️ **ОБЯЗАТЕЛЬНО измените для продакшена!**

---

## 💡 Преимущества этого подхода

✅ **Не нужно менять код** - пароль в Environment Variables  
✅ **Безопасно** - хеш не хранится в Git  
✅ **Легко изменить** - просто обновите переменную на Vercel  
✅ **Разные пароли** - можно задать разные для Production/Preview  

---

## 🔄 Как изменить пароль

1. Сгенерируйте новый хеш: `npm run password:generate`
2. Vercel → Settings → Environment Variables
3. Найдите `VITE_ADMIN_PASSWORD_HASH`
4. Нажмите **Edit** → вставьте новый хеш → **Save**
5. Redeploy

---

## 📝 Полный список Environment Variables для Vercel

```
# GitHub (для админ-панели)
VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_REPO=Tor2024/OK-STUDIO
VITE_GITHUB_BRANCH=main

# Пароль админ-панели (SHA-256 хеш)
VITE_ADMIN_PASSWORD_HASH=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=hello@webstudio-ok.de

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

---

## 🛡️ Безопасность

### Что хранится где:

**В Git (публично):**
- ❌ Пароль
- ❌ Хеш пароля
- ✅ Только код

**В Vercel (зашифровано):**
- ✅ Хеш пароля
- ✅ GitHub Token
- ✅ API ключи

**В вашей голове:**
- ✅ Сам пароль (например: `MySecurePass2026!`)

---

## 🧪 Проверка

После настройки:

1. Откройте `/admin`
2. Введите ваш пароль
3. Должно пустить в админ-панель

Если не работает:
- Проверьте что Redeploy завершен
- Проверьте что хеш правильный
- Проверьте консоль браузера (F12)

---

## 💪 Рекомендации для пароля

✅ Минимум 12 символов  
✅ Буквы (A-Z, a-z)  
✅ Цифры (0-9)  
✅ Спецсимволы (!@#$%^&*)  

**Примеры хороших паролей:**
- `OKstudio2026!Secure`
- `Kreuztal#WebDesign99`
- `Admin@Studio!2026`

**Плохие пароли:**
- ❌ `password`
- ❌ `123456`
- ❌ `admin`

---

**Готово! Теперь пароль настраивается через Vercel без изменения кода.**
