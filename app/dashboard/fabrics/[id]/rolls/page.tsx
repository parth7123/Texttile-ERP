import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { getFabricRolls, getRollFormOptions, createFabricRoll, deleteFabricRoll } from "./actions";
import FabricRollForm from "./roll-form";
import { getSessionOrgId } from "@/lib/session";

export default async function FabricRollsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const fabric = await prisma.fabricConstruction.findFirst({ where: { id, organizationId } });
  if (!fabric) notFound();

  const [rolls, { warehouses, looms }] = await Promise.all([
    getFabricRolls(fabric.id),
    getRollFormOptions(organizationId),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">{fabric.name} — Rolls</h1>
      <p className="text-sm text-gray-500 mb-6">{fabric.weaveType} · {fabric.width}" wide</p>

      <FabricRollForm fabricId={fabric.id} warehouses={warehouses} looms={looms} action={createFabricRoll} />

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Roll #</th>
              <th className="px-4 py-2">Warehouse</th>
              <th className="px-4 py-2">Loom</th>
              <th className="px-4 py-2">Length (m)</th>
              <th className="px-4 py-2">Weight (kg)</th>
              <th className="px-4 py-2">Grade</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rolls.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2 font-medium">{r.rollNumber}</td>
                <td className="px-4 py-2">{r.warehouse.name}</td>
                <td className="px-4 py-2">{r.loom?.name ?? "-"}</td>
                <td className="px-4 py-2">{r.lengthMeters.toFixed(2)}</td>
                <td className="px-4 py-2">{r.weightKg?.toFixed(2) ?? "-"}</td>
                <td className="px-4 py-2">{r.qualityGrade}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2 text-right">
                  <form action={deleteFabricRoll.bind(null, fabric.id, r.id)}>
                    <button className="text-red-600 hover:underline text-xs">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {rolls.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-6 text-center text-gray-400">No rolls yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}