import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE.name} handles your data.`,
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Privacy policy" }]} />
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink">Privacy policy</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-slate-700">
        <p>This is a plain template. Have it checked for your country before you run ads or collect emails at scale.</p>
        <p><strong>What we collect.</strong> If you join our email list, we store your email address to send you the weekly list. We may use basic analytics to see which pages are useful.</p>
        <p><strong>Cookies.</strong> We use only what is needed to run the site and any analytics or advertising you see disclosed on the page.</p>
        <p><strong>Third-party links.</strong> Opportunity pages link to other websites. We are not responsible for their privacy practices.</p>
        <p><strong>Your choices.</strong> You can unsubscribe at any time, or ask us to delete your email by writing to {SITE.sponsorEmail}.</p>
      </div>
    </div>
  );
}
