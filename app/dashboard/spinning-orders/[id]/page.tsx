import { notFound } from "next/navigation";
import { getSpinningOrderById, addSpinningLog, addWasteLog, completeSpinningOrder } from "../actions";
import { getSpinningFormOptions } from "../actions";

import { prisma } from "@/lib/prisma";
import { getSessionOrgId } from "@/lib/session";

export default async function SpinningOrderDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const order = await getSpinningOrderById(id);
  if (!order) notFound();

  const { machines, employees, shifts } = await getSpinningFormOptions(organizationId);
  const warehouses = await prisma.warehouse.findMany({ where: { organizationId } });

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{order.orderNumber}</h1>
        <p className="text-sm text-gray-500">
          {order.producedQtyKg.toFixed(2)} / {order.targetQtyKg} KG · {order.status}
        </p>
      </div>

      {order.status !== "COMPLETED" && (
        <>
          <section>
            <h2 className="font-medium mb-3">Log Production</h2>
            <form action={addSpinningLog.bind(null, order.id)} className="grid grid-cols-4 gap-3 items-end p-4 border rounded bg-gray-50">
              <div>
                <label className="block text-xs font-medium mb-1">Machine</label>
                <select name="machineId" required className="w-full rounded border px-2 py-1.5 text-sm">
                  {machines.map((m) => (<option key={m.id} value={m.id}>{m.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Employee</label>
                <select name="employeeId" className="w-full rounded border px-2 py-1.5 text-sm">
                  <option value="">-</option>
                  {employees.map((e) => (<option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Shift</label>
                <select name="shiftId" className="w-full rounded border px-2 py-1.5 text-sm">
                  <option value="">-</option>
                  {shifts.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Date</label>
                <input name="logDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)} className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Output (KG)</label>
                <input name="outputKg" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Efficiency %</label>
                <input name="efficiencyPct" type="number" step="0.01" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Count Achieved</label>
                <input name="countAchieved" type="number" step="0.01" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div className="col-span-4">
                <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Log</button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="font-medium mb-3">Log Waste</h2>
            <form action={addWasteLog.bind(null, order.id)} className="grid grid-cols-4 gap-3 items-end p-4 border rounded bg-gray-50">
              <div>
                <label className="block text-xs font-medium mb-1">Waste Type</label>
                <input name="wasteType" placeholder="Sliver waste, Comber noil..." required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Qty (KG)</label>
                <input name="quantityKg" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Norm %</label>
                <input name="normPct" type="number" step="0.01" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Date</label>
                <input name="logDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)} className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div className="col-span-4">
                <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Waste Log</button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="font-medium mb-3">Complete Order</h2>
            <form action={completeSpinningOrder.bind(null, order.id)} className="grid grid-cols-4 gap-3 items-end p-4 border rounded bg-gray-50">
              <div>
                <label className="block text-xs font-medium mb-1">Yarn Lot #</label>
                <input name="lotNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Warehouse</label>
                <select name="warehouseId" required className="w-full rounded border px-2 py-1.5 text-sm">
                  {warehouses.map((w) => (<option key={w.id} value={w.id}>{w.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Labor Cost</label>
                <input name="laborCost" type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Overhead Cost</label>
                <input name="overheadCost" type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div className="col-span-4">
                <button className="rounded bg-green-700 text-white px-3 py-1.5 text-sm">Complete & Create Yarn Lot</button>
              </div>
            </form>
          </section>
        </>
      )}

      <section>
        <h2 className="font-medium mb-3">Production Logs</h2>
        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Date</th><th className="px-4 py-2">Machine</th><th className="px-4 py-2">Output (KG)</th><th className="px-4 py-2">Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {order.logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2">{l.logDate.toLocaleDateString()}</td>
                <td className="px-4 py-2">{l.machine.name}</td>
                <td className="px-4 py-2">{l.outputKg}</td>
                <td className="px-4 py-2">{l.efficiencyPct ?? "-"}</td>
              </tr>
            ))}
            {order.logs.length === 0 && (<tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400">No logs yet.</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}