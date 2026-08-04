/**
 * Optimize Summer 2026 destination Images into public/destinations/summer-2026/{slug}/
 * Run: node scripts/prepare-summer2026-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "summer 2026");
const OUT = path.join(ROOT, "public", "destinations", "summer-2026");
const TMP_LM = path.join(ROOT, ".tmp-summer2026-text", "lake-murray-images");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif", ".heic", ".heif"]);

/** @type {{ slug: string, folder: string | null, imagesDir?: string, exclude?: RegExp, max?: number }[]} */
const DESTINATIONS = [
  { slug: "visit-dodge-city", folder: "Dodge City (Done)", max: 8 },
  { slug: "visit-edenton", folder: "Edenton (Done)", max: 10 },
  { slug: "visit-excelsior-springs", folder: "Excelsior Springs (Done)", max: 8, exclude: /^(Ocean-House|Perry Raso|SC25|Tandem|Young Boulder)/i },
  { slug: "visit-french-lick", folder: "French Lick Indiana (Done)", max: 8 },
  { slug: "visit-gun-lake-casino", folder: "Gun Lake Casino (Done)", max: 8 },
  { slug: "visit-henderson", folder: "Henderson NV (Done)", max: 8 },
  { slug: "visit-lake-murray", folder: null, imagesDir: TMP_LM, max: 6 },
  { slug: "visit-ocean-county", folder: "Ocean County (Done)", max: 0 }, // PDFs only — skip binary convert here
  { slug: "visit-pearland", folder: "Pearland TX (Done)", max: 0 }, // Dropbox placeholder — empty
  { slug: "visit-randolph-county", folder: "Randolph County (Done)", max: 8 },
  { slug: "visit-rehoboth-beach", folder: "Rehoboth (Done)", max: 10, exclude: /^RBDBCC_/i },
  { slug: "visit-south-county", folder: "South County (Done)", max: 8 },
  { slug: "visit-springfield", folder: "Springfield, IL (Done)", max: 8 },
  { slug: "visit-tennessee", folder: "Tennessee Tourism (Done)", max: 10 },
  { slug: "visit-tifton", folder: "Tifton GA (Done)", max: 8 },
  { slug: "visit-uvalde", folder: "Uvalde (Done)", max: 8 },
  { slug: "visit-pella", folder: "Visit Pella (Done)", max: 8 },
  { slug: "visit-st-pete", folder: "Visit St Pete (Done)", max: 8 },
];

function findImagesDir(folder) {
  const base = path.join(SRC, folder);
  if (!fs.existsSync(base)) return null;
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const hit = entries.find((e) => e.isDirectory() && /^images/i.test(e.name));
  return hit ? path.join(base, hit.name) : null;
}

function walkImages(dir, exclude) {
  if (!dir || !fs.existsSync(dir)) return [];
  /** @type {string[]} */
  const files = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const name of fs.readdirSync(cur)) {
      const full = path.join(cur, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        // Prefer "No Seal" / Advertorial Images content for TN
        stack.push(full);
        continue;
      }
      const ext = path.extname(name).toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      if (exclude && exclude.test(name)) continue;
      // Skip logos / tiny banners / ads when obvious
      if (/logo|banner|primary_fullcolor|reversed/i.test(name) && st.size < 200_000) continue;
      files.push(full);
    }
  }
  // Prefer larger files (usually hero-quality), then name
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
    console.warn("  skip", path.basename(src), String(err.message || err));
    return false;
  }
}

async function processDest(d) {
  const outDir = path.join(OUT, d.slug);
  fs.mkdirSync(outDir, { recursive: true });
  // clear previous jpgs
  for (const f of fs.readdirSync(outDir)) {
    if (/\.jpe?g$/i.test(f)) fs.unlinkSync(path.join(outDir, f));
  }

  if (!d.max) {
    console.log(d.slug, "— no local raster images configured");
    return [];
  }

  const imagesDir = d.imagesDir || (d.folder ? findImagesDir(d.folder) : null);
  let files = walkImages(imagesDir, d.exclude);
  // For Tennessee, prefer No Seal folder if present
  if (d.slug === "visit-tennessee" && imagesDir) {
    const noSeal = path.join(imagesDir, "Advertorial Images", "No Seal");
    const sealed = path.join(imagesDir, "Advertorial Images");
    const prefer = fs.existsSync(noSeal) ? noSeal : sealed;
    files = walkImages(prefer, d.exclude);
  }
  files = files.slice(0, d.max);

  /** @type {string[]} */
  const written = [];
  for (let i = 0; i < files.length; i++) {
    const name = safeBase(files[i], i);
    const dest = path.join(outDir, name);
    const ok = await optimizeOne(files[i], dest);
    if (ok) {
      written.push(`/destinations/summer-2026/${d.slug}/${name}`);
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(" ", d.slug, name, `${kb}KB`);
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
console.log("\nWrote", path.join(OUT, "manifest.json"));
