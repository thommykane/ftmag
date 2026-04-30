import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const j = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "src/data/restaurants/national151-1000.json"),
    "utf8",
  ),
);
const t = fs.readFileSync(
  path.join(ROOT, "src/data/restaurants/national150Seed.ts"),
  "utf8",
);
const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const ban = new Set([...t.matchAll(/name: "([^"]+)"/g)].map((m) => norm(m[1])));

let ranksOk = true;
for (let i = 0; i < j.length; i++) {
  if (j[i].nationalRank !== 151 + i) {
    console.log("Bad rank at", i, j[i].nationalRank);
    ranksOk = false;
    break;
  }
}
console.log("Ranks 151–1000 contiguous:", ranksOk);

const overlap = j.filter((r) => ban.has(norm(r.name)));
console.log("Overlap with top-150 names:", overlap.length, overlap.map((r) => r.name));

const seen = new Set();
let dup = false;
for (const r of j) {
  const k = norm(r.name);
  if (seen.has(k)) {
    console.log("Dup:", r.name);
    dup = true;
  }
  seen.add(k);
}
console.log("Unique names in 151–1000:", seen.size, "dup?", dup);
