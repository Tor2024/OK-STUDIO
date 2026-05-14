# Руководство по Форматированию Текста — Admin Panel

**Где можно использовать форматирование?**

---

## ✅ MARKDOWN ПОДДЕРЖИВАЕТСЯ

### 1. **PORTFOLIO → Volltext**

**Где:** Admin Panel → Tab "PORTFOLIO" → Поле "Volltext (Markdown)"

**Что можно:**
```markdown
## Überschrift 2
### Überschrift 3

**Fetter Text**
*Kursiver Text*

- Listenpunkt 1
- Listenpunkt 2

> Blockzitat

[Link Text](https://example.com)
```

**Подсказка:** Под полем всегда видна справка по Markdown

---

### 2. **JOURNAL → Inhalt**

**Где:** Admin Panel → Tab "JOURNAL" → Поле "Inhalt (Markdown)"

**Что можно:**
- Все то же самое, что в Portfolio
- **ПЛЮС:** Кнопка "VORSCHAU" для предпросмотра
- **ПЛЮС:** Кнопка "MARKDOWN HILFE" для полной справки

**Особенности:**
- Переключайтесь между "EDITOR" и "VORSCHAU"
- Видите результат в реальном времени
- Полная справка по клику

---

## ❌ MARKDOWN НЕ ПОДДЕРЖИВАЕТСЯ

### 3. **FAQ → Antwort**

**Где:** Admin Panel → Tab "FAQ" → Поле "Antwort"

**Что можно:**
- Только обычный текст
- Без форматирования
- Без Markdown

**Подсказка:** Под полем написано "Keine Markdown-Formatierung"

**Почему?**
FAQ ответы отображаются как простой текст для лучшей читаемости.

---

### 4. **Все остальные поля**

**Где:** Все остальные текстовые поля (Name, Kategorie, Kurzbeschreibung и т.д.)

**Что можно:**
- Только обычный текст
- Без форматирования

---

## 📊 БЫСТРАЯ СПРАВКА

| Раздел | Поле | Markdown? | Подсказка |
|--------|------|-----------|-----------|
| Portfolio | Volltext | ✅ ДА | Под полем |
| Journal | Inhalt | ✅ ДА | Кнопка "HILFE" |
| FAQ | Antwort | ❌ НЕТ | Под полем |
| Все остальное | - | ❌ НЕТ | - |

---

## 🎯 ПРИМЕРЫ

### ✅ Правильно (Portfolio/Journal):

```markdown
## Projektbeschreibung

Das Projekt umfasste:
- Webdesign
- Backend-Entwicklung
- SEO-Optimierung

**Ergebnis:** 300% mehr Traffic

[Zur Website](https://example.com)
```

### ❌ Неправильно (FAQ):

```
**Frage:** Wie lange dauert...?
## Antwort
- Punkt 1
- Punkt 2
```

**Почему неправильно?**  
В FAQ Markdown не работает, весь текст отобразится как есть (со звездочками и решетками).

### ✅ Правильно (FAQ):

```
Frage: Wie lange dauert ein Projekt?

Antwort: Ein Standard-Relaunch dauert bei uns 4-8 Wochen. 
Komplexere Systeme können 10-16 Wochen in Anspruch nehmen.
```

---

## 💡 СОВЕТЫ

### Для Portfolio/Journal (Markdown):

1. **Используйте заголовки** для структуры
   ```markdown
   ## Hauptüberschrift
   ### Unterüberschrift
   ```

2. **Выделяйте важное** жирным
   ```markdown
   **Wichtig:** Das ist wichtig!
   ```

3. **Списки** для перечислений
   ```markdown
   - Punkt 1
   - Punkt 2
   - Punkt 3
   ```

4. **Ссылки** для внешних ресурсов
   ```markdown
   [Mehr erfahren](https://example.com)
   ```

### Для FAQ (Plain Text):

1. **Пишите просто** — без форматирования
2. **2-4 предложения** — кратко и понятно
3. **Конкретика** — отвечайте на вопрос прямо
4. **Без HTML/Markdown** — только текст

---

## 🔍 КАК ПРОВЕРИТЬ?

### Portfolio/Journal:
1. Написать текст с Markdown
2. Нажать "SPEICHERN & DEPLOYEN"
3. Открыть страницу проекта/статьи на сайте
4. Увидеть отформатированный текст

### Journal (быстрая проверка):
1. Написать текст с Markdown
2. Нажать кнопку "VORSCHAU"
3. Увидеть результат сразу
4. Вернуться в "EDITOR" для правок

### FAQ:
1. Написать обычный текст
2. Нажать "SPEICHERN & DEPLOYEN"
3. Открыть `/approach` на сайте
4. Увидеть текст как есть (без форматирования)

---

## ❓ ЧАСТЫЕ ВОПРОСЫ

### Q: Почему в FAQ нет Markdown?
**A:** FAQ ответы должны быть простыми и читаемыми. Markdown может усложнить восприятие.

### Q: Можно ли добавить Markdown в FAQ?
**A:** Технически да, но не рекомендуется. Если очень нужно — обратитесь к разработчику.

### Q: Где посмотреть полный список Markdown синтаксиса?
**A:** В Admin Panel → Tab "JOURNAL" → Кнопка "MARKDOWN HILFE"

### Q: Что делать, если Markdown не работает?
**A:** Проверьте:
1. Вы в правильном поле? (Portfolio/Journal)
2. Синтаксис правильный? (## для заголовка, ** для жирного)
3. Сохранили изменения? (SPEICHERN & DEPLOYEN)

---

## 🚀 ГОТОВО!

Теперь вы знаете:
- ✅ Где можно использовать Markdown
- ✅ Где нельзя использовать Markdown
- ✅ Как правильно форматировать текст
- ✅ Как проверить результат

**Удачи в работе с Admin Panel!** 🎉
