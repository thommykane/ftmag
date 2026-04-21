import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CUISINE_FILTERS } from "@/data/chefs";
import { normalizeChefSlug, isValidChefSlug } from "@/lib/chefs/chefSlug";
import { getNextSortOrder } from "@/lib/chefs/queries";
import { resolveChefPortrait } from "@/lib/chefs/resolveChefImage";
import { sessionUserIsAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowed = new Set(CUISINE_FILTERS);

function parseCuisines(formData: FormData): string[] {
  const raw = formData.getAll("cuisines").map((x) => String(x).trim());
  return Array.from(new Set(raw.filter((c) => allowed.has(c))));
}

export async function GET() {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const chefs = await prisma.chef.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      imageUrl: true,
      cuisines: true,
      sortOrder: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ chefs });
}

export async function POST(req: NextRequest) {
  if (!(await sessionUserIsAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const dup = await prisma.chef.findUnique({ where: { slug } });
  if (dup) {
    return NextResponse.json({ error: "That URL path is already used by another chef." }, { status: 400 });
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
      requireImage: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Image upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const sortOrder = await getNextSortOrder();

  const chef = await prisma.chef.create({
    data: {
      slug,
      name,
      description,
      imageUrl,
      cuisines,
      sortOrder,
    },
  });

  return NextResponse.json({ chef });
}
