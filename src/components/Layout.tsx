import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import Cursor from './Cursor';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'REFERENZEN', link: '/work' },
    { label: 'LEISTUNGEN', link: '/capabilities' },
    { label: 'METHODIK', link: '/approach' },
    { label: 'JOURNAL', link: '/insights' },
    { label: 'KONTAKT', link: '/contact' }
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Reset loader on path change if desired, or just initial load
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F1F3EA] flex items-center justify-center font-mono text-[#616752]">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin mb-4" size={32} />
          <span className="telemetry-label animate-pulse">LADE KREUZTAL_NODE_V3.4...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F3EA] flex flex-col items-center text-[#616752]">
      <Cursor />
      <div className="w-full bg-[#616752] text-[#F1F3EA] text-[10px] py-1 text-center font-mono tracking-widest uppercase px-4">
        HINWEIS: DIESE WEBSITE IST TEIL EINES PORTFOLIOS UND NIMMT DERZEIT KEINE REALEN AUFTRÄGE ENTGEGEN.
      </div>
      <header className="flex md:grid md:grid-cols-12 border-b border-[#C5C5C5] sticky top-0 bg-[#F1F3EA] z-50 w-full max-w-[1280px]">
        <Link to="/" className="flex-1 md:col-span-3 p-4 md:p-6 flex items-center border-r border-[#C5C5C5] hover:bg-white transition-colors h-16 md:h-20">
          <Logo />
        </Link>
        <nav className="hidden md:col-span-6 md:flex items-center justify-center gap-8 border-r border-[#C5C5C5]">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              to={item.link} 
              className={`font-mono text-[11px] tracking-widest hover:text-[#616752] transition-colors relative group py-2 ${location.pathname === item.link ? 'text-[#616752] font-bold' : 'text-[#616752]/60'}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#616752] transition-transform duration-300 ${location.pathname === item.link ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
            </Link>
          ))}
        </nav>
        <div className="md:col-span-3 flex items-center justify-end px-4 md:px-6 gap-4 border-l md:border-l-0 border-[#C5C5C5]">
          <span className="hidden md:block font-mono text-[11px]">MENÜ</span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-[#616752] hover:text-[#F1F3EA] transition-colors cursor-pointer"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 w-full bg-[#141414] text-[#F1F3EA] z-[49] p-8 space-y-8 border-b border-[#616752] shadow-2xl"
          >
            <div className="space-y-0">
              {navItems.map((item, index) => (
                <div key={item.label}>
                  <Link 
                    to={item.link} 
                    className="block font-mono text-lg tracking-[0.2em] hover:text-[#616752] transition-colors py-4"
                  >
                    {item.label}
                  </Link>
                  {index < navItems.length - 1 && (
                    <div className="border-b border-white/10" />
                  )}
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-green-500 rounded-full" />
                <span className="telemetry-label !text-[8px] opacity-50">NODE: KREUZTAL_MAIN_UNIT</span>
              </div>
              <Link to="/contact" className="bg-[#616752] text-white p-4 font-mono text-center text-xs tracking-widest">
                PROJEKT_STARTEN
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-[1280px] border-x border-[#C5C5C5] flex-1 bg-white/30 backdrop-blur-sm">
        {children}
      </main>

      <footer className="w-full max-w-[1280px] border-x border-b border-[#C5C5C5] bg-[#F1F3EA] z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 md:p-12 border-b border-[#C5C5C5]">
          <div className="md:col-span-1 space-y-4">
            <Logo />
            <p className="font-serif italic text-sm opacity-60 leading-relaxed">
              Exklusives Webdesign & digitale Exzellenz für das Siegerland und darüber hinaus.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="telemetry-label !text-[10px] opacity-40">NAVIGATION</h4>
            <nav className="flex flex-col gap-2">
              {navItems.map(item => (
                <Link key={item.link} to={item.link} className="font-mono text-[11px] tracking-widest hover:text-black transition-colors underline-offset-4 hover:underline">{item.label}</Link>
              ))}
            </nav>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="telemetry-label !text-[10px] opacity-40 uppercase tracking-widest">Regionale Präsenz</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {[
                { name: 'Siegen', id: 'siegen' },
                { name: 'Olpe', id: 'olpe' },
                { name: 'Kreuztal', id: 'kreuztal' },
                { name: 'Attendorn', id: 'attendorn' },
                { name: 'Lennestadt', id: 'lennestadt' },
                { name: 'Hilchenbach', id: 'hilchenbach' },
                { name: 'Netphen', id: 'netphen' },
                { name: 'Freudenberg', id: 'freudenberg' },
                { name: 'Gummersbach', id: 'gummersbach' },
                { name: 'Lüdenscheid', id: 'luedenscheid' },
                { name: 'Hagen', id: 'hagen' },
                { name: 'Iserlohn', id: 'iserlohn' }
              ].map(city => (
                <Link 
                  key={city.id} 
                  to={`/local/${city.id}`} 
                  className="font-mono text-[10px] tracking-tight opacity-60 hover:opacity-100 hover:text-black transition-all flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 bg-[#616752] rounded-full scale-0 group-hover:scale-100 transition-transform" />
                  Webdesign {city.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-6 md:py-4 gap-4 md:gap-0 bg-white/30">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="telemetry-label">SYSTEMSTATUS: OPTIMAL</span>
            </div>
            <span className="telemetry-label hidden sm:block">UPTIME: 99.99%</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <Link to="/impressum" className="telemetry-label hover:text-black transition-colors opacity-60 hover:opacity-100">IMPRESSUM</Link>
            <Link to="/privacy" className="telemetry-label hover:text-black transition-colors opacity-60 hover:opacity-100">DATENSCHUTZ</Link>
            <span className="telemetry-label text-opacity-30 border-l border-[#C5C5C5] pl-6 ml-2">© 2026 OK_STUDIO</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
