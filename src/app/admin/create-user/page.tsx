import Link from "next/link";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { Panel } from "@/components/ui/Panel";
import { requireAdminPage } from "@/lib/requireAdmin";

export default async function AdminCreateUserPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-10">
      <Panel
        title="Create user"
        subtitle="New account — email and phone stored as verified; no signup link required."
        className="w-full min-w-0"
      >
        <CreateUserForm />
      </Panel>
      <p className="mt-8 text-center text-xs text-white/45">
        <Link href="/admin" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin home
        </Link>
      </p>
    </div>
  );
}
