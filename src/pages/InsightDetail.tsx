import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { useItem } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, articleSchema, breadcrumbSchema } from '../components/SchemaOrg';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function InsightDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: insight, loading } = useItem<any>('insights', id!);

  usePageTitle(insight?.title ?? 'Journal');
  useMeta({
    title: insight?.title ?? 'Journal',
    description: insight?.content?.slice(0, 160).replace(/[#*>\n]/g, ' ').trim(),
    image: `/og/insights/${id}.svg`,
    url: `/insights/${id}`,
    type: 'article',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#616752] border-t-transparent rounded-full animate-spin" />
          <span className="telemetry-label animate-pulse">SYNCHRONIZING_KNOWLEDGE...</span>
        </div>
      </div>
    );
  }

  if (!insight) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center">
        <span className="telemetry-label text-red-500 mb-4 block">STATUS_404</span>
        <h1 className="font-display font-black text-4xl uppercase mb-4">Artikel nicht gefunden</h1>
        <p className="font-mono text-sm mb-8 opacity-50">Der angeforderte Artikel existiert nicht oder wurde entfernt.</p>
        <Link to="/insights" className="bg-[#616752] text-white px-8 py-3 font-mono text-xs tracking-widest hover:opacity-90 transition-all">ZURÜCK ZUM JOURNAL</Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="p-4 md:p-6 border-b border-[#C5C5C5] flex items-center justify-between sticky top-14 bg-white/80 backdrop-blur-md z-30">
        <Link to="/insights" className="flex items-center gap-2 font-mono text-[10px] tracking-widest hover:opacity-50 transition-opacity">
          <ArrowLeft size={14} /> ZURÜCK ZUM JOURNAL
        </Link>
        <span className="telemetry-label hidden sm:block opacity-40">{insight.date}</span>
      </div>

      <header className="border-b border-[#C5C5C5] bg-[#F1F3EA]">
        <div className="max-w-4xl mx-auto p-6 md:p-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#616752] text-[#F1F3EA] px-3 py-1 font-mono text-[9px] tracking-widest uppercase">{insight.tag}</span>
            <span className="font-mono text-[10px] opacity-40 flex items-center gap-1"><Calendar size={10} /> {insight.date}</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase leading-tight tracking-tight mb-8">{insight.title}</h1>
          <div className="flex items-center gap-2 font-mono text-[10px] opacity-50">
            <User size={12} /><span>{insight.author || 'OK Studio'}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 md:p-16">
        {insight && <SchemaOrg
          schema={[
            articleSchema(insight.title, insight.date, insight.author, `/insights/${insight.id}`),
            breadcrumbSchema([{name:'Home',url:'/'},{name:'Journal',url:'/insights'},{name:insight.title,url:`/insights/${insight.id}`}])
          ]}
          id="schema-insight"
        />}
        {insight.content ? (
          <div className="insight-md">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="border border-[#C5C5C5] p-12 text-center bg-[#F1F3EA]">
            <span className="telemetry-label opacity-30 block">INHALT_NICHT_VERFÜGBAR</span>
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-[#C5C5C5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="telemetry-label block mb-2">PROJEKT STARTEN?</span>
            <p className="font-serif italic text-lg opacity-60">Lassen Sie uns gemeinsam etwas Außergewöhnliches bauen.</p>
          </div>
          <Link to="/contact" className="shrink-0 bg-[#616752] text-white px-8 py-4 font-mono text-[11px] tracking-[0.3em] hover:opacity-90 transition-all">KONTAKT AUFNEHMEN</Link>
        </div>
      </div>

      <style>{`
        .insight-md h1,.insight-md h2,.insight-md h3{font-family:var(--font-display);font-weight:900;text-transform:uppercase;letter-spacing:.05em;margin-top:2.5rem;margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid #C5C5C5;color:#616752}
        .insight-md p{font-family:var(--font-serif);font-size:1.125rem;line-height:1.8;margin-bottom:1.5rem;opacity:.85}
        .insight-md ul,.insight-md ol{font-family:var(--font-mono);font-size:.875rem;margin-bottom:1.5rem;padding-left:1.5rem}
        .insight-md li{margin-bottom:.5rem;opacity:.8}
        .insight-md blockquote{border-left:3px solid #616752;padding-left:1.5rem;margin:2rem 0;font-family:var(--font-serif);font-style:italic;font-size:1.25rem;opacity:.7}
        .insight-md strong{font-weight:700;color:#141414}
        .insight-md a{color:#616752;text-decoration:underline}
      `}</style>
    </motion.div>
  );
}
