import Link from "next/link";
import { MagazinesAdminForm } from "@/components/admin/MagazinesAdminForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export default async function AdminMagazinesPage() {
  await requireAdminPage();

  const magazines = await prisma.magazine.findMany({
    orderBy: { releaseDate: "desc" },
    select: {
      id: true,
      slug: true,
      displayTitle: true,
      releaseDate: true,
      releaseLabel: true,
      coverSrc: true,
      pdfSrc: true,
      purchaseUrl: true,
    },
  });

  const rows = magazines.map((m) => ({
    ...m,
    releaseDate: m.releaseDate.toISOString(),
  }));

  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Magazines</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-8 text-sm text-white/60">
        Create a new issue; it appears first on the public magazines page when its release date is the newest.
      </p>
      <MagazinesAdminForm initialMagazines={rows} />
      <p className="mt-12 text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
