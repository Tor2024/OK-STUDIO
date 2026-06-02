import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useData } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function LocalLanding() {
  const { id } = useParams<{ id: string }>();
  const { data: allLandings, loading } = useData<any[]>('landings.json');
  const landing = allLandings?.find(l => l.id === id);
  const isDraft = landing && landing.published === false;

  usePageTitle(landing?.title ?? 'Webdesign & Digitalisierung');
  useMeta({
    title: landing?.title ?? 'Webdesign & Digitalisierung',
    description: landing?.description,
    keywords: landing?.keywords,
    url: `/local/${id}`,
    noindex: isDraft,
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#616752] border-t-transparent rounded-full animate-spin" />
          <span className="telemetry-label animate-pulse">OPTIMIZING_LOCAL_NODE...</span>
        </div>
      </div>
    );
  }

  if (!landing || isDraft) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
        <h1 className="font-display font-black text-4xl uppercase mb-4">{isDraft ? 'In Arbeit' : 'Node nicht gefunden'}</h1>
        <p className="font-serif italic mb-8 opacity-60 max-w-xs mx-auto">
          {isDraft ? 'Diese Seite wird aktuell für den Suchalgorithmus optimiert и скоро будет доступна.' : 'Die angeforderte Adresse existiert nicht oder wurde verschoben.'}
        </p>
        <Link to="/" className="bg-[#616752] text-white px-8 py-3 font-mono text-xs tracking-widest hover:opacity-90 transition-all">ZURÜCK ZUR BASIS</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="p-4 md:p-6 border-b border-[#C5C5C5] flex items-center justify-between sticky top-14 bg-white/80 backdrop-blur-md z-30">
        <Link to="/" className="flex items-center gap-2 font-mono text-[10px] tracking-widest hover:opacity-50 transition-opacity">
          <ArrowLeft size={14} /> STARTSEITE
        </Link>
        <span className="telemetry-label flex items-center gap-2">
          <MapPin size={12} className="text-red-500" /> 
          LOCAL_NODE: {landing.city.toUpperCase()}
        </span>
      </div>

      <header className="bg-[#F1F3EA] text-[#141414] py-20 md:py-32 border-b border-[#C5C5C5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#616752 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="telemetry-label text-[#616752] mb-6 block font-bold tracking-[0.3em]">EXKLUSIVES WEBDESIGN FÜR {landing.city.toUpperCase()}</span>
            <h1 className="font-display font-black text-4xl md:text-7xl uppercase leading-[0.9] tracking-tight mb-8">
              {landing.title}
            </h1>
            <p className="font-serif italic text-xl md:text-2xl opacity-70 max-w-2xl leading-relaxed">
              {landing.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="inverted-block px-8 py-4 text-[13px] font-mono tracking-[0.2em] flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer"
              >
                KOSTENLOSES ERSTGESPRÄCH <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link 
                to="/work" 
                className="border border-[#616752] px-8 py-4 text-[13px] font-mono tracking-[0.2em] flex items-center justify-center hover:bg-[#616752] hover:text-[#F1F3EA] transition-all cursor-pointer"
              >
                REFERENZEN ANSEHEN <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 md:p-16">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6">
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-[#616752]">Warum OK Studio in {landing.city}?</h2>
            <div className="space-y-4">
              {[
                'Lokale Expertise & Marktkenntnis',
                'Persönliche Beratung vor Ort',
                'Hochperformante Web-Lösungen',
                'Messbare Ergebnisse & Leads'
              ].map((item, idx) => (
                <motion.div 
                  key={item} 
                  className="flex items-center gap-3 font-mono text-sm border-b border-[#C5C5C5] pb-3 hover:border-[#616752] transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + idx * 0.1 }}
                >
                  <CheckCircle2 size={18} className="text-[#616752] flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#F1F3EA] to-white border-2 border-[#616752] p-8 shadow-lg hover:shadow-xl transition-shadow">
            <span className="telemetry-label block mb-4 text-[#616752]">DIREKTKONTAKT</span>
            <p className="font-serif italic text-lg mb-6 opacity-70 leading-relaxed">Lassen Sie uns Ihr Projekt in {landing.city} gemeinsam zum Erfolg führen.</p>
            <Link to="/contact" className="flex items-center justify-between bg-[#616752] text-white p-4 font-mono text-xs tracking-widest hover:bg-[#141414] transition-all group">
              JETZT ANFRAGEN <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <div className="insight-md">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{landing.content}</ReactMarkdown>
        </div>

        <motion.div 
          className="mt-20 pt-12 border-t border-[#C5C5C5] text-center bg-gradient-to-b from-white to-[#F1F3EA] p-12 rounded-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="telemetry-label block mb-4 text-[#616752]">PROJEKT_STARTEN</span>
          <h3 className="font-display font-black text-3xl md:text-4xl uppercase mb-4 leading-tight">Bereit für den digitalen Relaunch?</h3>
          <p className="font-serif italic text-lg opacity-60 mb-8 max-w-xl mx-auto">
            Wir analysieren Ihre aktuelle Online-Präsenz und zeigen Ihnen konkrete Verbesserungspotenziale auf.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-[#616752] text-white px-12 py-5 font-mono text-xs tracking-[0.3em] hover:scale-105 hover:bg-[#141414] transition-all shadow-xl"
          >
            KOSTENLOSES ERSTGESPRÄCH
          </Link>
        </motion.div>
      </div>

      <style>{`
        .insight-md h2 { 
          font-family: var(--font-display); 
          font-weight: 900; 
          text-transform: uppercase; 
          font-size: 2rem; 
          margin: 3rem 0 1.5rem; 
          border-bottom: 2px solid #616752; 
          padding-bottom: 0.75rem; 
          color: #616752; 
        }
        .insight-md p { 
          font-family: var(--font-serif); 
          font-size: 1.125rem; 
          line-height: 1.8; 
          margin-bottom: 1.5rem; 
          color: #141414;
        }
        .insight-md ul { 
          margin-bottom: 1.5rem; 
          padding-left: 1.5rem; 
          list-style-type: none;
        }
        .insight-md li { 
          margin-bottom: 0.75rem; 
          font-family: var(--font-mono); 
          font-size: 0.9rem;
          padding-left: 1.5rem;
          position: relative;
        }
        .insight-md li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: #616752;
          font-weight: bold;
        }
        .insight-md strong {
          color: #616752;
          font-weight: 700;
        }
      `}</style>
    </motion.div>
  );
}
