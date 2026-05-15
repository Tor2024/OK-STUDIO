import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useCollection } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, breadcrumbSchema } from '../components/SchemaOrg';
import { Link } from 'react-router-dom';
import SmartLink from '../components/SmartLink';
import { parseMonthYear } from '../lib/dateUtils';

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  completedAt?: string;
  fullDescription?: string;
  order?: number;
}

export default function Work() {
  usePageTitle('Referenzen');
  useMeta({
    title: 'Referenzen & Portfolio',
    description: 'Ausgewählte Web-Projekte von OK Studio: Web-Relaunch, System-Entwicklung und KI-Automation für den deutschen Mittelstand.',
    url: '/work',
  });
  const { data: raw, loading } = useCollection<any>('projects');
  const projects = [...raw]
    .filter(p => p.published !== false)
    .sort((a, b) => {
      const dateA = parseMonthYear(a.completedAt || '');
      const dateB = parseMonthYear(b.completedAt || '');
      if (dateA !== dateB) return dateB - dateA;
      return (a.order ?? 0) - (b.order ?? 0);
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#616752] border-t-transparent rounded-full animate-spin" />
          <span className="telemetry-label animate-pulse">SCANNING_ARCHIVE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <SchemaOrg schema={breadcrumbSchema([{name:'Home',url:'/'},{name:'Referenzen',url:'/work'}])} id="schema-work" />
      <section className="p-6 md:p-12 border-b border-[#C5C5C5]">
        <span className="telemetry-label mb-4 block">ARCHIV / PROJEKTE</span>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 className="display-xl text-5xl md:text-8xl mb-0">Ausgewählte<br />Werke</h1>
          <p className="body-md max-w-sm opacity-70 md:mb-2">Unsere Projekte sind keine Oberflächen, sondern funktionale Artefakte.</p>
        </div>
      </section>

      {projects.length === 0 ? (
        <div className="p-12 md:p-24 flex flex-col items-center justify-center text-center min-h-[40vh]">
          <span className="font-mono text-[9px] tracking-widest opacity-20 uppercase mb-4">// ARCHIV_LEER</span>
          <p className="font-serif italic text-xl opacity-40 mb-8">Projekte werden in Kürze hinzugefügt.</p>
          <SmartLink to="/contact" className="bg-[#616752] text-white px-8 py-4 font-mono text-[11px] tracking-widest hover:opacity-90 transition-all">PROJEKT ANFRAGEN</SmartLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12">
          {projects.map((project, idx) => (
            <SmartLink
              prefetch="project"
              itemId={project.id}
              to={`/work/${project.id}`}
              key={project.id}
              className="col-span-12 grid grid-cols-1 md:grid-cols-12 border-b border-[#C5C5C5] group cursor-pointer hover:bg-[#F1F3EA] transition-all duration-500"
            >
              <div className="hidden md:flex col-span-1 p-6 border-r border-[#C5C5C5] items-start justify-center font-mono opacity-30 text-sm pt-12">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="col-span-12 md:col-span-6 p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#C5C5C5]">
                <span className="telemetry-label mb-2 block opacity-50">{project.category}</span>
                <h2 className="display-serif text-3xl md:text-5xl mb-4 md:mb-6 group-hover:italic transition-all uppercase tracking-tight leading-tight">{project.title}</h2>
                <p className="body-md text-gray-600 mb-6 md:mb-8 max-w-md">{project.description}</p>
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest border-b border-[#616752] pb-1 w-fit group-hover:gap-4 transition-all">
                  REFERENZ_DETAILS_ANSEHEN <ArrowUpRight size={14} />
                </div>
              </div>
              <div className="col-span-12 md:col-span-5 relative overflow-hidden bg-neutral-100 h-[280px] md:h-[420px]">
                {project.image ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                    src={project.image}
                    alt={`${project.title} - ${project.category} Referenzprojekt`}
                    loading="lazy"
                    width="800"
                    height="600"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[1000ms] ease-in-out"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F1F3EA]">
                    <span className="font-mono text-[9px] opacity-20 uppercase tracking-widest">NO_IMAGE</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-[#616752] text-[#F1F3EA] px-3 py-1 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.completedAt || '2025'}
                </div>
              </div>
            </SmartLink>
          ))}
        </div>
      )}

      <section className="p-8 md:p-12 border-t border-[#C5C5C5] flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#F1F3EA]">
        <div>
          <span className="telemetry-label block mb-1">NÄCHSTES PROJEKT</span>
          <p className="font-serif italic text-lg opacity-60">Ihr Projekt könnte hier stehen.</p>
        </div>
        <Link to="/contact" className="shrink-0 bg-[#616752] text-white px-10 py-4 font-mono text-[11px] tracking-[0.3em] hover:opacity-90 transition-all">
          ANFRAGE SENDEN
        </Link>
      </section>
    </div>
  );
}
