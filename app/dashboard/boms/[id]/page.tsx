import { notFound } from "next/navigation";
import { getBOMById, addBOMItem, deleteBOMItem, toggleBOMActive } from "../actions";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";

export default async function BOMDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const bom = await getBOMById(id);
  if (!bom) notFound();

  const fibers = await prisma.fiber.findMany({ where: { organizationId }, orderBy: { name: "asc" } });
  const yarns = await prisma.yarnMaster.findMany({ where: { organizationId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{bom.name}</h1>
          <p className="text-sm text-gray-500">{bom.outputType} · v{bom.version} · {bom.isActive ? "Active" : "Inactive"}</p>
        </div>
        <form action={toggleBOMActive.bind(null, bom.id, bom.isActive)}>
          <button className="rounded border px-3 py-1.5 text-sm">{bom.isActive ? "Deactivate" : "Activate"}</button>
        </form>
      </div>

      <section>
        <h2 className="font-medium mb-3">Inputs (per unit output)</h2>

        <form action={addBOMItem.bind(null, bom.id)} className="grid grid-cols-5 gap-3 items-end mb-4 p-4 border rounded bg-gray-50">
          <div>
            <label className="block text-xs font-medium mb-1">Fiber</label>
            <select name="fiberId" className="w-full rounded border px-2 py-1.5 text-sm">
              <option value="">-</option>
              {fibers.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Input Yarn (for fabric BOM)</label>
            <select name="inputYarnId" className="w-full rounded border px-2 py-1.5 text-sm">
              <option value="">-</option>
              {yarns.map((y) => (<option key={y.id} value={y.id}>{y.countValue}{y.countSystem}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Qty</label>
            <input name="quantity" type="number" step="0.001" required className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Unit</label>
            <input name="unit" defaultValue="KG" required className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Wastage %</label>
            <input name="wastagePct" type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div className="col-span-5">
            <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Input</button>
          </div>
        </form>

        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Input</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Wastage %</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {bom.items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.fiber?.name ?? "Yarn input"}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.unit}</td>
                <td className="px-4 py-2">{item.wastagePct}%</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteBOMItem.bind(null, bom.id, item.id)}>
                    <button className="text-red-600 hover:underline text-xs">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
            {bom.items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-4 text-center text-gray-400">No inputs added.</td></tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="font-medium mb-3">Cost Sheets</h2>
        <p className="text-xs text-gray-500 mb-3">
          Generated from the "Complete Order" action on Spinning/Weaving production orders using this BOM.
        </p>
        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Reference</th>
              <th className="px-4 py-2">Output Qty</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Labor</th>
              <th className="px-4 py-2">Overhead</th>
              <th className="px-4 py-2">Wastage</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Cost/Unit</th>
            </tr>
          </thead>
          <tbody>
            {bom.costSheets.map((cs) => (
              <tr key={cs.id} className="border-t">
                <td className="px-4 py-2">{cs.referenceType}</td>
                <td className="px-4 py-2">{cs.outputQty.toFixed(2)}</td>
                <td className="px-4 py-2">{cs.materialCost.toFixed(2)}</td>
                <td className="px-4 py-2">{cs.laborCost.toFixed(2)}</td>
                <td className="px-4 py-2">{cs.overheadCost.toFixed(2)}</td>
                <td className="px-4 py-2">{cs.wastageCost.toFixed(2)}</td>
                <td className="px-4 py-2 font-medium">{cs.totalCost.toFixed(2)}</td>
                <td className="px-4 py-2">{cs.costPerUnit.toFixed(2)}</td>
              </tr>
            ))}
            {bom.costSheets.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-4 text-center text-gray-400">No cost sheets yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}