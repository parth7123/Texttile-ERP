import Link from "next/link";
import { getFabrics } from "./actions";

export default async function FabricsPage({ searchParams }: { searchParams: Promise<{ q?: string }> | { q?: string } }) {
  const sp = await Promise.resolve(searchParams);
  const fabrics = await getFabrics(sp?.q);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Fabric Constructions</h1>
        <Link href="/dashboard/fabrics/new" className="rounded bg-black text-white px-4 py-2 text-sm">
          + New Fabric
        </Link>
      </div>

      <form className="mb-4">
        <input name="q" defaultValue={sp?.q} placeholder="Search by name..." className="w-full max-w-sm rounded border px-3 py-2 text-sm" />
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Weave</th>
              <th className="px-4 py-2">Warp / Weft Yarn</th>
              <th className="px-4 py-2">EPI x PPI</th>
              <th className="px-4 py-2">Width</th>
              <th className="px-4 py-2">Rolls</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {fabrics.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-4 py-2 font-medium">{f.name}</td>
                <td className="px-4 py-2">{f.weaveType}</td>
                <td className="px-4 py-2">{f.warpYarn.countValue}{f.warpYarn.countSystem} / {f.weftYarn.countValue}{f.weftYarn.countSystem}</td>
                <td className="px-4 py-2">{f.epi} x {f.ppi}</td>
                <td className="px-4 py-2">{f.width}"</td>
                <td className="px-4 py-2">
                  <Link href={`/dashboard/fabrics/${f.id}/rolls`} className="text-blue-600 hover:underline">
                    {f._count.rolls} roll{f._count.rolls === 1 ? "" : "s"}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <span className={f.isActive ? "text-green-700" : "text-gray-400"}>{f.isActive ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/dashboard/fabrics/${f.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {fabrics.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">No fabrics yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}