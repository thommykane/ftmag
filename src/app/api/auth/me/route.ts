import { NextResponse } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session.user) {
    return NextResponse.json({ user: null });
  }

  let dbIsAdmin = false;
  try {
    const row = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });
    dbIsAdmin = row?.isAdmin === true;
  } catch (e) {
    console.error("[auth/me]", e);
  }

  const email = session.user.email;
  const isAdmin = dbIsAdmin || isAdminEmail(email);

  return NextResponse.json({
    user: {
      id: session.user.id,
      email,
      name: session.user.name ?? "Admin",
      mustChangePassword: session.user.mustChangePassword,
      isAdmin,
    },
  });
}
