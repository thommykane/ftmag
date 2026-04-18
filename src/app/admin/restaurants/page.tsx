import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdminPage } from "@/lib/requireAdmin";
import { RestaurantsAdminClient } from "./RestaurantsAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminRestaurantsPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="mb-8 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Restaurants</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-8 text-sm text-white/60">
        Reorder the national list, edit venues, and assign up to eight restaurants per state Eat section.
      </p>
      <RestaurantsAdminClient />
      <p className="mt-12 text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
