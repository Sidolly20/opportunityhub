"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface SearchItem {
  title: string;
  slug: string;
  category: string;
}

export default function SearchButton({ index }: { index: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else setQ("");
  }, [open]);

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    const list = n ? index.filter((i) => i.title.toLowerCase().includes(n)) : index;
    return list.slice(0, 8);
  }, [q, index]);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/opportunity/${slug}`);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 hover:border-emerald-300"
        aria-label="Search"
      >
        <span aria-hidden>🔍</span>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 text-[11px] sm:inline">⌘K</kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Search opportunities"
        >
          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && results[0] && go(results[0].slug)}
              placeholder="Search jobs, fellowships, scholarships…"
              className="w-full border-b border-slate-100 px-5 py-4 text-base outline-none"
            />
            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-slate-500">No matches</li>}
              {results.map((r) => (
                <li key={r.slug}>
                  <button
                    type="button"
                    onClick={() => go(r.slug)}
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-emerald-50"
                  >
                    <span className="font-medium text-slate-800">{r.title}</span>
                    <span className="shrink-0 text-xs text-slate-400">{r.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
