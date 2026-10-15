/**
 * Builds src/data/destinations/fallWinter2025Places.ts
 * Run: node scripts/build-fall-winter-2025-places.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TEXT = path.join(ROOT, ".tmp-fall-winter-2025-text");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/destinations/fall-winter-2025-web/manifest.json"), "utf8"),
);

const PLACES = [
  { slug: "bell-buckle", kind: "city", textFile: "bell-buckle.txt", stateSlug: "tennessee", stateName: "Tennessee", placeName: "Bell Buckle", title: "Why Visit Bell Buckle, Tennessee in the Fall", ctaUrl: "https://bellbuckletn.com/", ctaLabel: "Visit Bell Buckle" },
  { slug: "boerne", kind: "city", textFile: "boerne.txt", stateSlug: "texas", stateName: "Texas", placeName: "Boerne", title: "Autumn Charm and Culinary Delights in Boerne", ctaUrl: "https://www.visitboerne.org/", ctaLabel: "Visit Boerne" },
  { slug: "butte", kind: "city", textFile: "butte.txt", stateSlug: "montana", stateName: "Montana", placeName: "Butte", title: "A Taste of Butte", ctaUrl: "https://www.visitbutte.com/", ctaLabel: "Visit Butte" },
  { slug: "gettysburg", kind: "city", textFile: "gettysburg.txt", stateSlug: "pennsylvania", stateName: "Pennsylvania", placeName: "Gettysburg", title: "Autumn in Gettysburg, Pennsylvania", ctaUrl: "https://www.destinationgettysburg.com/", ctaLabel: "Destination Gettysburg" },
  { slug: "jefferson-county", kind: "county", textFile: "jefferson-county.txt", stateSlug: "west-virginia", stateName: "West Virginia", placeName: "Jefferson County", title: "Jefferson County, West Virginia", ctaUrl: "https://www.wherealmostheavenbegins.com/", ctaLabel: "Visit Jefferson County" },
  { slug: "lafayette", kind: "city", textFile: "lafayette.txt", stateSlug: "louisiana", stateName: "Louisiana", placeName: "Lafayette", title: "Fall in Lafayette, Louisiana", ctaUrl: "https://www.lafayettetravel.com/", ctaLabel: "Visit Lafayette" },
  { slug: "lynchburg", kind: "city", textFile: "lynchburg.txt", stateSlug: "tennessee", stateName: "Tennessee", placeName: "Lynchburg", title: "Autumn in Lynchburg, Tennessee", ctaUrl: "https://www.lynchburgtn.com/", ctaLabel: "Visit Lynchburg" },
  { slug: "marthas-vineyard", kind: "city", textFile: "marthas-vineyard.txt", stateSlug: "massachusetts", stateName: "Massachusetts", placeName: "Martha's Vineyard", title: "Why You Should Visit Martha's Vineyard", ctaUrl: "https://www.mvy.com/", ctaLabel: "Visit Martha's Vineyard" },
  { slug: "merrimack-valley", kind: "city", textFile: "merrimack-valley.txt", stateSlug: "massachusetts", stateName: "Massachusetts", placeName: "Merrimack Valley", title: "Revolutionary Cuisine: Lexington, Concord, and Lowell", ctaUrl: "https://www.merrimackvalley.org/", ctaLabel: "Visit the Merrimack Valley" },
  { slug: "tillamook", kind: "county", textFile: "tillamook.txt", stateSlug: "oregon", stateName: "Oregon", placeName: "Tillamook County", title: "Oregon's Tillamook Coast in the Fall", ctaUrl: "https://tillamookcoast.com/", ctaLabel: "Visit the Tillamook Coast" },
  { slug: "cape-may", kind: "city", textFile: "cape-may.txt", stateSlug: "new-jersey", stateName: "New Jersey", placeName: "Cape May", title: "Winter's Coastal Secret at the Jersey Cape", ctaUrl: "https://www.capemay.com/", ctaLabel: "Visit Cape May" },
  { slug: "cave-city", kind: "city", textFile: "cave-city.txt", stateSlug: "kentucky", stateName: "Kentucky", placeName: "Cave City", title: "A Piece of Paradise in Cave City, Kentucky", ctaUrl: "https://www.cavecity.com/", ctaLabel: "Visit Cave City" },
  { slug: "aiken", kind: "city", textFile: "aiken.txt", stateSlug: "south-carolina", stateName: "South Carolina", placeName: "Aiken", title: "Aiken, South Carolina: Where Tradition Meets Timeless Charm", ctaUrl: "https://www.visitaikensc.com/", ctaLabel: "Visit Aiken" },
  { slug: "elgin", kind: "city", textFile: "elgin.txt", stateSlug: "illinois", stateName: "Illinois", placeName: "Elgin", title: "Elgin, Illinois: A Fox River Table and a Walkable Downtown", ctaUrl: "https://exploreelginarea.com/", ctaLabel: "Explore Elgin" },
  { slug: "livingston", kind: "city", textFile: "livingston.txt", stateSlug: "montana", stateName: "Montana", placeName: "Livingston", title: "Escape to a Vibrant Winter Wonderland in Livingston", ctaUrl: "https://www.explorelivingstonmt.com/", ctaLabel: "Explore Livingston" },
  { slug: "plaquemines-parish", kind: "county", textFile: "plaquemines-parish.txt", stateSlug: "louisiana", stateName: "Louisiana", placeName: "Plaquemines Parish", title: "Winter Escape in Plaquemines Parish", ctaUrl: "http://plaqueminesparishtourism.com/", ctaLabel: "Visit Plaquemines Parish" },
  { slug: "seattle", kind: "city", textFile: "seattle.txt", stateSlug: "washington", stateName: "Washington", placeName: "Seattle", title: "Fantastic Foodie Finds in Seattle", ctaUrl: "https://visitseattle.org/", ctaLabel: "Visit Seattle" },
];

function cleanText(raw) {
  return raw.replace(/\u0000/g, "").replace(/\uFFFD/g, "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n");
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
    if (/https?:\/\//i.test(p) && p.length < 240) continue;
    if (/photograph by|photo caption|photo attribution/i.test(p)) continue;
    if (/food\s*&\s*travel|editorial copy|600 words|cvb$/i.test(p) && p.length < 80) continue;
    if (/^(website url|plan your|learn more at|for more information|visit www)/i.test(p)) continue;
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
      const next = `${buf} ${part}`.trim();
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
  const raw = fs.readFileSync(textPath, "utf8");
  const paragraphs = toParagraphs(raw, meta);
  if (paragraphs[0] && paragraphs[0].toLowerCase() === meta.title.toLowerCase()) paragraphs.shift();
  const images = MANIFEST[meta.slug] || [];
  places.push({ ...meta, dek: inferDek(paragraphs), heroImage: images[0] || "", gallery: images.slice(1), paragraphs });
  console.log(meta.slug, meta.kind, "paras", paragraphs.length, "imgs", images.length);
}

const lines = [];
lines.push(`import type { FallPlace } from "./fall2026Places";`);
lines.push(``);
lines.push(`/** Fall 2025 and Winter 2025 city and county pages. Duplicates of existing guides are omitted. */`);
lines.push(`export const FALL_WINTER_2025_PLACES: FallPlace[] = [`);
for (const g of places) {
  lines.push(`  {`);
  lines.push(`    kind: ${JSON.stringify(g.kind)},`);
  lines.push(`    stateSlug: ${JSON.stringify(g.stateSlug)},`);
  lines.push(`    placeSlug: ${JSON.stringify(g.slug)},`);
  lines.push(`    placeName: ${JSON.stringify(g.placeName)},`);
  lines.push(`    stateName: ${JSON.stringify(g.stateName)},`);
  lines.push(`    linkLabel: ${JSON.stringify(g.placeName)},`);
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
fs.writeFileSync(path.join(ROOT, "src/data/destinations/fallWinter2025Places.ts"), lines.join("\n"), "utf8");
console.log("places", places.length);
