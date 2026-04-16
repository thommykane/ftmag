import Link from "next/link";
import { notFound } from "next/navigation";
import { StateDestinationEditor } from "@/components/admin/StateDestinationEditor";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";
import { requireAdminPage } from "@/lib/requireAdmin";

type Props = { params: { slug: string } };

export default async function AdminEditDestinationPage({ params }: Props) {
  await requireAdminPage();

  const slug = params.slug;
  if (!US_STATES_ALPHABETICAL.some((s) => s.slug === slug)) {
    notFound();
  }

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 pt-8">
        <Link href="/admin/destinations" className="text-xs uppercase tracking-[0.2em] text-[#c9a227]/90 underline">
          ← Destinations
        </Link>
      </div>
      <StateDestinationEditor slug={slug} />
    </div>
  );
}
