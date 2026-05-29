import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdminPage } from "@/lib/requireAdmin";
import { AdBannersAdminClient } from "./AdBannersAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminAdBannersPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Ad Banners</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-8 text-sm text-white/60">
        Manage the site-wide banner rotator above main content. Each slide fades to the next and links to its
        destination URL.
      </p>
      <AdBannersAdminClient />
      <p className="mt-12 text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
