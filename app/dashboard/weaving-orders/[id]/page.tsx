import { notFound } from "next/navigation";
import { getWeavingOrderById, addWeavingLog, completeWeavingOrder, getWeavingFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function WeavingOrderDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const order = await getWeavingOrderById(id);
  if (!order) notFound();

  const { looms, employees, shifts } = await getWeavingFormOptions(organizationId);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold">{order.orderNumber}</h1>
        <p className="text-sm text-gray-500">{order.producedLengthM.toFixed(2)} / {order.targetLengthM} M · {order.status}</p>
      </div>

      {order.status !== "COMPLETED" && (
        <>
          <section>
            <h2 className="font-medium mb-3">Log Production</h2>
            <form action={addWeavingLog.bind(null, order.id)} className="grid grid-cols-4 gap-3 items-end p-4 border rounded bg-gray-50">
              <div>
                <label className="block text-xs font-medium mb-1">Loom</label>
                <select name="loomId" required className="w-full rounded border px-2 py-1.5 text-sm">
                  {looms.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
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
                <label className="block text-xs font-medium mb-1">Date</label>
                <input name="logDate" type="date" required defaultValue={new Date().toISOString().slice(0,10)} className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Output (M)</label>
                <input name="outputMeters" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Efficiency %</label>
                <input name="efficiencyPct" type="number" step="0.01" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Stops</label>
                <input name="stops" type="number" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div className="col-span-4">
                <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Log</button>
              </div>
            </form>
          </section>

          <section>
            <h2 className="font-medium mb-3">Complete Order</h2>
            <form action={completeWeavingOrder.bind(null, order.id)} className="grid grid-cols-3 gap-3 items-end p-4 border rounded bg-gray-50">
              <div>
                <label className="block text-xs font-medium mb-1">Labor Cost</label>
                <input name="laborCost" type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Overhead Cost</label>
                <input name="overheadCost" type="number" step="0.01" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
              </div>
              <div>
                <button className="rounded bg-green-700 text-white px-3 py-1.5 text-sm">Complete Order</button>
              </div>
            </form>
            <p className="text-xs text-gray-500 mt-2">
              Add produced fabric rolls separately from the fabric's Rolls page, selecting the loom used.
            </p>
          </section>
        </>
      )}

      <section>
        <h2 className="font-medium mb-3">Production Logs</h2>
        <table className="w-full text-sm border rounded">
          <thead className="bg-gray-50 text-left">
            <tr><th className="px-4 py-2">Date</th><th className="px-4 py-2">Loom</th><th className="px-4 py-2">Output (M)</th><th className="px-4 py-2">Stops</th></tr>
          </thead>
          <tbody>
            {order.logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="px-4 py-2">{l.logDate.toLocaleDateString()}</td>
                <td className="px-4 py-2">{l.loom.name}</td>
                <td className="px-4 py-2">{l.outputMeters}</td>
                <td className="px-4 py-2">{l.stops ?? "-"}</td>
              </tr>
            ))}
            {order.logs.length === 0 && (<tr><td colSpan={4} className="px-4 py-4 text-center text-gray-400">No logs yet.</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
}