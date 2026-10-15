import Link from "next/link";
import { getInspections } from "./actions";

export default async function QualityPage() {
  const inspections = await getInspections();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Quality Inspections</h1>
        <Link href="/dashboard/quality/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New Inspection</Link>
      </div>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left">
          <tr><th className="px-4 py-2">Roll #</th><th className="px-4 py-2">Fabric</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Grade</th><th className="px-4 py-2">Defects</th><th className="px-4 py-2">Date</th><th className="px-4 py-2"></th></tr>
        </thead>
        <tbody>
          {inspections.map((i) => (
            <tr key={i.id} className="border-t">
              <td className="px-4 py-2 font-medium">{i.fabricRoll?.rollNumber ?? "-"}</td>
              <td className="px-4 py-2">{i.fabricRoll?.fabric.name ?? "-"}</td>
              <td className="px-4 py-2">{i.inspectionType.replace(/_/g, " ")}</td>
              <td className="px-4 py-2">{i.grade}</td>
              <td className="px-4 py-2">{i.defects.length}</td>
              <td className="px-4 py-2">{i.inspectedAt.toLocaleDateString()}</td>
              <td className="px-4 py-2 text-right"><Link href={`/dashboard/quality/${i.id}`} className="text-blue-600 hover:underline">Open</Link></td>
            </tr>
          ))}
          {inspections.length === 0 && (<tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No inspections yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}