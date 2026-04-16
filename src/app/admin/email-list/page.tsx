import Link from "next/link";
import { EmailListSubscribersGrid } from "@/components/admin/EmailListSubscribersGrid";
import { Panel } from "@/components/ui/Panel";
import { requireAdminPage } from "@/lib/requireAdmin";

export default async function AdminEmailListPage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-[min(1200px,100%)] px-4 py-16 md:py-10">
      <Panel title="Email list" subtitle="Subscriber registry — sortable columns" className="w-full min-w-0">
        <EmailListSubscribersGrid />
      </Panel>
      <p className="mt-6 text-center text-xs text-white/45">
        <Link href="/" className="text-white/70 underline hover:text-[#c9a227]">
          ← Back to site
        </Link>
      </p>
    </div>
  );
}
