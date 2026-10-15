import Link from "next/link";
import { getLooms } from "./actions";

const statusColor: Record<string, string> = {
  RUNNING: "text-green-700",
  IDLE: "text-gray-500",
  MAINTENANCE: "text-amber-600",
  BREAKDOWN: "text-red-600",
  RETIRED: "text-gray-400",
};

export default async function LoomsPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const sp = await Promise.resolve(searchParams);
  const looms = await getLooms(sp?.q);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Looms</h1>
        <Link href="/dashboard/looms/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New Loom</Link>
      </div>

      <form className="mb-4">
        <input name="q" defaultValue={sp?.q} placeholder="Search by name..." className="w-full max-w-sm rounded border px-3 py-2 text-sm" />
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">Width</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Downtime Logs</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {looms.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2 font-medium">{l.name}</td>
                <td className="px-4 py-2">{l.loomType.replace(/_/g, " ")}</td>
                <td className="px-4 py-2">{l.branch?.name ?? "-"}</td>
                <td className="px-4 py-2">{l.width ? `${l.width}"` : "-"}</td>
                <td className={`px-4 py-2 ${statusColor[l.status]}`}>{l.status}</td>
                <td className="px-4 py-2">
                  <Link href={`/dashboard/looms/${l.id}/downtime`} className="text-blue-600 hover:underline">
                    {l._count.downtimeLogs} log{l._count.downtimeLogs === 1 ? "" : "s"}
                  </Link>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/dashboard/looms/${l.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {looms.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No looms yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}