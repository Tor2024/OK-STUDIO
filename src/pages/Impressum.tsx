import { motion } from 'motion/react';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg } from '../components/SchemaOrg';
import { useData } from '../hooks/useData';

interface ImpressumSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface ImpressumData {
  title: string;
  subtitle: string;
  sections: ImpressumSection[];
  disclaimer: string;
}

export default function Impressum() {
  const { data: impressum } = useData<ImpressumData>('impressum.json');
  
  useMeta({
    title: 'Impressum — Web Studio OK',
    description: 'Rechtliche Angaben und Kontaktinformationen von Web Studio OK in Kreuztal. Angaben gemäß § 5 TMG.'
  });
  
  if (!impressum) {
    return (
      <div className="p-12 lg:p-24 max-w-4xl mx-auto">
        <p className="font-mono text-sm opacity-50">Lädt...</p>
      </div>
    );
  }
  
  return (
    <>
      <SchemaOrg schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Impressum', description: 'Rechtliche Angaben' }} />
      <div className="p-12 lg:p-24 max-w-4xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="telemetry-label mb-6 block">{impressum.subtitle}</span>
        <h1 className="display-serif text-5xl mb-12">{impressum.title}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-mono text-sm leading-relaxed">
          {impressum.sections.sort((a, b) => a.order - b.order).map(section => (
            <section key={section.id} className="space-y-4">
              <h2 className="font-bold border-b border-[#C5C5C5] pb-2">{section.title}</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>
            </section>
          ))}
        </div>

        {impressum.disclaimer && (
          <div className="mt-12 p-8 border border-[#C5C5C5] bg-neutral-50 font-serif italic opacity-70">
            {impressum.disclaimer}
          </div>
        )}
      </motion.div>
    </div>
    </>
  );
}
