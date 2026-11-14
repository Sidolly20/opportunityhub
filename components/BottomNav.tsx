"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Icon = "home" | "briefcase" | "award" | "cap" | "book";

const ITEMS: { href: string; label: string; icon: Icon }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/category/remote-jobs", label: "Jobs", icon: "briefcase" },
  { href: "/category/fellowships", label: "Fellowships", icon: "award" },
  { href: "/category/scholarships", label: "Scholarships", icon: "cap" },
  { href: "/guides", label: "Guides", icon: "book" },
];

function IconSvg({ name, className }: { name: Icon; className?: string }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "briefcase":
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="9" r="6" />
          <path d="m8.2 14.2-1.2 7.8 5-3 5 3-1.2-7.8" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M22 10 12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z" />
        </svg>
      );
  }
}

export default function BottomNav() {
  const pathname = usePathname() || "/";

  return (
    <nav
      aria-label="Quick menu"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {ITEMS.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition ${
                  active ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                <span
                  className={`grid h-8 w-14 place-items-center rounded-full transition ${
                    active ? "bg-emerald-100" : ""
                  }`}
                >
                  <IconSvg name={item.icon} />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
