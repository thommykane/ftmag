/**
 * One-off generator: reads scripts/chef-bulk-names.txt, fetches Wikipedia thumbnails + extracts,
 * writes src/data/chefsBulkEntry.ts. Run: npx tsx scripts/generate-chefs-bulk.ts
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const EXISTING_SLUGS = new Set([
  "alice-waters",
  "ayesha-curry",
  "bethenny-frankel",
  "bobby-flay",
  "chrissy-teigen",
  "curtis-stone",
  "david-chang",
  "giada-de-laurentiis",
  "gordon-ramsay",
  "guy-fieri",
  "gwyneth-paltrow",
  "ina-garten",
  "jamie-oliver",
  "jose-andres",
  "katie-lee",
  "marcus-samuelsson",
  "martha-stewart",
  "michael-voltaggio",
  "nigella-lawson",
  "nobuyuki-matsuhisa",
]);

/** Exact display names to skip (duplicate person / redundant vs seed). */
const SKIP_NAMES = new Set(
  [
    "Nobu Matsuhisa",
    "Fäviken Magnus Nilsson",
    "Ottolenghi",
  ].map((s) => s.toLowerCase()),
);

const PLACEHOLDER = (name: string) =>
  `https://placehold.co/330x440/1c1917/d4af37?text=${encodeURIComponent(name.replace(/\+/g, " ").slice(0, 18))}`;

function slugify(name: string): string {
  return name
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function inferCuisines(text: string, title: string): string[] {
  const raw = `${title} ${text}`.toLowerCase();
  const tags = new Set<string>();
  const add = (s: string) => tags.add(s);

  if (/indian|delhi|mumbai|masala|curry/i.test(raw)) add("Indian");
  if (/japanese|sushi|tokyo|kaiseki|osaka|kyoto|ramen|iron chef/i.test(raw)) add("Asian");
  if (/korean|seoul|kimchi/i.test(raw)) add("Asian");
  if (/chinese|cantonese|sichuan|hong kong|taiwan/i.test(raw)) add("Asian");
  if (/thai|bangkok/i.test(raw)) add("Asian");
  if (/vietnamese|vietnam|pho/i.test(raw)) add("Vietnamese");
  if (/peruvian|lima|nikkei|ceviche|latin america/i.test(raw)) add("Mexican");
  if (/mexican|mexico|oaxaca/i.test(raw)) add("Mexican");
  if (/spanish|spain|catalan|basque|madrid|barcelona/i.test(raw)) add("Fusion");
  if (/french|paris|lyon|michelin|brasserie|bistro|nouvelle/i.test(raw)) add("French"), add("Classical French");
  if (/italian|italy|sicily|tuscany|pasta|ristorante/i.test(raw)) add("Italian");
  if (/british|scottish|england|london|uk chef/i.test(raw)) add("Comfort");
  if (/american|new york|california cuisine|texas/i.test(raw)) add("American");
  if (/southern |soul food|charleston|nashville/i.test(raw)) add("Southern");
  if (/cajun|creole|new orleans/i.test(raw)) add("Cajun");
  if (/bbq|barbecue|smokehouse|pitmaster/i.test(raw)) add("BBQ");
  if (/pastry|pâtissier|patissier|dessert|chocolat|gelato/i.test(raw)) add("Desserts and Pastry");
  if (/molecular|modernist|elbulli|avant-garde/i.test(raw)) add("Molecular Gastronomy");
  if (/vegetable|vegetarian|plant-based|farm/i.test(raw)) add("Garden to Table");
  if (/wine|sommelier/i.test(raw)) add("Wine Expert");
  if (/cookbook|author|writer|television|food network|celebrity/i.test(raw)) add("Writer/Blogger"), add("Celebrities in Food");
  if (/healthy|wellness|organic/i.test(raw)) add("Healthy");
  if (/nordic|noma|scandinavia|denmark|sweden/i.test(raw)) add("Fusion");
  if (/australian|sydney|melbourne/i.test(raw)) add("Fusion"), add("American");
  if (/turkish|middle east|levant/i.test(raw)) add("Fusion");
  if (/african|senegal|ghana/i.test(raw)) add("Caribbean");
  if (/caribbean|jamaica/i.test(raw)) add("Caribbean");

  if (tags.size === 0) add("Fusion"), add("Celebrities in Food");
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

type WikiSummary = {
  title?: string;
  extract?: string;
  thumbnail?: { source?: string };
};

async function fetchWiki(name: string): Promise<{ title: string; extract: string; imageUrl: string }> {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`;
  try {
    const res = await fetch(url, { headers: { "user-agent": "FTMAG-chef-seed/1.0 (contact: editorial)" } });
    if (!res.ok) throw new Error(String(res.status));
    const j = (await res.json()) as WikiSummary & { type?: string };
    if (j.type === "disambiguation" || !j.extract) throw new Error("disambiguation or empty");
    const img = j.thumbnail?.source;
    return {
      title: j.title ?? name,
      extract: j.extract,
      imageUrl: img?.startsWith("http") ? img : PLACEHOLDER(name),
    };
  } catch {
    return { title: name, extract: "", imageUrl: PLACEHOLDER(name) };
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const txt = readFileSync(path.join(__dirname, "chef-bulk-names.txt"), "utf8");
  const names = txt
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const seenSlugs = new Set<string>();
  const out: Array<{
    slug: string;
    name: string;
    excerpt: string;
    cuisines: string[];
    imageUrl: string;
  }> = [];

  for (const name of names) {
    if (SKIP_NAMES.has(name.toLowerCase())) continue;
    const slug = slugify(name);
    if (!slug || slug.length < 2) continue;
    if (seenSlugs.has(slug)) continue;
    if (EXISTING_SLUGS.has(slug)) continue;
    seenSlugs.add(slug);

    process.stdout.write(`\rFetching ${out.length + 1}: ${name.slice(0, 40).padEnd(40)}`);
    const wiki = await fetchWiki(name);
    await sleep(120);
    const excerpt = wiki.extract ? wiki.extract.split(". ").slice(0, 2).join(". ").trim() : "";
    const cuisines = inferCuisines(wiki.extract, wiki.title);
    out.push({
      slug,
      name,
      excerpt: excerpt || "",
      cuisines,
      imageUrl: wiki.imageUrl,
    });
  }

  console.log(`\nDone: ${out.length} new chefs`);

  const body = out
    .map(
      (c) => `  {
    slug: ${JSON.stringify(c.slug)},
    name: ${JSON.stringify(c.name)},
    excerpt: ${JSON.stringify(c.excerpt)},
    cuisines: ${JSON.stringify(c.cuisines)},
    imageUrl: ${JSON.stringify(c.imageUrl)},
  }`,
    )
    .join(",\n");

  const file = `/**
 * Bulk chef directory entries (Wikipedia thumbnails + inferred cuisines). Merged in src/data/chefs.ts.
 * Regenerate: npx tsx scripts/generate-chefs-bulk.ts
 */
export const CHEFS_BULK_ENTRY = [
${body},
] as const;

export type ChefBulkEntry = (typeof CHEFS_BULK_ENTRY)[number];
`;

  writeFileSync(path.join(ROOT, "src/data/chefsBulkEntry.ts"), file, "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
