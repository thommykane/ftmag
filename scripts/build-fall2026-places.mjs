/**
 * Builds src/data/destinations/fall2026Places.ts from extracted editorials + image manifest.
 * Run: node scripts/build-fall2026-places.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TEXT = path.join(ROOT, ".tmp-fall2026-text");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/destinations/fall-2026-web/manifest.json"), "utf8"),
);

const PLACES = [
  { slug: "alpharetta", kind: "city", textFile: "Alpharetta-GA-Completed.txt", stateSlug: "georgia", stateName: "Georgia", placeName: "Alpharetta", title: "Discover Flavors Worth Traveling For", ctaUrl: "https://www.awesomealpharetta.com/", ctaLabel: "Visit Alpharetta" },
  { slug: "ann-arbor", kind: "city", textFile: "Ann-Arbor-Completed.txt", stateSlug: "michigan", stateName: "Michigan", placeName: "Ann Arbor", title: "Ann Arbor, Michigan: University Town with Culinary Culture", ctaUrl: "https://www.annarbor.org/", ctaLabel: "Visit Ann Arbor" },
  { slug: "athens", kind: "city", textFile: "Athens-OH-Completed.txt", stateSlug: "ohio", stateName: "Ohio", placeName: "Athens", title: "Athens, Ohio: A Taste of Appalachian Ohio", ctaUrl: "https://athensohio.com/", ctaLabel: "Visit Athens County" },
  { slug: "bowling-green", kind: "city", textFile: "Bowling-Green-Complete.txt", stateSlug: "kentucky", stateName: "Kentucky", placeName: "Bowling Green", title: "Autumn Adventures in Bowling Green, Kentucky", ctaUrl: "https://www.visitbgky.com/", ctaLabel: "Visit Bowling Green" },
  { slug: "brevard", kind: "city", textFile: "Brevard-NC-Complete.txt", stateSlug: "north-carolina", stateName: "North Carolina", placeName: "Brevard", title: "Scenic & Mountain-Inspired Dining in North Carolina's Land of Waterfalls", ctaUrl: "https://www.explorebrevard.com/", ctaLabel: "Explore Brevard" },
  { slug: "canton", kind: "city", textFile: "Canton-ILL-Completed.txt", stateSlug: "illinois", stateName: "Illinois", placeName: "Canton", title: "Spoon River Valley Scenic Drive: A Fall Journey Through Fulton County", ctaUrl: "https://spoonriverdrive.org/", ctaLabel: "Visit Spoon River Valley" },
  { slug: "clarksville", kind: "city", textFile: "Clarksville-TN-Completed.txt", stateSlug: "tennessee", stateName: "Tennessee", placeName: "Clarksville", title: "A Global Culinary Tour in Clarksville, Tennessee", ctaUrl: "https://visitclarksvilletn.com/", ctaLabel: "Visit Clarksville" },
  { slug: "columbus", kind: "city", textFile: "Columbus-GA-Completed.txt", stateSlug: "georgia", stateName: "Georgia", placeName: "Columbus", title: "Where Memorable Meals Lead to Great Getaways", ctaUrl: "https://visitcolumbusga.com/", ctaLabel: "Visit Columbus" },
  { slug: "deerfield", kind: "city", textFile: "Deerfield-VT-Complete.txt", stateSlug: "vermont", stateName: "Vermont", placeName: "Deerfield Valley", title: "Find Your Fall in Southern Vermont's Deerfield Valley", ctaUrl: "https://www.visitvermont.com/", ctaLabel: "Visit Deerfield Valley" },
  { slug: "folly-beach", kind: "city", textFile: "Folly-Beach-Completed.txt", stateSlug: "south-carolina", stateName: "South Carolina", placeName: "Folly Beach", title: "Come Hungry to Charleston's Beach Town", ctaUrl: "https://www.visitfolly.com/", ctaLabel: "Visit Folly Beach" },
  { slug: "grants-pass", kind: "city", textFile: "Grants-Pass-OR-Complete.txt", stateSlug: "oregon", stateName: "Oregon", placeName: "Grants Pass", title: "Grown Here. Gathered Here. Savored Here.", ctaUrl: "https://visitgrantspass.com/", ctaLabel: "Visit Grants Pass" },
  { slug: "greater-zion", kind: "city", textFile: "Greater-Zion-Completed.txt", stateSlug: "utah", stateName: "Utah", placeName: "Greater Zion", title: "Greater Zion's Secret Recipe", ctaUrl: "https://www.greaterzion.com/", ctaLabel: "Visit Greater Zion" },
  { slug: "jamestown", kind: "city", textFile: "Jamestown-Complete.txt", stateSlug: "north-dakota", stateName: "North Dakota", placeName: "Jamestown", title: "Come for the Bison. Stay for Jamestown.", ctaUrl: "https://www.discoverjamestownnd.com/", ctaLabel: "Discover Jamestown" },
  { slug: "little-rock", kind: "city", textFile: "Little-Rock-AK-Complete.txt", stateSlug: "arkansas", stateName: "Arkansas", placeName: "Little Rock", title: "Come Hungry to Little Rock", ctaUrl: "https://www.littlerock.com/", ctaLabel: "Visit Little Rock" },
  { slug: "menomonie", kind: "city", textFile: "Menomonie-WI-Need-FP-Ad.txt", stateSlug: "wisconsin", stateName: "Wisconsin", placeName: "Menomonie", title: "Cold Beer, Hot Pizza, and Good Company in Menomonie", ctaUrl: "https://www.exploremenomonie.com/", ctaLabel: "Explore Menomonie" },
  { slug: "north-shore", kind: "city", textFile: "North-Shore-WI-Completed.txt", stateSlug: "wisconsin", stateName: "Wisconsin", placeName: "Milwaukee's North Shore", title: "Milwaukee's North Shore: Close to Everything, Far from Ordinary", ctaUrl: "https://www.discoverthenorthshoremke.com/", ctaLabel: "Discover the North Shore" },
  { slug: "pahrump", kind: "city", textFile: "Pahrump-NV-Completed.txt", stateSlug: "nevada", stateName: "Nevada", placeName: "Pahrump", title: "The Best Adventures You Don't See Coming", ctaUrl: "https://www.visitpahrump.com/", ctaLabel: "Visit Pahrump" },
  { slug: "walla-walla", kind: "city", textFile: "Walla-Walla-Completed.txt", stateSlug: "washington", stateName: "Washington", placeName: "Walla Walla", title: "How Walla Walla Is Redefining Fall Wine Touring", ctaUrl: "https://wallawalla.org/", ctaLabel: "Visit Walla Walla" },
  { slug: "crawford-county", kind: "county", textFile: "Crawford-County-Completed.txt", stateSlug: "pennsylvania", stateName: "Pennsylvania", placeName: "Crawford County", title: "Discover Crawford County, Pennsylvania", ctaUrl: "https://visitcrawford.org/", ctaLabel: "Visit Crawford County" },
  { slug: "hampshire-county", kind: "county", textFile: "Hampshire-County-Completed.txt", stateSlug: "west-virginia", stateName: "West Virginia", placeName: "Hampshire County", title: "Fall Finds Its Rhythm in the Hampshire Highlands", ctaUrl: "https://hampshirehighlands.com/", ctaLabel: "Visit Hampshire Highlands" },
  { slug: "mecklenburg-county", kind: "county", textFile: "Mecklenburg-County-VA-Complete.txt", stateSlug: "virginia", stateName: "Virginia", placeName: "Mecklenburg County", title: "Find More of What Matters in Mecklenburg County", ctaUrl: "https://www.visitmeckva.com/", ctaLabel: "Visit Mecklenburg County" },
  { slug: "river-parishes", kind: "county", textFile: "Lousiana-s-River-Parish-LA-Completed.txt", stateSlug: "louisiana", stateName: "Louisiana", placeName: "Louisiana's River Parishes", title: "Bold in Flavor. Rich in Stories.", ctaUrl: "https://lariverparishes.com/", ctaLabel: "Visit Louisiana's River Parishes" },
  { slug: "rutherford-county", kind: "county", textFile: "Rutherford-County-TN-Completed.txt", stateSlug: "tennessee", stateName: "Tennessee", placeName: "Rutherford County", title: "Savor the Flavors of Rutherford County", ctaUrl: "https://visitrutherfordtn.com/", ctaLabel: "Visit Rutherford County" },
  { slug: "york", kind: "county", textFile: "York-PA-Completed.txt", stateSlug: "pennsylvania", stateName: "Pennsylvania", placeName: "York County", title: "Fall in York County, Pennsylvania", ctaUrl: "https://www.yorkpa.org/", ctaLabel: "Explore York County" },
];

function cleanText(raw) {
  return raw
    .replace(/\u0000/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function toParagraphs(raw, meta) {
  const lines = cleanText(raw)
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const paras = [];
  for (const p of lines) {
    if (/^LINK:/i.test(p)) continue;
    if (/^HYPERLINK\b/i.test(p)) continue;
    if (/https?:\/\//i.test(p) && p.length < 220) continue;
    if (/photograph by|\[photograph/i.test(p)) continue;
    if (/^[\d_]{2,}[-_\d]*[a-z0-9 ._-]*$/i.test(p) && p.length < 40) continue;
    if (/food\s*&\s*travel|editorial copy|advertorial|words$/i.test(p) && p.length < 80) continue;
    if (/^(website url|plan your|learn more at|ready to start planning)/i.test(p)) continue;
    if (meta.title && p.toLowerCase() === meta.title.toLowerCase()) continue;
    if (p.length < 40 && !/[.!?]$/.test(p)) continue;
    if (paras.length && paras[paras.length - 1] === p) continue;
    paras.push(p);
  }

  const split = [];
  for (const p of paras) {
    if (p.length < 900) {
      split.push(p);
      continue;
    }
    const parts = p.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [p];
    let buf = "";
    for (const part of parts) {
      const next = (buf + " " + part).trim();
      if (next.length > 520 && buf) {
        split.push(buf);
        buf = part.trim();
      } else buf = next;
    }
    if (buf) split.push(buf);
  }
  return split;
}

function inferDek(paragraphs) {
  const body = paragraphs.find((p) => p.length > 80) || paragraphs[0] || "";
  return body.length > 160 ? `${body.slice(0, 157).replace(/\s+\S*$/, "")}…` : body;
}

const places = [];
for (const meta of PLACES) {
  const textPath = path.join(TEXT, meta.textFile);
  if (!fs.existsSync(textPath)) {
    console.warn("Missing text", meta.textFile);
    continue;
  }
  const raw = fs.readFileSync(textPath, "utf8");
  const paragraphs = toParagraphs(raw, meta);
  if (paragraphs[0] && paragraphs[0].toLowerCase() === meta.title.toLowerCase()) paragraphs.shift();
  const images = MANIFEST[meta.slug] || [];
  places.push({
    kind: meta.kind,
    stateSlug: meta.stateSlug,
    placeSlug: meta.slug,
    placeName: meta.placeName,
    stateName: meta.stateName,
    linkLabel: meta.kind === "county" ? meta.placeName : meta.placeName,
    title: meta.title,
    dek: inferDek(paragraphs),
    heroImage: images[0] || "",
    gallery: images.slice(1),
    paragraphs,
    ctaUrl: meta.ctaUrl,
    ctaLabel: meta.ctaLabel,
  });
  console.log(meta.slug, meta.kind, "paras", paragraphs.length, "imgs", images.length);
}

const lines = [];
lines.push(`export type FallPlaceKind = "city" | "county";`);
lines.push(``);
lines.push(`export type FallPlace = {`);
lines.push(`  kind: FallPlaceKind;`);
lines.push(`  stateSlug: string;`);
lines.push(`  placeSlug: string;`);
lines.push(`  placeName: string;`);
lines.push(`  stateName: string;`);
lines.push(`  linkLabel: string;`);
lines.push(`  title: string;`);
lines.push(`  dek: string;`);
lines.push(`  heroImage: string;`);
lines.push(`  gallery: string[];`);
lines.push(`  paragraphs: string[];`);
lines.push(`  ctaUrl?: string;`);
lines.push(`  ctaLabel?: string;`);
lines.push(`};`);
lines.push(``);
lines.push(`/** Fall 2026 city and county pages from partner editorials and Images folders. */`);
lines.push(`export const FALL_2026_PLACES: FallPlace[] = [`);
for (const g of places) {
  lines.push(`  {`);
  lines.push(`    kind: ${JSON.stringify(g.kind)},`);
  lines.push(`    stateSlug: ${JSON.stringify(g.stateSlug)},`);
  lines.push(`    placeSlug: ${JSON.stringify(g.placeSlug)},`);
  lines.push(`    placeName: ${JSON.stringify(g.placeName)},`);
  lines.push(`    stateName: ${JSON.stringify(g.stateName)},`);
  lines.push(`    linkLabel: ${JSON.stringify(g.linkLabel)},`);
  lines.push(`    title: ${JSON.stringify(g.title)},`);
  lines.push(`    dek: ${JSON.stringify(g.dek)},`);
  lines.push(`    heroImage: ${JSON.stringify(g.heroImage)},`);
  lines.push(`    gallery: ${JSON.stringify(g.gallery)},`);
  lines.push(`    paragraphs: [`);
  for (const p of g.paragraphs) lines.push(`      ${JSON.stringify(p)},`);
  lines.push(`    ],`);
  lines.push(`    ctaUrl: ${JSON.stringify(g.ctaUrl)},`);
  lines.push(`    ctaLabel: ${JSON.stringify(g.ctaLabel)},`);
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);
lines.push(`export function getFallPlacesForState(stateSlug: string, kind?: FallPlaceKind): FallPlace[] {`);
lines.push(`  return FALL_2026_PLACES.filter((p) => p.stateSlug === stateSlug && (!kind || p.kind === kind));`);
lines.push(`}`);
lines.push(``);
lines.push(`export function getFallPlace(stateSlug: string, kind: FallPlaceKind, placeSlug: string): FallPlace | undefined {`);
lines.push(`  return FALL_2026_PLACES.find((p) => p.stateSlug === stateSlug && p.kind === kind && p.placeSlug === placeSlug);`);
lines.push(`}`);
lines.push(``);

const outPath = path.join(ROOT, "src/data/destinations/fall2026Places.ts");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath, places.length);
