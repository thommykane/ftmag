/**
 * Builds src/data/destinations/summer2026Guides.ts from extracted editorials + image manifest.
 * Run: node scripts/build-summer2026-guides.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TEXT = path.join(ROOT, ".tmp-summer2026-text");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/destinations/summer-2026/manifest.json"), "utf8"),
);

/** @type {Record<string, { textFile: string, stateSlug: string, stateName: string, placeName: string, visitSlug: string, linkLabel: string, title?: string, dek?: string, ctaUrl?: string, ctaLabel?: string, skipTitleLines?: number }>} */
const META = {
  "visit-dodge-city": {
    textFile: "Dodge-City-Done-.txt",
    stateSlug: "kansas",
    stateName: "Kansas",
    placeName: "Dodge City",
    visitSlug: "visit-dodge-city",
    linkLabel: "Visit Dodge City",
    ctaUrl: "https://visitdodgecity.org/legends",
    ctaLabel: "Plan your visit",
  },
  "visit-edenton": {
    textFile: "Edenton-Done-.txt",
    stateSlug: "north-carolina",
    stateName: "North Carolina",
    placeName: "Edenton",
    visitSlug: "visit-edenton",
    linkLabel: "Visit Edenton",
    title: "Beyond the View: Edenton’s Waterfront & Downtown",
    dek: "The South’s Prettiest Small Town — wander the waterfront without needing the car keys until it’s time to head home.",
  },
  "visit-excelsior-springs": {
    textFile: "Excelsior-Springs-Done-.txt",
    stateSlug: "missouri",
    stateName: "Missouri",
    placeName: "Excelsior Springs",
    visitSlug: "visit-excelsior-springs",
    linkLabel: "Visit Excelsior Springs",
    title: "Excelsior Springs, Missouri",
    dek: "Historic downtown, tasting rooms, and a small-town getaway just outside Kansas City.",
  },
  "visit-french-lick": {
    textFile: "French-Lick-Indiana-Done-.txt",
    stateSlug: "indiana",
    stateName: "Indiana",
    placeName: "French Lick",
    visitSlug: "visit-french-lick",
    linkLabel: "Visit French Lick",
    title: "Timeless French Lick: The Luxury of Taking Your Time",
    dek: "Southern Indiana resorts, scenic landscapes, and the art of slowing down.",
  },
  "visit-gun-lake-casino": {
    textFile: "Gun-Lake-Casino-Done-.txt",
    stateSlug: "michigan",
    stateName: "Michigan",
    placeName: "Gun Lake Casino Resort",
    visitSlug: "visit-gun-lake-casino",
    linkLabel: "Visit Gun Lake Casino",
    title: "A World of Flavor | One Incredible Destination",
    dek: "Four-Diamond dining, luxurious stays, and entertainment at Gun Lake Casino Resort.",
    ctaUrl: "https://gunlakecasino.com",
    ctaLabel: "Book your stay",
  },
  "visit-henderson": {
    textFile: "Henderson-NV-Done-.txt",
    stateSlug: "nevada",
    stateName: "Nevada",
    placeName: "Henderson",
    visitSlug: "visit-henderson",
    linkLabel: "Visit Henderson",
    title: "Your Weekend Escape Starts in Henderson",
    dek: "Small-city vibe and big-city amenities minutes from the Las Vegas Strip.",
  },
  "visit-lake-murray": {
    textFile: "Lake-Murray-Country-Done-.txt",
    stateSlug: "south-carolina",
    stateName: "South Carolina",
    placeName: "Lake Murray",
    visitSlug: "visit-lake-murray",
    linkLabel: "Visit Lake Murray",
    title: "Smoke on the Water at Lake Murray",
    dek: "Barbecue tradition meets Columbia’s waterfront scene on the shores of Lake Murray.",
  },
  "visit-ocean-county": {
    textFile: "Ocean-County-Done-.txt",
    stateSlug: "new-jersey",
    stateName: "New Jersey",
    placeName: "Ocean County",
    visitSlug: "visit-ocean-county",
    linkLabel: "Visit Ocean County",
    title: "Ocean County, New Jersey",
    dek: "Forty-four miles of Jersey Shore coastline — salt air, marinas, and bayside flavor.",
  },
  "visit-pearland": {
    textFile: "Pearland-TX-Done-.txt",
    stateSlug: "texas",
    stateName: "Texas",
    placeName: "Pearland",
    visitSlug: "visit-pearland",
    linkLabel: "Visit Pearland",
    title: "Visit Pearland, Texas",
    dek: "Twenty minutes south of Houston — barbecue, craft beer, temples, and trails.",
    ctaUrl: "https://visitpearland.com",
    ctaLabel: "Explore Pearland",
  },
  "visit-randolph-county": {
    textFile: "Randolph-County-Done-.txt",
    stateSlug: "west-virginia",
    stateName: "West Virginia",
    placeName: "Randolph County",
    visitSlug: "visit-randolph-county",
    linkLabel: "Visit Randolph County",
    title: "Randolph County, West Virginia",
    dek: "West Virginia’s largest county — trails, cabins, festivals, and Appalachian culture.",
  },
  "visit-rehoboth-beach": {
    textFile: "Rehoboth-Done-.txt",
    stateSlug: "delaware",
    stateName: "Delaware",
    placeName: "Rehoboth Beach",
    visitSlug: "visit-rehoboth-beach",
    linkLabel: "Visit Rehoboth Beach",
    title: "Rehoboth Beach & Dewey Beach",
    dek: "Award-winning boardwalk, tax-free shopping, and Delaware’s coastal resort area.",
  },
  "visit-south-county": {
    textFile: "South-County-Done-.txt",
    stateSlug: "rhode-island",
    stateName: "Rhode Island",
    placeName: "South County",
    visitSlug: "visit-south-county",
    linkLabel: "Visit South County",
    title: "South County, Rhode Island",
    dek: "Where the Ocean State earns its name — beaches, preserves, and seaside villages.",
  },
  "visit-springfield": {
    textFile: "Springfield-IL-Done-.txt",
    stateSlug: "illinois",
    stateName: "Illinois",
    placeName: "Springfield",
    visitSlug: "visit-springfield",
    linkLabel: "Visit Springfield",
    title: "Springfield, Illinois — More Than One Day",
    dek: "Route 66, Lincoln history, architecture, and culinary stops in the capital city.",
  },
  "visit-tennessee": {
    textFile: "Tennessee-Tourism-Done-.txt",
    stateSlug: "tennessee",
    stateName: "Tennessee",
    placeName: "Tennessee",
    visitSlug: "visit-tennessee",
    linkLabel: "Explore Tennessee",
    title: "Tennessee Summer Escapes",
    dek: "Reconnect with nature, culinary tours, festivals, and live music across the Volunteer State.",
    ctaUrl: "https://www.tnvacation.com",
    ctaLabel: "Plan a Tennessee trip",
  },
  "visit-tifton": {
    textFile: "Tifton-GA-Done-.txt",
    stateSlug: "georgia",
    stateName: "Georgia",
    placeName: "Tifton",
    visitSlug: "visit-tifton",
    linkLabel: "Visit Tifton",
    title: "Your Perfect Day in Tifton",
    dek: "Small-town Southern charm, local flavor, and the Friendliest City there ever was.",
  },
  "visit-uvalde": {
    textFile: "Uvalde-Done-.txt",
    stateSlug: "texas",
    stateName: "Texas",
    placeName: "Uvalde County",
    visitSlug: "visit-uvalde",
    linkLabel: "Visit Uvalde",
    title: "TerraTx: Art Meets the Frio Canyon",
    dek: "Uvalde County’s open-air mural festival along the crystal-clear Frio River.",
  },
  "visit-pella": {
    textFile: "Visit-Pella-Done-.txt",
    stateSlug: "iowa",
    stateName: "Iowa",
    placeName: "Pella",
    visitSlug: "visit-pella",
    linkLabel: "Visit Pella",
    title: "Celebrate America’s 250th in Pella, Iowa",
    dek: "Classic Americana meets living Dutch culture in the heart of the Midwest.",
  },
  "visit-st-pete": {
    textFile: "Visit-St-Pete-Done-.txt",
    stateSlug: "florida",
    stateName: "Florida",
    placeName: "St. Pete-Clearwater",
    visitSlug: "visit-st-pete",
    linkLabel: "Visit St. Pete",
    title: "The Best of Both Worlds — St. Pete-Clearwater",
    dek: "Sugar-white beaches by day, MICHELIN-recommended plates by night.",
  },
};

