import { motion } from 'motion/react';
import { useMeta } from '../hooks/useMeta';
import { SchemaOrg } from '../components/SchemaOrg';
import { useData } from '../hooks/useData';
import ReactMarkdown from 'react-markdown';

interface PrivacySection {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface PrivacyData {
  title: string;
  subtitle: string;
  sections: PrivacySection[];
}

export default function Privacy() {
  const { data: privacy } = useData<PrivacyData>('privacy.json');
  
  useMeta({
    title: 'Datenschutzerklärung — Web Studio OK',
    description: 'Datenschutzerklärung von Web Studio OK. Informationen zur Datenerfassung, Verarbeitung und Ihren Rechten gemäß DSGVO.'
  });
  
  if (!privacy) {
    return (
      <div className="p-12 lg:p-24 max-w-4xl mx-auto">
        <p className="font-mono text-sm opacity-50">Lädt...</p>
      </div>
    );
  }
  
  return (
    <>
      <SchemaOrg schema={{ '@context': 'https://schema.org', '@type': 'WebPage', name: 'Datenschutzerklärung', description: 'Datenschutzinformationen' }} />
      <div className="p-12 lg:p-24 max-w-4xl mx-auto space-y-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <span className="telemetry-label mb-6 block">{privacy.subtitle}</span>
        <h1 className="display-serif text-5xl mb-12">{privacy.title}</h1>
        
        <div className="space-y-8 font-mono text-xs leading-relaxed text-gray-700">
          {privacy.sections.sort((a, b) => a.order - b.order).map(section => (
            <section key={section.id} className="space-y-2">
              <h2 className="text-sm font-bold text-black">{section.title}</h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{section.content}</ReactMarkdown>
              </div>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
    </>
  );
}
