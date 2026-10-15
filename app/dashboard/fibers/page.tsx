import Link from "next/link";
import { getFibers } from "./actions";

export default async function FibersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const sp = await Promise.resolve(searchParams);
  const fibers = await getFibers(sp?.q);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Fibers</h1>
        <Link href="/dashboard/fibers/new" className="rounded bg-black text-white px-4 py-2 text-sm">
          + New Fiber
        </Link>
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={sp?.q}
          placeholder="Search by name, type, origin..."
          className="w-full max-w-sm rounded border px-3 py-2 text-sm"
        />
      </form>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Origin</th>
              <th className="px-4 py-2">Lots</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {fibers.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-4 py-2 font-medium">{f.name}</td>
                <td className="px-4 py-2">{f.fiberType}</td>
                <td className="px-4 py-2">{f.grade ?? "-"}</td>
                <td className="px-4 py-2">{f.origin ?? "-"}</td>
                <td className="px-4 py-2">
                  <Link href={`/dashboard/fibers/${f.id}/lots`} className="text-blue-600 hover:underline">
                    {f._count.lots} lot{f._count.lots === 1 ? "" : "s"}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <span className={f.isActive ? "text-green-700" : "text-gray-400"}>
                    {f.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/dashboard/fibers/${f.id}/edit`} className="text-blue-600 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {fibers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                  No fibers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}