function cleanText(raw) {
  return raw
    .replace(/\u0000/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\uFFFD/g, "'")
    .trim();
}

function toParagraphs(raw, meta) {
  let text = cleanText(raw)
    .replace(/fi /g, "fi")
    .replace(/fl /g, "fl")
    .replace(/dif\s*fi\s*cult/gi, "difficult")
    .replace(/re\s*fl\s*ects/gi, "reflects");

  if (meta.visitSlug === "visit-gun-lake-casino") {
    const copyIdx = text.search(/COPY:\s*/i);
    if (copyIdx >= 0) text = text.slice(copyIdx).replace(/^COPY:\s*/i, "");
    text = text.replace(/\s*LOGO\/TAG:[\s\S]*$/i, "");
    text = text.replace(/\s*DISCLAIMER:[\s\S]*$/i, "");
    text = text.replace(/\s*ALWAYS SAFE\.[\s\S]*$/i, "");
  }

  if (meta.visitSlug === "visit-tennessee") {
    text = text.replace(/^Tennessee Advertorial\s*/i, "");
  }

  if (meta.visitSlug === "visit-st-pete") {
    text = text.replace(/^Food & Travel Magazine 600 Word Story\s*/i, "");
    text = text.replace(/^The Best of Both Worlds\s*/i, "");
    text = text.replace(/^Page \d+\s*/gim, "");
  }

  if (meta.visitSlug === "visit-pearland") {
    text = text.replace(/\s*DropBox of Images\s*$/i, "");
  }

  if (meta.visitSlug === "visit-french-lick") {
    text = text.replace(/^Timeless French Lick: The Luxury of Taking\s*\n?\s*Your Time\s*/i, "");
  }

  if (meta.visitSlug === "visit-edenton") {
    text = text.replace(/^Beyond the View:[\s\S]*?Downtown Experience\s*/i, "");
    text = text.replace(/^EDENTON,\s*N\.C\.\s*[—\-].*?—\s*/i, "");
  }

  // PDF soft-wrap: join lines that don't end a sentence unless blank line between
  const rawLines = text.split("\n");
  /** @type {string[]} */
  const joined = [];
  let cur = "";
  for (const rawLine of rawLines) {
    const line = rawLine.replace(/\s+/g, " ").trim();
    if (!line) {
      if (cur) {
        joined.push(cur);
        cur = "";
      }
      continue;
    }
    if (!cur) {
      cur = line;
      continue;
    }
    // New section heading (short Title Case line)
    const looksHeading =
      line.length < 50 &&
      !/[.!?]$/.test(line) &&
      /^[A-Z]/.test(line) &&
      /[a-z]/.test(line) &&
      !/^(The |A |An |For |With |From |In |On |At |To |And )/i.test(line) &&
      /[.!?]"?$/.test(cur);
    if (looksHeading) {
      joined.push(cur);
      cur = line;
      continue;
    }
    cur = `${cur} ${line}`;
  }
  if (cur) joined.push(cur);

  /** @type {string[]} */
  const paras = [];
  for (let p of joined) {
    p = p.replace(/\s+/g, " ").trim();
    if (/^Begin your own discovery at /i.test(p)) continue;
    if (/^https?:\/\//i.test(p)) continue;
    if (/^LINE:\s*/i.test(p)) continue;
    if (/^Client:/i.test(p)) continue;
    if (/^Format:/i.test(p)) continue;
    if (/^Job#:/i.test(p)) continue;
    if (meta.title && p.toLowerCase() === meta.title.toLowerCase()) continue;
    // Skip leftover title fragments
    if (/^Waterfront & Downtown Experience$/i.test(p)) continue;
    if (/^Your Time$/i.test(p)) continue;
    if (p.length < 20 && !/[.!?]$/.test(p)) continue;
    paras.push(p);
  }

  // Split oversized glued blocks on sentence boundaries if > 900 chars
  /** @type {string[]} */
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
      } else {
        buf = next;
      }
    }
    if (buf) split.push(buf);
  }

  return split;
}

