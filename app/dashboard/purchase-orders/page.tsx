import Link from "next/link";
import { getPurchaseOrders } from "./actions";

const statusColor: Record<string, string> = {
  DRAFT: "text-gray-500", APPROVED: "text-blue-600", PARTIALLY_RECEIVED: "text-amber-600", RECEIVED: "text-green-700", CANCELLED: "text-red-600",
};

export default async function PurchaseOrdersPage() {
  const pos = await getPurchaseOrders();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Purchase Orders</h1>
        <Link href="/dashboard/purchase-orders/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New PO</Link>
      </div>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left">
          <tr><th className="px-4 py-2">PO #</th><th className="px-4 py-2">Supplier</th><th className="px-4 py-2">Items</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr>
        </thead>
        <tbody>
          {pos.map((po) => (
            <tr key={po.id} className="border-t">
              <td className="px-4 py-2 font-medium">{po.poNumber}</td>
              <td className="px-4 py-2">{po.supplier.name}</td>
              <td className="px-4 py-2">{po.items.length}</td>
              <td className="px-4 py-2">{po.currency} {po.totalAmount.toFixed(2)}</td>
              <td className={`px-4 py-2 ${statusColor[po.status]}`}>{po.status}</td>
              <td className="px-4 py-2 text-right"><Link href={`/dashboard/purchase-orders/${po.id}`} className="text-blue-600 hover:underline">Open</Link></td>
            </tr>
          ))}
          {pos.length === 0 && (<tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No purchase orders yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}