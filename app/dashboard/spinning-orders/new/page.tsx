import { createSpinningOrder, getSpinningFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function NewSpinningOrderPage() {
  const organizationId = await getSessionOrgId();
  const { yarns, boms } = await getSpinningFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Spinning Order</h1>
      <form action={createSpinningOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Order Number</label>
          <input name="orderNumber" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Yarn</label>
          <select name="yarnId" required className="w-full rounded border px-3 py-2">
            {yarns.map((y) => (<option key={y.id} value={y.id}>{y.countValue}{y.countSystem} {y.yarnType ?? ""}</option>))}
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
          <label className="block text-sm font-medium mb-1">Target Qty (KG)</label>
          <input name="targetQtyKg" type="number" step="0.01" required className="w-full rounded border px-3 py-2" />
        </div>
        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create Order</button>
      </form>
    </div>
  );
}
