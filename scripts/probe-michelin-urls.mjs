const u =
  "https://raw.githubusercontent.com/ngshiheng/michelin-my-maps/main/data/michelin_my_maps.csv";
const t = await (await fetch(u)).text();
const counts = (pat) => (t.match(new RegExp(pat, "g")) || []).length;
console.log({
  "new-jersey/": counts("new-jersey/"),
  "washington-state/": counts("washington-state/"),
  "en/oregon/": counts("guide\\.michelin\\.com/en/oregon/"),
  "en/washington/": counts("guide\\.michelin\\.com/en/washington/"),
});
