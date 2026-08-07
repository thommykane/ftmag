/**
 * Builds src/data/destinations/spring2026Guides.ts from extracted editorials + image manifest.
 * Run: node scripts/build-spring2026-guides.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const TEXT = path.join(ROOT, ".tmp-spring2026-text");
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(ROOT, "public/destinations/spring-2026-web/manifest.json"), "utf8"),
);

const META = {
  "visit-alamance": {
    textFile: "Alamance-County-NC-Completed.txt",
    stateSlug: "north-carolina",
    stateName: "North Carolina",
    placeName: "Alamance County",
    visitSlug: "visit-alamance",
    linkLabel: "Visit Alamance County",
    title: "Discover Alamance County, NC",
    dek: "Small-town charm, riverside trails, and surprises around every corner.",
    ctaUrl: "https://www.visitalamance.com/",
    ctaLabel: "Visit Alamance",
  },
  "visit-beaufort": {
    textFile: "Beaufort-SC-Completed.txt",
    stateSlug: "south-carolina",
    stateName: "South Carolina",
    placeName: "Beaufort",
    visitSlug: "visit-beaufort",
    linkLabel: "Visit Beaufort",
    title: "Spring in Beaufort, South Carolina",
    dek: "Azaleas, marsh light, and Lowcountry flavor along the salt air.",
    ctaUrl: "https://www.beaufortsc.org/",
    ctaLabel: "Visit Beaufort",
  },
  "visit-brandywine-valley": {
    textFile: "Chester-County-PA-Brandywine-Valley-Completed.txt",
    stateSlug: "pennsylvania",
    stateName: "Pennsylvania",
    placeName: "Brandywine Valley",
    visitSlug: "visit-brandywine-valley",
    linkLabel: "Visit Brandywine Valley",
    title: "Spring in Chester County’s Brandywine Valley",
    dek: "Gardens, estates, and culinary stops when the valley melts into spring.",
    ctaUrl: "https://www.brandywinevalley.com/",
    ctaLabel: "Visit Brandywine Valley",
  },
  "visit-fresno": {
    textFile: "Fresno-Completed.txt",
    stateSlug: "california",
    stateName: "California",
    placeName: "Fresno County",
    visitSlug: "visit-fresno",
    linkLabel: "Visit Fresno",
    title: "An Under-the-Radar Foodie Experience in Fresno County",
    dek: "Luxury dining, food trucks, wineries, and breweries across the Central Valley.",
    ctaUrl: "https://www.visitfresnocounty.org/",
    ctaLabel: "Visit Fresno County",
  },
  "visit-highland-county": {
    textFile: "Highland-County-VA-Completed.txt",
    stateSlug: "virginia",
    stateName: "Virginia",
    placeName: "Highland County",
    visitSlug: "visit-highland-county",
    linkLabel: "Visit Highland County",
    title: "Life Is Sweet in Highland County, Virginia",
    dek: "Peaceful mountains, festivals, and outstanding views on Virginia’s western edge.",
    ctaUrl: "https://www.highlandcounty.org/",
    ctaLabel: "Visit Highland County",
  },
  "visit-hocking-hills": {
    textFile: "Hocking-Hills-Ohio-Completed.txt",
    stateSlug: "ohio",
    stateName: "Ohio",
    placeName: "Hocking Hills",
    visitSlug: "visit-hocking-hills",
    linkLabel: "Visit Hocking Hills",
    title: "Spring in Ohio’s Hocking Hills",
    dek: "Waterfalls, forest hikes, and a slower pace when spring awakens.",
    ctaUrl: "https://www.explorehockinghills.com/",
    ctaLabel: "Explore Hocking Hills",
  },
  "visit-jacksonville": {
    textFile: "Jacksonville-OR-Complete.txt",
    stateSlug: "oregon",
    stateName: "Oregon",
    placeName: "Jacksonville",
    visitSlug: "visit-jacksonville",
    linkLabel: "Visit Jacksonville",
    title: "Jacksonville, Oregon: In the Middle of Everywhere",
    dek: "Wildflowers, waking vineyards, and a historic town in southern Oregon.",
    ctaUrl: "https://jacksonvilleoregon.org/",
    ctaLabel: "Visit Jacksonville",
  },
  "visit-kenosha": {
    textFile: "Kenosha-Completed.txt",
    stateSlug: "wisconsin",
    stateName: "Wisconsin",
    placeName: "Kenosha",
    visitSlug: "visit-kenosha",
    linkLabel: "Visit Kenosha",
    title: "Kenosha on Lake Michigan",
    dek: "Culinary tradition and community pride along Wisconsin’s lakeshore.",
    ctaUrl: "https://www.visitkenosha.com/",
    ctaLabel: "Visit Kenosha",
  },
  "visit-laredo": {
    textFile: "Laredo-TX-Complete.txt",
    stateSlug: "texas",
    stateName: "Texas",
    placeName: "Laredo",
    visitSlug: "visit-laredo",
    linkLabel: "Visit Laredo",
    title: "Laredo, Texas: Culture, Cuisine, and Adventure",
    dek: "Along the Rio Grande, a border city that defies expectations.",
    ctaUrl: "https://visitlaredo.com/",
    ctaLabel: "Visit Laredo",
  },
  "visit-ridgeland": {
    textFile: "Ridgeland-Completed.txt",
    stateSlug: "mississippi",
    stateName: "Mississippi",
    placeName: "Ridgeland",
    visitSlug: "visit-ridgeland",
    linkLabel: "Visit Ridgeland",
    title: "Ridgeland, Mississippi",
    dek: "Two new trails and one delicious destination for diners and explorers.",
    ctaUrl: "https://www.exploreridgeland.com/",
    ctaLabel: "Explore Ridgeland",
  },
  "visit-sandia-resort": {
    textFile: "Sandia-Resort-Complete.txt",
    stateSlug: "new-mexico",
    stateName: "New Mexico",
    placeName: "Sandia Resort & Casino",
    visitSlug: "visit-sandia-resort",
    linkLabel: "Visit Sandia Resort",
    title: "Sandia Resort & Casino",
    dek: "At the foothills of the Sandia Mountains — spirit, flavor, and hospitality.",
    ctaUrl: "https://www.sandiacasino.com/",
    ctaLabel: "Visit Sandia Resort & Casino",
  },
  "visit-santa-fe": {
    textFile: "Santa-Fe-Completed.txt",
    stateSlug: "new-mexico",
    stateName: "New Mexico",
    placeName: "Santa Fe",
    visitSlug: "visit-santa-fe",
    linkLabel: "Visit Santa Fe",
    title: "Discover Your Heart, Soul & Spirit in Santa Fe",
    dek: "The #1 U.S. city in Travel + Leisure’s World’s Best — art, flavor, and spirit.",
    ctaUrl: "https://www.visitsantafe.com/",
    ctaLabel: "Visit Santa Fe",
  },
  "visit-stevens-point": {
    textFile: "Stevens-Point-Just-needs-Images.txt",
    stateSlug: "wisconsin",
    stateName: "Wisconsin",
    placeName: "Stevens Point",
    visitSlug: "visit-stevens-point",
    linkLabel: "Visit Stevens Point",
    title: "Pedal, Pour, and Plate in Stevens Point",
    dek: "A culinary adventure through Central Wisconsin’s Stevens Point area.",
    ctaUrl: "https://www.stevenspointarea.com/",
    ctaLabel: "Visit Stevens Point Area",
  },
  "visit-beech-mountain": {
    textFile: "Town-Of-Beech-Mountain-Completed.txt",
    stateSlug: "north-carolina",
    stateName: "North Carolina",
    placeName: "Beech Mountain",
    visitSlug: "visit-beech-mountain",
    linkLabel: "Visit Beech Mountain",
    title: "Beech Mountain: A Calm & Cool Retreat",
    dek: "Trade packed shorelines for panoramic views in North Carolina’s high country.",
    ctaUrl: "https://www.beechmtn.com/",
    ctaLabel: "Visit Beech Mountain",
  },
  "visit-lodi": {
    textFile: "Visit-Lodi-CA-Completed.txt",
    stateSlug: "california",
    stateName: "California",
    placeName: "Lodi",
    visitSlug: "visit-lodi",
    linkLabel: "Visit Lodi",
    title: "Visit Lodi, California",
    dek: "A charming small town with a big wine reputation between Sacramento and the Delta.",
    ctaUrl: "https://www.visitlodi.com/",
    ctaLabel: "Visit Lodi",
  },
  "visit-massachusetts": {
    textFile: "Visit-Mass-Completed.txt",
    stateSlug: "massachusetts",
    stateName: "Massachusetts",
    placeName: "Massachusetts",
    visitSlug: "visit-massachusetts",
    linkLabel: "Explore Massachusetts",
    title: "A Taste of Massachusetts",
    dek: "Where food tells the story of place — land, sea, and local flavor.",
    ctaUrl: "https://www.visitma.com/",
    ctaLabel: "Visit Massachusetts",
  },
  "visit-tupelo": {
    textFile: "Visit-Tupelo-MS-Completed.txt",
    stateSlug: "mississippi",
    stateName: "Mississippi",
    placeName: "Tupelo",
    visitSlug: "visit-tupelo",
    linkLabel: "Visit Tupelo",
    title: "Road Trip Memories in Tupelo, Mississippi",
    dek: "Elvis heritage, the Natchez Trace, and a culinary scene worth the detour.",
    ctaUrl: "https://www.tupelo.net/",
    ctaLabel: "Visit Tupelo",
  },
  "visit-yorktown": {
    textFile: "York-County-Yorktown-VA-Completed.txt",
    stateSlug: "virginia",
    stateName: "Virginia",
    placeName: "Yorktown",
    visitSlug: "visit-yorktown",
    linkLabel: "Visit Yorktown",
    title: "Small Town, Deep History: Yorktown’s Riverfront Life",
    dek: "Where sand, sea, and ships sealed America’s independence — and flavor still gathers.",
    ctaUrl: "https://www.visityorktown.org/",
    ctaLabel: "Visit Yorktown",
  },
};

function cleanText(raw) {
  return raw
    .replace(/\u0000/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\uFFFD/g, "'")
    .trim();
}

function toParagraphs(raw, meta) {
  let text = cleanText(raw);

  // Strip common metadata prefixes
  text = text
    .replace(/^Food & Travel Magazine: Spring Editorial\s*/i, "")
    .replace(/^Web Page Images \(10\)\s*/i, "")
    .replace(/^Editorial \(600 Words\):\s*/i, "")
    .replace(/^Food & Travel Mag\s*/i, "")
    .replace(/^Visit Lodi Advertorial\s*/i, "")
    .replace(/^\d+\s*words\s*/i, "")
    .replace(/^Title:\s*/i, "")
    .replace(/^GARDEN & GUN[\s\S]*?Copy \(\d+ words\)\s*/i, "")
    .replace(/^Headline\s*/i, "")
    .replace(/^Jan - Feb\s*/i, "")
    .replace(/^approx\.?\s*600 words\)?\s*/i, "")
    .replace(/\(approx\.?\s*600 words\)\s*/i, "")
    .replace(/^Photos:\s*https?:\/\/\S+\s*/i, "")
    .replace(/Pedal, Pour, and Plate: A Culinary Adventure in Stevens Point AreaPhotos:\s*https?:\/\/\S+\s*/i, "Pedal, Pour, and Plate: A Culinary Adventure in Stevens Point Area\n");

  if (meta.visitSlug === "visit-santa-fe") {
    text = text.replace(/Discover Your Heart, Soul & Spirit in Santa Fe:\s*/i, "Discover Your Heart, Soul & Spirit in Santa Fe\n");
  }

  const rawLines = text.split("\n");
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
    const looksHeading =
      line.length < 55 &&
      !/[.!?]$/.test(line) &&
      /^[A-Z]/.test(line) &&
      /[a-z]/.test(line) &&
      /[.!?]"?$/.test(cur);
    if (looksHeading) {
      joined.push(cur);
      cur = line;
      continue;
    }
    cur = `${cur} ${line}`;
  }
  if (cur) joined.push(cur);

  const paras = [];
  for (let p of joined) {
    p = p.replace(/\s+/g, " ").trim();
    if (/^https?:\/\//i.test(p)) continue;
    if (meta.title && p.toLowerCase() === meta.title.toLowerCase()) continue;
    if (p.length < 25 && !/[.!?]$/.test(p)) continue;
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
  if (!images.length) console.warn("No images for", slug);
  const heroImage = images[0] || "";
  const gallery = images.slice(1);
  const title = inferTitle(paragraphs, meta, raw);
  const dek = inferDek(paragraphs, meta);
  if (paragraphs[0] && paragraphs[0].toLowerCase() === title.toLowerCase()) paragraphs.shift();

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
lines.push(`/** Spring 2026 dedicated destination visit guides (from partner editorials + Images). */`);
lines.push(`export const SPRING_2026_GUIDES: VisitGuide[] = [`);

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
  for (const p of g.paragraphs) lines.push(`      ${JSON.stringify(p)},`);
  lines.push(`    ],`);
  if (g.ctaUrl) {
    lines.push(`    ctaUrl: ${JSON.stringify(g.ctaUrl)},`);
    lines.push(`    ctaLabel: ${JSON.stringify(g.ctaLabel)},`);
  }
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);

const outPath = path.join(ROOT, "src/data/destinations/spring2026Guides.ts");
fs.writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath, "guides:", guides.length);
