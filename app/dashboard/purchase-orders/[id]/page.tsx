import { notFound } from "next/navigation";
import { getPOById, addPOItem, approvePO, createGRN, getPOFormOptions } from "../actions";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";

export default async function PODetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const po = await getPOById(id);
  if (!po) notFound();

  const { fibers, yarns } = await getPOFormOptions(organizationId);
  const warehouses = await prisma.warehouse.findMany({ where: { organizationId } });

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{po.poNumber}</h1>
          <p className="text-sm text-gray-500">{po.supplier.name} · {po.status} · Total {po.currency} {po.totalAmount.toFixed(2)}</p>
        </div>
        {po.status === "DRAFT" && (
          <form action={approvePO.bind(null, po.id)}>
            <button className="rounded bg-blue-600 text-white px-3 py-1.5 text-sm">Approve</button>
          </form>
        )}
      </div>

      {po.status === "DRAFT" && (
        <section>
          <h2 className="font-medium mb-3">Add Item</h2>
          <form action={addPOItem.bind(null, po.id)} className="grid grid-cols-6 gap-3 items-end p-4 border rounded bg-gray-50">
            <div>
              <label className="block text-xs font-medium mb-1">Fiber</label>
              <select name="fiberId" className="w-full rounded border px-2 py-1.5 text-sm">
                <option value="">-</option>
                {fibers.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Yarn</label>
              <select name="yarnId" className="w-full rounded border px-2 py-1.5 text-sm">
                <option value="">-</option>
                {yarns.map((y) => (<option key={y.id} value={y.id}>{y.countValue}{y.countSystem}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Description</label>
              <input name="description" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Qty</label>
              <input name="quantity" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Unit</label>
              <input name="unit" defaultValue="KG" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Rate</label>
              <input name="rate" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div className="col-span-6">
              <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Item</button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="font-medium mb-3">Items</h2>
        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Description</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Rate</th><th className="px-4 py-2">Amount</th></tr></thead>
          <tbody>
            {po.items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-2">{i.description}</td>
                <td className="px-4 py-2">{i.quantity} {i.unit}</td>
                <td className="px-4 py-2">{i.rate.toFixed(2)}</td>
                <td className="px-4 py-2">{i.amount.toFixed(2)}</td>
              </tr>
            ))}
            {po.items.length === 0 && (<tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400">No items yet.</td></tr>)}
          </tbody>
        </table>
      </section>

      {(po.status === "APPROVED" || po.status === "PARTIALLY_RECEIVED") && po.items.length > 0 && (
        <section>
          <h2 className="font-medium mb-3">Record Goods Received (GRN)</h2>
          <form action={createGRN.bind(null, po.id)} className="space-y-3 p-4 border rounded bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">GRN Number</label>
                <input name="grnNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Warehouse</label>
                <select name="warehouseId" required className="w-full rounded border px-2 py-1.5 text-sm">
                  {warehouses.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                </select>
              </div>
            </div>
            {po.items.map((i) => (
              <div key={i.id} className="grid grid-cols-3 gap-3 items-end border-t pt-3">
                <p className="text-sm">{i.description} (ordered {i.quantity} {i.unit})</p>
                <div>
                  <label className="block text-xs font-medium mb-1">Received Qty</label>
                  <input name={`received_${i.id}`} type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Rejected Qty</label>
                  <input name={`rejected_${i.id}`} type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
                </div>
              </div>
            ))}
            <button className="rounded bg-green-700 text-white px-3 py-1.5 text-sm">Record GRN & Create Lots</button>
          </form>
        </section>
      )}

      <section>
        <h2 className="font-medium mb-3">GRN History</h2>
        {po.grns.map((grn) => (
          <div key={grn.id} className="mb-3 p-3 border rounded text-sm">
            <p className="font-medium">{grn.grnNumber} — {grn.receivedDate.toLocaleDateString()}</p>
            {grn.items.map((i) => (<p key={i.id} className="text-gray-600">{i.description}: {i.receivedQty} received, {i.rejectedQty} rejected</p>))}
          </div>
        ))}
        {po.grns.length === 0 && <p className="text-gray-400 text-sm">No GRNs recorded.</p>}
      </section>
    </div>
  );
}