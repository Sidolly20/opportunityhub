export const SITE = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "AfriRemote Hub",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  tagline: "Verified remote tech jobs, fellowships and scholarships for Africans",
  description:
    "A daily-updated, human-checked directory of remote tech jobs, fellowships, internships, scholarships and funding for Nigerians and Africans. Every listing links to the official source.",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL || "",
  newsletterAction: process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || "",
  sponsorEmail: process.env.SPONSOR_EMAIL || "hello@example.com",
};
