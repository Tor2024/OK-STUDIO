import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent_v1');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cookie_consent_v1', 'accepted');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[420px] z-50 pointer-events-none"
        >
          <div className="bg-[#141414] text-white p-6 shadow-2xl border border-[#616752] pointer-events-auto">
            <div className="flex items-start gap-4">
              <div className="bg-[#616752] p-2">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <span className="telemetry-label text-white block">COOKIE_PROTKOLL_v3.4</span>
                <p className="text-[10px] font-mono leading-relaxed opacity-70">
                  Wir nutzen Cookies, um die Performance unserer Systeme zu analysieren und Ihr Erlebnis zu optimieren. Durch Klicken auf "AKZEPTIEREN" stimmen Sie der Datennutzung zu. Details in unserer <Link to="/privacy" className="underline hover:text-[#616752]">Datenschutzerklärung</Link>.
                </p>
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={accept}
                    className="flex-1 bg-[#616752] text-white py-2 font-mono text-[9px] tracking-widest hover:opacity-90 transition-all uppercase"
                  >
                    Alle Akzeptieren
                  </button>
                  <button 
                    onClick={() => setIsVisible(false)}
                    className="px-4 border border-white/20 text-white/50 py-2 font-mono text-[9px] tracking-widest hover:text-white transition-all uppercase"
                  >
                    Ablehnen
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
