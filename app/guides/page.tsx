import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { GUIDES } from "@/lib/guides";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guides: Remote Jobs, Fellowships & Scholarships for Africans",
  description: "Plain-English guides on finding remote tech jobs, applying for fellowships and avoiding scams, written for Africans.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Guides" }]} />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Guides</h1>
      <p className="mt-3 max-w-2xl text-slate-600">Short, practical guides to help you find real opportunities and apply with confidence.</p>
      <div className="mt-8 space-y-4">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-300 hover:shadow-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{g.readMins} min read</p>
            <h2 className="mt-1 text-xl font-bold text-ink">{g.title}</h2>
            <p className="mt-2 text-slate-600">{g.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
