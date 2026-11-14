import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import { countdownText, formatDate, statusOf, type Status } from "@/lib/dates";

const BADGE: Record<Status, { label: string; cls: string }> = {
  open: { label: "Open", cls: "bg-emerald-50 text-emerald-700 ring-emerald-600/20" },
  "closing-soon": { label: "Closing soon", cls: "bg-amber-50 text-amber-800 ring-amber-600/30" },
  rolling: { label: "Rolling", cls: "bg-sky-50 text-sky-700 ring-sky-600/20" },
  closed: { label: "Closed", cls: "bg-slate-100 text-slate-500 ring-slate-400/30" },
  news: { label: "News", cls: "bg-violet-50 text-violet-700 ring-violet-600/20" },
};

export default function OpportunityCard({ o }: { o: Opportunity }) {
  const status = statusOf(o);
  const b = BADGE[status];
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${b.cls}`}>
          {b.label}
        </span>
        <span className="text-xs font-medium text-slate-500">{o.category}</span>
      </div>

      <h3 className="text-lg font-bold leading-snug text-ink">
        <Link href={`/opportunity/${o.slug}`} className="after:absolute after:inset-0">
          {o.title}
        </Link>
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{o.summary}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-xs">
        <div>
          <dt className="text-slate-400">Deadline</dt>
          <dd className="mt-0.5 font-semibold text-slate-800">
            {o.deadline ? formatDate(o.deadline) : "Not stated"}
          </dd>
          {status !== "news" && (
            <dd className={`mt-0.5 ${status === "closing-soon" ? "font-semibold text-amber-700" : "text-slate-500"}`}>
              {countdownText(o.deadline)}
            </dd>
          )}
        </div>
        <div>
          <dt className="text-slate-400">Location</dt>
          <dd className="mt-0.5 font-semibold text-slate-800">{o.location}</dd>
          <dd className="mt-0.5 text-slate-500">via {o.sourceName}</dd>
        </div>
      </dl>

      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
        View details <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
      </span>
    </article>
  );
}
