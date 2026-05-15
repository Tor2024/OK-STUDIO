# 📝 Facebook Auto-Post - Все команды

## 🧪 Тестирование

### Проверить подключение к Facebook API
```bash
npm run fb:test
```

Проверяет:
- Валидность токена
- Разрешения
- Доступ к странице
- API публикации

---

## 📰 Публикация статей

### Все статьи одной командой
```bash
# 1. Почему большинство сайтов не зарабатывают
npm run fb:post insight warum-die-meisten-websites-kein-geld-verdienen

# 2. ИИ в среднем бизнесе: где он действительно помогает
npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft

# 3. Брутальный веб-дизайн: почему меньше значит больше
npm run fb:post insight brutalist-webdesign-warum-weniger-mehr-ist

# 4. ИИ в немецком среднем бизнесе (длинная статья)
npm run fb:post insight kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet

# 5. Цифровой дизайн 2025: почему эстетики недостаточно
npm run fb:post insight digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft

# 6. Техническая эволюция: React 19 и будущее веб-разработки
npm run fb:post insight die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung
```

---

## 📁 Публикация проектов

### Все проекты одной командой
```bash
# 1. Kraftwerk Digital
npm run fb:post project kraftwerk-digital

# 2. Medizin Nord
npm run fb:post project medizin-nord

# 3. Logistik Pro
npm run fb:post project logistik-pro

# 4. Kreuztaler Werkstatt
npm run fb:post project kreuztaler-werkstatt
```

---

## 🔄 Массовая публикация

### Опубликовать все статьи (PowerShell)
```powershell
$articles = @(
  "warum-die-meisten-websites-kein-geld-verdienen",
  "ki-im-mittelstand-wo-sie-wirklich-hilft",
  "brutalist-webdesign-warum-weniger-mehr-ist",
  "kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet",
  "digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft",
  "die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung"
)

foreach ($article in $articles) {
  npm run fb:post insight $article
  Start-Sleep -Seconds 5
}
```

### Опубликовать все проекты (PowerShell)
```powershell
$projects = @(
  "kraftwerk-digital",
  "medizin-nord",
  "logistik-pro",
  "kreuztaler-werkstatt"
)

foreach ($project in $projects) {
  npm run fb:post project $project
  Start-Sleep -Seconds 5
}
```

### Опубликовать всё (PowerShell)
```powershell
# Сначала статьи
$articles = @(
  "warum-die-meisten-websites-kein-geld-verdienen",
  "ki-im-mittelstand-wo-sie-wirklich-hilft",
  "brutalist-webdesign-warum-weniger-mehr-ist",
  "kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet",
  "digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft",
  "die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung"
)

foreach ($article in $articles) {
  npm run fb:post insight $article
  Start-Sleep -Seconds 10
}

# Потом проекты
$projects = @(
  "kraftwerk-digital",
  "medizin-nord",
  "logistik-pro",
  "kreuztaler-werkstatt"
)

foreach ($project in $projects) {
  npm run fb:post project $project
  Start-Sleep -Seconds 10
}

Write-Host "✅ Все опубликовано!"
```

---

## 📊 Примеры вывода

### Успешная публикация
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

### Ошибка токена
```
❌ Ошибка: Не заданы FACEBOOK_ACCESS_TOKEN или FACEBOOK_PAGE_ID

Добавьте в .env файл:
FACEBOOK_ACCESS_TOKEN=ваш_токен
FACEBOOK_PAGE_ID=ваш_page_id
```

### Статья не найдена
```
❌ Статья не найдена: wrong-id
```

---

## 🎯 Быстрые команды

### Опубликовать последнюю статью
```bash
npm run fb:post insight die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung
```

### Опубликовать лучший проект
```bash
npm run fb:post project kraftwerk-digital
```

---

## ⚙️ Настройка

### Проверить .env
```bash
type .env | findstr FACEBOOK
```

Должно показать:
```
FACEBOOK_ACCESS_TOKEN=EAABsbCS1iHgBO7ZC8ZBfkQZBZCZCZC...
FACEBOOK_PAGE_ID=123456789012345
```

### Добавить токены
```bash
echo FACEBOOK_ACCESS_TOKEN=ваш_токен >> .env
echo FACEBOOK_PAGE_ID=ваш_page_id >> .env
```

---

## 📚 Справка

### Показать справку
```bash
npm run fb:post
```

Выведет:
```
╔═══════════════════════════════════════════════════╗
║       FACEBOOK AUTO-POSTING для OK STUDIO         ║
╚═══════════════════════════════════════════════════╝

Использование:
  npm run fb:post insight <id>
  npm run fb:post project <id>

Примеры:
  npm run fb:post insight ki-im-mittelstand-wo-sie-wirklich-hilft
  npm run fb:post project kraftwerk-digital

...
```

---

## 🔗 Полезные ссылки

- **Тест подключения:** `npm run fb:test`
- **Инструкция:** [FACEBOOK_START_HERE.md](FACEBOOK_START_HERE.md)
- **Быстрый старт:** [FACEBOOK_QUICKSTART.md](FACEBOOK_QUICKSTART.md)
- **Решение проблем:** [FACEBOOK_SETUP_GUIDE.md](FACEBOOK_SETUP_GUIDE.md)

---

**💡 Совет:** Сохраните этот файл в закладки для быстрого доступа к командам!
