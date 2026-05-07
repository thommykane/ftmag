/**
 * Builds src/data/chefProfileOverlays.json from English Wikipedia intros (~250 words max).
 * Run: npx tsx scripts/build-chef-profile-overlays.ts
 * Optional: DATABASE_URL set + --apply  to update local DB immediately.
 *
 * Uses only Wikipedia lead sections (sourced at publish time). Editorial review recommended.
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "../src/lib/prisma";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "src/data/chefProfileOverlays.json");

const UA =
  "FTMAG/1.0 (https://foodandtravel.net; chef profiles seed; respects rate limits)";
const DELAY_MS = 900;
const STUB_PHRASE = "celebrated chef and culinary figure";
const TARGET_WORDS = 250;

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function firstNWords(text: string, n: number): string {
  const words = text.replace(/\s+/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length <= n) return words.join(" ");
  return `${words.slice(0, n).join(" ")}…`;
}

async function wikiIntroPlain(title: string): Promise<{ title: string; extract: string } | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=${encodeURIComponent(title)}`;

  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    const body = await res.text();

    if (res.status === 429 || /too many requests/i.test(body)) {
      await sleep(15_000 * (attempt + 1));
      continue;
    }

    if (!res.ok) {
      if (attempt < 7) {
        await sleep(3000 * (attempt + 1));
        continue;
      }
      return null;
    }

    if (/too many requests/i.test(body)) {
      await sleep(15_000 * (attempt + 1));
      continue;
    }

    let j: {
      query?: { pages?: Record<string, { extract?: string; title?: string; missing?: string }> };
    };
    try {
      j = JSON.parse(body) as typeof j;
    } catch {
      if (attempt < 7) {
        await sleep(5000 * (attempt + 1));
        continue;
      }
      return null;
    }

    const pages = j.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0];
    if (!page || page.missing || !page.extract?.trim()) return null;
    return { title: page.title ?? title, extract: page.extract.trim() };
  }

  return null;
}

async function wikiSearchTitles(query: string, limit: number): Promise<string[]> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${limit}`;

  for (let attempt = 0; attempt < 8; attempt++) {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    const body = await res.text();

    if (res.status === 429 || /too many requests/i.test(body)) {
      await sleep(15_000 * (attempt + 1));
      continue;
    }

    if (!res.ok) {
      if (attempt < 7) {
        await sleep(3000 * (attempt + 1));
        continue;
      }
      return [];
    }

    if (/too many requests/i.test(body)) {
      await sleep(15_000 * (attempt + 1));
      continue;
    }

    let j: { query?: { search?: { title: string }[] } };
    try {
      j = JSON.parse(body) as typeof j;
    } catch {
      if (attempt < 7) {
        await sleep(5000 * (attempt + 1));
        continue;
      }
      return [];
    }

    return (j.query?.search ?? []).map((s) => s.title).filter(Boolean);
  }

  return [];
}

const BETWEEN_TRY_MS = 450;

function uniqueTitles(titles: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of titles) {
    const k = t.trim();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function parseBorn(extract: string): { birthDate: Date | null; birthPlace: string } {
  const paren = extract.match(/\(\s*born\s+([^)]+)\)/i);
  const chunk = (paren?.[1] ?? "").trim();
  let birthDate: Date | null = null;
  let birthPlace = "";

  if (chunk) {
    const inMatch = chunk.match(/\b(?:in|near)\s+(.+)$/i);
    if (inMatch) birthPlace = inMatch[1].replace(/\s+$/, "").replace(/^[,\s]+/, "").slice(0, 200);

    const isoLike =
      chunk.match(new RegExp(`(\\d{1,2})\\s+(${MONTHS})\\s+(\\d{4})`, "i")) ||
      chunk.match(new RegExp(`(${MONTHS})\\s+(\\d{1,2}),?\\s+(\\d{4})`, "i"));
    if (isoLike) {
      const tryParse = Date.parse(chunk.replace(/^on\s+/i, "").split(/,\s*in\s/i)[0].trim());
      if (!Number.isNaN(tryParse)) birthDate = new Date(tryParse);
    } else {
      const y = chunk.match(/\b(19|20)\d{2}\b/);
      if (y) {
        const tryParse = Date.parse(`${y[0]}-01-01`);
        if (!Number.isNaN(tryParse)) birthDate = new Date(tryParse);
      }
    }
  }

  if (!birthPlace) {
    const m = extract.match(/born (?:in|on) ([^.]+?)(?:\.|,)/i);
    if (m) birthPlace = m[1].trim().slice(0, 200);
  }

  return { birthDate, birthPlace };
}

function extractAwardsSnippet(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const hits = sentences.filter((s) =>
    /michelin|james beard|50 best|world.{0,12}50|three-star|three star|stars?\s+in\s+the\s+michelin/i.test(s),
  );
  const line = hits.slice(0, 3).join(" ").trim();
  return line.slice(0, 900);
}

type Overlay = {
  description: string;
  birthDate: string | null;
  birthPlace: string;
  specialtyCuisine: string;
  awards: string;
};

async function buildOverlayForName(name: string, cuisineFallback: string): Promise<Overlay | null> {
  const stripped = name.replace(/^Iron Chef\s+/i, "").trim();
  const directTitles = uniqueTitles([
    name,
    stripped,
    `${name} (chef)`,
    `${stripped} (chef)`,
    `${stripped} (cook)`,
  ]);

  let extract = "";
  for (const t of directTitles) {
    const hit = await wikiIntroPlain(t);
    if (hit?.extract) {
      extract = hit.extract;
      break;
    }
    await sleep(BETWEEN_TRY_MS);
  }

  if (!extract) {
    const searchQueries = uniqueTitles([
      `${stripped} chef`,
      `${name} chef`,
      `${stripped} restaurateur`,
      stripped,
    ]);
    for (const q of searchQueries) {
      const titles = await wikiSearchTitles(q, 5);
      await sleep(BETWEEN_TRY_MS);
      for (const title of titles) {
        if (/^List of\b/i.test(title)) continue;
        const hit = await wikiIntroPlain(title);
        if (hit?.extract && hit.extract.length > 80) {
          const looksLikePerson =
            /\b(born|chef|restaurateur|cook|restaurant|kitchen|michelin)\b/i.test(hit.extract);
          if (looksLikePerson) {
            extract = hit.extract;
            break;
          }
        }
        await sleep(BETWEEN_TRY_MS);
      }
      if (extract) break;
    }
  }

  if (!extract) return null;

  const description = firstNWords(extract, TARGET_WORDS);
  const { birthDate, birthPlace } = parseBorn(extract);
  const awards = extractAwardsSnippet(extract);
  const specialtyCuisine =
    cuisineFallback.trim() ||
    (extract.match(/\b(French|Italian|Spanish|Japanese|Chinese|Indian|Mexican|Nordic|British|American)\b/i)?.[1] ??
      "");

  return {
    description,
    birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : null,
    birthPlace,
    specialtyCuisine,
    awards: awards || "",
  };
}

async function main() {
  const applyDb = process.argv.includes("--apply");
  const retryFallbacks = process.argv.includes("--retry-fallbacks");
  const maxRaw = process.env.CHEF_PROFILE_MAX;
  const max = maxRaw != null && maxRaw !== "" ? Number(maxRaw) : Infinity;

  const allRows = await prisma.chef.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true, cuisines: true },
  });
  const rows = Number.isFinite(max) && max > 0 ? allRows.slice(0, max) : allRows;

  const existing: Record<string, Overlay> = {};
  if (retryFallbacks && existsSync(OUT)) {
    try {
      Object.assign(existing, JSON.parse(readFileSync(OUT, "utf8")) as Record<string, Overlay>);
    } catch {
      /* ignore */
    }
  }

  const out: Record<string, Overlay> = retryFallbacks ? { ...existing } : {};
  let ok = 0;
  let miss = 0;

  const skipSlugs = new Set(["rene-redzepi"]);

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (skipSlugs.has(r.slug)) continue;

    if (retryFallbacks) {
      const cur = out[r.slug];
      if (cur && typeof cur.description === "string" && !cur.description.includes(STUB_PHRASE)) {
        continue;
      }
    }

    const cuisines = Array.isArray(r.cuisines)
      ? (r.cuisines as unknown[]).filter((x): x is string => typeof x === "string")
      : [];
    const cuisineFallback = cuisines[0] ?? "";

    process.stdout.write(`\r${i + 1}/${rows.length} ${r.name.slice(0, 42).padEnd(42)}`);
    const overlay = await buildOverlayForName(r.name, cuisineFallback);
    await sleep(DELAY_MS);

    if (!overlay) {
      miss += 1;
      out[r.slug] = {
        description: `${r.name} is a celebrated chef and culinary figure. A full biography will continue to expand as we source additional public references.`,
        birthDate: null,
        birthPlace: "",
        specialtyCuisine: cuisineFallback,
        awards: "",
      };
      ok += 1;
      continue;
    }

    out[r.slug] = overlay;
    ok += 1;
  }

  console.log(
    `\nWikipedia hits: ${ok - miss}, fallbacks: ${miss}, processed: ${Object.keys(out).length} (chef rows in batch: ${rows.length})`,
  );
  writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
  console.log("Wrote", OUT);

  if (applyDb) {
    let n = 0;
    for (const [slug, o] of Object.entries(out)) {
      await prisma.chef.updateMany({
        where: { slug },
        data: {
          description: o.description,
          birthDate: o.birthDate ? new Date(o.birthDate) : null,
          birthPlace: o.birthPlace,
          specialtyCuisine: o.specialtyCuisine,
          awards: o.awards,
        },
      });
      n += 1;
    }
    console.log("Applied to DB:", n, "rows");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
