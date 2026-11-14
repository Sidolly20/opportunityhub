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
});
export type AiItem = z.infer<typeof AiItemSchema>;

/** What we save and show on the site. */
export interface Opportunity extends Omit<AiItem, "isRelevant"> {
  id: string; // hash, used for dedupe
  slug: string;
  sourceName: string;
  sourceUrl: string; // always link back to the original
  publishedAt: string; // ISO
  createdAt: string; // ISO
}
