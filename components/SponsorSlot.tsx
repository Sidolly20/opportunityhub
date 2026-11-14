import Link from "next/link";

export default function SponsorSlot() {
  return (
    <aside aria-label="Sponsored" className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/60 p-5 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-700">Sponsored</p>
      <p className="mt-2 text-sm font-semibold text-ink">Your brand here</p>
      <p className="mt-1 text-xs text-slate-600">Reach African developers and students who are actively applying.</p>
      <Link href="/sponsor" className="mt-3 inline-block text-sm font-semibold text-emerald-700 underline">
        See sponsor options
      </Link>
    </aside>
  );
}
