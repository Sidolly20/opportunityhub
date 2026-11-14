import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORY_INFO } from "@/lib/categories";
import SearchButton, { type SearchItem } from "./SearchButton";

export default function Navbar({ index }: { index: SearchItem[] }) {
  const links = CATEGORY_INFO.filter((c) => c.name !== "News" && c.name !== "Internships");
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-[17px] font-extrabold tracking-tight text-ink">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-600/30"
            aria-hidden
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2 22 12 12 22 2 12z" />
            </svg>
          </span>
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink"
            >
              {c.navLabel}
            </Link>
          ))}
          <Link
            href="/guides"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-ink"
          >
            Guides
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton index={index} />
          <Link
            href="/sponsor"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            <span className="hidden sm:inline">Submit / Sponsor</span>
            <span className="sm:hidden">Post</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
