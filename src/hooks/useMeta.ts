import { useEffect } from 'react';

interface MetaOptions {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const SITE_NAME = 'OK Studio';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://ok-studio-umber.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;
const DEFAULT_DESC = 'Digitale Transformation für KMU in Kreuztal. Hochperformante Web-Systeme, Relaunch & KI-Integrationen für den deutschen Mittelstand.';

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useMeta({ title, description, keywords, image, url, type = 'website', noindex = false }: MetaOptions) {
  useEffect(() => {
    const fullTitle = `${title} — ${SITE_NAME}`;
    const desc = description ?? DEFAULT_DESC;
    const img = image ?? DEFAULT_IMAGE;
    const pageUrl = url ? `${SITE_URL}${url}` : SITE_URL;

    // Basic
    document.title = fullTitle;
    setMeta('description', desc);
    if (keywords) setMeta('keywords', keywords);
    if (noindex) setMeta('robots', 'noindex,nofollow');

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:image', img, 'property');
    setMeta('og:url', pageUrl, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:locale', 'de_DE', 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', img);

    // Canonical
    setLink('canonical', pageUrl);

    return () => {
      document.title = `${SITE_NAME} — Web-Design & Relaunch für den Mittelstand`;
    };
  }, [title, description, keywords, image, url, type, noindex]);
}
