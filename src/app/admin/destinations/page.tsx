import Link from "next/link";
import { US_STATES_ALPHABETICAL } from "@/data/states/usStates";
import { requireAdminPage } from "@/lib/requireAdmin";

export default async function AdminDestinationsPage() {
  await requireAdminPage();
  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-xl font-semibold">Destinations (CMS)</h1>
        <p className="mt-2 max-w-prose text-sm text-white/70">
          Edit live copy in the database (overrides bundled defaults). Schema reference:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">state-destination.schema.json</code>. Bundled
          files in <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">src/data/states/</code> apply when no DB
          row exists or after “Revert to bundled.”
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/15">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/15 bg-black/40 text-[11px] uppercase tracking-[0.18em] text-white/55">
            <tr>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Public page</th>
              <th className="px-4 py-3">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {US_STATES_ALPHABETICAL.map((s) => (
              <tr key={s.slug} className="hover:bg-white/[0.03]">
                <td className="px-4 py-2.5">{s.name}</td>
                <td className="px-4 py-2.5">
                  <Link href={`/visit/${s.slug}`} className="text-[#e8d48b] underline underline-offset-2">
                    /visit/{s.slug}
                  </Link>
                </td>
                <td className="px-4 py-2.5">
                  <Link
                    href={`/admin/destinations/${s.slug}`}
                    className="text-white underline decoration-[#c9a227]/55 underline-offset-2 hover:text-[#e8d48b]"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
