import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

function splitName(name: string): { firstName: string; lastName: string } {
  const t = name.trim();
  if (!t) return { firstName: "—", lastName: "—" };
  const i = t.indexOf(" ");
  if (i <= 0) return { firstName: t, lastName: "—" };
  return { firstName: t.slice(0, i), lastName: t.slice(i + 1).trim() || "—" };
}

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: {
      stripeSubscriptionStatus: { in: ["active", "trialing"] },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });

  const rows = users.map((u) => {
    const { firstName, lastName } = splitName(u.name);
    return {
      id: u.id,
      firstName,
      lastName,
      email: u.email,
      phone: u.phone,
    };
  });

  return NextResponse.json({ rows });
}
