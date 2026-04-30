import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SEED = fs.readFileSync(
  path.join(ROOT, "src/data/restaurants/national150Seed.ts"),
  "utf8",
);
const banned = new Set(
  [...SEED.matchAll(/name: "([^"]+)"/g)].map((m) =>
    m[1]
      .toLowerCase()
      .replace(/[''`]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  ),
);
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const bulk = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "src/data/restaurants/national-fallback-bulk.json"),
    "utf8",
  ),
);
const bad = bulk.filter((r) => banned.has(norm(r.name)));
console.log(
  "Banned collisions:",
  bad.map((r) => r.name),
);
