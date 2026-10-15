import Link from "next/link";
import { getBOMs } from "./actions";

export default async function BOMsPage() {
  const boms = await getBOMs();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Bill of Materials</h1>
        <Link href="/dashboard/boms/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New BOM</Link>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Output Type</th>
              <th className="px-4 py-2">Output</th>
              <th className="px-4 py-2">Version</th>
              <th className="px-4 py-2">Items</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {boms.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="px-4 py-2 font-medium">{b.name}</td>
                <td className="px-4 py-2">{b.outputType}</td>
                <td className="px-4 py-2">
                  {b.outputType === "YARN"
                    ? (b.yarnOutput ? `${b.yarnOutput.countValue}${b.yarnOutput.countSystem}` : "-")
                    : (b.fabricOutput?.name ?? "-")}
                </td>
                <td className="px-4 py-2">v{b.version}</td>
                <td className="px-4 py-2">{b._count.items}</td>
                <td className="px-4 py-2">{b.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/dashboard/boms/${b.id}`} className="text-blue-600 hover:underline">Open</Link>
                </td>
              </tr>
            ))}
            {boms.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No BOMs yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}