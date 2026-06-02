import { useState } from 'react';
import { animationDescriptions, AnimationType } from './HeroAnimations';
import { Sparkles, Loader2 } from 'lucide-react';

interface HomepageSettings {
  hero: {
    mainTitle: string;
    mainTitleAnimation: AnimationType;
    subTitle: string;
    subTitleAnimation: AnimationType;
    description: string;
    descriptionAnimation: AnimationType;
    button1Text: string;
    button1Link: string;
    button1Animation: AnimationType;
    button2Text: string;
    button2Link: string;
    button2Animation: AnimationType;
  };
  quote: {
    text: string;
    animation: AnimationType;
  };
}

interface HomepageEditorProps {
  settings: HomepageSettings;
  onChange: (settings: HomepageSettings) => void;
  onSave: () => void;
  saving?: boolean;
}

// AI улучшение текста
async function improveText(text: string, type: 'title' | 'subtitle' | 'description' | 'quote' | 'button'): Promise<string> {
  const prompts = {
    title: `Улучши этот заголовок для веб-студии, сделай его более цепляющим и профессиональным. Заголовок должен быть коротким (1-2 слова), мощным и запоминающимся. Отвечай ТОЛЬКО улучшенным текстом без объяснений. Текст: "${text}"`,
    subtitle: `Улучши этот подзаголовок для веб-студии. Он должен дополнять главный заголовок, быть кратким (2-5 слов) и описывать целевую аудиторию или результат. Отвечай ТОЛЬКО улучшенным текстом без объяснений. Текст: "${text}"`,
    description: `Улучши это описание для веб-студии. Текст должен быть убедительным, профессиональным, подчеркивать уникальность и конкретные преимущества. Максимум 2-3 предложения. Отвечай ТОЛЬКО улучшенным текстом без объяснений. Текст: "${text}"`,
    quote: `Создай вдохновляющую цитату для веб-студии на основе этой идеи. Цитата должна быть короткой, философской и запоминающейся (10-15 слов). Отвечай ТОЛЬКО цитатой без кавычек и объяснений. Идея: "${text}"`,
    button: `Улучши текст для кнопки призыва к действию. Текст должен быть коротким (1-2 слова), активным и мотивирующим на клик. Используй заглавные буквы. Отвечай ТОЛЬКО улучшенным текстом без объяснений. Текст: "${text}"`
  };

  try {
    const response = await fetch('/api/format-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: prompts[type],
        type: 'homepage'
      })
    });

    if (!response.ok) throw new Error('AI unavailable');
    
    const data = await response.json();
    return data.formatted || text;
  } catch (error) {
    console.error('AI improvement error:', error);
    return text;
  }
}

// Рекомендации по анимациям
const animationRecommendations = {
  mainTitle: ['scaleBounce', 'fadeSlideUp', 'rotateIn'],
  subTitle: ['fadeSlideRight', 'fadeSlideLeft', 'scaleIn'],
  description: ['fadeIn', 'fadeSlideUp'],
  buttons: ['scaleIn', 'scaleBounce', 'elastic'],
  quote: ['typewriter', 'glitch', 'fadeIn']
};

