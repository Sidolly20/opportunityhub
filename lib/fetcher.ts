import Parser from "rss-parser";
import { GoogleGenerativeAI } from "@google/generative-ai";
import slugify from "slugify";
import { createHash } from "crypto";
import { AiItemSchema, CATEGORIES, type Opportunity } from "./types";
import { getAll, saveMany } from "./store";

/* ------------------------------------------------------------------ */
/* 1. SETTINGS - change these to change your niche                     */
/* ------------------------------------------------------------------ */

const NICHE =
  "verified remote tech jobs, fellowships, internships, scholarships and funding for Africans";

/** Google News RSS search queries. Add or remove freely. */
const QUERIES = [
  "remote jobs Africa developers",
  "fellowship 2027 Africa application open",
  "tech internship Nigeria 2027",
  "scholarship Africans 2027 deadline",
  "grant funding African startups 2027",
  "remote work Africa hiring tech",
];

const MAX_ITEMS_PER_FEED = 8;
const MAX_NEW_PER_RUN = 15; // keeps you inside the free Gemini limit
const MAX_AGE_DAYS = 30;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const DELAY_BETWEEN_AI_CALLS_MS = 4500; // free tier is about 15 calls/min

/* ------------------------------------------------------------------ */
/* 2. SMALL HELPERS                                                    */
/* ------------------------------------------------------------------ */

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; OpportunityHubBot/1.0)" },
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function feedUrl(query: string) {
  const q = encodeURIComponent(`${query} when:14d`);
  return `https://news.google.com/rss/search?q=${q}&hl=en-NG&gl=NG&ceid=NG:en`;
}

function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeTitle(s: string) {
  return s
    .toLowerCase()
    .replace(/ - [^-]+$/, "") // Google News adds " - Source Name"
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function makeId(title: string, sourceName: string) {
  return createHash("sha256")
    .update(`${normalizeTitle(title)}|${sourceName.toLowerCase()}`)
    .digest("hex")
    .slice(0, 24);
}

/** 0 to 1. How similar two titles are (word overlap). */
function similarity(a: string, b: string) {
  const A = new Set(normalizeTitle(a).split(" ").filter((w) => w.length > 2));
  const B = new Set(normalizeTitle(b).split(" ").filter((w) => w.length > 2));
  if (!A.size || !B.size) return 0;
  let shared = 0;
  A.forEach((w) => B.has(w) && shared++);
  return shared / (A.size + B.size - shared);
}

function isIsoDate(s: string | null): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s));
}

/* ------------------------------------------------------------------ */
/* 3. STEP A - read the RSS feeds                                      */
/* ------------------------------------------------------------------ */

interface RawItem {
  title: string;
  link: string;
  sourceName: string;
  snippet: string;
  publishedAt: string;
}

async function readFeeds(): Promise<RawItem[]> {
  const results = await Promise.allSettled(
    QUERIES.map((q) => parser.parseURL(feedUrl(q)))
  );

  const cutoff = Date.now() - MAX_AGE_DAYS * 86_400_000;
  const items: RawItem[] = [];

  results.forEach((res, i) => {
    if (res.status === "rejected") {
      console.warn(`[fetcher] Feed failed for "${QUERIES[i]}":`, res.reason?.message);
      return;
    }
    for (const it of res.value.items.slice(0, MAX_ITEMS_PER_FEED)) {
      if (!it.title || !it.link) continue;
      const published = it.isoDate || it.pubDate;
      const ts = published ? Date.parse(published) : Date.now();
      if (isNaN(ts) || ts < cutoff) continue;

      const rawSource =
        (it as unknown as { source?: string }).source ||
        it.title.match(/ - ([^-]+)$/)?.[1] ||
        "Google News";

      items.push({
        title: it.title,
        link: it.link,
        sourceName: String(rawSource).trim(),
        snippet: stripHtml(it.contentSnippet || it.content || ""),
        publishedAt: new Date(ts).toISOString(),
      });
    }
  });

  return items;
}

/* ------------------------------------------------------------------ */
/* 4. STEP B - remove duplicates                                       */
/* ------------------------------------------------------------------ */

function dedupe(raw: RawItem[], existing: Opportunity[]): RawItem[] {
  const knownIds = new Set(existing.map((o) => o.id));
  const knownTitles = existing.map((o) => o.title);
  const kept: RawItem[] = [];

  for (const item of raw) {
    const id = makeId(item.title, item.sourceName);
    if (knownIds.has(id)) continue;

    const nearDuplicate =
      knownTitles.some((t) => similarity(t, item.title) >= 0.7) ||
      kept.some((k) => similarity(k.title, item.title) >= 0.7);
    if (nearDuplicate) continue;

    kept.push(item);
  }
  return kept;
}

