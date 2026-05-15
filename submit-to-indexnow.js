/**
 * Одноразовая отправка всех URL в IndexNow
 */

const INDEXNOW_KEY = '4434f77f70e8d53b46114b675ea5783c';
const SITE_URL = 'https://ok-studio-umber.vercel.app';

const urls = [
  '/',
  '/work',
  '/insights',
  '/capabilities',
  '/approach',
  '/contact',
  '/impressum',
  '/privacy',
  '/work/kraftwerk-digital',
  '/work/medizin-nord',
  '/work/logistik-pro',
  '/work/kreuztaler-werkstatt',
  '/insights/warum-die-meisten-websites-kein-geld-verdienen',
  '/insights/ki-im-mittelstand-wo-sie-wirklich-hilft',
  '/insights/brutalist-webdesign-warum-weniger-mehr-ist',
  '/insights/kuenstliche-intelligenz-im-deutschen-mittelstand-von-der-vision-zur-wertschoepfenden-realitaet',
  '/insights/digitales-design-2025-warum-aesthetik-allein-nicht-mehr-verkauft',
  '/insights/die-technische-evolution-react-19-und-die-zukunft-der-webentwicklung',
];

const fullUrls = urls.map(url => `${SITE_URL}${url}`);

console.log('🚀 Отправка в IndexNow...');
console.log(`📊 Всего URL: ${fullUrls.length}`);
console.log('');

fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    host: SITE_URL.replace('https://', ''),
    key: INDEXNOW_KEY,
    urlList: fullUrls,
  }),
})
  .then(response => {
    if (response.ok || response.status === 202) {
      console.log('✅ Успешно отправлено в IndexNow!');
      console.log('');
      console.log('📋 Отправленные URL:');
      fullUrls.forEach(url => console.log(`   - ${url}`));
      console.log('');
      console.log('⏰ Поисковики получат уведомление в течение нескольких минут');
      console.log('🔍 Индексация начнётся в течение нескольких часов');
    } else {
      return response.text().then(text => {
        console.error('❌ Ошибка IndexNow:', text);
      });
    }
  })
  .catch(error => {
    console.error('❌ Ошибка сети:', error);
  });
