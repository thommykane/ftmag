import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";
import { subscriptionGrantsPaidAccess } from "@/lib/subscription";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = params.id?.trim();
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      isAdmin: true,
      stripeSubscriptionStatus: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (user.isAdmin) {
    return NextResponse.json({ error: "Cannot delete an admin account." }, { status: 403 });
  }
  if (!subscriptionGrantsPaidAccess(user.stripeSubscriptionStatus)) {
    return NextResponse.json(
      { error: "This account is not listed as an active paid subscriber." },
      { status: 400 },
    );
  }

  await prisma.user.delete({ where: { id: user.id } });

  return NextResponse.json({ ok: true });
}
