import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

function csvCell(s: string): string {
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await prisma.emailListSubscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: { firstName: true, lastName: true, email: true, phone: true },
  });

  const header = ["First Name", "Last Name", "Email", "Phone Number"].map(csvCell).join(",");
  const lines = rows.map((r) =>
    [r.firstName, r.lastName, r.email, r.phone ?? ""].map((x) => csvCell(x)).join(","),
  );
  const body = [header, ...lines].join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="email-list-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
