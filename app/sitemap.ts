import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getActive } from "@/lib/data";
import { CATEGORY_INFO } from "@/lib/categories";
import { GUIDES } from "@/lib/guides";
import { isIndexable } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getActive();
  const now = new Date();
  const fixed = ["/about", "/sponsor", "/privacy", "/guides"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  }));
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...CATEGORY_INFO.map((c) => ({
      url: `${SITE.url}/category/${c.slug}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...GUIDES.map((g) => ({
      url: `${SITE.url}/guides/${g.slug}`,
      lastModified: new Date(g.updated),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...fixed,
    ...items.filter(isIndexable).map((o) => ({
      url: `${SITE.url}/opportunity/${o.slug}`,
      lastModified: new Date(o.checkedAt ?? o.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
