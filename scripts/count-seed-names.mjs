import fs from "node:fs";
const t = fs.readFileSync("src/data/restaurants/national150Seed.ts", "utf8");
const m = [...t.matchAll(/name: "([^"]+)"/g)].map((x) => x[1]);
console.log("count", m.length);
console.log("unique", new Set(m).size);
