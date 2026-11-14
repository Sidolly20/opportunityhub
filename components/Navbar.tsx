import Link from "next/link";
import { SITE } from "@/lib/site";
import { CATEGORY_INFO } from "@/lib/categories";
import SearchButton, { type SearchItem } from "./SearchButton";

export default function Navbar({ index }: { index: SearchItem[] }) {
  const links = CATEGORY_INFO.filter((c) => c.name !== "News" && c.name !== "Internships");
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-ink">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-600 text-white" aria-hidden>
            ◆
          </span>
          {SITE.name}
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink"
            >
              {c.navLabel}
            </Link>
          ))}
          <Link href="/guides" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-ink">
            Guides
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchButton index={index} />
          <Link
            href="/sponsor"
            className="rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <span className="hidden sm:inline">Submit / Sponsor</span>
            <span className="sm:hidden">Sponsor</span>
          </Link>
        </div>
      </div>

      <nav aria-label="Categories" className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-1.5 lg:hidden">
        {CATEGORY_INFO.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="whitespace-nowrap rounded-full px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
          >
            {c.navLabel}
          </Link>
        ))}
        <Link href="/guides" className="whitespace-nowrap rounded-full px-3 py-1 text-sm text-slate-600 hover:bg-slate-100">
          Guides
        </Link>
      </nav>
    </header>
  );
}
