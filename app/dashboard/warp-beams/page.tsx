import { prisma } from "@/lib/prisma";

import { getWarpBeams, createWarpBeam } from "./actions";
import { getSessionOrgId } from "@/lib/session";

export default async function WarpBeamsPage() {
  const organizationId = await getSessionOrgId();
  const [beams, yarnLots, looms] = await Promise.all([
    getWarpBeams(),
    prisma.yarnLot.findMany({ where: { yarn: { organizationId } }, include: { yarn: true } }),
    prisma.loom.findMany({ where: { organizationId } }),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Warp Beams</h1>

      <form action={createWarpBeam} className="grid grid-cols-5 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Beam #</label>
          <input name="beamNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Yarn Lot</label>
          <select name="yarnLotId" required className="w-full rounded border px-2 py-1.5 text-sm">
            {yarnLots.map((l) => (<option key={l.id} value={l.id}>{l.lotNumber} ({l.yarn.countValue}{l.yarn.countSystem})</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Total Ends</label>
          <input name="totalEnds" type="number" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Length (M)</label>
          <input name="lengthMeters" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Loom</label>
          <select name="loomId" className="w-full rounded border px-2 py-1.5 text-sm">
            <option value="">-</option>
            {looms.map((l) => (<option key={l.id} value={l.id}>{l.name}</option>))}
          </select>
        </div>
        <div className="col-span-5">
          <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Beam</button>
        </div>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left">
          <tr><th className="px-4 py-2">Beam #</th><th className="px-4 py-2">Yarn Lot</th><th className="px-4 py-2">Ends</th><th className="px-4 py-2">Length (M)</th><th className="px-4 py-2">Loom</th><th className="px-4 py-2">Status</th></tr>
        </thead>
        <tbody>
          {beams.map((b) => (
            <tr key={b.id} className="border-t">
              <td className="px-4 py-2 font-medium">{b.beamNumber}</td>
              <td className="px-4 py-2">{b.yarnLot.lotNumber}</td>
              <td className="px-4 py-2">{b.totalEnds}</td>
              <td className="px-4 py-2">{b.lengthMeters}</td>
              <td className="px-4 py-2">{b.loom?.name ?? "-"}</td>
              <td className="px-4 py-2">{b.status}</td>
            </tr>
          ))}
          {beams.length === 0 && (<tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No warp beams yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
