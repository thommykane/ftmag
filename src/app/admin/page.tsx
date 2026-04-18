import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdminPage } from "@/lib/requireAdmin";

export default async function AdminHomePage() {
  await requireAdminPage();

  return (
    <div className="mx-auto max-w-lg px-4 py-24">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-lg uppercase tracking-[0.28em] text-[#c9a227]">Admin</h1>
        <AdminLogoutButton />
      </div>
      <p className="mb-8 text-sm text-white/60">Site tools and exports.</p>
      <ul className="space-y-3 text-sm">
        <li>
          <Link
            href="/admin/create-user"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Create User
          </Link>
          <span className="ml-2 text-white/45">— new account, no verification</span>
        </li>
        <li>
          <Link
            href="/admin/email-list"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Email List
          </Link>
          <span className="ml-2 text-white/45">— subscribers and CSV</span>
        </li>
        <li>
          <Link
            href="/admin/paid-subscribers"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Paid subscriber
          </Link>
          <span className="ml-2 text-white/45">— paid members and CSV</span>
        </li>
        <li>
          <Link
            href="/admin/destinations"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Destinations
          </Link>
          <span className="ml-2 text-white/45">— state pages &amp; CMS notes</span>
        </li>
        <li>
          <Link
            href="/admin/restaurants"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Restaurants
          </Link>
          <span className="ml-2 text-white/45">— national list &amp; state Eat picks</span>
        </li>
        <li>
          <Link
            href="/admin/magazines"
            className="text-white underline decoration-[#c9a227]/60 decoration-2 underline-offset-[3px] transition hover:text-[#e8d48b]"
          >
            Magazines
          </Link>
          <span className="ml-2 text-white/45">— new issues, PDF &amp; cover upload</span>
        </li>
      </ul>
      <p className="mt-12 text-xs text-white/45">
        <Link href="/" className="text-white/70 underline hover:text-[#c9a227]">
          ← Back to Food &amp; Travel Magazine
        </Link>
      </p>
    </div>
  );
}
