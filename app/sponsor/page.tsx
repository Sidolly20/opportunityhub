import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sponsor or Submit an Opportunity",
  description: `Submit a genuine opportunity or sponsor ${SITE.name} to reach African developers, students and founders.`,
  alternates: { canonical: "/sponsor" },
};

const OPTIONS = [
  { t: "Submit an opportunity", d: "Genuine jobs, fellowships, scholarships and programmes are listed free. Send the official link, deadline and who can apply." },
  { t: "Featured listing", d: "Your opportunity pinned at the top of its category for a set time, clearly labelled as sponsored." },
  { t: "Sidebar banner", d: "A banner slot on every opportunity page, in front of people who are actively applying." },
  { t: "Newsletter sponsor", d: "A short sponsor note in the weekly email list." },
];

export default function Sponsor() {
  const mail = `mailto:${SITE.sponsorEmail}`;
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Sponsor / Submit" }]} />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Sponsor or submit</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Reach African developers, students and founders at the moment they are looking for their next step.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {OPTIONS.map((o) => (
          <div key={o.t} className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="font-bold text-ink">{o.t}</h2>
            <p className="mt-2 text-sm text-slate-600">{o.d}</p>
          </div>
        ))}
      </div>
      <a href={mail} className="mt-8 inline-block rounded-xl bg-emerald-600 px-6 py-3.5 font-bold text-white hover:bg-emerald-700">
        Email us: {SITE.sponsorEmail}
      </a>
      <p className="mt-4 text-xs text-slate-500">Sponsored content is always labelled and never changes our editorial choices.</p>
    </div>
  );
}
