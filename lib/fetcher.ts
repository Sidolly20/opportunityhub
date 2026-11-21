import Parser from "rss-parser";
import { GoogleGenAI } from "@google/genai";
import slugify from "slugify";
import { createHash } from "crypto";
import { z } from "zod";
import { AiItemSchema, CATEGORIES, type Opportunity } from "./types";
import { statusOf } from "./dates";
import { getAll, saveMany } from "./store";
import { fetchRemotiveJobs } from "./sources/remotive";

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
  "remote software developer jobs open to Nigeria 2027",
  "remote data analyst job Africa hiring now",
  "free coding bootcamp Africa 2027",
  "free tech training Africans scholarship 2027",
  "free online tech course Africa certificate 2027",
];

const MAX_ITEMS_PER_FEED = 8;
const MAX_NEW_PER_RUN = 12; // safe batch size for free tier
const MAX_AGE_DAYS = 30;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const DELAY_BETWEEN_AI_CALLS_MS = 4500; // keeps you comfortably under per-minute limits

// Quality rules (the "robot editor"). Change these numbers to be stricter or looser.
const MAX_REFRESH_PER_RUN = 6; // old listings upgraded or re-checked each day
const RECHECK_AFTER_DAYS = 14; // re-read the official page after this many days
const MIN_QUALITY = 6; // Gemini scores the official page 0-10; below this = not published
const MIN_PAGE_CHARS = 700; // official page must have at least this much readable text
const MAX_PAGE_CHARS = 12000; // how much of the page we hand to Gemini
const ALLOW_NEWS = false; // news-only items are thin; keep off for quality

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
async function fetchPage(url: string): Promise<Page | null> {
  try {
    if (!/^https?:\/\//i.test(url)) return null;
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") || "";
    if (!type.includes("html")) return null;
    const html = (await res.text()).slice(0, 1_500_000);
    return { url: res.url || url, html, text: htmlToText(html) };
  } catch {
    return null;
  }
}

function extractLinks(html: string, base: string): { text: string; url: string }[] {
  const out: { text: string; url: string }[] = [];
  const seen = new Set<string>();
  const baseHost = new URL(base).hostname;
  const re = /<a\s[^>]*?href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < 40) {
    try {
      const u = new URL(m[1], base);
      if (!/^https?:$/.test(u.protocol)) continue;
      if (SKIP_HOSTS.test(u.hostname) || u.hostname === baseHost) continue;
      u.hash = "";
      const key = u.toString();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ text: stripHtml(m[2]).slice(0, 80), url: key });
    } catch {
      /* ignore bad links */
    }
  }
  return out;
}

