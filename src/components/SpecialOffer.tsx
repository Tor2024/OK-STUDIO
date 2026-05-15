import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SpecialOfferData {
  enabled: boolean;
  title: string;
  message: string;
  buttonText: string;
  buttonLink: string;
  validUntil?: string;
}

export default function SpecialOffer() {
  const [offer, setOffer] = useState<SpecialOfferData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Проверяем, не закрыл ли пользователь предложение ранее
    const dismissed = sessionStorage.getItem('special-offer-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Загружаем данные о специальном предложении
    fetch('/data/special-offer.json?t=' + Date.now())
      .then(res => res.json())
      .then((data: SpecialOfferData) => {
        if (data.enabled) {
          setOffer(data);
          // Показываем с небольшой задержкой для эффекта
          setTimeout(() => setIsVisible(true), 2000);
        }
      })
      .catch(err => console.error('Failed to load special offer:', err));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      sessionStorage.setItem('special-offer-dismissed', 'true');
      setIsDismissed(true);
    }, 300);
  };

  if (!offer || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed top-0 left-0 right-0 z-50 shadow-2xl"
        >
          <div className="bg-[#616752] border-b-4 border-[#141414]">
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-5">
              <div className="flex items-center justify-between gap-4">
                {/* Icon + Content */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Icon */}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.6, delay: 0.3, repeat: Infinity, repeatDelay: 3 }}
                    className="shrink-0 bg-[#F1F3EA] p-2 md:p-3"
                  >
                    <Sparkles size={20} className="text-[#616752] md:w-6 md:h-6" />
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-black text-sm md:text-lg uppercase text-[#F1F3EA] mb-1 tracking-tight">
                      {offer.title}
                    </h3>
                    <p className="font-serif text-xs md:text-sm text-[#F1F3EA]/90 leading-snug line-clamp-2">
                      {offer.message}
                    </p>
                    {offer.validUntil && (
                      <p className="font-mono text-[9px] md:text-[10px] text-[#F1F3EA]/70 mt-1 uppercase tracking-wider">
                        Gültig bis {offer.validUntil}
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA + Close */}
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <Link
                    to={offer.buttonLink}
                    onClick={handleClose}
                    className="bg-[#F1F3EA] text-[#616752] px-4 md:px-6 py-2 md:py-3 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase hover:bg-white transition-all shadow-lg whitespace-nowrap"
                  >
                    {offer.buttonText}
                  </Link>
                  
                  <button
                    onClick={handleClose}
                    className="bg-[#141414] text-[#F1F3EA] p-2 hover:bg-black transition-colors"
                    aria-label="Schließen"
                  >
                    <X size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
