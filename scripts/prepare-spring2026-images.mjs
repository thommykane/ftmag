/**
 * Optimize Spring 2026 destination Images into public/destinations/spring-2026-web/{slug}/
 * (keeps source packs in public/destinations/spring-2026/)
 * Run: node scripts/prepare-spring2026-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "public", "destinations", "spring-2026");
const OUT = path.join(ROOT, "public", "destinations", "spring-2026-web");
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff", ".gif"]);

/** Skip summer duplicates + non-destination packs */
const DESTINATIONS = [
  { slug: "visit-alamance", folder: "Alamance, County, NC (Completed)", max: 8, imagesFromEditorial: true },
  { slug: "visit-beaufort", folder: "Beaufort, SC (Completed)", max: 8 },
  { slug: "visit-brandywine-valley", folder: "Chester County, PA (Brandywine Valley) (Completed)", max: 8 },
  { slug: "visit-fresno", folder: "Fresno (Completed)", max: 7 },
  { slug: "visit-highland-county", folder: "Highland County VA (Completed)", max: 8 },
  { slug: "visit-hocking-hills", folder: "Hocking Hills, Ohio (Completed)", max: 8 },
  { slug: "visit-jacksonville", folder: "Jacksonville, OR (Complete)", max: 7 },
  { slug: "visit-kenosha", folder: "Kenosha (Completed)", max: 8 },
  { slug: "visit-laredo", folder: "Laredo, TX (Complete)", max: 8 },
  { slug: "visit-ridgeland", folder: "Ridgeland (Completed)", max: 8 },
  { slug: "visit-sandia-resort", folder: "Sandia Resort (Complete)", max: 8 },
  { slug: "visit-santa-fe", folder: "Santa Fe (Completed)", max: 8 },
  { slug: "visit-stevens-point", folder: "Stevens Point (Just needs Images)", max: 8 },
  { slug: "visit-beech-mountain", folder: "Town Of Beech Mountain (Completed)", max: 8 },
  { slug: "visit-lodi", folder: "Visit Lodi, CA (Completed)", max: 8 },
  { slug: "visit-massachusetts", folder: "Visit Mass (Completed)", max: 8 },
  { slug: "visit-tupelo", folder: "Visit Tupelo MS (Completed)", max: 8, exclude: /^\._/ },
  { slug: "visit-yorktown", folder: "York County (Yorktown) VA  (Completed)", max: 8 },
];

function findImagesDir(folder, imagesFromEditorial) {
  const base = path.join(SRC, folder);
  if (!fs.existsSync(base)) return null;
  if (imagesFromEditorial) {
    const ed = path.join(base, "Editorial");
    if (fs.existsSync(ed)) return ed;
  }
  const entries = fs.readdirSync(base, { withFileTypes: true });
  const hit = entries.find((e) => e.isDirectory() && /^images/i.test(e.name));
  return hit ? path.join(base, hit.name) : null;
}

function walkImages(dir, exclude) {
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
      if (exclude && exclude.test(name)) continue;
      if (/logo|banner|primary|reversed|\.rtf$/i.test(name) && st.size < 200_000) continue;
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
  const imagesDir = findImagesDir(d.folder, d.imagesFromEditorial);
  let files = walkImages(imagesDir, d.exclude).slice(0, d.max);
  const written = [];
  for (let i = 0; i < files.length; i++) {
    const name = safeBase(files[i], i);
    const dest = path.join(outDir, name);
    if (await optimizeOne(files[i], dest)) {
      written.push(`/destinations/spring-2026-web/${d.slug}/${name}`);
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
console.log("\nWrote", path.join(OUT, "manifest.json"));
