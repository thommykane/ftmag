/**
 * Builds ranks 151–1000 from Michelin Guide CSV + curated fallbacks.
 * Run: node scripts/build-national-151-1000.mjs
 *
 * Operational status is not asserted by this script. For editorial QA, a
 * practical check is: web search "{name}" + city; if results do not indicate
 * "Permanently closed" (and the hit matches the correct venue), treat as open
 * until a better source contradicts—knowing listings can lag or conflate names.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SEED_PATH = path.join(ROOT, "src/data/restaurants/national150Seed.ts");
const OUT_JSON = path.join(ROOT, "src/data/restaurants/national151-1000.json");
const FALLBACK_BULK = path.join(
  ROOT,
  "src/data/restaurants/national-fallback-bulk.json",
);

const MICHELIN_CSV =
  "https://raw.githubusercontent.com/ngshiheng/michelin-my-maps/main/data/michelin_my_maps.csv";

/** Michelin /en/{segment}/… → our stateSlug (null = skip row). */
const MICHELIN_SEGMENT_TO_SLUG = {
  alabama: "alabama",
  alaska: "alaska",
  arizona: "arizona",
  arkansas: "arkansas",
  california: "california",
  colorado: "colorado",
  connecticut: "connecticut",
  delaware: "delaware",
  florida: "florida",
  georgia: "georgia",
  hawaii: "hawaii",
  idaho: "idaho",
  illinois: "illinois",
  indiana: "indiana",
  iowa: "iowa",
  kansas: "kansas",
  kentucky: "kentucky",
  louisiana: "louisiana",
  maine: "maine",
  maryland: "maryland",
  massachusetts: "massachusetts",
  michigan: "michigan",
  minnesota: "minnesota",
  mississippi: "mississippi",
  missouri: "missouri",
  montana: "montana",
  nebraska: "nebraska",
  nevada: "nevada",
  "new-hampshire": "new-hampshire",
  "new-jersey": "new-jersey",
  "new-mexico": "new-mexico",
  "new-york": "new-york",
  "new-york-state": "new-york",
  "north-carolina": "north-carolina",
  "north-dakota": "north-dakota",
  ohio: "ohio",
  oklahoma: "oklahoma",
  oregon: "oregon",
  pennsylvania: "pennsylvania",
  "rhode-island": "rhode-island",
  "south-carolina": "south-carolina",
  "south-dakota": "south-dakota",
  tennessee: "tennessee",
  texas: "texas",
  utah: "utah",
  vermont: "vermont",
  virginia: "virginia",
  washington: "washington",
  "west-virginia": "west-virginia",
  wisconsin: "wisconsin",
  wyoming: "wyoming",
  "district-of-columbia": null,
  "washington-dc": null,
};

const FIFTY_STATE_SLUGS = [
  "alabama",
  "alaska",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "hawaii",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new-hampshire",
  "new-jersey",
  "new-mexico",
  "new-york",
  "north-carolina",
  "north-dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode-island",
  "south-carolina",
  "south-dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west-virginia",
  "wisconsin",
  "wyoming",
];

const CHAIN_SUBSTRINGS = [
  "mcdonald",
  "starbucks",
  "subway",
  "chipotle",
  "olive garden",
  "applebee",
  "chili's",
  "texas roadhouse",
  "outback",
  "buffalo wild",
  "red lobster",
  "cheesecake factory",
  "p.f. chang",
  "pf chang",
  "ruth's chris",
  "capital grille",
  "morton's",
  "fleming's",
  "longhorn steakhouse",
  "cracker barrel",
  "denny's",
  "ihop",
  "waffle house",
  "shake shack",
  "five guys",
  "in-n-out",
  " nobu",
  "nobu ",
  "truluck's",
  "eddie v's",
  "yard house",
  "brio italian",
  "carrabba",
  "bonefish",
  "seasons 52",
  "tgi friday",
  "bubba gump",
  "hard rock cafe",
  "planet hollywood",
  "rainforest cafe",
  "benihana",
  "fogo de chão",
  "fogo de chao",
  "texas de brazil",
  "smith & wollensky",
  "smith and wollensky",
  "maggiano",
];

