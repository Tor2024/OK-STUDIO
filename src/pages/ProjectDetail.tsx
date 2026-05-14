import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { useItem } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, breadcrumbSchema } from '../components/SchemaOrg';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: project, loading } = useItem<any>('projects', id!);

  usePageTitle(project?.title ?? 'Projekt');
  useMeta({
    title: project?.title ?? 'Projekt',
    description: project?.description,
    image: `/og/projects/${id}.svg`,
    url: `/work/${id}`,
    type: 'article',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#616752] border-t-transparent rounded-full animate-spin" />
          <span className="telemetry-label animate-pulse">INITIALIZING_ASSET...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center">
        <span className="telemetry-label text-red-500 mb-4 block">STATUS_404</span>
        <h1 className="font-display font-black text-4xl uppercase mb-4">Projekt nicht gefunden</h1>
        <p className="font-mono text-sm mb-8 opacity-50">Das angeforderte Projekt existiert nicht oder wurde aus dem Archiv entfernt.</p>
        <Link to="/work" className="bg-[#616752] text-white px-8 py-3 font-mono text-xs tracking-widest hover:opacity-90 transition-all">ZURÜCK ZUM ARCHIV</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="p-4 md:p-6 border-b border-[#C5C5C5] flex items-center justify-between sticky top-14 bg-white/80 backdrop-blur-md z-30">
        <Link to="/work" className="flex items-center gap-2 font-mono text-[10px] tracking-widest hover:opacity-50 transition-opacity">
          <ArrowLeft size={14} /> ZURÜCK ZUR AUSWAHL
        </Link>
        <span className="telemetry-label hidden sm:block opacity-40">{project.category}</span>
      </div>

      <header className="relative h-[40vh] md:h-[60vh] overflow-hidden border-b border-[#C5C5C5]">
        <img 
          src={project.image} 
          alt={project.title} 
          loading="eager"
          width="1920"
          height="1080"
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-end p-6 md:p-12">
          <div className="mt-auto">
            <span className="telemetry-label text-white mb-2 block">{project.category}</span>
            <h1 className="font-display font-black text-3xl md:text-6xl text-white uppercase tracking-tight leading-tight">{project.title}</h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 max-w-7xl mx-auto p-6 md:p-12 gap-8 md:gap-12">
        <div className="col-span-1 md:col-span-8 order-2 md:order-1">
          <div className="prose prose-neutral max-w-none markdown-container">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {project.fullDescription || project.description || 'Keine detaillierte Beschreibung verfügbar.'}
            </ReactMarkdown>
          </div>
        </div>
        <div className="col-span-1 md:col-span-4 order-1 md:order-2 space-y-6 md:space-y-8">
          <div className="border border-[#C5C5C5] p-6 md:p-8 bg-[#F1F3EA]">
            <h3 className="telemetry-label mb-6 block font-bold">PROJEKT_DATEN</h3>
            <div className="space-y-4 font-mono text-[11px]">
              <div className="flex justify-between border-b border-[#C5C5C5] pb-2">
                <span className="opacity-50 flex items-center gap-2"><Calendar size={12} /> DATUM</span>
                <span>{project.completedAt || '2025'}</span>
              </div>
              <div className="flex justify-between border-b border-[#C5C5C5] pb-2">
                <span className="opacity-50 flex items-center gap-2"><Tag size={12} /> KATEGORIE</span>
                <span>{project.category}</span>
              </div>
            </div>
          </div>
          <div className="p-6 md:p-8 border border-[#C5C5C5]">
            <span className="telemetry-label mb-4 block">ZUSAMMENFASSUNG</span>
            <p className="font-serif text-base md:text-lg leading-relaxed italic opacity-70">{project.description}</p>
          </div>
          <Link to="/contact" className="block w-full bg-[#616752] text-white py-4 font-mono text-[10px] tracking-widest text-center hover:opacity-90 transition-all">
            PROJEKT ANFRAGEN
          </Link>
        </div>
      </div>

      <style>{`
        .markdown-container h1,.markdown-container h2,.markdown-container h3{font-family:var(--font-display);font-weight:900;text-transform:uppercase;letter-spacing:.05em;margin-top:2rem;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid #C5C5C5;color:#616752}
        .markdown-container p{font-family:var(--font-serif);font-size:1.125rem;line-height:1.8;margin-bottom:1.5rem;opacity:.85}
        .markdown-container img{width:100%;border:1px solid #C5C5C5;margin:2rem 0;box-shadow:0 20px 40px rgba(0,0,0,.1)}
        .markdown-container ul{font-family:var(--font-mono);font-size:.875rem;margin-bottom:1.5rem;padding-left:1.5rem}
        .markdown-container li{margin-bottom:.5rem;opacity:.8}
        .markdown-container blockquote{border-left:3px solid #616752;padding-left:1.5rem;margin:2rem 0;font-family:var(--font-serif);font-style:italic;font-size:1.25rem;opacity:.7}
        .markdown-container strong{font-weight:700;color:#141414}
      `}</style>
    </motion.div>
  );
}
