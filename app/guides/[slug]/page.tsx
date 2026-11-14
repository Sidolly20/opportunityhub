import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { GUIDES, guideBySlug } from "@/lib/guides";
import { abs, breadcrumbLd, guideLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/dates";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) return { title: "Not found", robots: { index: false } };
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: {
      type: "article",
      title: g.title,
      description: g.description,
      url: abs(`/guides/${g.slug}`),
      siteName: SITE.name,
      modifiedTime: g.updated,
    },
    twitter: { card: "summary_large_image", title: g.title, description: g.description },
  };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const g = guideBySlug(slug);
  if (!g) notFound();
  const others = GUIDES.filter((x) => x.slug !== g.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={guideLd(g)} />
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }])} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides", href: "/guides" }, { name: g.title }]} />

      <article className="notebook mt-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1>{g.title}</h1>
        <p className="hand" style={{ color: "#64748b", fontSize: "0.95rem" }}>
          By the {SITE.name} editorial desk · Updated {formatDate(g.updated)} · {g.readMins} min read
        </p>

        <nav aria-label="In this guide">
          <p style={{ fontWeight: 700, marginBottom: 0 }}>In this guide</p>
          <ul>
            {g.sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>
            ))}
          </ul>
        </nav>

        {g.sections.map((s) => (
          <section key={s.id}>
            <h2 id={s.id}>{s.heading}</h2>
            {s.body.map((p, i) => <p key={i}>{p}</p>)}
            {s.bullets && <ul>{s.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </section>
        ))}

        <p>
          <strong>See the live list:</strong> <Link href={`/category/${g.category}`}>open opportunities in this category</Link>.
        </p>
      </article>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-ink">More guides</h2>
        <ul className="mt-3 space-y-2">
          {others.map((o) => (
            <li key={o.slug}><Link href={`/guides/${o.slug}`} className="font-semibold text-emerald-700 underline">{o.title}</Link></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
