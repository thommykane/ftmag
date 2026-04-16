import Link from "next/link";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { Panel } from "@/components/ui/Panel";
import { getSession } from "@/lib/session";
import { userHasAdminRole } from "@/lib/requireAdmin";

export default async function AdminChangePasswordPage() {
  const session = await getSession();
  if (!session.user) redirect("/admin/login");
  if (!(await userHasAdminRole(session.user.id, session.user.email))) redirect("/");
  if (!session.user.mustChangePassword) redirect("/admin");

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-10">
      <Panel title="Security" subtitle="Update your admin password">
        <ChangePasswordForm />
      </Panel>
      <p className="mt-8 text-center text-xs text-white/45">
        <Link href="/admin/login" className="text-white/70 underline hover:text-[#c9a227]">
          ← Admin sign in
        </Link>
      </p>
    </div>
  );
}
