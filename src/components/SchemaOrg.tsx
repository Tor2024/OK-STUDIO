/**
 * Schema.org structured data injected as JSON-LD scripts.
 * Improves Google rich snippets: LocalBusiness, Article, FAQPage, BreadcrumbList.
 */

import { useEffect } from 'react';

interface SchemaOrgProps {
  schema: Record<string, unknown> | Record<string, unknown>[];
  id?: string;
}

export function SchemaOrg({ schema, id = 'schema-org' }: SchemaOrgProps) {
  useEffect(() => {
    const existing = document.getElementById(id);
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(Array.isArray(schema) ? schema : schema);
    document.head.appendChild(script);

    return () => {
      document.getElementById(id)?.remove();
    };
  }, [schema, id]);

  return null;
}

// ─── Pre-built schemas ────────────────────────────────────────────────────────

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Web Studio OK',
  alternateName: 'OK Studio',
  description: 'Digitale Transformation für KMU in Kreuztal und Siegerland. Hochperformante Web-Systeme, Relaunch & KI-Integrationen für den deutschen Mittelstand in NRW.',
  url: 'https://www.webstudio-ok.de',
  telephone: '+49-2732-123456',
  email: 'hello@webstudio-ok.de',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Heidestraße 123',
    addressLocality: 'Kreuztal',
    postalCode: '57223',
    addressRegion: 'Nordrhein-Westfalen',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 50.9667,
    longitude: 7.9833,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Kreuztal',
    },
    {
      '@type': 'City',
      name: 'Siegen',
    },
    {
      '@type': 'State',
      name: 'Nordrhein-Westfalen',
    },
  ],
  serviceType: ['Webdesign', 'Web-Relaunch', 'KI-Integration', 'Digitalisierung', 'Lead-Generierung'],
  priceRange: '€€',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Dienstleistungen',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Web-Relaunch',
          description: 'Kompletter digitaler Relaunch für mittelständische Unternehmen',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'KI-Integration',
          description: 'Integration von KI-Lösungen in bestehende Systeme',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Lead-Generierung',
          description: 'Optimierung für maximale Conversion und Lead-Generierung',
        },
      },
    ],
  },
};

export function articleSchema(title: string, date: string, author: string, url: string, description?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description ?? title,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'OK Studio',
      url: 'https://www.webstudio-ok.de',
    },
    datePublished: date,
    url: `https://www.webstudio-ok.de${url}`,
    inLanguage: 'de',
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `https://www.webstudio-ok.de${item.url}`,
    })),
  };
}
