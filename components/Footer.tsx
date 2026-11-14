import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORY_INFO } from "@/lib/categories";
import { GUIDES } from "@/lib/guides";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-extrabold text-white">{SITE.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{SITE.tagline}.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Browse</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORY_INFO.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">{c.h1}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Guides</p>
          <ul className="mt-3 space-y-2 text-sm">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link href={`/guides/${g.slug}`} className="hover:text-white">{g.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">About &amp; editorial policy</Link></li>
            <li><Link href="/sponsor" className="hover:text-white">Sponsor or submit</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {SITE.name}. Always apply through the official link and never pay to be considered.
        Some links may be affiliate or sponsored links and are marked clearly.
      </div>
    </footer>
  );
}
