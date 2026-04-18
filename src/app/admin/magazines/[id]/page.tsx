import Link from "next/link";
import { notFound } from "next/navigation";
import { MagazineEditForm } from "@/components/admin/MagazineEditForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditMagazinePage({ params }: Props) {
  await requireAdminPage();

  const m = await prisma.magazine.findUnique({ where: { id: params.id } });
  if (!m) notFound();

  const initial = {
    id: m.id,
    slug: m.slug,
    displayTitle: m.displayTitle,
    releaseDate: m.releaseDate.toISOString().slice(0, 10),
    releaseLabel: m.releaseLabel,
    blurb: m.blurb,
    coverSrc: m.coverSrc,
    pdfSrc: m.pdfSrc,
    purchaseUrl: m.purchaseUrl,
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Edit magazine</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-6 text-sm text-white/60">
        <Link href="/admin/magazines" className="text-[#c9a227] underline hover:text-[#e8d48b]">
          ← Back to magazines
        </Link>
        <span className="mx-2 text-white/35">·</span>
        <span className="text-white/50">{m.displayTitle}</span>
      </p>
      <MagazineEditForm magazine={initial} />
    </div>
  );
}
