import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getDefaultStateDestination, resolveStateDestination } from "@/data/states/getStateDestination";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";
import { stateDestinationPayloadZ } from "@/lib/stateDestinationZod";
import { prisma } from "@/lib/prisma";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

function isValidSlug(slug: string) {
  return US_STATES_ALPHABETICAL.some((s) => s.slug === slug);
}

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = params.slug;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown state" }, { status: 404 });
  }

  let storedInDatabase = false;
  try {
    const row = await prisma.stateDestinationContent.findUnique({ where: { slug } });
    storedInDatabase = !!row;
  } catch {
    /* ignore */
  }

  const destination = await resolveStateDestination(slug);
  if (!destination) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ destination, storedInDatabase });
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = params.slug;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown state" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = stateDestinationPayloadZ.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (parsed.data.slug !== slug) {
    return NextResponse.json({ error: "Slug in body must match URL" }, { status: 400 });
  }

  const destination = parsed.data;

  await prisma.stateDestinationContent.upsert({
    where: { slug },
    create: { slug, payload: destination as object },
    update: { payload: destination as object },
  });

  revalidatePath(`/visit/${slug}`);
  revalidatePath("/top-destinations");

  return NextResponse.json({ ok: true, destination });
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slug = params.slug;
  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Unknown state" }, { status: 404 });
  }

  try {
    await prisma.stateDestinationContent.delete({ where: { slug } });
  } catch {
    /* ignore missing row */
  }

  revalidatePath(`/visit/${slug}`);
  revalidatePath("/top-destinations");

  const destination = getDefaultStateDestination(slug);
  return NextResponse.json({ ok: true, destination });
}
