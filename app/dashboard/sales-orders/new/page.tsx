import { createSalesOrder, getSOFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function NewSOPage() {
  const organizationId = await getSessionOrgId();
  const { customers } = await getSOFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New Sales Order</h1>
      <form action={createSalesOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">SO Number</label>
          <input name="soNumber" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Customer</label>
          <select name="customerId" required className="w-full rounded border px-3 py-2">
            {customers.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Date</label>
          <input name="deliveryDate" type="date" className="w-full rounded border px-3 py-2" />
        </div>
        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create SO</button>
      </form>
    </div>
  );
}
