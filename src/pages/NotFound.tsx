import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-[#C5C5C5] p-12 bg-white text-center shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
        <ShieldAlert size={48} className="mx-auto mb-6 text-red-500" />
        <span className="telemetry-label text-red-500 mb-2 block">STATUS_CODE_404</span>
        <h1 className="display-serif text-4xl mb-4">Pfad nicht gefunden</h1>
        <p className="font-mono text-xs opacity-60 mb-8 leading-relaxed">
          Die angeforderte Ressource existiert nicht im System-Verzeichnis. Möglicherweise wurde die URL verschoben или gelöscht.
        </p>
        <Link 
          to="/" 
          className="w-full bg-[#616752] text-white py-4 font-mono text-[10px] tracking-[0.3em] flex items-center justify-center gap-2 hover:opacity-90 transition-all"
        >
          <ArrowLeft size={14} /> ZURÜCK ZUM DASHBOARD
        </Link>
      </motion.div>
    </div>
  );
}
