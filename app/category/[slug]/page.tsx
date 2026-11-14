import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import DirectoryFilter from "@/components/DirectoryFilter";
import { CATEGORY_INFO, categoryBySlug } from "@/lib/categories";
import { getActive } from "@/lib/data";
import { abs, breadcrumbLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { GUIDES } from "@/lib/guides";

export const revalidate = 3600;

export function generateStaticParams() {
  return CATEGORY_INFO.map((c) => ({ slug: c.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) return { title: "Not found", robots: { index: false } };
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/category/${c.slug}` },
    openGraph: { type: "website", title: c.title, description: c.description, url: abs(`/category/${c.slug}`), siteName: SITE.name },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = categoryBySlug(slug);
  if (!c) notFound();

  const items = (await getActive()).filter((o) => o.category === c.name);
  const related = GUIDES.filter((g) => g.category === c.slug);

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.h1,
    description: c.description,
    url: abs(`/category/${c.slug}`),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.slice(0, 20).map((o, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(`/opportunity/${o.slug}`),
        name: o.title,
      })),
    },
  };

  return (
    <>
      <JsonLd data={listLd} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: c.h1, path: `/category/${c.slug}` }])} />
      <section className="hero-bg text-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="[&_*]:!text-slate-400 [&_a:hover]:!text-white">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: c.h1 }]} />
          </div>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">{c.h1}</h1>
          <div className="mt-4 max-w-3xl space-y-3 text-slate-300">
            {c.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <DirectoryFilter items={items} lockedCategory={c.name} />
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-6">
          <h2 className="text-xl font-bold text-ink">Read this first</h2>
          <ul className="mt-3 space-y-2">
            {related.map((g) => (
              <li key={g.slug}><Link href={`/guides/${g.slug}`} className="font-semibold text-emerald-700 underline">{g.title}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
