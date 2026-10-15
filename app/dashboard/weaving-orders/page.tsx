import Link from "next/link";
import { getWeavingOrders } from "./actions";

const statusColor: Record<string, string> = {
  PLANNED: "text-gray-500", IN_PROGRESS: "text-blue-600", COMPLETED: "text-green-700", CANCELLED: "text-red-600", ON_HOLD: "text-amber-600",
};

export default async function WeavingOrdersPage() {
  const orders = await getWeavingOrders();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Weaving Production Orders</h1>
        <Link href="/dashboard/weaving-orders/new" className="rounded bg-black text-white px-4 py-2 text-sm">+ New Order</Link>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Order #</th><th className="px-4 py-2">Target (M)</th><th className="px-4 py-2">Produced (M)</th><th className="px-4 py-2">Beam</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-2 font-medium">{o.orderNumber}</td>
                <td className="px-4 py-2">{o.targetLengthM}</td>
                <td className="px-4 py-2">{o.producedLengthM.toFixed(2)}</td>
                <td className="px-4 py-2">{o.warpBeam?.beamNumber ?? "-"}</td>
                <td className={`px-4 py-2 ${statusColor[o.status]}`}>{o.status}</td>
                <td className="px-4 py-2 text-right"><Link href={`/dashboard/weaving-orders/${o.id}`} className="text-blue-600 hover:underline">Open</Link></td>
              </tr>
            ))}
            {orders.length === 0 && (<tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No weaving orders yet.</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}