/** Google News links are wrapped. This unwraps them to the real article address (best effort). */
async function resolveArticleUrl(link: string): Promise<string | null> {
  let host = "";
  try {
    host = new URL(link).hostname;
  } catch {
    return null;
  }
  if (host !== "news.google.com") return link;

  const id = link.match(/articles\/([^?/]+)/)?.[1];
  if (!id) return null;

  // Old style links hide the address inside the id itself.
  try {
    const decoded = Buffer.from(id.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("latin1");
    const found = decoded.match(/https?:\/\/[\x21-\x7e]+/);
    if (found && !found[0].includes("news.google.com")) return found[0];
  } catch {
    /* fall through */
  }

  // New style links: ask Google's own page for the real address.
  try {
    const page = await fetch(`https://news.google.com/rss/articles/${id}`, {
      headers: { "User-Agent": BROWSER_UA },
      signal: AbortSignal.timeout(15000),
    });
    const html = await page.text();
    const sig = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
    const ts = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
    if (!sig || !ts) return null;
    const inner =
      `["garturlreq",[["X","X",["X","X"],null,null,1,1,"US:en",null,1,null,null,null,null,null,0,1],"X","X",1,[1,1,1],1,1,null,0,0,null,0],"${id}",${ts},"${sig}"]`;
    const body = "f.req=" + encodeURIComponent(JSON.stringify([[["Fbv4je", inner]]]));
    const res = await fetch("https://news.google.com/_/DotsSplashUi/data/batchexecute", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": BROWSER_UA,
      },
      body,
      signal: AbortSignal.timeout(15000),
    });
    const raw = await res.text();
    const parsed = JSON.parse(raw.split("\n\n")[1]);
    const url = JSON.parse(parsed[0][2])[1];
    return typeof url === "string" && /^https?:\/\//.test(url) ? url : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* 6. STEP D - ask Gemini (twice: find the official page, then write)  */
/* ------------------------------------------------------------------ */

const FindSchema = z.object({
  isRelevant: z.boolean(),
  officialUrl: z.string().nullable(),
});

async function askJson<S extends z.ZodTypeAny>(
  aiClient: GoogleGenAI,
  prompt: string,
  schema: S,
  errors: string[]
): Promise<z.infer<S> | null> {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await aiClient.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });
      const parsed = schema.safeParse(JSON.parse(res.text ?? ""));
      if (parsed.success) return parsed.data;
      console.warn(`[fetcher] Bad AI shape (try ${attempt})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[fetcher] Gemini error (try ${attempt}): ${msg}`);
      const short = msg.slice(0, 300);
      if (errors.length < 3 && !errors.includes(short)) errors.push(short);
      if (msg.includes("404") || msg.includes("400") || msg.includes("403")) break;
      await sleep(2000);
    }
  }
  return null;
}

function buildFindPrompt(item: RawItem, articleText: string, links: { text: string; url: string }[]) {
  const list = links.map((l, i) => `${i + 1}. [${l.text || "no text"}] ${l.url}`).join("\n");
  return `You help a website about ${NICHE}.
Below is a news article and the outside links found in it.
Return JSON with exactly these keys: isRelevant, officialUrl.
- "isRelevant": true only if the article is about a REAL opportunity people can apply to now (job, fellowship, internship, scholarship, grant, training). False for opinion, ads, results announcements, or off-topic.
- "officialUrl": copy EXACTLY ONE address from the numbered list that is the official page of the organisation running the opportunity (their own application or programme page). Use null if none of them is clearly that.

ARTICLE TITLE: ${item.title}
ARTICLE TEXT: ${articleText.slice(0, 6000)}

LINKS:
${list || "(none)"}`;
}

function buildWritePrompt(item: RawItem, page: Page) {
  const today = new Date().toISOString().slice(0, 10);
  return `You are a careful editor for a website about ${NICHE}.
Today is ${today}. Below is the text of the OFFICIAL page. Return ONE JSON object.

Hard rules:
- Use ONLY facts that appear in the official text. If something is not there, write "Not stated" or leave it null. Never guess.
- Write in your own words, in plain, warm, human English. Short sentences. No hype words like "amazing" or "unlock".
- "deadline": "YYYY-MM-DD" only if a clear closing date for the current round is stated, otherwise null.
- "location": be specific. If only certain countries can apply, say "Listed countries only" or name them. Never write "Global" unless the text clearly says anyone worldwide can apply.
- "category": one of ${CATEGORIES.join(", ")}.
- "title": clear, under 100 characters, include the year if the programme has one, no source name.
- "summary": 40 to 70 words.
- "keyTakeaways": 3 to 5 short strings about what the person gets.
- "eligibility": short strings saying who can apply (use [] if not stated).
- "whoItsFor": 1 to 2 sentences describing the person this suits best.
- "whoShouldSkip": 1 to 2 sentences describing who should NOT spend time on this (wrong level, wrong country, wrong field), based on the text.
- "theCatch": 1 to 2 sentences on the thing people overlook (for example: master's only, needs a university offer first, unpaid, limited countries, short window).
- "applySteps": 3 to 6 steps that are specific to THIS opportunity and based on the text (documents named, portals named, two-step processes). If the text does not describe the process, give only 3 simple true steps.
- "faqs": 2 to 4 objects {"q","a"}: real questions an applicant would ask, answered only from the text. Skip any question the text cannot answer.
- "quality": a number 0 to 10. How complete and useful is this page for an applicant? Give 0 to 4 if it lacks eligibility or dates, or is mostly marketing.
- "isRelevant": true only if this is a real opportunity that is open or recurring, false otherwise.

Return JSON with exactly these keys: isRelevant, title, category, deadline, eligibility, location, summary, keyTakeaways, whoItsFor, whoShouldSkip, theCatch, applySteps, faqs, quality.

OFFICIAL PAGE ADDRESS: ${page.url}
OFFICIAL PAGE TEXT:
${page.text}`;
}
/* ------------------------------------------------------------------ */
/* 5. STEP C - read the real pages (article -> official page)          */
/* ------------------------------------------------------------------ */

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";
const SKIP_HOSTS =
  /(facebook|twitter|x\.com|instagram|linkedin|youtube|whatsapp|t\.me|telegram|pinterest|tiktok|google\.|doubleclick|wp\.com|wordpress|gravatar)/i;

