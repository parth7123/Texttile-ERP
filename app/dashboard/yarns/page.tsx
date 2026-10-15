import Link from "next/link";
import { getYarns } from "./actions";

export default async function YarnsPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const sp = await Promise.resolve(searchParams);
  const q = sp?.q;
  const yarns = await getYarns(q);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Yarns</h1>
        <Link href="/dashboard/yarns/new" className="rounded bg-black text-white px-4 py-2 text-sm">
          + New Yarn
        </Link>
      </div>

      <form className="mb-4">
        <input name="q" defaultValue={q} placeholder="Search by type or blend..." className="w-full max-w-sm rounded border px-3 py-2 text-sm" />
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Count</th>
              <th className="px-4 py-2">Ply</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Blend</th>
              <th className="px-4 py-2">Cost/KG</th>
              <th className="px-4 py-2">Lots</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {yarns.map((y) => (
              <tr key={y.id} className="border-t">
                <td className="px-4 py-2 font-medium">{y.countValue} {y.countSystem}</td>
                <td className="px-4 py-2">{y.ply}</td>
                <td className="px-4 py-2">{y.yarnType ?? "-"}</td>
                <td className="px-4 py-2">{y.blendRatio ?? "-"}</td>
                <td className="px-4 py-2">{y.standardCostPerKg?.toFixed(2) ?? "-"}</td>
                <td className="px-4 py-2">
                  <Link href={`/dashboard/yarns/${y.id}/lots`} className="text-blue-600 hover:underline">
                    {y._count.lots} lot{y._count.lots === 1 ? "" : "s"}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <span className={y.isActive ? "text-green-700" : "text-gray-400"}>{y.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/dashboard/yarns/${y.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {yarns.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">No yarns yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}