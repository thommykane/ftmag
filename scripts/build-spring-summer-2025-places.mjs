/**
 * Builds src/data/destinations/springSummer2025Places.ts
 * Run: node scripts/build-spring-summer-2025-places.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TEXT = path.join(ROOT, ".tmp-spring-summer-2025-text");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/destinations/spring-summer-2025-web/manifest.json"), "utf8"),
);

const PLACES = [
  { slug: "cherokee-county", kind: "county", textFile: "cherokee.txt", stateSlug: "georgia", stateName: "Georgia", placeName: "Cherokee County", title: "Adventure Meets Flavor on the Trail in Cherokee, Georgia", ctaUrl: "https://www.destinationcherokeega.com/", ctaLabel: "Destination Cherokee" },
  { slug: "chincoteague", kind: "city", textFile: "chincoteague.txt", stateSlug: "virginia", stateName: "Virginia", placeName: "Chincoteague", title: "Discover Your Love of Chincoteague Island", ctaUrl: "https://www.visitciva.com/", ctaLabel: "Visit Chincoteague" },
  { slug: "new-bedford", kind: "city", textFile: "new-bedford.txt", stateSlug: "massachusetts", stateName: "Massachusetts", placeName: "New Bedford", title: "New Bedford, the City That Lit the World", ctaUrl: "https://explorenewbedford.org/", ctaLabel: "Explore New Bedford" },
  { slug: "peachtree-city", kind: "city", textFile: "peachtree-city.txt", stateSlug: "georgia", stateName: "Georgia", placeName: "Peachtree City", title: "Discover Peachtree City, Georgia", ctaUrl: "https://visitpeachtreecity.com/", ctaLabel: "Visit Peachtree City" },
  { slug: "wichita-falls", kind: "city", textFile: "wichita-falls.txt", stateSlug: "texas", stateName: "Texas", placeName: "Wichita Falls", title: "Farm-to-Table Evenings at Morath Orchard", ctaUrl: "https://discoverwichitafalls.com/", ctaLabel: "Discover Wichita Falls" },
  { slug: "mobile", kind: "city", textFile: "mobile.txt", stateSlug: "alabama", stateName: "Alabama", placeName: "Mobile", title: "Choose Your Own Walkable Adventure in Mobile", ctaUrl: "https://www.mobile.org/", ctaLabel: "Visit Mobile" },
  { slug: "palm-beaches", kind: "city", textFile: "palm-beaches.txt", stateSlug: "florida", stateName: "Florida", placeName: "The Palm Beaches", title: "Curate Your Perfect Vacation in The Palm Beaches", ctaUrl: "https://www.thepalmbeaches.com/", ctaLabel: "Discover The Palm Beaches" },
];

function cleanText(raw) {
  return raw
    .replace(/\u0000/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/\r/g, "")
    .replace(/---URLS---[\s\S]*$/, "")
    .replace(/[ \t]+\n/g, "\n");
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
    if (/https?:\/\//i.test(p)) continue;
    if (/photograph by|photo caption|photo attribution/i.test(p)) continue;
    if (/food\s*[&+]\s*travel|editorial copy|600 words|cvb$|funded by the/i.test(p) && p.length < 120) continue;
    if (/^(website url|plan your|learn more at|for more information|visit www|headline|copy|blurb|editorial|video|photos|url)\b/i.test(p)) continue;
    if (/^(visit |plan your trip at |make .+ your next destination)/i.test(p) && /https?:\/\/|\.com\b|\.org\b/i.test(p) && p.length < 160) continue;
    const bare = p.toLowerCase().replace(/[!?.]+$/g, "").trim();
    const titleBare = meta.title.toLowerCase().replace(/[!?.]+$/g, "").trim();
    if (titleBare === bare || titleBare.startsWith(bare)) continue;
    if (p.length < 100 && !/[.!?]$/.test(p)) continue;
    if (paras.length && paras[paras.length - 1] === p) continue;
    paras.push(p);
  }
  const split = [];
  for (const p of paras) {
    if (p.length < 900) {
      split.push(p);
      continue;
    }
    const protectedText = p.replace(/\b([A-Z])\./g, "$1\u0001");
    const parts = (protectedText.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [protectedText]).map((part) =>
      part.replace(/\u0001/g, "."),
    );
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
  const images = MANIFEST[meta.slug] || [];
  places.push({ ...meta, dek: inferDek(paragraphs), heroImage: images[0] || "", gallery: images.slice(1), paragraphs });
  console.log(meta.slug, meta.kind, "paras", paragraphs.length, "words", paragraphs.join(" ").split(/\s+/).length, "imgs", images.length);
}

const lines = [];
lines.push(`import type { FallPlace } from "./fall2026Places";`);
lines.push(``);
lines.push(`/** Spring 2025 and Summer 2025 city and county pages. Duplicates of existing guides are omitted. */`);
lines.push(`export const SPRING_SUMMER_2025_PLACES: FallPlace[] = [`);
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
fs.writeFileSync(path.join(ROOT, "src/data/destinations/springSummer2025Places.ts"), lines.join("\n"), "utf8");
console.log("places", places.length);