interface Page {
  url: string;
  html: string;
  text: string;
}

function htmlToText(html: string) {
  return html
    .replace(/<(script|style|noscript|svg|nav|footer|header|form|iframe)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim()
    .slice(0, MAX_PAGE_CHARS);
}
interface Stats {
  unresolved: number;
  unreadable: number;
  noOfficial: number;
  lowQuality: number;
}

/**
 * Turns one found item into a finished listing, or returns null if it is not good enough.
 * If `prior` is given we are upgrading or re-checking an existing listing (keeps its id and slug).
 */
async function buildOpportunity(
  aiClient: GoogleGenAI,
  raw: RawItem,
  prior: Opportunity | undefined,
  errors: string[],
  stats: Stats
): Promise<Opportunity | null> {
  let official: Page | null = null;

  if (prior?.officialUrl) official = await fetchPage(prior.officialUrl);

  if (!official) {
    const articleUrl = await resolveArticleUrl(raw.link);
    if (!articleUrl) {
      stats.unresolved++;
      return null;
    }
    const article = await fetchPage(articleUrl);
    if (!article) {
      stats.unreadable++;
      return null;
    }
    if (raw.sourceName === "Remotive") {
      official = article; // a job board page is already the real listing
    } else {
      const links = extractLinks(article.html, article.url);
      const find = await askJson(aiClient, buildFindPrompt(raw, article.text, links), FindSchema, errors);
      await sleep(DELAY_BETWEEN_AI_CALLS_MS);
      if (!find || !find.isRelevant) return null;
      const chosen = links.find((l) => l.url === find.officialUrl);
      if (chosen) official = await fetchPage(chosen.url);
    }
  }

  if (!official || official.text.length < MIN_PAGE_CHARS) {
    stats.noOfficial++;
    return null;
  }

  const ai = await askJson(aiClient, buildWritePrompt(raw, official), AiItemSchema, errors);
  if (!ai || !ai.isRelevant) return null;
  if (ai.category === "News" && !ALLOW_NEWS) return null;

  // The robot editor: not good enough, not published.
  const good =
    (ai.quality ?? 0) >= MIN_QUALITY && !!ai.whoItsFor && !!ai.theCatch && ai.eligibility.length > 0;
  if (!good) {
    stats.lowQuality++;
    return null;
  }

  const deadline = isIsoDate(ai.deadline) ? ai.deadline : null;
  if (!prior && deadline && Date.parse(deadline) < Date.now() - 86_400_000) return null;

  const id = prior?.id ?? makeId(raw.title, raw.sourceName);
  const { isRelevant, ...rest } = ai;
  void isRelevant;
  const now = new Date().toISOString();

  return {
    ...rest,
    deadline,
    id,
    slug: prior?.slug ?? `${slugify(ai.title, { lower: true, strict: true }).slice(0, 70)}-${id.slice(0, 6)}`,
    sourceName: raw.sourceName,
    sourceUrl: prior?.sourceUrl ?? raw.link,
    officialUrl: official.url,
    publishedAt: prior?.publishedAt ?? raw.publishedAt,
    createdAt: prior?.createdAt ?? now,
    checkedAt: now,
  };
}

/* ------------------------------------------------------------------ */
/* 7. MAIN RUNNER - finds new items, upgrades old ones, saves          */
/* ------------------------------------------------------------------ */

function needsCheck(o: Opportunity) {
  if (statusOf(o) === "closed") return false;
  if (!o.checkedAt) return true;
  return Date.now() - Date.parse(o.checkedAt) > RECHECK_AFTER_DAYS * 86_400_000;
}

export async function runFetcher() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY in .env.local");
  }

  const aiClient = new GoogleGenAI({ apiKey });
  const existing = await getAll();
  const raw = await readFeeds();
  const fresh = dedupe(raw, existing).slice(0, MAX_NEW_PER_RUN);

  const errors: string[] = [];
  const stats: Stats = { unresolved: 0, unreadable: 0, noOfficial: 0, lowQuality: 0 };
  const knownOfficial = new Set(existing.map((o) => o.officialUrl).filter(Boolean) as string[]);

  // A) brand new items
  const created: Opportunity[] = [];
  for (let i = 0; i < fresh.length; i++) {
    if (i > 0) await sleep(DELAY_BETWEEN_AI_CALLS_MS);
    const built = await buildOpportunity(aiClient, fresh[i], undefined, errors, stats);
    if (built && !(built.officialUrl && knownOfficial.has(built.officialUrl))) {
      if (built.officialUrl) knownOfficial.add(built.officialUrl);
      created.push(built);
    }
  }

  // B) upgrade old thin listings and re-check old ones (never-checked first, then oldest)
  const refreshList = existing
    .filter(needsCheck)
    .sort((a, b) => Date.parse(a.checkedAt ?? "1970-01-01") - Date.parse(b.checkedAt ?? "1970-01-01"))
    .slice(0, MAX_REFRESH_PER_RUN);

  const refreshed: Opportunity[] = [];
  for (const o of refreshList) {
    await sleep(DELAY_BETWEEN_AI_CALLS_MS);
    const asRaw: RawItem = {
      title: o.title,
      link: o.sourceUrl,
      sourceName: o.sourceName,
      snippet: o.summary,
      publishedAt: o.publishedAt,
    };
    const built = await buildOpportunity(aiClient, asRaw, o, errors, stats);
    if (built) refreshed.push(built);
  }

  // C) real job listings from a job board (they get upgraded by step B on later days)
  let jobs: Opportunity[] = [];
  try {
    jobs = await fetchRemotiveJobs(new Set(existing.map((o) => o.id)));
  } catch (err) {
    errors.push(`job source: ${err instanceof Error ? err.message : String(err)}`.slice(0, 300));
  }

  const toSave = [...created, ...refreshed, ...jobs];
  if (toSave.length > 0) {
    await saveMany(toSave);
  }

  const tried = fresh.length + refreshList.length;
  const warning =
    tried >= 4 && created.length + refreshed.length === 0
      ? `Read 0 of ${tried} pages successfully (could not open: ${stats.unresolved + stats.unreadable + stats.noOfficial}, too thin: ${stats.lowQuality}). The page reader may need attention.`
      : "";

  return {
    scanned: raw.length,
    candidates: fresh.length,
    newPublished: created.length,
    refreshed: refreshed.length,
    jobs: jobs.length,
    added: created.length + jobs.length,
    skipped: stats,
    model: GEMINI_MODEL,
    errors,
    warning,
  };
}
