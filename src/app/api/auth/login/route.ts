import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rl = rateLimit("login", getClientIp(req), 20, 15 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${rl.retryAfterSeconds}s.` },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return NextResponse.json(
      {
        error: "Database is not configured.",
        hint: "Add DATABASE_URL to .env.local (local) or Vercel → Environment Variables. Use your Postgres connection string (Neon, Railway, Supabase, etc.). Then run: npx prisma db push && npm run db:seed",
      },
      { status: 503 },
    );
  }

  let user;
  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    console.error("[auth/login/db]", e);
    const prismaCode =
      e instanceof Prisma.PrismaClientKnownRequestError
        ? e.code
        : e instanceof Prisma.PrismaClientInitializationError
          ? (e.errorCode ?? "INIT")
          : "UNKNOWN";
    const extra =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2021"
        ? " Tables missing — run: npx prisma db push"
        : "";
    return NextResponse.json(
      {
        error: "Database unavailable.",
        prismaCode,
        hint: `Check DATABASE_URL (host, password, ?sslmode=require for cloud Postgres).${extra} Then: npm run db:seed`,
      },
      { status: 503 },
    );
  }

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (!user.isAdmin) {
    return NextResponse.json({ error: "Not an administrator account." }, { status: 403 });
  }

  try {
    const session = await getSession();
    session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      mustChangePassword: user.mustChangePassword,
    };
    await session.save();
    return NextResponse.json({
      ok: true,
      mustChangePassword: user.mustChangePassword,
    });
  } catch (e) {
    console.error("[auth/login/session]", e);
    const pwd = process.env.SESSION_SECRET ?? "";
    const secretOk = pwd.length >= 32;
    return NextResponse.json(
      {
        error: "Session could not be saved.",
        hint: secretOk
          ? "Cookie blocked or session error — try another browser."
          : "SESSION_SECRET on Vercel must be at least 32 characters.",
      },
      { status: 503 },
    );
  }
}
