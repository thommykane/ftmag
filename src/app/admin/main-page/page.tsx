import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdminPage } from "@/lib/requireAdmin";
import { MainPageAdminClient } from "./MainPageAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminMainPagePage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Main Page</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-8 text-sm text-white/60">
        Control what appears on the public homepage — enable slots, set titles, and choose automatic or manual picks
        for restaurants, chefs, destinations, and CMS articles.
      </p>
      <MainPageAdminClient />
      <p className="mt-12 text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
