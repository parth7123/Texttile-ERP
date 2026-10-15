import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { getFiberLots, getLotFormOptions, createFiberLot, deleteFiberLot } from "./actions";
import FiberLotForm from "./lot-form";
import { getSessionOrgId } from "@/lib/session";

export default async function FiberLotsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const fiber = await prisma.fiber.findFirst({ where: { id, organizationId } });
  if (!fiber) notFound();

  const [lots, { warehouses, suppliers }] = await Promise.all([
    getFiberLots(fiber.id),
    getLotFormOptions(organizationId),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">{fiber.name} — Lots</h1>
      <p className="text-sm text-gray-500 mb-6">{fiber.fiberType} · Reorder level {fiber.reorderLevel} {fiber.unit}</p>

      <FiberLotForm fiberId={fiber.id} warehouses={warehouses} suppliers={suppliers} action={createFiberLot} />

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Lot #</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Received</th>
              <th className="px-4 py-2">In (KG)</th>
              <th className="px-4 py-2">Left (KG)</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lot) => (
              <tr key={lot.id} className="border-t">
                <td className="px-4 py-2 font-medium">{lot.lotNumber}</td>
                <td className="px-4 py-2">{lot.warehouse.name}</td>
                <td className="px-4 py-2">{lot.supplier?.name ?? "-"}</td>
                <td className="px-4 py-2">{lot.receivedAt.toLocaleDateString()}</td>
                <td className="px-4 py-2">{lot.quantityIn.toFixed(2)}</td>
                <td className="px-4 py-2">{lot.quantityLeft.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteFiberLot.bind(null, fiber.id, lot.id)}>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {lots.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">No lots received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}