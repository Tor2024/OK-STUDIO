import { useData } from '../hooks/useData';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, faqSchema, breadcrumbSchema } from '../components/SchemaOrg';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Approach() {
  usePageTitle('Methodik');
  useMeta({
    title: 'Methodik — Unser Prozess in 4 Phasen',
    description: 'Analyse, Architektur, Bauphase und Go-Live: Unser systematischer Vier-Phasen-Prozess für digitale Projekte im Mittelstand.',
    url: '/approach',
  });
  const { data: faqs } = useData<any[]>('faqs.json');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const steps = [
    {
      num: '01',
      title: 'Analyse & Telemetrie',
      desc: 'Wir analysieren bestehende Strukturen und erfassen relevante Datenvektoren, um das volle Potential zu verstehen.'
    },
    {
      num: '02',
      title: 'Strukturelle Architektur',
      desc: 'Wir entwerfen das logische Framework. Ästhetik folgt bei uns strikt der Funktionalität und Conversion.'
    },
    {
      num: '03',
      title: 'Bauphase & Belastungstests',
      desc: 'Der Code wird geschrieben, optimiert und unter realen Bedingungen auf absolute Stabilität geprüft.'
    },
    {
      num: '04',
      title: 'Go-Live & Monitoring',
      desc: 'Live-Schaltung des Systems mit kontinuierlicher Leistungsüberwachung und Optimierung in Echtzeit.'
    }
  ];

  return (
    <div className="pb-24">
      <section className="p-6 md:p-12 border-b border-[#C5C5C5] bg-[#F1F3EA]">
        <span className="telemetry-label mb-4 block">PROTOKOLL / ANSATZ</span>
        <h1 className="display-xl text-5xl md:text-7xl mb-6 md:mb-8">Unbeirrbare<br />Präzision</h1>
        <div className="max-w-2xl">
          <p className="body-md text-base md:text-xl">Unser Ansatz ist tief in der brutalistischen Philosophie verwurzelt: Ehrlichkeit in den Materialien (Code) und Klarheit in der Struktur (Layout).</p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12">
        <div className="hidden md:block md:col-span-4 p-12 border-r border-[#C5C5C5] sticky top-24 self-start">
           <h2 className="display-serif text-4xl leading-tight mb-8">Der Modus Operandi</h2>
           <p className="body-md text-sm opacity-70 mb-12">Ein systematischer Vier-Phasen-Prozess sichert die Integrität jedes Projekts.</p>
           <div className="aspect-square bg-neutral-200 border border-[#C5C5C5] relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center font-mono opacity-10 text-[8px] leading-none whitespace-pre select-none">
                {Array.from({ length: 20 }).map((_, i) => (<div key={i}>SYSTEM_LOGIC_CORE_SEQUENCE_DATA_PACKETS_V4</div>))}
             </div>
             <div className="relative z-10 p-6 flex flex-col justify-end h-full">
               <span className="telemetry-label text-[8px] mb-2">SCANNING_ASSETS...</span>
               <div className="w-full h-[1px] bg-[#616752] animate-pulse" />
             </div>
           </div>
        </div>
        <div className="col-span-1 md:col-span-8">
           {steps.map((step, idx) => (
             <div key={step.num} className={`p-8 md:p-12 border-b border-[#C5C5C5] ${idx % 2 === 0 ? 'bg-white/50' : 'bg-[#F1F3EA]'}`}>
               <span className="font-mono text-4xl md:text-5xl font-bold opacity-10 block mb-6">{step.num}</span>
               <h3 className="display-serif text-2xl md:text-3xl mb-4">{step.title}</h3>
               <p className="body-md max-w-lg mb-8">{step.desc}</p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 border border-[#C5C5C5] font-mono text-[9px] uppercase tracking-tighter opacity-50">Log_Sequence_{step.num}</div>
                  <div className="p-3 border border-[#C5C5C5] font-mono text-[9px] uppercase tracking-tighter opacity-50">Status: Validated</div>
                  <div className="p-3 border border-[#C5C5C5] font-mono text-[9px] uppercase tracking-tighter opacity-50">Complexity: High</div>
               </div>
             </div>
           ))}
        </div>
      </div>

      <section className="bg-white border-b border-[#C5C5C5] p-6 md:p-24">
        {faqs && faqs.length > 0 && <SchemaOrg schema={faqSchema(faqs)} id="schema-faq" />}
        <div className="max-w-4xl mx-auto">
          <span className="telemetry-label mb-8 block text-center opacity-40 flex items-center justify-center gap-2">
            <HelpCircle size={14} /> HÄUFIG_GESTELLTE_FRAGEN (FAQ)
          </span>
          {faqs && faqs.length > 0 ? (
            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <div key={faq.id} className="border border-[#C5C5C5]">
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full p-4 md:p-6 flex justify-between items-center text-left hover:bg-[#F1F3EA] transition-colors"
                  >
                    <span className="font-display font-medium text-base md:text-lg uppercase tracking-wider pr-4">{faq.question}</span>
                    {openFaq === faq.id ? <ChevronUp size={20} className="shrink-0" /> : <ChevronDown size={20} className="shrink-0" />}
                  </button>
                  {openFaq === faq.id && (
                    <div className="p-4 md:p-6 border-t border-[#C5C5C5] font-serif text-base md:text-lg leading-relaxed opacity-70 bg-neutral-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-[#C5C5C5] bg-[#F1F3EA]">
              <p className="font-mono text-sm opacity-50">Keine FAQs verfügbar</p>
            </div>
          )}
        </div>
      </section>

      <section className="p-8 md:p-12 border-b border-[#C5C5C5] flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center bg-[#616752] text-[#F1F3EA]">
        <h2 className="display-serif text-3xl md:text-4xl mb-6 md:mb-8">Bereit für eine Systemumstellung?</h2>
        <p className="body-md max-w-xl opacity-80 mb-8 md:mb-12">Lassen Sie uns Ihre digitale Infrastruktur auf eine neue Stufe der Effizienz heben.</p>
        <Link to="/contact" className="bg-[#F1F3EA] text-[#616752] px-8 md:px-12 py-4 md:py-5 font-mono text-[13px] tracking-widest hover:opacity-90 transition-all">JETZT KONTAKTIEREN</Link>
      </section>
    </div>
  );
}
