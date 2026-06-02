import { animationDescriptions, AnimationType } from './HeroAnimations';

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

export default function HomepageEditor({ settings, onChange, onSave, saving }: HomepageEditorProps) {
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

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="border border-[#C5C5C5] p-6 bg-white">
        <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-3">
          <span className="w-8 h-8 bg-[#616752] text-white flex items-center justify-center font-mono text-sm">1</span>
          HERO BEREICH
        </h2>

        {/* Main Title */}
        <div className="space-y-6">
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <label className="telemetry-label block mb-2 font-bold">HAUPTTITEL</label>
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
                  {animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Sub Title */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <label className="telemetry-label block mb-2 font-bold">UNTERTITEL</label>
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
                  {animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4">
            <label className="telemetry-label block mb-2 font-bold">BESCHREIBUNG</label>
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
                  {animationDescriptions[opt]}
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
            <label className="telemetry-label block font-bold">BUTTON 1 (PRIMÄR)</label>
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
                  {animationDescriptions[opt]}
                </option>
              ))}
            </select>
          </div>

          {/* Button 2 */}
          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4 space-y-3">
            <label className="telemetry-label block font-bold">BUTTON 2 (SEKUNDÄR)</label>
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
                  {animationDescriptions[opt]}
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
          <label className="telemetry-label block font-bold">ZITAT TEXT</label>
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
                {animationDescriptions[opt]}
              </option>
            ))}
          </select>
          <div className="mt-3 p-3 bg-white border border-[#C5C5C5] font-mono text-[9px] text-[#616752]">
            <strong>💡 TIPP:</strong> "typewriter" und "glitch" funktionieren am besten mit Zitaten
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-8 py-4 bg-[#616752] text-white font-mono text-[11px] tracking-widest hover:bg-[#737A5E] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              SPEICHERN...
            </>
          ) : (
            <>
              ✓ ÄNDERUNGEN SPEICHERN
            </>
          )}
        </button>
      </div>

      {/* Preview Note */}
      <div className="border-2 border-blue-500 bg-blue-50 p-4">
        <p className="font-mono text-[10px] text-blue-700 flex items-center gap-2">
          <span className="text-xl">ℹ️</span>
          <span>
            <strong>HINWEIS:</strong> Nach dem Speichern besuchen Sie die Hauptseite, um die Änderungen zu sehen. 
            Die Animationen werden beim Laden der Seite abgespielt.
          </span>
        </p>
      </div>
    </div>
  );
}
