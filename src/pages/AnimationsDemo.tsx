/**
 * AnimationsDemo.tsx
 * Демонстрационная страница всех анимаций
 * Доступна по адресу: /animations-demo
 */

import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from '../components/animations';

export default function AnimationsDemo() {
  return (
    <div className="pb-24">
      {/* Заголовок */}
      <section className="p-12 border-b border-[#C5C5C5] bg-[#F1F3EA]">
        <FadeIn>
          <span className="telemetry-label mb-4 block">DEMO / ANIMATIONS</span>
          <h1 className="display-xl text-6xl mb-4">Scroll Animations</h1>
          <p className="body-md max-w-2xl">
            Демонстрация всех доступных анимаций при скролле. 
            Прокрутите страницу вниз, чтобы увидеть эффекты.
          </p>
        </FadeIn>
      </section>

      {/* FadeIn Demo */}
      <section className="p-12 border-b border-[#C5C5C5]">
        <h2 className="font-display text-3xl mb-8 uppercase">1. FadeIn Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <FadeIn direction="up">
            <div className="p-8 bg-[#616752] text-white">
              <h3 className="font-mono text-sm mb-2">UP</h3>
              <p className="text-xs opacity-80">Появляется снизу вверх</p>
            </div>
          </FadeIn>
          <FadeIn direction="down" delay={0.1}>
            <div className="p-8 bg-[#616752] text-white">
              <h3 className="font-mono text-sm mb-2">DOWN</h3>
              <p className="text-xs opacity-80">Появляется сверху вниз</p>
            </div>
          </FadeIn>
          <FadeIn direction="left" delay={0.2}>
            <div className="p-8 bg-[#616752] text-white">
              <h3 className="font-mono text-sm mb-2">LEFT</h3>
              <p className="text-xs opacity-80">Появляется справа налево</p>
            </div>
          </FadeIn>
          <FadeIn direction="right" delay={0.3}>
            <div className="p-8 bg-[#616752] text-white">
              <h3 className="font-mono text-sm mb-2">RIGHT</h3>
              <p className="text-xs opacity-80">Появляется слева направо</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SlideIn Demo */}
      <section className="p-12 border-b border-[#C5C5C5] bg-[#F1F3EA]">
        <h2 className="font-display text-3xl mb-8 uppercase">2. SlideIn Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SlideIn direction="left">
            <div className="p-12 bg-white border-2 border-[#141414]">
              <h3 className="font-display text-2xl mb-4">SLIDE LEFT</h3>
              <p className="text-sm">Въезжает слева с brutalist easing</p>
            </div>
          </SlideIn>
          <SlideIn direction="right" delay={0.2}>
            <div className="p-12 bg-white border-2 border-[#141414]">
              <h3 className="font-display text-2xl mb-4">SLIDE RIGHT</h3>
              <p className="text-sm">Въезжает справа с brutalist easing</p>
            </div>
          </SlideIn>
        </div>
      </section>

      {/* ScaleIn Demo */}
      <section className="p-12 border-b border-[#C5C5C5]">
        <h2 className="font-display text-3xl mb-8 uppercase">3. ScaleIn Animation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[0, 0.15, 0.3].map((delay, idx) => (
            <ScaleIn key={idx} delay={delay}>
              <div className="aspect-square bg-[#616752] flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="text-6xl font-display mb-2">{idx + 1}</div>
                  <div className="text-xs font-mono">DELAY: {delay}s</div>
                </div>
              </div>
            </ScaleIn>
          ))}
        </div>
      </section>

      {/* StaggerContainer Demo */}
      <section className="p-12 border-b border-[#C5C5C5] bg-[#F1F3EA]">
        <h2 className="font-display text-3xl mb-8 uppercase">4. Stagger Animation</h2>
        <StaggerContainer staggerDelay={0.1}>
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <StaggerItem key={idx}>
                <div className="p-6 bg-white border border-[#C5C5C5] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs opacity-50">ITEM_{String(idx + 1).padStart(2, '0')}</span>
                    <h3 className="font-display text-xl mt-1">Последовательное появление</h3>
                  </div>
                  <div className="w-12 h-12 bg-[#616752] flex items-center justify-center text-white font-mono">
                    {idx + 1}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </section>

      {/* Combined Demo */}
      <section className="p-12">
        <FadeIn>
          <h2 className="font-display text-3xl mb-8 uppercase">5. Combined Animations</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SlideIn direction="left">
            <div className="p-8 bg-[#141414] text-white">
              <StaggerContainer staggerDelay={0.1}>
                <StaggerItem>
                  <h3 className="font-display text-2xl mb-4">NESTED</h3>
                </StaggerItem>
                <StaggerItem>
                  <p className="mb-4">SlideIn + StaggerContainer</p>
                </StaggerItem>
                <StaggerItem>
                  <div className="border border-white/20 p-4 font-mono text-xs">
                    Комбинация анимаций для сложных эффектов
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </SlideIn>
          <ScaleIn delay={0.3}>
            <div className="p-8 bg-[#616752] text-white h-full flex flex-col justify-center">
              <h3 className="font-display text-2xl mb-4">SCALE + DELAY</h3>
              <p className="text-sm opacity-80">
                Появляется после левого блока с эффектом масштабирования
              </p>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* Info */}
      <section className="p-12 bg-[#F1F3EA] border-t border-[#C5C5C5]">
        <FadeIn>
          <div className="max-w-2xl">
            <span className="telemetry-label mb-4 block">DOCUMENTATION</span>
            <h2 className="font-display text-2xl mb-4">Как использовать</h2>
            <div className="space-y-4 font-mono text-xs bg-[#141414] text-[#00FF00] p-6">
              <div>import &#123; FadeIn, SlideIn, ScaleIn &#125; from '../components/animations';</div>
              <div className="opacity-50">// Пример использования:</div>
              <div>&lt;FadeIn direction="up" delay=&#123;0&#125;&gt;</div>
              <div className="pl-4">&lt;h1&gt;Заголовок&lt;/h1&gt;</div>
              <div>&lt;/FadeIn&gt;</div>
            </div>
            <p className="mt-6 text-sm opacity-70">
              Подробная документация: <code className="bg-white px-2 py-1">ANIMATIONS_GUIDE.md</code>
            </p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
