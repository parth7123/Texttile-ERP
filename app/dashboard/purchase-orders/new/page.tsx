import { createPurchaseOrder, getPOFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function NewPOPage() {
  const organizationId = await getSessionOrgId();
  const { suppliers } = await getPOFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Purchase Order</h1>
      <form action={createPurchaseOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">PO Number</label>
          <input name="poNumber" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Supplier</label>
          <select name="supplierId" required className="w-full rounded border px-3 py-2">
            {suppliers.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Expected Date</label>
          <input name="expectedDate" type="date" className="w-full rounded border px-3 py-2" />
        </div>
        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create PO</button>
      </form>
    </div>
  );
}
