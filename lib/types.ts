import { z } from "zod";

export const CATEGORIES = [
  "Remote Jobs",
  "Fellowships",
  "Internships",
  "Scholarships",
  "Grants & Funding",
  "Bootcamps & Training",
  "News",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** What Gemini must return for ONE item. */
export const AiItemSchema = z.object({
  isRelevant: z.boolean(),
  title: z.string().min(5).max(160),
  category: z.enum(CATEGORIES),
  deadline: z.string().nullable(), // ISO date "YYYY-MM-DD" or null
  eligibility: z.array(z.string()).max(8),
  location: z.string().max(80), // e.g. "Remote - Africa", "Nigeria"
  summary: z.string().min(30).max(500),
  keyTakeaways: z.array(z.string()).min(1).max(6),
  // New quality fields. All optional so old saved items keep working.
  whoItsFor: z.string().max(500).nullish(),
  whoShouldSkip: z.string().max(500).nullish(),
  theCatch: z.string().max(500).nullish(),
  applySteps: z.array(z.string().max(300)).max(6).nullish(),
  faqs: z
    .array(z.object({ q: z.string().max(200), a: z.string().max(600) }))
    .max(4)
    .nullish(),
  quality: z.number().min(0).max(10).nullish(),
});
export type AiItem = z.infer<typeof AiItemSchema>;

/** What we save and show on the site. */
export interface Opportunity extends Omit<AiItem, "isRelevant"> {
  id: string; // hash, used for dedupe
  slug: string;
  sourceName: string;
  sourceUrl: string; // the original link we found
  officialUrl?: string; // the official page we actually read
  publishedAt: string; // ISO
  createdAt: string; // ISO
  checkedAt?: string; // ISO, last time the official page was read
}
