import fs from "fs";

const CTAS = {
  "visit-dodge-city": { ctaUrl: "https://www.visitdodgecity.org/", ctaLabel: "Visit Dodge City" },
  "visit-edenton": { ctaUrl: "https://visitedenton.com/", ctaLabel: "Visit Edenton" },
  "visit-excelsior-springs": { ctaUrl: "https://visitexcelsior.com/", ctaLabel: "Visit Excelsior Springs" },
  "visit-french-lick": { ctaUrl: "https://timelessfrenchlick.com/", ctaLabel: "Visit French Lick" },
  "visit-gun-lake-casino": { ctaUrl: "https://gunlakecasino.com/", ctaLabel: "Visit Gun Lake Casino" },
  "visit-henderson": { ctaUrl: "https://www.visithenderson.com/", ctaLabel: "Visit Henderson" },
  "visit-lake-murray": { ctaUrl: "https://www.lakemurraycountry.com/", ctaLabel: "Visit Lake Murray Country" },
  "visit-ocean-county": { ctaUrl: "https://oceancountytourism.com/", ctaLabel: "Visit Ocean County" },
  "visit-pearland": { ctaUrl: "https://visitpearland.com/", ctaLabel: "Visit Pearland" },
  "visit-randolph-county": { ctaUrl: "https://elkinsrandolphwv.com/", ctaLabel: "Visit Randolph County" },
  "visit-rehoboth-beach": { ctaUrl: "https://www.beach-fun.com/", ctaLabel: "Visit Rehoboth Beach" },
  "visit-south-county": { ctaUrl: "https://www.visitsouthcounty.com/", ctaLabel: "Visit South County" },
  "visit-springfield": { ctaUrl: "https://www.visitspringfieldillinois.com/", ctaLabel: "Visit Springfield" },
  "visit-tennessee": { ctaUrl: "https://www.tnvacation.com/", ctaLabel: "Explore Tennessee" },
  "visit-tifton": { ctaUrl: "https://thinktifton.com/", ctaLabel: "Visit Tifton" },
  "visit-uvalde": { ctaUrl: "https://visituvaldecounty.com/", ctaLabel: "Visit Uvalde County" },
  "visit-pella": { ctaUrl: "https://www.visitpella.com/", ctaLabel: "Visit Pella" },
  "visit-st-pete": { ctaUrl: "https://www.visitstpeteclearwater.com/", ctaLabel: "Visit St. Pete-Clearwater" },
};

const path = "src/data/destinations/summer2026Guides.ts";
let src = fs.readFileSync(path, "utf8");

for (const [slug, { ctaUrl, ctaLabel }] of Object.entries(CTAS)) {
  const marker = `visitSlug: "${slug}"`;
  const start = src.indexOf(marker);
  if (start < 0) {
    console.error("missing", slug);
    continue;
  }
  const end = src.indexOf("\n  },", start);
  if (end < 0) {
    console.error("end missing", slug);
    continue;
  }
  let block = src.slice(start, end);
  block = block.replace(/\n\s*ctaUrl: [^,\n]+,\n\s*ctaLabel: [^,\n]+,/, "");
  block += `\n    ctaUrl: ${JSON.stringify(ctaUrl)},\n    ctaLabel: ${JSON.stringify(ctaLabel)},`;
  src = src.slice(0, start) + block + src.slice(end);
  console.log(slug, "->", ctaUrl);
}

fs.writeFileSync(path, src);
console.log("done");
