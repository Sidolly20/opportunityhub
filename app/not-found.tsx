import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-5xl font-extrabold text-ink">404</p>
      <p className="mt-3 text-slate-600">That page has closed or moved. The live list is always up to date.</p>
      <Link href="/" className="mt-6 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white">
        Back to all opportunities
      </Link>
    </div>
  );
}
