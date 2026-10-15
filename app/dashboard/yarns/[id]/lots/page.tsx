import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { getYarnLots, getYarnLotFormOptions, createYarnLot, deleteYarnLot } from "./actions";
import YarnLotForm from "./lot-form";
import { getSessionOrgId } from "@/lib/session";

export default async function YarnLotsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const yarn = await prisma.yarnMaster.findFirst({ where: { id, organizationId } });
  if (!yarn) notFound();

  const [lots, warehouses] = await Promise.all([
    getYarnLots(yarn.id),
    getYarnLotFormOptions(organizationId),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">{yarn.countValue} {yarn.countSystem}{yarn.ply > 1 ? `/${yarn.ply}` : ""} — Lots</h1>
      <p className="text-sm text-gray-500 mb-6">{yarn.yarnType ?? "Yarn"}{yarn.blendRatio ? ` · ${yarn.blendRatio}` : ""}</p>

      <YarnLotForm yarnId={yarn.id} warehouses={warehouses} action={createYarnLot} />

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Lot #</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Produced</th>
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
                <td className="px-4 py-2">{lot.qualityGrade ?? "-"}</td>
                <td className="px-4 py-2">{lot.producedAt.toLocaleDateString()}</td>
                <td className="px-4 py-2">{lot.quantityIn.toFixed(2)}</td>
                <td className="px-4 py-2">{lot.quantityLeft.toFixed(2)}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteYarnLot.bind(null, yarn.id, lot.id)}>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {lots.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-center text-gray-400">No lots yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}