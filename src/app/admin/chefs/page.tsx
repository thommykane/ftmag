import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminChefsPage() {
  await requireAdminPage();

  const chefs = await prisma.chef.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true, updatedAt: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Chefs</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-6 text-sm text-white/60">
        Manage Top Chefs profiles, images, descriptions, and cuisine tags. Public URLs are{" "}
        <code className="text-white/75">/top-chefs/[your-slug]</code>.
      </p>
      <p className="mb-8">
        <Link
          href="/admin/chefs/new"
          className="rounded border-2 border-[#c9a227] bg-[#6E0F1F] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#5a0c19]"
        >
          Add chef
        </Link>
      </p>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
        All chefs ({chefs.length})
      </h2>
      <ul className="space-y-2 text-sm text-white/85">
        {chefs.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 py-3"
          >
            <span className="font-medium text-white">{c.name}</span>
            <span className="font-mono text-xs text-white/45">{c.slug}</span>
            <Link
              href={`/admin/chefs/${c.id}`}
              className="text-xs font-semibold uppercase tracking-wide text-[#e8d48b] underline decoration-[#c9a227]/50 hover:text-white"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
