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

const ACCENT: Record<string, string> = {
  "Remote Jobs": "from-emerald-500 to-teal-500",
  Fellowships: "from-violet-500 to-fuchsia-500",
  Internships: "from-sky-500 to-cyan-500",
  Scholarships: "from-amber-500 to-orange-500",
  "Grants & Funding": "from-rose-500 to-pink-500",
  "Bootcamps & Training": "from-indigo-500 to-blue-500",
  News: "from-slate-500 to-slate-700",
};

function Pill({ icon, children }: { icon: "pin" | "calendar"; children: React.ReactNode }) {
  const common = {
    width: 13,
    height: 13,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "shrink-0 text-slate-400",
    "aria-hidden": true,
  };
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
      {icon === "pin" ? (
        <svg {...common}>
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      ) : (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      )}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function OpportunityCard({ o }: { o: Opportunity }) {
  const status = statusOf(o);
  const b = BADGE[status];
  const accent = ACCENT[o.category] ?? ACCENT.News;
  const countdown = status !== "news" ? countdownText(o.deadline) : "";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5">
      <div className={`h-1.5 w-full bg-gradient-to-r ${accent}`} aria-hidden />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {o.category}
          </span>
          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${b.cls}`}>
            {b.label}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
          <Link href={`/opportunity/${o.slug}`} className="after:absolute after:inset-0">
            {o.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{o.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill icon="pin">{o.location}</Pill>
          <Pill icon="calendar">{o.deadline ? formatDate(o.deadline) : "No fixed deadline"}</Pill>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="min-w-0">
            {countdown && (
              <p className={`text-xs font-semibold ${status === "closing-soon" ? "text-amber-700" : "text-slate-500"}`}>
                {countdown}
              </p>
            )}
            <p className="truncate text-xs text-slate-400">via {o.sourceName}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
            View
            <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
          </span>
        </div>
      </div>
    </article>
  );
}