function inferTitle(paragraphs, meta, raw) {
  if (meta.title) return meta.title;
  const first = cleanText(raw).split(/\n+/).map((l) => l.trim()).find(Boolean);
  if (first && first.length < 110 && !first.endsWith(".")) return first;
  return `Visit ${meta.placeName}`;
}

function inferDek(paragraphs, meta) {
  if (meta.dek) return meta.dek;
  const body = paragraphs.find((p) => p.length > 80) || paragraphs[0] || "";
  return body.length > 160 ? `${body.slice(0, 157).replace(/\s+\S*$/, "")}…` : body;
}

function esc(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
}

/** @type {object[]} */
const guides = [];

for (const [slug, meta] of Object.entries(META)) {
  const textPath = path.join(TEXT, meta.textFile);
  if (!fs.existsSync(textPath)) {
    console.warn("Missing text", meta.textFile);
    continue;
  }
  const raw = fs.readFileSync(textPath, "utf8");
  const paragraphs = toParagraphs(raw, meta);
  const images = MANIFEST[slug] || [];
  const heroImage = images[0] || "";
  const gallery = images.slice(1);
  const title = inferTitle(paragraphs, meta, raw);
  const dek = inferDek(paragraphs, meta);

  // If first paragraph duplicates title, drop it
  if (paragraphs[0] && paragraphs[0].toLowerCase() === title.toLowerCase()) {
    paragraphs.shift();
  }

  guides.push({
    stateSlug: meta.stateSlug,
    visitSlug: meta.visitSlug,
    linkLabel: meta.linkLabel,
    placeName: meta.placeName,
    stateName: meta.stateName,
    title,
    dek,
    heroImage,
    gallery,
    paragraphs,
    ctaUrl: meta.ctaUrl,
    ctaLabel: meta.ctaLabel,
  });
  console.log(slug, "paras", paragraphs.length, "imgs", images.length);
}

