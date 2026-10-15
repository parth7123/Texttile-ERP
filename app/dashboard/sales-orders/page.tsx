import Link from "next/link";
import { getSalesOrders } from "./actions";

const statusColor: Record<string, string> = {
  DRAFT: "text-gray-500", CONFIRMED: "text-blue-600", PARTIALLY_DISPATCHED: "text-amber-600", DISPATCHED: "text-purple-600", INVOICED: "text-green-700", CANCELLED: "text-red-600",
};

export default async function SalesOrdersPage() {
  const orders = await getSalesOrders();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Sales Orders</h1>
        <Link href="/dashboard/sales-orders/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New SO</Link>
      </div>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">SO #</th><th className="px-4 py-2">Customer</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr></thead>
        <tbody>
          {orders.map((so) => (
            <tr key={so.id} className="border-t">
              <td className="px-4 py-2 font-medium">{so.soNumber}</td>
              <td className="px-4 py-2">{so.customer.name}</td>
              <td className="px-4 py-2">{so.currency} {so.totalAmount.toFixed(2)}</td>
              <td className={`px-4 py-2 ${statusColor[so.status]}`}>{so.status}</td>
              <td className="px-4 py-2 text-right"><Link href={`/dashboard/sales-orders/${so.id}`} className="text-blue-600 hover:underline">Open</Link></td>
            </tr>
          ))}
          {orders.length === 0 && (<tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No sales orders yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}