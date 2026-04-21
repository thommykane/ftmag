import Link from "next/link";
import { ChefEditForm } from "@/components/admin/ChefEditForm";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdminPage } from "@/lib/requireAdmin";

export default async function AdminNewChefPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Add chef</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-6 text-sm text-white/60">
        <Link href="/admin/chefs" className="text-[#c9a227] underline hover:text-[#e8d48b]">
          ← Back to chefs
        </Link>
      </p>
      <ChefEditForm chef={null} />
    </div>
  );
}
