import { notFound } from "next/navigation";
import { getSOById, addSOItem, createDispatch, createInvoice, getSOFormOptions } from "../actions";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";

export default async function SODetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const so = await getSOById(id);
  if (!so) notFound();

  const { fabrics, yarns } = await getSOFormOptions(organizationId);
  const availableRolls = await prisma.fabricRoll.findMany({
    where: { fabric: { organizationId }, status: "IN_STOCK" },
    include: { fabric: true },
  });

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{so.soNumber}</h1>
        <p className="text-sm text-gray-500">{so.customer.name} · {so.status} · Total {so.currency} {so.totalAmount.toFixed(2)}</p>
      </div>

      {so.status === "DRAFT" && (
        <section>
          <h2 className="font-medium mb-3">Add Item</h2>
          <form action={addSOItem.bind(null, so.id)} className="grid grid-cols-6 gap-3 items-end p-4 border rounded bg-gray-50">
            <div>
              <label className="block text-xs font-medium mb-1">Fabric</label>
              <select name="fabricId" className="w-full rounded border px-2 py-1.5 text-sm">
                <option value="">-</option>
                {fabrics.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
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
              <input name="unit" defaultValue="METER" required className="w-full rounded border px-2 py-1.5 text-sm" />
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
            {so.items.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-4 py-2">{i.description}</td>
                <td className="px-4 py-2">{i.quantity} {i.unit}</td>
                <td className="px-4 py-2">{i.rate.toFixed(2)}</td>
                <td className="px-4 py-2">{i.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {so.status === "CONFIRMED" && (
        <section>
          <h2 className="font-medium mb-3">Dispatch</h2>
          <form action={createDispatch.bind(null, so.id)} className="space-y-3 p-4 border rounded bg-gray-50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Dispatch Number</label>
                <input name="dispatchNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Vehicle Number</label>
                <input name="vehicleNumber" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Select Rolls to Dispatch</label>
              <div className="max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                {availableRolls.map((r) => (
                  <label key={r.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="rollIds" value={r.id} />
                    {r.rollNumber} — {r.fabric.name} ({r.lengthMeters}m)
                  </label>
                ))}
                {availableRolls.length === 0 && <p className="text-xs text-gray-400">No rolls in stock.</p>}
              </div>
            </div>
            <button className="rounded bg-purple-600 text-white px-3 py-1.5 text-sm">Create Dispatch</button>
          </form>
        </section>
      )}

      {(so.status === "DISPATCHED" || so.status === "CONFIRMED") && so.invoices.length === 0 && (
        <section>
          <h2 className="font-medium mb-3">Invoice</h2>
          <form action={createInvoice.bind(null, so.id)} className="grid grid-cols-3 gap-3 items-end p-4 border rounded bg-gray-50">
            <div>
              <label className="block text-xs font-medium mb-1">Invoice Number</label>
              <input name="invoiceNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Due Date</label>
              <input name="dueDate" type="date" className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <button className="rounded bg-green-700 text-white px-3 py-1.5 text-sm">Generate Invoice</button>
            </div>
          </form>
        </section>
      )}

      {so.invoices.length > 0 && (
        <section>
          <h2 className="font-medium mb-3">Invoices</h2>
          {so.invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between p-3 border rounded mb-2 text-sm">
              <span>{inv.invoiceNumber} — {inv.status} — Paid {inv.paidAmount.toFixed(2)} / {inv.totalAmount.toFixed(2)}</span>
              <a href={`/dashboard/invoices/${inv.id}`} className="text-blue-600 hover:underline">Open</a>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}