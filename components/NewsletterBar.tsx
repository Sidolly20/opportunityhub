import { SITE } from "@/lib/site";

export default function NewsletterBar({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur ${compact ? "" : "md:flex md:items-center md:gap-4"}`}
    >
      <form
        action={SITE.newsletterAction || undefined}
        method="post"
        className={`flex flex-1 flex-col gap-2 sm:flex-row ${SITE.newsletterAction ? "" : "pointer-events-none opacity-70"}`}
      >
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            name="email"
            required
            placeholder="Your email for the weekly list"
            className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </label>
        <button type="submit" className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-ink hover:bg-emerald-400">
          Get the weekly list
        </button>
      </form>
      {SITE.whatsapp && (
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 md:mt-0"
        >
          💬 Join WhatsApp
        </a>
      )}
    </div>
  );
}
