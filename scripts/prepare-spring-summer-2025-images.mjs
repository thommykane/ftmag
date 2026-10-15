/**
 * Optimize Spring 2025 + Summer 2025 Images into public/destinations/spring-summer-2025-web/{slug}/
 * Skips destinations that already have pages.
 * Run: node scripts/prepare-spring-summer-2025-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "public", "destinations", "spring-summer-2025-web");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif"]);

const DESTINATIONS = [
  { slug: "cherokee-county", season: "spring 25", folder: "Cherokee, GA (Completed)", max: 8 },
  { slug: "chincoteague", season: "spring 25", folder: "Chinqateague (Completed)", max: 8 },
  { slug: "new-bedford", season: "spring 25", folder: "New Bedford (Completed)", max: 8 },
  { slug: "peachtree-city", season: "spring 25", folder: "Peachtree (Completed)", max: 8 },
  { slug: "wichita-falls", season: "spring 25", folder: "Wichita Falls (completed)", max: 8 },
  { slug: "mobile", season: "summer 25", folder: "Mobile (Completed)", max: 8 },
  // Palm Beaches Images folder is banner ads only; the page uses an empty gallery.
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
      written.push(`/destinations/spring-summer-2025-web/${d.slug}/${name}`);
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
