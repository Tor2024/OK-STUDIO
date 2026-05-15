import { motion } from 'motion/react';
import { ArrowUpRight, ShieldCheck, Lock, Fingerprint, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCollection, useSettings, useData } from '../hooks/useData';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, localBusinessSchema } from '../components/SchemaOrg';
import { FadeIn, SlideIn, ScaleIn, StaggerContainer, StaggerItem } from '../components/animations';
import SpecialOffer from '../components/SpecialOffer';

export default function Home() {
  useMeta({
    title: 'Web-Design & Relaunch für den Mittelstand',
    description: 'Mit Sitz in Kreuztal entwickeln wir hochperformante, schlüsselfertige Web-Systeme für den deutschen Mittelstand. Web-Relaunch, KI-Integration & Lead-Generierung.',
    url: '/',
  });
  const { data: insights } = useCollection<any>('insights');
  const { data: clients } = useData<any[]>('clients.json');
  const { data: projects } = useCollection<any>('projects');
  const { get } = useSettings();

  const sortedProjects = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const sortedInsights = [...insights].sort((a, b) => b.date.localeCompare(a.date));
  const sortedClients = clients ? [...clients].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];

  const latestInsight = sortedInsights[0] ?? {
    id: null,
    title: 'Die Schnittstelle zwischen brutalistischer Geometrie und reaktiven Codestrukturen.',
    date: 'Nov 2024',
    tag: 'PHILOSOPHY',
  };

  return (
    <>
      <SchemaOrg schema={localBusinessSchema} id="schema-home" />
      <SpecialOffer />
      <section className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px] border-b border-[#C5C5C5]">
        <div className="col-span-1 lg:col-span-8 p-6 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#C5C5C5] relative overflow-hidden">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative z-10">
            <h1 className="display-xl z-10 relative text-5xl md:text-8xl">Digitaler</h1>
            <span className="display-serif md:absolute md:top-[110px] md:left-[260px] z-20 block mt-2 md:mt-0 text-4xl md:text-7xl">Erfolg für KMU</span>
            <div className="mt-24 md:mt-48 max-w-sm">
              <p className="body-md">Mit Sitz in Kreuztal entwickeln wir hochperformante, schlüsselfertige Web-Systeme für den deutschen Mittelstand. Wir verbinden industriellen Anspruch mit digitaler Verkaufspsychologie.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/work" className="inverted-block px-8 py-4 text-[13px] font-mono tracking-[0.2em] flex items-center justify-center hover:bg-neutral-800 transition-all cursor-pointer">
                  REFERENZEN <ArrowUpRight size={16} className="ml-2" />
                </Link>
                <Link to="/contact" className="border border-[#616752] px-8 py-4 text-[13px] font-mono tracking-[0.2em] flex items-center justify-center hover:bg-[#616752] hover:text-[#F1F3EA] transition-all cursor-pointer">
                  ANFRAGE <ArrowUpRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </motion.div>
          <div className="flex flex-col md:flex-row border-t border-[#C5C5C5] -mx-6 md:-mx-12 mt-12 bg-[#F1F3EA]">
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#C5C5C5]">
              <span className="telemetry-label mb-4 block">LEISTUNGEN</span>
              <ul className="space-y-1">
                <li className="font-display text-xl md:text-2xl">01 Web Relaunch</li>
                <li className="font-display text-xl md:text-2xl">02 Lead Flow</li>
                <li className="font-display text-xl md:text-2xl">03 Branding</li>
              </ul>
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
              <div className="font-mono text-[10px] leading-relaxed uppercase">
                {get('node_location', '[KREUZTAL NODE 01]\nLAT: 50.9667 N\nLON: 7.9833 E').split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
                <div className="mt-1 opacity-50">STATUS: {get('site_status', 'BETRIEBSBEREIT')}</div>
              </div>
              <div className="font-serif text-xl md:text-2xl italic leading-tight mt-4">"Struktur ist die ultimative Form von Schönheit."</div>
            </div>
          </div>
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden font-mono text-[8px] leading-none whitespace-pre select-none -z-10">
            {Array.from({ length: 40 }).map((_, i) => (<div key={i}>010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101</div>))}
          </div>
        </div>
        <div className="col-span-1 lg:col-span-4 p-0 flex flex-col bg-[#F1F3EA]">
          <div className="p-4 md:p-6 border-b border-[#C5C5C5] flex justify-between">
            <span className="telemetry-label font-bold">{get('engine_version', 'COREARCHIV')}</span>
            <span className="telemetry-label opacity-40">U_TIME: {get('system_uptime', '99.98%')}</span>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 md:p-8 relative min-h-[300px]">
            <div className="aspect-square w-full max-w-[320px] lg:max-w-none border border-[#C5C5C5] relative bg-white shadow-sm flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200" 
                alt="Moderne Büroarchitektur in Kreuztal - Webdesign und digitale Transformation für KMU" 
                loading="eager"
                width="1200"
                height="1200"
                className="w-full h-full object-cover grayscale contrast-125 opacity-90 transition-opacity hover:opacity-100" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 pointer-events-none border-[8px] md:border-[12px] border-[#F1F3EA]" />
            </div>
          </div>
          <div className="p-6 border-t border-[#C5C5C5] min-h-[160px]">
            <span className="telemetry-label block mb-3">NEUESTE EINBLICKE</span>
            <Link to={latestInsight.id ? `/insights/${latestInsight.id}` : '/insights'} className="text-[14px] leading-tight font-medium underline cursor-pointer hover:no-underline block">
              {latestInsight.title}
            </Link>
            <p className="text-[12px] text-[#737373] mt-2 italic">Veröffentlicht in Kreuztal {"//"} {latestInsight.date}</p>
            <Link 
              to="/insights" 
              className="inline-flex items-center gap-2 mt-6 font-mono text-[10px] tracking-widest text-[#616752] hover:text-[#141414] transition-colors border-b border-[#616752] pb-1"
            >
              ALLE ARTIKEL ANSEHEN <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 border-b border-[#C5C5C5]">
        {/* Колонка 1: Заголовок */}
        <div className="col-span-1 md:col-span-3 p-8 md:p-10 border-b md:border-b-0 md:border-r border-[#C5C5C5]">
          <FadeIn direction="right">
            <h2 className="font-display text-3xl md:text-4xl uppercase mb-4 md:mb-6 leading-tight">Leistungen</h2>
            <p className="body-md text-sm">Unsere Ingenieurslogik angewandt auf ästhetische Grenzen.</p>
          </FadeIn>
        </div>
        
        {/* Колонка 2: Список услуг */}
        <div className="col-span-1 md:col-span-6 border-b md:border-b-0 md:border-r border-[#C5C5C5]">
          <StaggerContainer staggerDelay={0.15}>
            {[
              { id: '01', title: 'Web-Design & Relaunch', desc: 'Hochwertiges Design trifft auf Verkaufspsychologie. Wir verwandeln Ihre Webseite in ein profitables System.', link: '/capabilities' },
              { id: '02', title: 'Entwicklung', desc: 'Von der Idee bis zum Go-Live. Wir übernehmen die komplette technische Realisierung inkl. Hosting.', link: '/capabilities' },
              { id: '03', title: 'KI & Automation', desc: 'Effizienzsteigerung für KMU durch intelligente Workflows und moderne Integrationen.', link: '/capabilities' }
            ].map((item, idx) => (
              <StaggerItem key={item.id}>
                <Link 
                  to={item.link}
                  className={`block p-8 md:p-10 ${idx !== 2 ? 'border-b border-[#C5C5C5]' : ''} group hover:bg-[#616752] transition-colors`}
                >
                  <span className="telemetry-label block mb-4 group-hover:text-[#F1F3EA] opacity-50">{item.id}</span>
                  <h3 className="font-display text-xl uppercase mb-4 group-hover:text-[#F1F3EA]">{item.title}</h3>
                  <p className="body-md text-sm group-hover:text-[#F1F3EA]/80">{item.desc}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
        
        {/* Колонка 3: Изображения */}
        <div className="col-span-1 md:col-span-3 flex flex-col">
          <StaggerContainer staggerDelay={0.2}>
            {[
              { id: '01', image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600', alt: 'Web-Design & Relaunch' },
              { id: '02', image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=600', alt: 'Entwicklung' },
              { id: '03', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600', alt: 'KI & Automation' }
            ].map((item, idx) => (
              <StaggerItem key={item.id}>
                <div className={`relative overflow-hidden bg-neutral-100 flex-1 ${idx !== 2 ? 'border-b border-[#C5C5C5]' : ''} group`}>
                  <img 
                    src={item.image} 
                    alt={item.alt}
                    loading="lazy"
                    width="600"
                    height="400"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 min-h-[200px]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 font-mono text-[9px] border border-[#C5C5C5] group-hover:bg-[#616752] group-hover:text-white transition-colors">
                    {item.id}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {sortedProjects.length > 0 && (
        <section className="border-b border-[#C5C5C5]">
          <FadeIn>
            <div className="p-8 md:p-12 border-b border-[#C5C5C5] flex justify-between items-end">
              <div>
                <span className="telemetry-label mb-2 block uppercase text-[#616752]">PROJEKT_ARCHIV</span>
                <h2 className="display-serif text-3xl md:text-5xl uppercase tracking-tight">Ausgewählte Arbeiten</h2>
              </div>
              <Link to="/work" className="font-mono text-[10px] tracking-widest border-b border-[#616752] pb-1 hover:gap-4 transition-all flex items-center gap-2">
                ALLE_ANSEHEN <ArrowUpRight size={14} />
              </Link>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {sortedProjects.slice(0, 2).map((project, idx) => (
              <ScaleIn key={project.id} delay={idx * 0.2}>
                <Link
                  to={`/work/${project.id}`}
                  className={`group relative overflow-hidden h-[400px] border-b md:border-b-0 ${idx === 0 ? 'md:border-r' : ''} border-[#C5C5C5] block`}
                >
                  <img 
                    src={project.image} 
                    alt={`${project.title} - ${project.category} Projekt von OK Studio Kreuztal`} 
                    loading="lazy"
                    width="800"
                    height="600"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end text-white">
                    <span className="telemetry-label !text-white opacity-60 mb-2">{project.category}</span>
                    <h3 className="display-serif text-3xl mb-2">{project.title}</h3>
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest">DETAILS_ÖFFNEN <ArrowUpRight size={14} /></div>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 font-mono text-[9px] border border-[#C5C5C5] group-hover:bg-[#616752] group-hover:text-white transition-colors">
                    CASE_STUDY_{idx + 1}
                  </div>
                </Link>
              </ScaleIn>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C5C5C5] bg-[#616752] text-[#F1F3EA]">
        <div className="col-span-1 lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-[#F1F3EA]/30">
          <SlideIn direction="left">
            <span className="telemetry-label text-[#F1F3EA] mb-6 block">KUNDENNETZWERK</span>
            <h2 className="display-serif text-3xl mb-8 leading-tight">Vertraut von regionalen Akteuren</h2>
          </SlideIn>
          <StaggerContainer staggerDelay={0.1}>
            <div className="space-y-4 md:space-y-6">
              {sortedClients.map((client: any) => (
                <StaggerItem key={client.id}>
                  {client.link ? (
                    <a 
                      href={client.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex justify-between items-center border-b border-[#F1F3EA]/10 pb-2 group cursor-pointer hover:border-[#F1F3EA]/50 transition-colors"
                    >
                      <span className="font-display text-base md:text-lg uppercase tracking-widest">{client.name}</span>
                      <ArrowUpRight size={14} className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <div className="flex justify-between items-center border-b border-[#F1F3EA]/10 pb-2 group cursor-pointer hover:border-[#F1F3EA]/50 transition-colors">
                      <span className="font-display text-base md:text-lg uppercase tracking-widest">{client.name}</span>
                      <ArrowUpRight size={14} className="opacity-30 group-hover:opacity-100 transition-colors" />
                    </div>
                  )}
                </StaggerItem>
              ))}
              {sortedClients.length === 0 && (
                <div className="py-4 border-b border-[#F1F3EA]/10 font-mono text-[10px] opacity-20 uppercase tracking-widest">Warte auf Netzwerk-Update...</div>
              )}
            </div>
          </StaggerContainer>
        </div>
        <div className="col-span-1 lg:col-span-8 p-8 md:p-12 flex flex-col justify-between">
          <FadeIn delay={0.3}>
            <div className="mb-12">
              <span className="telemetry-label text-[#F1F3EA] mb-6 block uppercase">SICHERHEITSPROTOKOLL</span>
              <StaggerContainer staggerDelay={0.15}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <StaggerItem>
                    <div className="flex flex-col gap-3"><Lock size={20} /><span className="font-display uppercase text-sm">XSS-Schutz</span><p className="text-[10px] opacity-60 font-mono italic">Bereinigte Eingabevektoren.</p></div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex flex-col gap-3"><Fingerprint size={20} /><span className="font-display uppercase text-sm">Identity</span><p className="text-[10px] opacity-60 font-mono italic">Sichere API-Orchestrierung.</p></div>
                  </StaggerItem>
                  <StaggerItem>
                    <div className="flex flex-col gap-3"><Activity size={20} /><span className="font-display uppercase text-sm">Monitoring</span><p className="text-[10px] opacity-60 font-mono italic">Echtzeit-Bedrohungserkennung.</p></div>
                  </StaggerItem>
                </div>
              </StaggerContainer>
            </div>
          </FadeIn>
          <ScaleIn delay={0.5}>
            <div className="bg-[#F1F3EA] text-[#616752] p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-6 sm:gap-0">
              <div className="max-w-md text-center sm:text-left">
                <span className="telemetry-label text-[#616752] mb-2 block font-bold">LID-MAGNET_SYSTEM</span>
                <p className="text-sm font-serif">Neukunden erhalten einen umfassenden <span className="underline italic">Website-Performance Check</span> ohne Kosten.</p>
              </div>
              <Link to="/contact?audit=true" className="w-full sm:w-auto px-8 py-4 bg-[#616752] text-[#F1F3EA] font-mono text-[11px] hover:opacity-90 transition-opacity uppercase tracking-widest text-center shadow-lg active:scale-95 transform">AUDIT ANFORDERN</Link>
            </div>
          </ScaleIn>
        </div>
      </section>
    </>
  );
}
