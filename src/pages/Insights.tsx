import { useCollection } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, breadcrumbSchema } from '../components/SchemaOrg';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SmartLink from '../components/SmartLink';

interface Insight {
  id: string;
  date: string;
  title: string;
  tag: string;
  author: string;
  content?: string;
}

export default function Insights() {
  usePageTitle('Journal');
  useMeta({
    title: 'Journal — Strategie, Design & KI für KMU',
    description: 'Artikel und Einblicke zu Webdesign, KI-Integration und digitaler Strategie für den deutschen Mittelstand.',
    url: '/insights',
  });
  const { data: raw, loading } = useCollection<any>('insights');
  const articles = [...raw]
    .filter(i => i.published !== false)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#616752] border-t-transparent rounded-full animate-spin" />
          <span className="telemetry-label animate-pulse">SYNCHRONIZING_KNOWLEDGE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <section className="p-6 md:p-12 border-b border-[#C5C5C5]">
        <span className="telemetry-label mb-4 block">DATEN / EINBLICKE</span>
        <div className="flex justify-between items-end">
          <h1 className="display-xl text-5xl md:text-8xl">Theorie {"&"}<br />Praxis</h1>
          <div className="font-mono text-[9px] opacity-50 mb-4 pb-1 border-b border-[#C5C5C5] hidden sm:block">{articles.length} ARTIKEL</div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[60vh]">
        <div className="col-span-1 lg:col-span-8 border-b lg:border-b-0 lg:border-r border-[#C5C5C5]">
          {articles.length === 0 ? (
            <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-[9px] tracking-widest opacity-20 uppercase mb-4">// ARCHIV_LEER</span>
              <p className="font-serif italic text-lg opacity-40">Neue Artikel werden in Kürze veröffentlicht.</p>
            </div>
          ) : (
            articles.map(article => (
              <SmartLink
                key={article.id}
                prefetch="insight"
                itemId={article.id}
                to={`/insights/${article.id}`}
                className="block p-8 md:p-12 border-b border-[#C5C5C5] group hover:bg-[#F1F3EA] transition-colors"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-[10px] md:text-xs opacity-50">{article.date}</span>
                  <span className="telemetry-label group-hover:bg-[#616752] group-hover:text-[#F1F3EA] px-2 py-1 transition-colors text-[9px]">{article.tag}</span>
                </div>
                <h2 className="display-serif text-2xl md:text-4xl mb-6 group-hover:underline underline-offset-8 decoration-1 leading-tight">{article.title}</h2>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase opacity-40">AUTOR: {article.author}</span>
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity text-[#616752]">
                    LESEN <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="col-span-1 lg:col-span-4 bg-[#F1F3EA]/30 p-8 md:p-12">
          <div className="sticky top-32 space-y-10">
            {articles.length > 0 && (
              <div>
                <h3 className="telemetry-label mb-4 block">THEMEN</h3>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(articles.map(a => a.tag))].map(tag => (
                    <span key={tag} className="border border-[#C5C5C5] px-3 py-1 font-mono text-[9px] tracking-widest uppercase bg-white hover:bg-[#616752] hover:text-white hover:border-[#616752] transition-colors cursor-default">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="border border-[#C5C5C5] p-6 bg-white">
              <span className="telemetry-label block mb-3 font-bold">PROJEKT ANFRAGEN</span>
              <p className="font-serif italic text-sm opacity-60 mb-6 leading-relaxed">Bereit für Ihr nächstes digitales Projekt? Wir sind es auch.</p>
              <Link to="/contact" className="block w-full bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest text-center hover:opacity-90 transition-all">
                KONTAKT AUFNEHMEN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
