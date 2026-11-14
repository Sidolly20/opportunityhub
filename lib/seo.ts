import { SITE } from "./site";
import type { Opportunity } from "./types";

export const abs = (p: string) => `${SITE.url}${p.startsWith("/") ? p : `/${p}`}`;

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function articleLd(o: Opportunity) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: o.title.slice(0, 110),
    description: o.summary,
    datePublished: o.publishedAt,
    dateModified: o.createdAt,
    inLanguage: "en",
    mainEntityOfPage: abs(`/opportunity/${o.slug}`),
    isBasedOn: o.sourceUrl,
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

export function guideLd(g: { title: string; description: string; slug: string; updated: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title.slice(0, 110),
    description: g.description,
    datePublished: g.updated,
    dateModified: g.updated,
    inLanguage: "en",
    mainEntityOfPage: abs(`/guides/${g.slug}`),
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
}

export function siteLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      inLanguage: "en",
    },
  ];
}
