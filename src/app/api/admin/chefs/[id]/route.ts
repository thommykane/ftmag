import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CUISINE_FILTERS } from "@/data/chefs";
import { normalizeChefSlug, isValidChefSlug } from "@/lib/chefs/chefSlug";
import { resolveChefPortrait } from "@/lib/chefs/resolveChefImage";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowed = new Set(CUISINE_FILTERS);

function parseCuisines(formData: FormData): string[] {
  const raw = formData.getAll("cuisines").map((x) => String(x).trim());
  return Array.from(new Set(raw.filter((c) => allowed.has(c))));
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chef = await prisma.chef.findUnique({ where: { id: params.id } });
  if (!chef) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ chef });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.chef.findUnique({ where: { id: params.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const formData = await req.formData();
  const name = String(formData.get("name") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const cuisines = parseCuisines(formData);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json({ error: "Description is required" }, { status: 400 });
  }

  const slug = normalizeChefSlug(slugRaw);
  if (!isValidChefSlug(slug)) {
    return NextResponse.json(
      { error: "URL path must be lowercase letters, numbers, and hyphens (e.g. gordon-ramsay)." },
      { status: 400 },
    );
  }

  if (slug !== existing.slug) {
    const dup = await prisma.chef.findUnique({ where: { slug } });
    if (dup && dup.id !== existing.id) {
      return NextResponse.json({ error: "That URL path is already used by another chef." }, { status: 400 });
    }
  }

  const file = formData.get("image");
  const hasFile = file instanceof File && file.size > 0;

  let imageUrl: string;
  try {
    imageUrl = await resolveChefPortrait({
      storageKey: slug,
      imageUrlRaw,
      hasFile,
      file: hasFile && file instanceof File ? file : null,
      existingImageUrl: existing.imageUrl,
      requireImage: false,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Image upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const chef = await prisma.chef.update({
    where: { id: params.id },
    data: {
      slug,
      name,
      description,
      imageUrl,
      cuisines,
    },
  });

  return NextResponse.json({ chef });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.chef.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
