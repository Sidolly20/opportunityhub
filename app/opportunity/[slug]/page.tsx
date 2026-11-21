import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import NewsletterBar from "@/components/NewsletterBar";
import SponsorSlot from "@/components/SponsorSlot";
import OpportunityCard from "@/components/OpportunityCard";
import { getAll, getBySlug } from "@/lib/store";
import { SITE } from "@/lib/site";
import { abs, articleLd, breadcrumbLd, faqLd, isIndexable } from "@/lib/seo";
import { categorySlug } from "@/lib/categories";
import { AFFILIATES } from "@/lib/affiliates";
import { countdownText, formatDate, statusOf } from "@/lib/dates";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const o = await getBySlug(slug);
  if (!o) return { title: "Not found", robots: { index: false } };
  const url = `/opportunity/${o.slug}`;
  const closed = statusOf(o) === "closed";
  const desc = o.summary.length > 155 ? `${o.summary.slice(0, 152)}…` : o.summary;
  return {
    title: o.title,
    description: desc,
    alternates: { canonical: url },
    robots: closed || !isIndexable(o) ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type: "article",
      title: o.title,
      description: desc,
      url: abs(url),
      siteName: SITE.name,
      publishedTime: o.publishedAt,
      modifiedTime: o.checkedAt ?? o.createdAt,
      section: o.category,
    },
    twitter: { card: "summary_large_image", title: o.title, description: desc },
  };
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params;
  const o = await getBySlug(slug);
  if (!o) notFound();

  const status = statusOf(o);
  const catSlug = categorySlug(o.category);
  const all = await getAll();
  const related = all.filter((x) => x.category === o.category && x.id !== o.id && statusOf(x) !== "closed").slice(0, 3);

  const genericSteps = [
    "Open the official page using the button below and read the full rules.",
    "Check the eligibility list above against your own situation, one line at a time.",
    "Prepare what is usually needed: an updated CV, a short statement, and any links to your work.",
    o.deadline
      ? `Submit before ${formatDate(o.deadline)}. Aim to send it at least two days early.`
      : "Submit as early as you can, because rolling roles can close without warning.",
    "Save a copy of what you sent, and never pay anyone to be considered.",
  ];
  const steps = o.applySteps && o.applySteps.length > 0 ? o.applySteps : genericSteps;
  const applyUrl = o.officialUrl ?? o.sourceUrl;

  return (
    <>
      <JsonLd data={articleLd(o)} />
      {o.faqs && o.faqs.length > 0 && <JsonLd data={faqLd(o.faqs)} />}
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: o.category, path: `/category/${catSlug}` },
          { name: o.title, path: `/opportunity/${o.slug}` },
        ])}
      />

      <div className="mx-auto max-w-6xl px-4 pb-6 pt-8">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: o.category, href: `/category/${catSlug}` },
            { name: o.title },
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article>
            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">{o.category}</span>
                {status === "closed" && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">Closed</span>}
                {status === "closing-soon" && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-800 ring-1 ring-inset ring-amber-600/30">Closing soon</span>}
              </div>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">{o.title}</h1>
              <p className="mt-4 text-lg leading-relaxed text-slate-700">{o.summary}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm md:grid-cols-4">
                <div><dt className="text-slate-400">Deadline</dt><dd className="mt-1 font-semibold text-ink">{o.deadline ? formatDate(o.deadline) : "Not stated"}</dd></div>
                <div><dt className="text-slate-400">Time left</dt><dd className="mt-1 font-semibold text-ink">{o.category === "News" ? "n/a" : countdownText(o.deadline)}</dd></div>
                <div><dt className="text-slate-400">Location</dt><dd className="mt-1 font-semibold text-ink">{o.location}</dd></div>
                <div><dt className="text-slate-400">Source</dt><dd className="mt-1 font-semibold text-ink">{o.sourceName}</dd></div>
              </dl>
              <p className="mt-3 text-xs text-slate-500">
                Published {formatDate(o.publishedAt)} · {o.checkedAt ? `Checked against the official page on ${formatDate(o.checkedAt)}` : `Added ${formatDate(o.createdAt)}`}
              </p>
            </header>

            <section className="mt-10" aria-labelledby="why">
              <h2 id="why" className="text-2xl font-bold text-ink">Why this matters</h2>
              <ul className="mt-4 space-y-3">
                {o.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex gap-3 text-slate-700">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700" aria-hidden>✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </section>

            {(o.whoItsFor || o.whoShouldSkip || o.theCatch) && (
              <section className="mt-10 space-y-4" aria-labelledby="fit">
                <h2 id="fit" className="text-2xl font-bold text-ink">Is this right for you?</h2>
                {o.whoItsFor && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
                    <p className="text-sm font-semibold text-emerald-800">Who it suits</p>
                    <p className="mt-1 text-slate-700">{o.whoItsFor}</p>
                  </div>
                )}
                {o.whoShouldSkip && (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-600">Who should skip it</p>
                    <p className="mt-1 text-slate-700">{o.whoShouldSkip}</p>
                  </div>
                )}
                {o.theCatch && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                    <p className="text-sm font-semibold text-amber-800">The catch</p>
                    <p className="mt-1 text-slate-700">{o.theCatch}</p>
                  </div>
                )}
              </section>
            )}

            <section className="mt-10" aria-labelledby="elig">
              <h2 id="elig" className="text-2xl font-bold text-ink">Eligibility checklist</h2>
              {o.eligibility.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {o.eligibility.map((e, i) => (
                    <li key={i} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 text-slate-700">
                      <span aria-hidden className="text-slate-300">☐</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-slate-600">The source does not state clear eligibility rules. Check the official page before you apply.</p>
              )}
            </section>

            <section className="mt-10" aria-labelledby="steps">
              <h2 id="steps" className="text-2xl font-bold text-ink">Step-by-step: how to apply</h2>
              <ol className="mt-4 space-y-4">
                {steps.map((s, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                    <p className="pt-1 text-slate-700">{s}</p>
                  </li>
                ))}
              </ol>
              <a
                href={applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white shadow hover:bg-emerald-700"
              >
                Go to the official source ↗
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Source: {o.sourceName}. We summarise in our own words and link to the original. Always confirm details on the official page.
              </p>
            </section>
            {o.faqs && o.faqs.length > 0 && (
              <section className="mt-10" aria-labelledby="faq">
                <h2 id="faq" className="text-2xl font-bold text-ink">Questions people ask</h2>
                <dl className="mt-4 space-y-4">
                  {o.faqs.map((f, i) => (
                    <div key={i}>
                      <dt className="font-semibold text-ink">{f.q}</dt>
                      <dd className="mt-1 text-slate-700">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="Sidebar">
            <SponsorSlot />

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Recommended · affiliate</p>
              <ul className="mt-3 space-y-3">
                {AFFILIATES.map((a) => (
                  <li key={a.name}>
                    <a href={a.url} target="_blank" rel="sponsored nofollow noopener" className="block rounded-xl border border-slate-100 p-3 hover:border-emerald-300">
                      <span className="block text-sm font-semibold text-ink">{a.name}</span>
                      <span className="block text-xs text-slate-500">{a.blurb}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">We may earn a commission if you buy through these links. It never changes what we list.</p>
            </div>

            <div className="hero-bg rounded-2xl p-5 text-white">
              <p className="font-bold">Get the weekly list</p>
              <p className="mb-3 mt-1 text-sm text-slate-300">New opportunities, one short email.</p>
              <NewsletterBar compact />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16" aria-labelledby="rel">
            <h2 id="rel" className="text-2xl font-bold text-ink">More in {o.category}</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {related.map((r) => <OpportunityCard key={r.id} o={r} />)}
            </div>
            <Link href={`/category/${catSlug}`} className="mt-5 inline-block font-semibold text-emerald-700 underline">
              See all {o.category.toLowerCase()}
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
