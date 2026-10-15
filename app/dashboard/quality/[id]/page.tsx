import { notFound } from "next/navigation";
import { getInspectionById, addDefect } from "../actions";

export default async function InspectionDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const inspection = await getInspectionById(id);
  if (!inspection) notFound();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{inspection.fabricRoll?.rollNumber} — {inspection.inspectionType.replace(/_/g, " ")}</h1>
        <p className="text-sm text-gray-500">Grade {inspection.grade}{inspection.pointsScore ? ` · ${inspection.pointsScore} pts` : ""}</p>
      </div>

      <section>
        <h2 className="font-medium mb-3">Defects</h2>
        <form action={addDefect.bind(null, inspection.id)} className="grid grid-cols-4 gap-3 items-end mb-4 p-4 border rounded bg-gray-50">
          <div>
            <label className="block text-xs font-medium mb-1">Defect Code</label>
            <input name="defectCode" placeholder="Broken pick, Slub, Oil stain" required className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Points</label>
            <input name="points" type="number" step="0.1" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Position (m)</label>
            <input name="positionMeter" type="number" step="0.01" className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Defect</button>
          </div>
        </form>

        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left">
            <tr><th className="px-4 py-2">Code</th><th className="px-4 py-2">Points</th><th className="px-4 py-2">Position (m)</th></tr>
          </thead>
          <tbody>
            {inspection.defects.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-4 py-2">{d.defectCode}</td>
                <td className="px-4 py-2">{d.points}</td>
                <td className="px-4 py-2">{d.positionMeter ?? "-"}</td>
              </tr>
            ))}
            {inspection.defects.length === 0 && (<tr><td colSpan={3} className="px-4 py-4 text-center text-gray-400">No defects logged.</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}