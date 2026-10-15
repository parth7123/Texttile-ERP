import { createWeavingOrder, getWeavingFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function NewWeavingOrderPage() {
  const organizationId = await getSessionOrgId();
  const { fabrics, boms, beams } = await getWeavingFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Weaving Order</h1>
      <form action={createWeavingOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order Number</label>
          <input name="orderNumber" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fabric</label>
          <select name="fabricId" required className="w-full rounded border px-3 py-2">
            {fabrics.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Warp Beam (optional)</label>
          <select name="warpBeamId" className="w-full rounded border px-3 py-2">
            <option value="">-</option>
            {beams.map((b) => (<option key={b.id} value={b.id}>{b.beamNumber}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">BOM (optional)</label>
          <select name="bomId" className="w-full rounded border px-3 py-2">
            <option value="">-</option>
            {boms.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Length (M)</label>
          <input name="targetLengthM" type="number" step="0.01" required className="w-full rounded border px-3 py-2" />
        </div>
        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create Order</button>
      </form>
    </div>
  );
}
