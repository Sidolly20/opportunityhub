"use client";

import { useMemo, useState } from "react";
import type { Opportunity } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { daysLeft } from "@/lib/dates";
import OpportunityCard from "./OpportunityCard";

export default function DirectoryFilter({
  items,
  lockedCategory,
}: {
  items: Opportunity[];
  lockedCategory?: string;
}) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>(lockedCategory ?? "All");
  const [closingSoon, setClosingSoon] = useState(false);
  const [location, setLocation] = useState("All");

  const locations = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.location))).sort()],
    [items]
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((o) => {
      if (category !== "All" && o.category !== category) return false;
      if (location !== "All" && o.location !== location) return false;
      if (closingSoon) {
        const d = daysLeft(o.deadline);
        if (d === null || d < 0 || d > 14) return false;
      }
      if (needle) {
        const hay = `${o.title} ${o.summary} ${o.location} ${o.eligibility.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [items, q, category, closingSoon, location]);

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
      active
        ? "border-emerald-600 bg-emerald-600 text-white"
        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300"
    }`;

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search opportunities</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by role, programme or keyword"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:bg-white"
            />
          </label>
          <label>
            <span className="sr-only">Location or eligibility</span>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm md:w-56"
            >
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l === "All" ? "Any location" : l}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setClosingSoon((v) => !v)}
            aria-pressed={closingSoon}
            className={chip(closingSoon)}
          >
            ⏳ Closing soon
          </button>
        </div>

        {!lockedCategory && (
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Categories">
            {["All", ...CATEGORIES].map((c) => (
              <button key={c} type="button" onClick={() => setCategory(c)} className={chip(category === c)}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-slate-500" aria-live="polite">
        Showing <strong className="text-slate-800">{shown.length}</strong> of {items.length}
      </p>

      {shown.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          Nothing matches those filters yet. Try clearing a filter or check back tomorrow.
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((o) => (
            <OpportunityCard key={o.id} o={o} />
          ))}
        </div>
      )}
    </div>
  );
}