/* ------------------------------------------------------------------ */
/* 5. STEP C - ask Gemini to make clean, original structured data      */
/* ------------------------------------------------------------------ */

function buildPrompt(item: RawItem) {
  const today = new Date().toISOString().slice(0, 10);
  return `You are an editor for a website about ${NICHE}.
Today is ${today}.

Read this news item and return ONE JSON object. Rules:
- "isRelevant": true only if this is a REAL, currently useful opportunity or important news for ${NICHE}. False for opinion, ads, old events, or off-topic.
- Write everything in YOUR OWN WORDS. Never copy sentences from the source.
- Only use facts that appear in the text below. If something is unknown, do not invent it.
- "deadline": "YYYY-MM-DD" if clearly stated, otherwise null.
- "category": one of ${CATEGORIES.join(", ")}.
- "eligibility": short bullet strings (who can apply). Use [] if not stated.
- "location": for example "Remote - Africa", "Nigeria", "Global". Use "Not stated" if unknown.
- "summary": 40 to 70 words, plain and helpful.
- "keyTakeaways": 3 to 5 short bullet strings.
- "title": clear, under 100 characters, no source name.

Return JSON with exactly these keys: isRelevant, title, category, deadline, eligibility, location, summary, keyTakeaways.

SOURCE TITLE: ${item.title}
SOURCE NAME: ${item.sourceName}
SOURCE TEXT: ${item.snippet || "(no extra text)"}`;
}

async function structure(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  item: RawItem,
  errors: string[]
): Promise<Opportunity | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await model.generateContent(buildPrompt(item));
      const text = res.response.text();
      const parsed = AiItemSchema.safeParse(JSON.parse(text));
      if (!parsed.success) {
        console.warn(`[fetcher] Bad AI shape (try ${attempt}):`, item.title);
        continue;
      }
      const ai = parsed.data;
      if (!ai.isRelevant) return null;

      const deadline = isIsoDate(ai.deadline) ? ai.deadline : null;
      // Skip anything whose deadline has already passed.
      if (deadline && Date.parse(deadline) < Date.now() - 86_400_000) return null;

      const id = makeId(item.title, item.sourceName);
      const { isRelevant, ...rest } = ai;
      void isRelevant;

      return {
        ...rest,
        deadline,
        id,
        slug: `${slugify(ai.title, { lower: true, strict: true }).slice(0, 70)}-${id.slice(0, 6)}`,
        sourceName: item.sourceName,
        sourceUrl: item.link,
        publishedAt: item.publishedAt,
        createdAt: new Date().toISOString(),
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[fetcher] Gemini error (try ${attempt}): ${msg}`);

      // Remember a few distinct Gemini errors so they show up in the run summary.
      const short = msg.slice(0, 300);
      if (errors.length < 3 && !errors.includes(short)) errors.push(short);

      // A missing or retired model will never work on a retry, so stop early.
      if (/404|not found|no longer available/i.test(msg)) return null;

      if (/429|quota|rate/i.test(msg)) await sleep(20_000);
      else await sleep(1500);
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* 6. MAIN FUNCTION - called by the cron route                         */
/* ------------------------------------------------------------------ */

export interface IngestReport {
  feedItems: number;
  afterDedupe: number;
  saved: number;
  skipped: number;
  errors: string[];
}

export async function runIngestion(): Promise<IngestReport> {
  const report: IngestReport = { feedItems: 0, afterDedupe: 0, saved: 0, skipped: 0, errors: [] };

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    report.errors.push("GEMINI_API_KEY is missing");
    return report;
  }

  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: { responseMimeType: "application/json", temperature: 0.3 },
  });

  let raw: RawItem[] = [];
  try {
    raw = await readFeeds();
  } catch (e) {
    report.errors.push(`readFeeds: ${(e as Error).message}`);
    return report;
  }
  report.feedItems = raw.length;

  const existing = await getAll();
  const fresh = dedupe(raw, existing)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, MAX_NEW_PER_RUN);
  report.afterDedupe = fresh.length;

  const toSave: Opportunity[] = [];
  for (const item of fresh) {
    const result = await structure(model, item, report.errors);
    if (result) toSave.push(result);
    else report.skipped++;
    await sleep(DELAY_BETWEEN_AI_CALLS_MS);
  }

  try {
    await saveMany(toSave);
    report.saved = toSave.length;
  } catch (e) {
    report.errors.push(`saveMany: ${(e as Error).message}`);
  }

  console.log("[fetcher] Done:", report);
  return report;
}
