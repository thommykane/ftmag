/**
 * Renders 250×250 PNG thumbnails: black background, beige state silhouette.
 * Uses @svg-maps/usa.states-territories (Unlicense) + svg-path-bounds for fitting.
 */
import pathBounds from "svg-path-bounds";
import sharp from "sharp";
import mapData from "@svg-maps/usa.states-territories";
import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { US_STATES_ALPHABETICAL } from "../src/data/states/usStates";

const OUT_DIR = path.join(process.cwd(), "public/states");
const SIZE = 250;
const PADDING = 12;
const BG = "#000000";
const FILL = "#d4c4a8";

function escapeSvgAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const byAbbr = new Map(
    mapData.locations.map((loc: { id: string; path: string }) => [loc.id.toLowerCase(), loc.path]),
  );

  for (const row of US_STATES_ALPHABETICAL) {
    const id = row.abbr.toLowerCase();
    const d = byAbbr.get(id);
    if (!d) {
      console.error("Missing SVG path for", row.name, id);
      process.exitCode = 1;
      continue;
    }

    let bounds: number[];
    try {
      bounds = pathBounds(d);
    } catch (e) {
      console.error("pathBounds failed:", row.slug, e);
      process.exitCode = 1;
      continue;
    }

    const [minX, minY, maxX, maxY] = bounds;
    const w = maxX - minX;
    const h = maxY - minY;
    if (!(w > 0 && h > 0)) {
      console.error("Bad bounds:", row.slug, bounds);
      process.exitCode = 1;
      continue;
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const s = Math.min((SIZE - 2 * PADDING) / w, (SIZE - 2 * PADDING) / h);
    const half = SIZE / 2;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>
  <path fill="${FILL}" transform="translate(${half},${half}) scale(${s}) translate(${-cx},${-cy})" d="${escapeSvgAttr(d)}"/>
</svg>`;

    const buf = await sharp(Buffer.from(svg)).png().toBuffer();
    const outPath = path.join(OUT_DIR, `${row.slug}.png`);
    writeFileSync(outPath, buf);
    console.log("wrote", path.relative(process.cwd(), outPath));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
