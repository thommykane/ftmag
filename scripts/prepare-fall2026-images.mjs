/**
 * Optimize Fall 2026 Images into public/destinations/fall-2026-web/{slug}/
 * Run: node scripts/prepare-fall2026-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "fall 2026");
const OUT = path.join(ROOT, "public", "destinations", "fall-2026-web");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif"]);

/** Existing summer/spring pages are skipped. */
const DESTINATIONS = [
  { slug: "alpharetta", folder: "Alpharetta GA (Completed)", max: 8 },
  { slug: "ann-arbor", folder: "Ann Arbor (Completed)", max: 8 },
  { slug: "athens", folder: "Athens OH (Completed)", max: 8 },
  { slug: "bowling-green", folder: "Bowling Green (Complete)", max: 8 },
  { slug: "brevard", folder: "Brevard NC (Complete)", max: 8 },
  { slug: "canton", folder: "Canton ILL (Completed)", max: 8 },
  { slug: "clarksville", folder: "Clarksville TN (Completed)", max: 8 },
  { slug: "columbus", folder: "Columbus GA (Completed)", max: 8 },
  { slug: "crawford-county", folder: "Crawford County (Completed)", max: 8 },
  { slug: "deerfield", folder: "Deerfield VT (Complete)", max: 8 },
  { slug: "folly-beach", folder: "Folly Beach (Completed)", max: 8 },
  { slug: "grants-pass", folder: "Grants Pass OR (Complete)", max: 8 },
  { slug: "greater-zion", folder: "Greater Zion (Completed)", max: 8 },
  { slug: "hampshire-county", folder: "Hampshire County (Completed)", max: 8 },
  { slug: "jamestown", folder: "Jamestown (Complete)", max: 8 },
  { slug: "little-rock", folder: "Little Rock AK (Complete)", max: 8 },
  { slug: "river-parishes", folder: "Lousiana's River Parish LA (Completed)", max: 8 },
  { slug: "mecklenburg-county", folder: "Mecklenburg County VA (Complete )", max: 8 },
  { slug: "menomonie", folder: "Menomonie , WI (Need FP Ad)", max: 8 },
  { slug: "north-shore", folder: "North Shore WI (Completed)", max: 8 },
  { slug: "pahrump", folder: "Pahrump NV (Completed)", max: 8 },
  { slug: "rutherford-county", folder: "Rutherford County TN (Completed)", max: 8 },
  { slug: "walla-walla", folder: "Walla Walla (Completed)", max: 8 },
  { slug: "york", folder: "York PA (Completed)", max: 8 },
];

function findImagesDir(folder) {
  const base = path.join(SRC, folder);
  if (!fs.existsSync(base)) return null;
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const hit = entries.find((e) => e.isDirectory() && /^images/i.test(e.name));
  return hit ? path.join(base, hit.name) : null;
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
  const imagesDir = findImagesDir(d.folder);
  const files = walkImages(imagesDir).slice(0, d.max);
  const written = [];
  for (let i = 0; i < files.length; i++) {
    const name = safeBase(files[i], i);
    const dest = path.join(outDir, name);
    if (await optimizeOne(files[i], dest)) {
      written.push(`/destinations/fall-2026-web/${d.slug}/${name}`);
      console.log(" ", d.slug, name, `${Math.round(fs.statSync(dest).size / 1024)}KB`);
    }
  }
  console.log(d.slug, `→ ${written.length} images from`, imagesDir || "MISSING");
  return written;
}

const manifest = {};
for (const d of DESTINATIONS) {
  manifest[d.slug] = await processDest(d);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\nWrote", path.join(OUT, "manifest.json"));
