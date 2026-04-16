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
          Public content is sourced from TypeScript modules under{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">src/data/states/</code>. JSON schema:{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">state-destination.schema.json</code>. Replace
          placeholders by adding a file per state and registering it in{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">getStateDestination.ts</code>.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/15">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/15 bg-black/40 text-[11px] uppercase tracking-[0.18em] text-white/55">
            <tr>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Public page</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
