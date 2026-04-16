import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Panel } from "@/components/ui/Panel";
import { getSession } from "@/lib/session";
import { userHasAdminRole } from "@/lib/requireAdmin";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.user) {
    const ok = await userHasAdminRole(session.user.id, session.user.email);
    if (ok) {
      if (session.user.mustChangePassword) redirect("/admin/change-password");
      redirect("/admin");
    }
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 md:py-10">
      <Panel title="Admin sign in" subtitle="Food & Travel Magazine">
        <AdminLoginForm />
      </Panel>
      <p className="mt-8 text-center text-xs text-white/45">
        <Link href="/" className="text-white/70 underline hover:text-[#c9a227]">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