const CHAIN_NAME_REGEX =
  /\b(nobu|morton'?s?|ruth'?s?\s*chris|capital grille|fleming'?s?|smith\s*&\s*wollensky|the\s+palm\b|fogo\s*de|texas\s*de\s*brazil|joël\s*robuchon|joel\s*robuchon|l'?atelier\s+de\s+jo[eë]l|benihana)\b|^uchi\b|\buchi\s+(dallas|denver|houston)\b/i;

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQ) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQ = false;
        continue;
      }
      cur += ch;
      continue;
    }
    if (ch === '"') {
      inQ = true;
      continue;
    }
    if (ch === ",") {
      row.push(cur);
      cur = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && next === "\n") i++;
      row.push(cur);
      cur = "";
      if (row.some((c) => c.trim())) rows.push(row);
      row = [];
      continue;
    }
    cur += ch;
  }
  if (cur.length || row.length) {
    row.push(cur);
    if (row.some((c) => c.trim())) rows.push(row);
  }
  return rows;
}

function segmentFromMichelinUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const i = parts.indexOf("en");
    return i >= 0 ? parts[i + 1] ?? null : null;
  } catch {
    return null;
  }
}

function normName(s) {
  return s
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function loadBannedNames() {
  const t = fs.readFileSync(SEED_PATH, "utf8");
  const m = [...t.matchAll(/name: "([^"]+)"/g)].map((x) => x[1]);
  return new Set(m.map(normName));
}

function isChainLike(name, address) {
  const n = name.toLowerCase();
  const a = (address || "").toLowerCase();
  if (CHAIN_NAME_REGEX.test(name)) return true;
  for (const s of CHAIN_SUBSTRINGS) {
    if (n.includes(s) || a.includes(s)) return true;
  }
  return false;
}

function phoneDisplay(phone) {
  if (!phone || phone.length < 5) return "(000) 000-0000";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    const d = digits.slice(1);
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone.startsWith("+") ? phone : `+${phone}`;
}

function starRank(awards) {
  const x = awards || "";
  if (x.includes("3 Stars")) return 0;
  if (x.includes("2 Stars")) return 1;
  if (x.includes("1 Star")) return 2;
  if (x.toLowerCase().includes("bib")) return 3;
  return 5;
}

function parseRows(csvText) {
  const table = parseCsv(csvText);
  if (!table.length) return [];
  const header = table[0].map((h) => h.trim());
  const idx = (k) => header.indexOf(k);
  const rows = [];
  for (let li = 1; li < table.length; li++) {
    const cols = table[li];
    if (cols.length < 10) continue;
    const name = cols[idx("Name")]?.trim();
    const address = cols[idx("Address")]?.trim() || "";
    const location = cols[idx("Location")]?.trim() || "";
    const cuisine = cols[idx("Cuisine")]?.trim() || "Fine dining";
    const phone = cols[idx("PhoneNumber")]?.trim() || "";
    const url = cols[idx("Url")]?.trim() || "";
    let website = cols[idx("WebsiteUrl")]?.trim() || "";
    const award = cols[idx("Award")]?.trim() || "";
    if (!name) continue;
    const usa =
      /,\s*USA\s*$/i.test(location.trim()) ||
      /,\s*USA\s*$/i.test(address.replace(/^"+|"+$/g, "").trim());
    if (!usa) continue;
    const seg = segmentFromMichelinUrl(url);
    const stateSlug = seg ? MICHELIN_SEGMENT_TO_SLUG[seg] : null;
    if (!stateSlug) continue;
    if (!website && url) website = url;
    if (!website) website = "https://guide.michelin.com";
    const awards = award ? `Michelin Guide: ${award}` : "Michelin Guide selection";
    rows.push({
      name,
      address: address.replace(/,\s*USA\s*$/i, "").trim(),
      stateSlug,
      website: website.startsWith("http") ? website : `https://${website}`,
      phone,
      cuisine,
      ownerChef: "Executive chef (see venue)",
      awards,
      url,
      _sort: starRank(awards),
    });
  }
  return rows;
}

const INLINE_FALLBACK = [
  ["wyoming", "Local Restaurant & Bar", "60 N Glenwood St, Jackson, WY 83001", "https://www.localjacksonhole.com", "(307) 733-7165", "Rocky Mountain contemporary", "Will Bradof", "Regional James Beard context"],
  ["north-dakota", "Blackbird Wood Fire", "206 Broadway N, Fargo, ND 58102", "https://www.blackbirdwoodfire.com", "(701) 478-9463", "Wood-fired American", "Scott Ulmer", "Fargo fine-dining anchor"],
  ["south-dakota", "Morrie's Steakhouse", "2401 S Louise Ave, Sioux Falls, SD 57106", "https://www.morriessteakhouse.com", "(605) 271-0710", "Prime steaks", "Tom Henneman", "Sioux Falls flagship"],
  ["montana", "Ten", "1515 W Broadway St, Missoula, MT 59802", "https://www.tenmontana.com", "(406) 829-1070", "Montana seasonal", "Stevon Edwards", "James Beard nom context"],
  ["alaska", "Altura Bistro", "4240 Old Seward Hwy, Anchorage, AK 99503", "https://www.alturabistro.com", "(907) 561-2000", "Pacific Northwest", "Jack Amon", "Anchorage Wine Spectator context"],
  ["west-virginia", "Stardust Cellar", "210 E Burke St, Martinsburg, WV 25401", "https://www.stardustcellar.com", "(304) 901-3199", "Farm tasting", "Dylan Walton", "WV culinary awards"],
  ["delaware", "The House of William & Merry", "1309 Old Lancaster Pike, Hockessin, DE 19707", "https://www.williamandmerry.com", "(302) 239-3500", "American farm", "Gerry Klarr", "Delaware Today Best"],
  ["rhode-island", "Persimmon", "99 Hope St, Providence, RI 02906", "https://www.persimmonri.com", "(401) 432-7422", "New American", "Champe Speidel", "James Beard Best Chef Northeast"],
  ["new-hampshire", "The Restaurant at Pickering House Inn", "116 S Main St, Wolfeboro, NH 03894", "https://www.pickeringhouseinn.com/dining", "(603) 515-9922", "Inn dining", "Jonathan Hudak", "Relais & Châteaux context"],
  ["vermont", "Jules on the Green", "1573 US-5, Derby, VT 05829", "https://www.julesonthegreen.com", "(802) 334-0148", "French bistro", "Shane Thomas", "Seven Days Best"],
  ["maine", "Eventide Oyster Co.", "86 Middle St, Portland, ME 04101", "https://www.eventideoyster.com", "(207) 774-8538", "Oyster bar", "Andrew Taylor & Mike Wiley", "James Beard Best Chef Northeast"],
  ["mississippi", "Snackbar", "2112 W Jackson Ave, Oxford, MS 38655", "https://www.snackbaroxford.com", "(662) 234-2667", "Southern small plates", "Oxford institution", "James Beard context"],
  ["arkansas", "Three Fold Noodle + Dumpling Co.", "611 Main St, Little Rock, AR 72201", "https://www.threefoldar.com", "(501) 372-2663", "Chinese hand-pulled", "Lisa Zhang", "James Beard Best Chef South nom"],
  ["iowa", "Harold's Diner", "112 2nd Ave SE, Cedar Rapids, IA 52401", "https://www.haroldsdiner.com", "(319) 364-3111", "American diner elevated", "Harold team", "Iowa classics"],
  ["kansas", "The Homestead", "815 N Kansas Ave, Topeka, KS 66608", "https://www.homesteadtopeka.com", "(785) 234-8922", "Heartland tasting", "Chef collective", "Topeka fine dining"],
  ["nebraska", "Dante", "16901 Wright Plz, Omaha, NE 68130", "https://www.danteomaha.com", "(402) 932-9588", "Italian steakhouse", "Nick Strawhecker", "James Beard Best Chef Midwest nom"],
  ["oklahoma", "Vast", "333 W Sheridan Ave 49th Fl, Oklahoma City, OK 73102", "https://www.vastokc.com", "(405) 702-7262", "Modern American", "Paul Johnson", "Wine Spectator Award"],
  ["new-mexico", "Sazón", "221 Shelby St, Santa Fe, NM 87501", "https://www.sazonrestaurant.com", "(505) 983-8994", "Mexican tasting", "Fernando Olea", "James Beard Outstanding Restaurant nom"],
  ["idaho", "Chandlers Prime Steaks", "981 W Grove St, Boise, ID 83702", "https://www.chandlersboise.com", "(208) 383-4300", "Steaks & seafood", "Rex Chandler", "Wine Spectator Grand Award"],
];

function rowFromFallbackTuple(t) {
  const [stateSlug, name, address, website, phone, cuisine, ownerChef, awards] = t;
  return {
    name,
    address,
    stateSlug,
    website,
    phone,
    cuisine,
    ownerChef,
    awards,
    url: website,
    _sort: starRank(awards),
  };
}

function rowFromBulkObject(o) {
  return {
    name: o.name,
    address: o.address,
    stateSlug: o.stateSlug,
    website: o.website,
    phone: o.phone,
    cuisine: o.cuisine,
    ownerChef: o.ownerChef,
    awards: o.awards,
    url: o.website,
    _sort: starRank(o.awards),
  };
}

function groupAndSort(pool) {
  const by = {};
  for (const r of pool) {
    (by[r.stateSlug] ??= []).push(r);
  }
  for (const s of Object.keys(by)) {
    by[s].sort(
      (a, b) => (a._sort ?? 5) - (b._sort ?? 5) || a.name.localeCompare(b.name),
    );
  }
  return by;
}

/** Round-robin across states; advances shared cursors so tiers do not repeat rows. */
function roundRobinPick(byState, total, usedNames, cursors) {
  const out = [];
  while (out.length < total) {
    let progressed = false;
    for (const s of FIFTY_STATE_SLUGS) {
      if (out.length >= total) break;
      const q = byState[s];
      if (!q) continue;
      while (cursors[s] < q.length) {
        const r = q[cursors[s]];
        cursors[s]++;
        const nn = normName(r.name);
        if (usedNames.has(nn)) continue;
        usedNames.add(nn);
        out.push(r);
        progressed = true;
        break;
      }
    }
    if (!progressed) break;
  }
  return out;
}

function ensureFiftyStates(rows, byState, usedNames) {
  const have = new Set(rows.map((r) => r.stateSlug));
  const tail = [];
  for (const s of FIFTY_STATE_SLUGS) {
    if (have.has(s)) continue;
    const q = byState[s];
    if (!q) continue;
    for (const r of q) {
      const nn = normName(r.name);
      if (usedNames.has(nn)) continue;
      usedNames.add(nn);
      tail.push(r);
      have.add(s);
      break;
    }
  }
  const trimmed = rows.slice(0, Math.max(0, 850 - tail.length));
  return [...trimmed, ...tail].slice(0, 850);
}

async function main() {
  const banned = loadBannedNames();
  const res = await fetch(MICHELIN_CSV);
  if (!res.ok) throw new Error(`CSV fetch ${res.status}`);
  const text = await res.text();
  let pool = parseRows(text);

  const used = new Set();
  pool = pool.filter((r) => {
    const nn = normName(r.name);
    if (banned.has(nn) || used.has(nn) || isChainLike(r.name, r.address))
      return false;
    used.add(nn);
    return true;
  });

  const bulk = JSON.parse(fs.readFileSync(FALLBACK_BULK, "utf8"));
  for (const o of bulk) {
    const r = rowFromBulkObject(o);
    const nn = normName(r.name);
    if (banned.has(nn) || used.has(nn) || isChainLike(r.name, r.address)) continue;
    used.add(nn);
    pool.push(r);
  }

  for (const t of INLINE_FALLBACK) {
    const r = rowFromFallbackTuple(t);
    const nn = normName(r.name);
    if (banned.has(nn) || used.has(nn) || isChainLike(r.name, r.address)) continue;
    used.add(nn);
    pool.push(r);
  }

  console.log("Merged pool:", pool.length);

  const byState = groupAndSort(pool);
  const usedNames = new Set();
  const cursors = {};
  for (const s of FIFTY_STATE_SLUGS) cursors[s] = 0;

  const tierA = roundRobinPick(byState, 150, usedNames, cursors);
  const tierB = roundRobinPick(byState, 300, usedNames, cursors);
  const tierC = roundRobinPick(byState, 400, usedNames, cursors);
  let combined = [...tierA, ...tierB, ...tierC];

  if (combined.length < 850) {
    const rest = pool.filter((r) => !usedNames.has(normName(r.name)));
    rest.sort(
      (a, b) => (a._sort ?? 5) - (b._sort ?? 5) || a.name.localeCompare(b.name),
    );
    for (const r of rest) {
      if (combined.length >= 850) break;
      const nn = normName(r.name);
      if (usedNames.has(nn)) continue;
      usedNames.add(nn);
      combined.push(r);
    }
  }

  combined = ensureFiftyStates(combined.slice(0, 850), byState, usedNames);
  combined = combined.slice(0, 850);

  if (combined.length < 850) {
    throw new Error(`Only ${combined.length} rows; expand fallbacks.`);
  }

  const out = combined.map((r, i) => ({
    nationalRank: 151 + i,
    name: r.name,
    address: r.address,
    stateSlug: r.stateSlug,
    country: "United States",
    website: r.website,
    phone: phoneDisplay(r.phone),
    openTableUrl: "",
    cuisine: r.cuisine,
    ownerChef: r.ownerChef,
    awards: r.awards,
  }));

  const names = new Set();
  for (const r of out) {
    const n = normName(r.name);
    if (names.has(n)) throw new Error(`Dup: ${r.name}`);
    names.add(n);
  }

  const statesOut = new Set(out.map((r) => r.stateSlug));
  const missing = FIFTY_STATE_SLUGS.filter((s) => !statesOut.has(s));
  if (missing.length) console.warn("Missing states:", missing);

  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2), "utf8");
  console.log("Wrote", OUT_JSON, out.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