const lines = [];
lines.push(`import type { VisitGuide } from "./visitGuides";`);
lines.push(``);
lines.push(`/** Summer 2026 dedicated destination visit guides (from partner editorials + Images). */`);
lines.push(`export const SUMMER_2026_GUIDES: VisitGuide[] = [`);

for (const g of guides) {
  lines.push(`  {`);
  lines.push(`    stateSlug: ${JSON.stringify(g.stateSlug)},`);
  lines.push(`    visitSlug: ${JSON.stringify(g.visitSlug)},`);
  lines.push(`    linkLabel: ${JSON.stringify(g.linkLabel)},`);
  lines.push(`    placeName: ${JSON.stringify(g.placeName)},`);
  lines.push(`    stateName: ${JSON.stringify(g.stateName)},`);
  lines.push(`    title: ${JSON.stringify(g.title)},`);
  lines.push(`    dek: ${JSON.stringify(g.dek)},`);
  lines.push(`    heroImage: ${JSON.stringify(g.heroImage)},`);
  lines.push(`    gallery: ${JSON.stringify(g.gallery)},`);
  lines.push(`    paragraphs: [`);
  for (const p of g.paragraphs) {
    lines.push(`      ${JSON.stringify(p)},`);
  }
  lines.push(`    ],`);
  if (g.ctaUrl) {
    lines.push(`    ctaUrl: ${JSON.stringify(g.ctaUrl)},`);
    lines.push(`    ctaLabel: ${JSON.stringify(g.ctaLabel)},`);
  }
  lines.push(`  },`);
}

lines.push(`];`);
lines.push(``);

const outPath = path.join(ROOT, "src/data/destinations/summer2026Guides.ts");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath, "guides:", guides.length);
