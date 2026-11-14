import Link from "next/link";
import type { Metadata } from "next";
import DirectoryFilter from "@/components/DirectoryFilter";
import NewsletterBar from "@/components/NewsletterBar";
import { SITE } from "@/lib/site";
import { getActive } from "@/lib/data";
import { CATEGORY_INFO } from "@/lib/categories";
import { GUIDES } from "@/lib/guides";
import { daysLeft, formatDate } from "@/lib/dates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: `${SITE.name}: Remote Tech Jobs, Fellowships & Scholarships for Africans` },
  description: SITE.description,
  alternates: { canonical: "/" },
};

const FAQ = [
  {
    q: "Are these remote jobs really open to people in Nigeria and Africa?",
    a: "We read the location line of every post and only list roles that say they accept applicants from Africa or from anywhere. Even so, always confirm on the official page before you apply, because employers change their rules.",
  },
  {
    q: "Do I have to pay to apply for any of these opportunities?",
    a: "No. Real employers, fellowships and scholarships do not charge to consider you. If any page asks for a fee, treat it as a scam and tell us.",
  },
  {
    q: "How often is the list updated?",
    a: "Every morning. Closed opportunities drop off the main list so you do not waste time on dead links.",
  },
  {
    q: "Is the summary written by a person?",
    a: "Summaries are drafted with AI help from the public source and then published with a link to the original. Read the official page for the full rules. You can read how we work on our About page.",
  },
  {
    q: "How can my company or programme be listed?",
    a: "Use the Submit / Sponsor page. Genuine opportunities are listed free. Sponsors get extra visibility and are always labelled.",
  },
];

export default async function Home() {
  const items = await getActive();
  const list = items.slice(0, 90);
  const closingSoon = items.filter((o) => {
    const d = daysLeft(o.deadline);
    return d !== null && d >= 0 && d <= 14;
  }).length;
  const latest = items.reduce<string | null>((m, o) => (!m || o.createdAt > m ? o.createdAt : m), null);
  const updated = formatDate(latest ?? new Date().toISOString());

  return (
    <>
      {/* HERO */}
      <section className="hero-bg text-white">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:pb-20 md:pt-20">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" aria-hidden />
            Last updated {updated}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl">
            Remote tech jobs, fellowships and scholarships for Africans.
            <span className="text-emerald-400"> Checked. Sourced. Updated daily.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Stop scrolling through old posts and scams. Every listing here links to the official page, shows the real
            deadline, and tells you who can apply in plain words.
          </p>
          <div className="mt-8 max-w-3xl">
            <NewsletterBar />
          </div>
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 text-sm">
            <div><dt className="text-slate-400">Open now</dt><dd className="text-2xl font-bold">{items.length}</dd></div>
            <div><dt className="text-slate-400">Closing in 14 days</dt><dd className="text-2xl font-bold">{closingSoon}</dd></div>
            <div><dt className="text-slate-400">Categories</dt><dd className="text-2xl font-bold">{CATEGORY_INFO.length}</dd></div>
          </dl>
        </div>
      </section>

      {/* LIVE DIRECTORY */}
      <section id="directory" className="mx-auto max-w-6xl px-4 py-12" aria-labelledby="dir-h">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 id="dir-h" className="text-2xl font-extrabold text-ink md:text-3xl">Live opportunities</h2>
            <p className="mt-1 text-slate-600">Filter by category, location or deadline. No page reloads.</p>
          </div>
        </div>
        <DirectoryFilter items={list} />
      </section>

      {/* CATEGORY HUBS */}
      <section className="mx-auto max-w-6xl px-4 py-6" aria-labelledby="cat-h">
        <h2 id="cat-h" className="text-2xl font-extrabold text-ink">Browse by what you need</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_INFO.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md">
              <p className="font-bold text-ink">{c.h1}</p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* NOTEBOOK-STYLE EVERGREEN GUIDE */}
      <section className="mx-auto max-w-4xl px-4 py-14" aria-labelledby="guide-h">
        <article className="notebook rounded-2xl border border-slate-200 shadow-sm">
          <h2 id="guide-h" style={{ marginTop: 0 }}>A plain-English guide to finding opportunities from Africa</h2>
          <p>
            If you are a developer, designer, student or founder in Nigeria, Ghana, Kenya, South Africa or anywhere else on
            the continent, the internet has made one thing true: the opportunity can come to you. The hard part is
            separating the real ones from the noise.
          </p>
          <h2>Remote jobs: what to look for</h2>
          <p>
            A real remote job names the company, the role, the time zone and where you are allowed to live. Our{" "}
            <Link href="/category/remote-jobs">remote jobs page</Link> only lists posts that are open to Africa or to
            anywhere, and our <Link href="/guides/find-remote-tech-jobs-africa">step-by-step remote jobs guide</Link>{" "}
            shows how to read a post in two minutes.
          </p>
          <h2>Fellowships and scholarships: apply once, apply well</h2>
          <p>
            Fellowships and scholarships reward clear stories, not long ones. Check eligibility first, write plainly, and
            send before the last day. Start with the <Link href="/category/fellowships">fellowships list</Link> and the{" "}
            <Link href="/category/scholarships">scholarships list</Link>.
          </p>
          <h2>Stay safe</h2>
          <p>
            You should never pay to be considered. Read our <Link href="/guides/spot-fake-jobs-and-scholarships">scam
            checklist</Link> before you click apply on anything that looks too good to be true.
          </p>
        </article>
      </section>

      {/* GUIDES */}
      <section className="mx-auto max-w-6xl px-4 pb-6" aria-labelledby="g-h">
        <h2 id="g-h" className="text-2xl font-extrabold text-ink">Guides from the editorial desk</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-md">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">{g.readMins} min read</p>
              <p className="mt-2 font-bold text-ink">{g.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600">{g.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 py-10" aria-labelledby="trust-h">
        <div className="rounded-2xl bg-ink p-8 text-slate-300 md:p-10">
          <h2 id="trust-h" className="text-2xl font-extrabold text-white">How we keep this trustworthy</h2>
          <ul className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <li><strong className="text-white">Source first.</strong> Every listing links to the original page. We never copy the original text.</li>
            <li><strong className="text-white">Plain words.</strong> We rewrite in clear language and state what is not known.</li>
            <li><strong className="text-white">No fees.</strong> We never list anything that asks you to pay to apply.</li>
          </ul>
          <Link href="/about" className="mt-5 inline-block text-sm font-semibold text-emerald-400 underline">Read our editorial policy</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-10" aria-labelledby="faq-h">
        <h2 id="faq-h" className="text-2xl font-extrabold text-ink">Frequently asked questions</h2>
        <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold text-ink">
                <span className="mr-2 text-emerald-600 group-open:hidden">+</span>
                <span className="mr-2 hidden text-emerald-600 group-open:inline">–</span>
                {f.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
