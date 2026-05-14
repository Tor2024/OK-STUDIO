/**
 * Генератор хеша пароля для админ-панели
 * 
 * Использование:
 * npx tsx generate-password-hash.ts <ваш-пароль>
 */

import { createHash } from 'crypto';

function generatePasswordHash(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
╔═══════════════════════════════════════════════════╗
║       ГЕНЕРАТОР ХЕША ПАРОЛЯ                       ║
╚═══════════════════════════════════════════════════╝

Использование:
  npx tsx generate-password-hash.ts <ваш-пароль>

Пример:
  npx tsx generate-password-hash.ts mySecurePassword123

Затем:
  1. Скопируй сгенерированный хеш
  2. Открой src/pages/Admin.tsx
  3. Найди строку: const ADMIN_PASSWORD_HASH = '...'
  4. Замени хеш на свой

⚠️  ВАЖНО:
  - Используй сильный пароль (минимум 12 символов)
  - Не используй простые пароли типа "password" или "123456"
  - Храни пароль в безопасном месте
  - Не коммить пароль в Git

Текущий пароль по умолчанию: "password"
(ОБЯЗАТЕЛЬНО ИЗМЕНИ ЕГО!)
  `);
  process.exit(0);
}

const password = args[0];

if (password.length < 8) {
  console.error('❌ Пароль слишком короткий! Минимум 8 символов.');
  process.exit(1);
}

const hash = generatePasswordHash(password);

console.log('\n✅ Хеш успешно сгенерирован!\n');
console.log('═'.repeat(60));
console.log('Пароль:', password);
console.log('Хеш:   ', hash);
console.log('═'.repeat(60));
console.log('\n📋 Инструкция:');
console.log('1. Скопируй хеш выше');
console.log('2. Открой: src/pages/Admin.tsx');
console.log('3. Найди: const ADMIN_PASSWORD_HASH = \'...\'');
console.log('4. Замени на: const ADMIN_PASSWORD_HASH = \'' + hash + '\';');
console.log('\n⚠️  НЕ ЗАБУДЬ СОХРАНИТЬ ПАРОЛЬ В БЕЗОПАСНОМ МЕСТЕ!\n');
