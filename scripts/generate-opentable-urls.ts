/**
 * Fills src/data/restaurants/opentableUrlsByRank.json (merged into national seed via national150Seed.ts).
 *
 * ## Recommended: SerpAPI (reliable from servers / CI)
 *   set SERPAPI_KEY=...   (https://serpapi.com — Google results)
 *   npx tsx scripts/generate-opentable-urls.ts
 * Default delay between SerpAPI calls: 250ms (set OPENTABLE_DELAY_MS).
 *
 * ## Fallback: DuckDuckGo Lite (often blocked as “bot” from datacenters; may work on a home PC)
 *   Unset SERPAPI_KEY and run the same command (uses OPENTABLE_DELAY_MS default 2500ms).
 *
 * Resume-safe: skips ranks that already have an http(s) URL in the JSON.
 *
 *   OPENTABLE_MAX=50 npx tsx scripts/generate-opentable-urls.ts   # test first 50
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NATIONAL_150_SEED } from "../src/data/restaurants/national150Seed";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src/data/restaurants/opentableUrlsByRank.json");
const ERR = path.join(ROOT, "src/data/restaurants/opentable-generation-errors.json");

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const DEFAULT_DDG_DELAY = 2500;
const DEFAULT_SERP_DELAY = 250;
const MAX = process.env.OPENTABLE_MAX ? Number(process.env.OPENTABLE_MAX) : Infinity;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function delayAfterRequestMs(): number {
  if (process.env.SERPAPI_KEY) {
    return Number(process.env.OPENTABLE_DELAY_MS || DEFAULT_SERP_DELAY);
  }
  return Number(process.env.OPENTABLE_DELAY_MS || DEFAULT_DDG_DELAY);
}

async function lookupSerpApi(name: string, city: string): Promise<string | null> {
  const key = process.env.SERPAPI_KEY;
  if (!key) return null;

  const q = `site:opentable.com/r ${name} ${city}`;
  const u = new URL("https://serpapi.com/search.json");
  u.searchParams.set("engine", "google");
  u.searchParams.set("q", q);
  u.searchParams.set("api_key", key);

  const res = await fetch(u.toString());
  const j = (await res.json()) as {
    error?: string;
    organic_results?: { link?: string }[];
  };

  if (j.error) throw new Error(`SerpAPI: ${j.error}`);

  for (const o of j.organic_results || []) {
    const link = o.link;
    if (link?.includes("opentable.com/r/")) return link;
  }
  return null;
}

function firstOpenTableUrlFromDdgHtml(html: string): string | null {
  if (html.includes("challenge-form") || html.includes("anomaly.js")) {
    return null;
  }
  const re = /uddg=(https%3A%2F%2Fwww\.opentable\.com%2Fr%2F[^&"]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const url = decodeURIComponent(m[1]);
      if (url.startsWith("https://www.opentable.com/r/")) return url;
    } catch {
      /* skip */
    }
  }
  return null;
}

async function lookupDdg(name: string, city: string): Promise<string | null> {
  const q = encodeURIComponent(`site:opentable.com/r ${name} ${city}`);
  const url = `https://lite.duckduckgo.com/lite/?q=${q}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return firstOpenTableUrlFromDdgHtml(html);
}

async function lookupOpenTable(name: string, city: string): Promise<string | null> {
  return (await lookupSerpApi(name, city || "")) ?? (await lookupDdg(name, city || ""));
}

async function main() {
  let map: Record<string, string> = {};
  if (fs.existsSync(OUT)) {
    map = JSON.parse(fs.readFileSync(OUT, "utf8")) as Record<string, string>;
  }

  let errors: Record<string, { name: string; city: string; reason: string }> = {};
  if (fs.existsSync(ERR)) {
    errors = JSON.parse(fs.readFileSync(ERR, "utf8"));
  }

  const list = NATIONAL_150_SEED.filter((r) => r.nationalRank <= MAX);
  let skipped = 0;

  const useSerp = Boolean(process.env.SERPAPI_KEY);
  console.log(
    useSerp
      ? "Using SerpAPI for Google search (set OPENTABLE_DELAY_MS to throttle)."
      : "SerpAPI not set — using DuckDuckGo only (often blocked); prefer SERPAPI_KEY for a full run.",
  );

  for (const r of list) {
    const key = String(r.nationalRank);
    if (map[key]?.startsWith("http")) {
      skipped++;
      continue;
    }

    try {
      const ot = await lookupOpenTable(r.name, r.city || "");
      if (ot) {
        map[key] = ot;
        console.log(`${key} ✓ ${ot}`);
        delete errors[key];
      } else {
        errors[key] = { name: r.name, city: r.city || "", reason: "no_match" };
        console.log(`${key} ✗ no URL (${r.name}, ${r.city})`);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      errors[key] = { name: r.name, city: r.city || "", reason: msg };
      console.error(`${key} error`, msg);
    }

    fs.writeFileSync(OUT, JSON.stringify(map, null, 2), "utf8");
    fs.writeFileSync(ERR, JSON.stringify(errors, null, 2), "utf8");

    await sleep(delayAfterRequestMs() + Math.floor(Math.random() * (useSerp ? 50 : 800)));
  }

  console.log(
    `Done. Skipped (already set): ${skipped}. URLs stored: ${Object.keys(map).length}. Errors: ${Object.keys(errors).length}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
