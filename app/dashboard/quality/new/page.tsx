import { createInspection, getInspectionFormOptions } from "../actions";

import { inspectionTypes, fabricGrades } from "@/lib/validations/quality";
import { getSessionOrgId } from "@/lib/session";

export default async function NewInspectionPage() {
  const organizationId = await getSessionOrgId();
  const rolls = await getInspectionFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Quality Inspection</h1>
      <form action={createInspection} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fabric Roll</label>
          <select name="fabricRollId" required className="w-full rounded border px-3 py-2">
            {rolls.map((r) => (<option key={r.id} value={r.id}>{r.rollNumber} â€” {r.fabric.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Inspection Type</label>
          <select name="inspectionType" required className="w-full rounded border px-3 py-2">
            {inspectionTypes.map((t) => (<option key={t} value={t}>{t.replace(/_/g, " ")}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Points Score (4-point system)</label>
          <input name="pointsScore" type="number" step="0.01" className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <select name="grade" className="w-full rounded border px-3 py-2">
            {fabricGrades.map((g) => (<option key={g} value={g}>{g}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Remarks</label>
          <textarea name="remarks" className="w-full rounded border px-3 py-2" rows={3} />
        </div>
        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create Inspection</button>
      </form>
    </div>
  );
}
