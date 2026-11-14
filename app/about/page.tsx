import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About & Editorial Policy",
  description: `How ${SITE.name} finds, checks and publishes opportunities, how we use AI, and how to send corrections.`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }])} />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">About {SITE.name}</h1>
      <div className="mt-6 space-y-5 leading-relaxed text-slate-700">
        <p>
          {SITE.name} helps Nigerians and other Africans find real remote tech jobs, fellowships, internships,
          scholarships and funding, without wading through old posts and scams.
        </p>
        <h2 className="pt-4 text-2xl font-bold text-ink">How we publish</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>We find public news and announcements through search feeds.</li>
          <li>An AI tool helps us draft a short, original summary of each item. We do not copy the original text.</li>
          <li>Every listing shows its source and links to the official page.</li>
          <li>Items whose deadline has passed are removed from the main list.</li>
          <li>We do not list anything that asks applicants to pay a fee.</li>
        </ul>
        <h2 className="pt-4 text-2xl font-bold text-ink">AI use, stated plainly</h2>
        <p>
          Summaries are drafted with AI help and can contain mistakes. They are not a replacement for the official
          page. Always check the rules, deadline and eligibility at the source before you apply.
        </p>
        <h2 className="pt-4 text-2xl font-bold text-ink">Sponsors and affiliate links</h2>
        <p>
          Sponsors and affiliate partners help pay for this site. They are always labelled, and they never change
          what we list or how we describe it.
        </p>
        <h2 className="pt-4 text-2xl font-bold text-ink">Corrections</h2>
        <p>
          Found a mistake or a scam? Write to <a className="font-semibold text-emerald-700 underline" href={`mailto:${SITE.sponsorEmail}`}>{SITE.sponsorEmail}</a>.
          We fix real errors quickly.
        </p>
      </div>
    </div>
  );
}
