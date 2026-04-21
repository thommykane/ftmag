import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { MAX_COVER_BYTES, MAX_PDF_BYTES } from "@/lib/magazines/resolveUploads";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!process.env["BLOB_READ_WRITE_TOKEN"]) {
    return NextResponse.json(
      { error: "BLOB_READ_WRITE_TOKEN is not set — add it in Vercel to enable large file uploads." },
      { status: 503 },
    );
  }

  let body: HandleUploadBody;
  try {
    body = (await req.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.type === "blob.generate-client-token" && !(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const jsonResponse = await handleUpload({
      request: req,
      body,
      token: process.env["BLOB_READ_WRITE_TOKEN"],
      onBeforeGenerateToken: async (pathname, _clientPayload, _multipart) => {
        const maximumSizeInBytes = pathname.includes("/covers/") ? MAX_COVER_BYTES : MAX_PDF_BYTES;
        return {
          addRandomSuffix: true,
          maximumSizeInBytes,
          allowedContentTypes: [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/gif",
          ],
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload token failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
