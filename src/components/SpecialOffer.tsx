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
          setTimeout(() => setIsVisible(true), 1500);
        }
      })
      .catch(err => console.error('Failed to load special offer:', err));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('special-offer-dismissed', 'true');
    setIsDismissed(true);
  };

  if (!offer || isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Offer Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg"
          >
            <div className="relative bg-[#F1F3EA] border-4 border-[#616752] shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 bg-[#616752] text-white p-2 hover:bg-[#141414] transition-colors z-10 border-2 border-white shadow-lg"
                aria-label="Schließen"
              >
                <X size={20} />
              </button>

              {/* Decorative Corner */}
              <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-[#616752]" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-[#616752]" />

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 10, 0] }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-[#616752] p-4 inline-block"
                  >
                    <Sparkles size={32} className="text-[#F1F3EA]" />
                  </motion.div>
                </div>

                {/* Title */}
                <h2 className="font-display font-black text-2xl md:text-3xl uppercase text-center mb-4 tracking-tight text-[#141414]">
                  {offer.title}
                </h2>

                {/* Message */}
                <p className="font-serif text-base md:text-lg text-center mb-6 leading-relaxed text-[#141414] opacity-90">
                  {offer.message}
                </p>

                {/* Valid Until */}
                {offer.validUntil && (
                  <p className="font-mono text-xs text-center mb-6 text-[#616752] uppercase tracking-widest">
                    Gültig bis {offer.validUntil}
                  </p>
                )}

                {/* CTA Button */}
                <div className="flex justify-center">
                  <Link
                    to={offer.buttonLink}
                    onClick={handleClose}
                    className="bg-[#616752] text-white px-8 py-4 font-mono text-xs tracking-[0.3em] uppercase hover:bg-[#141414] transition-all inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {offer.buttonText}
                  </Link>
                </div>
              </div>

              {/* Decorative Lines */}
              <div className="absolute top-1/2 left-4 w-2 h-2 bg-[#616752] transform -translate-y-1/2" />
              <div className="absolute top-1/2 right-4 w-2 h-2 bg-[#616752] transform -translate-y-1/2" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