export default function HomepageEditor({ settings, onChange, onSave, saving }: HomepageEditorProps) {
  const [improving, setImproving] = useState<string | null>(null);

  const animationOptions: AnimationType[] = [
    'fadeIn',
    'fadeSlideUp',
    'fadeSlideDown',
    'fadeSlideLeft',
    'fadeSlideRight',
    'scaleIn',
    'scaleBounce',
    'rotateIn',
    'elastic',
    'wave',
    'typewriter',
    'glitch',
    'none'
  ];

  const handleImprove = async (field: string, type: 'title' | 'subtitle' | 'description' | 'quote' | 'button') => {
    setImproving(field);
    
    let currentText = '';
    if (field === 'mainTitle') currentText = settings.hero.mainTitle;
    else if (field === 'subTitle') currentText = settings.hero.subTitle;
    else if (field === 'description') currentText = settings.hero.description;
    else if (field === 'quote') currentText = settings.quote.text;
    else if (field === 'button1Text') currentText = settings.hero.button1Text;
    else if (field === 'button2Text') currentText = settings.hero.button2Text;

    const improved = await improveText(currentText || 'Создай креативный текст', type);
    
    if (field === 'mainTitle') {
      onChange({ ...settings, hero: { ...settings.hero, mainTitle: improved } });
    } else if (field === 'subTitle') {
      onChange({ ...settings, hero: { ...settings.hero, subTitle: improved } });
    } else if (field === 'description') {
      onChange({ ...settings, hero: { ...settings.hero, description: improved } });
    } else if (field === 'quote') {
      onChange({ ...settings, quote: { ...settings.quote, text: improved } });
    } else if (field === 'button1Text') {
      onChange({ ...settings, hero: { ...settings.hero, button1Text: improved } });
    } else if (field === 'button2Text') {
      onChange({ ...settings, hero: { ...settings.hero, button2Text: improved } });
    }
    
    setImproving(null);
  };

  const isRecommended = (field: keyof typeof animationRecommendations, animation: AnimationType) => {
    return animationRecommendations[field]?.includes(animation);
  };

  return (
    <div className="space-y-8">
      {/* Intro Box with Recommendations */}
      <div className="border-2 border-[#616752] bg-gradient-to-br from-[#F1F3EA] to-white p-6">
        <h3 className="font-display font-black text-lg uppercase mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-[#616752]" />
          EMPFEHLUNGEN FÜR BESTE WIRKUNG
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[10px]">
          <div className="bg-white border border-[#C5C5C5] p-3">
            <strong className="block mb-2 text-[#616752]">📝 TEXTE:</strong>
            <ul className="space-y-1 opacity-70">
              <li>• Haupttitel: 1-2 Wörter, kraftvoll</li>
              <li>• Untertitel: 2-5 Wörter, Zielgruppe</li>
              <li>• Beschreibung: 2-3 Sätze, konkret</li>
              <li>• Buttons: 1-2 Wörter, GROSSBUCHSTABEN</li>
              <li>• Zitat: 10-15 Wörter, inspirierend</li>
            </ul>
          </div>
          <div className="bg-white border border-[#C5C5C5] p-3">
            <strong className="block mb-2 text-[#616752]">✨ ANIMATIONEN:</strong>
            <ul className="space-y-1 opacity-70">
              <li>• Titel: scaleBounce, fadeSlideUp</li>
              <li>• Untertitel: fadeSlideRight/Left</li>
              <li>• Beschreibung: fadeIn</li>
              <li>• Buttons: scaleIn, elastic</li>
              <li>• Zitat: typewriter (🔥), glitch</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-200 p-3 font-mono text-[9px] text-blue-700">
          <strong>💡 AI-TIPP:</strong> Nutze die Sparkles-Buttons (✨) für automatische Textoptimierung durch KI!
        </div>
      </div>

      {/* Hero Section */}
      <div className="border border-[#C5C5C5] p-6 bg-white">
        <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#616752] text-white flex items-center justify-center font-mono text-sm">1</span>
          HERO BEREICH
        </h2>

        {/* Main Title */}
        <div className="space-y-6">
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="telemetry-label font-bold">HAUPTTITEL</label>
              <button
                onClick={() => handleImprove('mainTitle', 'title')}
                disabled={improving === 'mainTitle'}
                className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {improving === 'mainTitle' ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    KI VERBESSERN
                  </>
                )}
              </button>
            </div>
            <input
              className="admin-input mb-3"
              placeholder="z.B. Digitaler"
              value={settings.hero.mainTitle}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, mainTitle: e.target.value }
              })}
            />
            <label className="telemetry-label block mb-2 text-[9px]">ANIMATION</label>
            <select
              className="admin-input"
              value={settings.hero.mainTitleAnimation}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, mainTitleAnimation: e.target.value as AnimationType }
              })}
            >
              {animationOptions.map(opt => (
                <option key={opt} value={opt}>
                  {isRecommended('mainTitle', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Title */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="telemetry-label font-bold">UNTERTITEL</label>
              <button
                onClick={() => handleImprove('subTitle', 'subtitle')}
                disabled={improving === 'subTitle'}
                className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {improving === 'subTitle' ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    KI VERBESSERN
                  </>
                )}
              </button>
            </div>
            <input
              className="admin-input mb-3"
              placeholder="z.B. Erfolg für KMU"
              value={settings.hero.subTitle}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, subTitle: e.target.value }
              })}
            />
            <label className="telemetry-label block mb-2 text-[9px]">ANIMATION</label>
            <select
              className="admin-input"
              value={settings.hero.subTitleAnimation}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, subTitleAnimation: e.target.value as AnimationType }
              })}
            >
              {animationOptions.map(opt => (
                <option key={opt} value={opt}>
                  {isRecommended('subTitle', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="telemetry-label font-bold">BESCHREIBUNG</label>
              <button
                onClick={() => handleImprove('description', 'description')}
                disabled={improving === 'description'}
                className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {improving === 'description' ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    KI VERBESSERN
                  </>
                )}
              </button>
            </div>
            <textarea
              className="admin-input mb-3"
              placeholder="Beschreibungstext..."
              value={settings.hero.description}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, description: e.target.value }
              })}
              rows={3}
            />
            <label className="telemetry-label block mb-2 text-[9px]">ANIMATION</label>
            <select
              className="admin-input"
              value={settings.hero.descriptionAnimation}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, descriptionAnimation: e.target.value as AnimationType }
              })}
            >
              {animationOptions.map(opt => (
                <option key={opt} value={opt}>
                  {isRecommended('description', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="border border-[#C5C5C5] p-6 bg-white">
        <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#616752] text-white flex items-center justify-center font-mono text-sm">2</span>
          BUTTONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Button 1 */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="telemetry-label font-bold">BUTTON 1 (PRIMÄR)</label>
              <button
                onClick={() => handleImprove('button1Text', 'button')}
                disabled={improving === 'button1Text'}
                className="px-2 py-1 bg-purple-500 text-white font-mono text-[8px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {improving === 'button1Text' ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    AI
                  </>
                ) : (
                  <>
                    <Sparkles size={10} />
                    KI
                  </>
                )}
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Button Text"
              value={settings.hero.button1Text}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button1Text: e.target.value }
              })}
            />
            <input
              className="admin-input"
              placeholder="Link (z.B. /work)"
              value={settings.hero.button1Link}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button1Link: e.target.value }
              })}
            />
            <label className="telemetry-label block text-[9px]">ANIMATION</label>
            <select
              className="admin-input"
              value={settings.hero.button1Animation}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button1Animation: e.target.value as AnimationType }
              })}
            >
              {animationOptions.map(opt => (
                <option key={opt} value={opt}>
                  {isRecommended('buttons', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Button 2 */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="telemetry-label font-bold">BUTTON 2 (SEKUNDÄR)</label>
              <button
                onClick={() => handleImprove('button2Text', 'button')}
                disabled={improving === 'button2Text'}
                className="px-2 py-1 bg-purple-500 text-white font-mono text-[8px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
              >
                {improving === 'button2Text' ? (
                  <>
                    <Loader2 size={10} className="animate-spin" />
                    AI
                  </>
                ) : (
                  <>
                    <Sparkles size={10} />
                    KI
                  </>
                )}
              </button>
            </div>
            <input
              className="admin-input"
              placeholder="Button Text"
              value={settings.hero.button2Text}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button2Text: e.target.value }
              })}
            />
            <input
              className="admin-input"
              placeholder="Link (z.B. /contact)"
              value={settings.hero.button2Link}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button2Link: e.target.value }
              })}
            />
            <label className="telemetry-label block text-[9px]">ANIMATION</label>
            <select
              className="admin-input"
              value={settings.hero.button2Animation}
              onChange={e => onChange({
                ...settings,
                hero: { ...settings.hero, button2Animation: e.target.value as AnimationType }
              })}
            >
              {animationOptions.map(opt => (
                <option key={opt} value={opt}>
                  {isRecommended('buttons', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="border border-[#C5C5C5] p-6 bg-white">
        <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#616752] text-white flex items-center justify-center font-mono text-sm">3</span>
          ZITAT
        </h2>

        <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="telemetry-label font-bold">ZITAT TEXT</label>
            <button
              onClick={() => handleImprove('quote', 'quote')}
              disabled={improving === 'quote'}
              className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              {improving === 'quote' ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  AI...
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  KI VERBESSERN
                </>
              )}
            </button>
          </div>
          <textarea
            className="admin-input"
            placeholder="Ihr Slogan oder Zitat..."
            value={settings.quote.text}
            onChange={e => onChange({
              ...settings,
              quote: { ...settings.quote, text: e.target.value }
            })}
            rows={2}
          />
          <label className="telemetry-label block text-[9px]">ANIMATION</label>
          <select
            className="admin-input"
            value={settings.quote.animation}
            onChange={e => onChange({
              ...settings,
              quote: { ...settings.quote, animation: e.target.value as AnimationType }
            })}
          >
            {animationOptions.map(opt => (
              <option key={opt} value={opt}>
                {isRecommended('quote', opt) ? '⭐ ' : ''}{animationDescriptions[opt]}
              </option>
            ))}
          </select>
          <div className="mt-3 p-3 bg-white border border-[#C5C5C5] font-mono text-[9px] text-[#616752]">
            <strong>💡 EMPFEHLUNG:</strong> "typewriter" (🔥 sehr effektiv!) und "glitch" (modern) funktionieren am besten mit Zitaten
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-8 py-4 bg-[#616752] text-white font-mono text-[11px] tracking-widest hover:bg-[#737A5E] disabled:opacity-50 transition-colors flex items-center gap-2 shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              SPEICHERN...
            </>
          ) : (
            <>
              ✓ ÄNDERUNGEN SPEICHERN & LIVE SCHALTEN
            </>
          )}
        </button>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border-2 border-green-500 bg-green-50 p-4">
          <p className="font-mono text-[10px] text-green-700 flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>
              <strong>AUTO-FORMATIERUNG:</strong> KI optimiert automatisch Groß-/Kleinschreibung, Länge und Struktur für beste Lesbarkeit im Design.
            </span>
          </p>
        </div>
        <div className="border-2 border-orange-500 bg-orange-50 p-4">
          <p className="font-mono text-[10px] text-orange-700 flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span>
              <strong>RESPONSIV:</strong> Alle Animationen und Texte passen sich automatisch an Smartphone, Tablet und Desktop an.
            </span>
          </p>
        </div>
      </div>

      {/* Preview Note */}
      <div className="border-2 border-blue-500 bg-blue-50 p-4">
        <p className="font-mono text-[10px] text-blue-700">
          <strong className="block mb-2 text-[11px]">ℹ️ SO FUNKTIONIERT'S:</strong>
          <span className="block mb-1">1. Texte eingeben oder mit KI-Button verbessern lassen (✨)</span>
          <span className="block mb-1">2. Animationen aus Dropdown wählen (⭐ = empfohlen)</span>
          <span className="block mb-1">3. "ÄNDERUNGEN SPEICHERN" klicken</span>
          <span className="block mb-1">4. Hauptseite neu laden - Animationen starten automatisch!</span>
          <span className="block mt-2 text-purple-600">💡 Tipp: Kombiniere verschiedene Animationen für dynamischen Effekt</span>
        </p>
      </div>
    </div>
  );
}
