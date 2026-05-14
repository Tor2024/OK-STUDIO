import { Activity, Cpu, Layers } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg, breadcrumbSchema } from '../components/SchemaOrg';

export default function Capabilities() {
  usePageTitle('Leistungen');
  useMeta({
    title: 'Leistungen — Webdesign, Entwicklung & KI',
    description: 'Digitale Systeme, systemisches Branding und Echtzeit-Infrastruktur für KMU. Wir bauen hochskalierbare Web-Plattformen mit Fokus auf Performance.',
    url: '/capabilities',
  });
  const services = [
    {
      title: 'Digitale Systeme',
      icon: <Cpu size={24} />,
      desc: 'Entwicklung hochskalierbarer digitaler Plattformen mit Fokus auf Performance und Sicherheit.',
      features: ['Microservices', 'Edge Computing', 'React Architektur']
    },
    {
      title: 'Systemisches Branding',
      icon: <Layers size={24} />,
      desc: 'Markenidentitäten, die als Design-Tokens gedacht sind – modular, responsiv und technisch präzise.',
      features: ['Visuelle Systeme', 'Design Tokens', 'Marken-Richtlinien']
    },
    {
      title: 'Echtzeit-Infrastruktur',
      icon: <Activity size={24} />,
      desc: 'Implementierung von Echtzeit-Datenströmen und reaktiven Interfaces für komplexe Dashboards.',
      features: ['Websockets', 'Daten-Streaming', 'Live Telemetrie']
    }
  ];

  return (
    <div className="pb-24">
      <SchemaOrg schema={breadcrumbSchema([{name:'Home',url:'/'},{name:'Leistungen',url:'/capabilities'}])} id="schema-capabilities" />
      <section className="p-6 md:p-12 border-b border-[#C5C5C5] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-1 md:col-span-6">
          <span className="telemetry-label mb-4 block text-[#616752]">STEUERUNG / LEISTUNGEN</span>
          <h1 className="display-xl text-5xl md:text-7xl mb-6 md:mb-8 leading-tight">Was wir<br />liefern</h1>
          <p className="body-md text-base md:text-xl opacity-80">Wir bauen keine Webseiten. Wir engineering die digitale Zukunft Ihres Unternehmens durch systemische Integrität.</p>
        </div>
        <div className="col-span-1 md:col-span-6 flex items-end justify-start md:justify-end">
           <div className="font-mono text-[9px] border border-[#C5C5C5] p-4 bg-white/50 backdrop-blur-sm">
             [SYSTEM SPECS V4.1]<br />
             - HEADLESS_FIRST: TRUE<br />
             - LATENCY_MAX: 120MS<br />
             - COMPLIANCE: ISO/GDPR
           </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-[#C5C5C5]">
        {services.map((service, idx) => (
          <div key={service.title} className={`p-8 md:p-12 border-b md:border-b-0 ${idx !== 2 ? 'md:border-r border-[#C5C5C5]' : ''} hover:bg-[#616752] group transition-all duration-500`}>
            <div className="mb-8 p-4 border border-[#C5C5C5] w-fit group-hover:bg-[#F1F3EA] group-hover:text-[#616752] transition-colors">
              {service.icon}
            </div>
            <h2 className="display-serif text-2xl md:text-3xl mb-6 group-hover:text-[#F1F3EA]">{service.title}</h2>
            <p className="body-md mb-8 group-hover:text-[#F1F3EA]/70">{service.desc}</p>
            <ul className="space-y-4">
              {service.features.map(f => (
                <li key={f} className="flex items-center gap-3 font-mono text-[10px] tracking-widest text-[#616752] group-hover:text-[#F1F3EA]">
                  <div className="w-1.5 h-1.5 bg-[#616752] group-hover:bg-[#F1F3EA] rounded-full" />
                  {f.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#C5C5C5] bg-[#F1F3EA]">
           <h3 className="display-serif text-2xl mb-8">Technologie-Stack</h3>
           <div className="grid grid-cols-2 gap-8">
              {[
                { name: 'Frontend', techs: 'React, Next.js, Vite' },
                { name: 'Backend', techs: 'Node.js, Go, Python' },
                { name: 'Cloud', techs: 'AWS, GCP, Vercel' },
                { name: 'Design', techs: 'Figma, Framer, WebGL' }
              ].map(stack => (
                <div key={stack.name}>
                  <span className="telemetry-label block mb-2 opacity-50">{stack.name}</span>
                  <p className="font-mono text-sm font-bold">{stack.techs}</p>
                </div>
              ))}
           </div>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center bg-[#616752] text-[#F1F3EA]">
           <blockquote className="display-serif text-2xl md:text-3xl italic leading-tight mb-8">
             "Qualität ist keine Variable, sondern der Kern unserer Systemarchitektur."
           </blockquote>
           <span className="telemetry-label text-[#F1F3EA] opacity-60">CHIEF ARCHITECT // WEB STUDIO OK</span>
        </div>
      </section>
    </div>
  );
}
