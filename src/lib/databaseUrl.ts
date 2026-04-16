/**
 * Cloud Postgres (Railway, Neon, Vercel Postgres, etc.) expects TLS.
 * Local Docker (127.0.0.1) usually does not.
 *
 * - `sslmode=require` when missing.
 * - On **Windows**, `gssencmode=disable` avoids libpq GSSAPI issues with some hosts (Railway proxy).
 */
export function normalizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (trimmed.includes("127.0.0.1") || trimmed.includes("localhost")) return trimmed;

  let out = trimmed;
  if (!/sslmode=/i.test(out)) {
    out += out.includes("?") ? "&sslmode=require" : "?sslmode=require";
  }
  if (process.platform === "win32" && !/gssencmode=/i.test(out)) {
    out += "&gssencmode=disable";
  }
  return out;
}
