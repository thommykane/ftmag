/** Magazine-style accent for category label (WP slug or short name). */
export function categoryAccentClass(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "spring" || s.includes("spring")) return "text-emerald-700";
  if (s === "summer" || s.includes("summer")) return "text-amber-600";
  if (s === "fall" || s === "autumn" || s.includes("fall")) return "text-orange-700";
  if (s === "winter" || s.includes("winter")) return "text-sky-700";
  if (s === "foodie" || s.includes("foodie") || s.includes("best-restaurants")) return "text-[#6E0F1F]";
  if (s === "editorials" || s === "editorial" || s.includes("editorial")) return "text-zinc-700";
  if (s === "interviews" || s === "interview" || s.includes("interview") || s === "top-chefs" || s.includes("chefs"))
    return "text-rose-700";
  return "text-[#6E0F1F]";
}
