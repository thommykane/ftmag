/**
 * Optimize Fall 2025 + Winter 2025 Images into public/destinations/fall-winter-2025-web/{slug}/
 * Skips destinations that already have pages.
 * Run: node scripts/prepare-fall-winter-2025-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "destinations", "fall-winter-2025-web");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif"]);

const DESTINATIONS = [
  { slug: "bell-buckle", season: "fall 2025", folder: "Bell Buckle (Completed)", max: 8 },
  { slug: "boerne", season: "fall 2025", folder: "Boerne Texas (Completed)", max: 8 },
  { slug: "butte", season: "fall 2025", folder: "Butte (Complete)", max: 8 },
  { slug: "gettysburg", season: "fall 2025", folder: "Destination Gettysburg (Complete)", max: 8 },
  { slug: "jefferson-county", season: "fall 2025", folder: "Jefferson County (Completed) (They get no FP ad)", max: 8 },
  { slug: "lafayette", season: "fall 2025", folder: "Lafayette LA (Completed)", max: 8 },
  { slug: "lynchburg", season: "fall 2025", folder: "Lynchburg, TN (completed)", max: 8 },
  { slug: "marthas-vineyard", season: "fall 2025", folder: "Martha's Vineyard (Complete)", max: 8 },
  { slug: "merrimack-valley", season: "fall 2025", folder: "Merrimack Valley (Complete)", max: 8 },
  { slug: "tillamook", season: "fall 2025", folder: "Tillamook (Completed)", max: 8 },
  { slug: "cape-may", season: "winter 2025", folder: "Cape May (Done)", max: 8 },
  { slug: "cave-city", season: "winter 2025", folder: "Cave City (Done)", max: 8 },
  { slug: "aiken", season: "winter 2025", folder: "City Of Aiken (Done)", max: 8 },
  { slug: "livingston", season: "winter 2025", folder: "Explore Livingston (Done)", max: 8 },
  { slug: "plaquemines-parish", season: "winter 2025", folder: "Plaquemine Parish (done)", max: 8 },
  { slug: "seattle", season: "winter 2025", folder: "Port of Seattle (Done)", max: 8 },
];

function findImagesDir(folderPath) {
  if (!fs.existsSync(folderPath)) return null;
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });
  const hit = entries.find((e) => e.isDirectory() && /^images$/i.test(e.name.trim()));
  return hit ? path.join(folderPath, hit.name) : null;
}

function walkImages(dir) {
  if (!dir || !fs.existsSync(dir)) return [];
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const name of fs.readdirSync(cur)) {
      const full = path.join(cur, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        stack.push(full);
        continue;
      }
      const ext = path.extname(name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      if (/logo|banner|primary|reversed/i.test(name) && st.size < 250_000) continue;
      files.push(full);
    }
  }
  files.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size);
  return files;
}

function safeBase(filePath, index) {
  const base = path
    .basename(filePath, path.extname(filePath))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
  return `${String(index + 1).padStart(2, "0")}-${base || "image"}.jpg`;
}

async function optimizeOne(src, dest) {
  try {
    await sharp(src, { failOn: "none", limitInputPixels: false })
      .rotate()
      .resize({ width: 1920, height: 1440, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(dest);
    return true;
  } catch (err) {
    console.warn("  skip", path.basename(src), String(err.message || err).slice(0, 80));
    return false;
  }
}

async function processDest(d) {
  const outDir = path.join(OUT, d.slug);
  fs.mkdirSync(outDir, { recursive: true });
  for (const f of fs.readdirSync(outDir)) {
    if (/\.jpe?g$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }
  const imagesDir = findImagesDir(path.join(ROOT, "public", d.season, d.folder));
  const files = walkImages(imagesDir).slice(0, d.max);
  const written = [];
  for (let i = 0; i < files.length; i++) {
    const name = safeBase(files[i], i);
    const dest = path.join(outDir, name);
    if (await optimizeOne(files[i], dest)) {
      written.push(`/destinations/fall-winter-2025-web/${d.slug}/${name}`);
      console.log(" ", d.slug, name, `${Math.round(fs.statSync(dest).size / 1024)}KB`);
    }
  }
  console.log(d.slug, `→ ${written.length} images`);
  return written;
}

const manifest = {};
for (const d of DESTINATIONS) {
  manifest[d.slug] = await processDest(d);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("Wrote manifest", Object.keys(manifest).length);
