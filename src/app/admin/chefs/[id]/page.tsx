import Link from "next/link";
import { notFound } from "next/navigation";
import { ChefEditForm } from "@/components/admin/ChefEditForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function AdminEditChefPage({ params }: Props) {
  await requireAdminPage();

  const row = await prisma.chef.findUnique({ where: { id: params.id } });
  if (!row) notFound();

  const cuisines = Array.isArray(row.cuisines)
    ? (row.cuisines as unknown[]).filter((x): x is string => typeof x === "string")
    : [];

  const initial = {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: row.imageUrl,
    cuisines,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Edit chef</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-6 text-sm text-white/60">
        <Link href="/admin/chefs" className="text-[#c9a227] underline hover:text-[#e8d48b]">
          ← Back to chefs
        </Link>
        <span className="mx-2 text-white/35">·</span>
        <span className="text-white/50">{row.name}</span>
      </p>
      <ChefEditForm chef={initial} />
    </div>
  );
}
