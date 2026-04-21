import { NextResponse } from "next/server";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Read at request time (not inlined at build) so `useClientBlobUpload` matches
 * production env after deploy. Used before magazine create/update with file fields.
 */
export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = process.env["BLOB_READ_WRITE_TOKEN"];
  const useClientBlobUpload = Boolean(token);
  const onVercel = process.env["VERCEL"] === "1";
  /** Sending multi‑MB files through our API routes hits Vercel’s body limit (413) without direct Blob uploads. */
  const blockFileMultipart = onVercel && !token;

  return NextResponse.json({ useClientBlobUpload, blockFileMultipart });
}
