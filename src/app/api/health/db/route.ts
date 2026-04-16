import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Quick check: is DATABASE_URL set and can Prisma connect? Open GET /api/health/db in the browser. */
export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL?.trim());
  if (!hasUrl) {
    return NextResponse.json(
      {
        ok: false,
        step: "env",
        message: "DATABASE_URL is not set. Add it to .env.local (local) or Vercel → Settings → Environment Variables.",
      },
      { status: 503 },
    );
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, message: "Connected." });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      {
        ok: false,
        step: "connect",
        message: msg,
        hint:
          "Check the URL, password, and SSL (hosted Postgres often needs ?sslmode=require at the end). After the DB is reachable, run: npx prisma db push && npm run db:seed",
      },
      { status: 503 },
    );
  }
}
