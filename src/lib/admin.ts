/** Primary site owner — always treated as admin. Matches seeded admin in `prisma/seed.ts`. */
export const SITE_OWNER_EMAIL = "tkane@foodandtravel.net";

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (normalized === SITE_OWNER_EMAIL) return true;
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  const list = raw
    .split(",")
    .map((s) => s.replace(/^["']|["']$/g, "").trim().toLowerCase())
    .filter(Boolean);
  return list.includes(normalized);
}
