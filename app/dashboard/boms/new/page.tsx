import { createBOM, getBOMFormOptions } from "../actions";
import { getSessionOrgId } from "@/lib/session";


export default async function NewBOMPage() {
  const organizationId = await getSessionOrgId();
  const { yarns, fabrics } = await getBOMFormOptions(organizationId);

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-xl font-semibold mb-6">New BOM</h1>
      <form action={createBOM} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input name="name" required className="w-full rounded border px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Output Type</label>
          <select name="outputType" className="w-full rounded border px-3 py-2">
            <option value="YARN">Yarn</option>
            <option value="FABRIC">Fabric</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Yarn Output (if output = Yarn)</label>
          <select name="yarnOutputId" className="w-full rounded border px-3 py-2">
            <option value="">-</option>
            {yarns.map((y) => (
              <option key={y.id} value={y.id}>{y.countValue}{y.countSystem} {y.yarnType ?? ""}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fabric Output (if output = Fabric)</label>
          <select name="fabricOutputId" className="w-full rounded border px-3 py-2">
            <option value="">-</option>
            {fabrics.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <button className="rounded bg-black text-white px-4 py-2 text-sm">Create BOM</button>
      </form>
    </div>
  );
}
