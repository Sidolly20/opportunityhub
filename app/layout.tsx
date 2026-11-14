import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { siteLd } from "@/lib/seo";
import { getActive } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} | ${SITE.tagline}`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: "en_NG",
  },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "ubILvCdiyRNkx7JySH30ud7IQtSTNsd1LVZCb4QxhFc",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0b1220" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const items = await getActive();
  const index = items.slice(0, 300).map((o) => ({ title: o.title, slug: o.slug, category: o.category }));
  return (
    <html lang="en">
      <body className="bg-slate-50">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[70] focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Navbar index={index} />
        <div className="pb-24 md:pb-0">
          <main id="main">{children}</main>
          <Footer />
        </div>
        <BottomNav />
        <JsonLd data={siteLd()} />
      </body>
    </html>
  );
}
