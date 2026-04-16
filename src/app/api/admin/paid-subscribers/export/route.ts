import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

function csvCell(s: string): string {
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function splitName(name: string): { firstName: string; lastName: string } {
  const t = name.trim();
  if (!t) return { firstName: "", lastName: "" };
  const i = t.indexOf(" ");
  if (i <= 0) return { firstName: t, lastName: "" };
  return { firstName: t.slice(0, i), lastName: t.slice(i + 1).trim() };
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
    select: { name: true, email: true, phone: true },
  });

  const header = ["First Name", "Last Name", "Email", "Phone Number"].map(csvCell).join(",");
  const lines = users.map((u) => {
    const { firstName, lastName } = splitName(u.name);
    return [firstName, lastName, u.email, u.phone ?? ""].map((x) => csvCell(x)).join(",");
  });
  const body = [header, ...lines].join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="paid-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
