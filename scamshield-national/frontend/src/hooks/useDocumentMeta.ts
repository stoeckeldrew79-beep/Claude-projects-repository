import { useEffect } from 'react';

// Vite builds a plain SPA (no SSR), so meta tags are set client-side.
// Good enough for the SEO surface this app actually needs (title, meta
// description, canonical, basic Open Graph for share previews) without
// pulling in a full SSR framework for Phase 4.
function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export interface DocumentMeta {
  title: string;
  description: string;
  path?: string;
  /** Account/admin pages shouldn't show up in search results. */
  noindex?: boolean;
}

export function useDocumentMeta({ title, description, path, noindex }: DocumentMeta) {
  useEffect(() => {
    const fullTitle = `${title} | ScamShield National`;
    document.title = fullTitle;
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', 'website');

    const canonicalPath = path ?? window.location.pathname;
    const origin = window.location.origin;
    setCanonical(`${origin}${canonicalPath}`);
  }, [title, description, path, noindex]);
}
