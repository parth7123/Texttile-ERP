import { notFound } from "next/navigation";
import { getFabricById, updateFabric, getFabricFormOptions } from "../../actions";

import FabricForm from "../../fabric-form";
import { getSessionOrgId } from "@/lib/session";

export default async function EditFabricPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const [fabric, yarns] = await Promise.all([
    getFabricById(id),
    getFabricFormOptions(organizationId),
  ]);
  if (!fabric) notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Edit Fabric Construction</h1>
      <FabricForm
        action={updateFabric.bind(null, fabric.id)}
        yarns={yarns}
        defaultValues={{
          name: fabric.name,
          weaveType: fabric.weaveType,
          warpYarnId: fabric.warpYarnId,
          weftYarnId: fabric.weftYarnId,
          warpCount: fabric.warpCount ?? "",
          weftCount: fabric.weftCount ?? "",
          epi: fabric.epi.toString(),
          ppi: fabric.ppi.toString(),
          width: fabric.width.toString(),
          gsm: fabric.gsm?.toString() ?? "",
          unit: fabric.unit,
          standardCostPerUnit: fabric.standardCostPerUnit?.toString() ?? "",
          isActive: fabric.isActive,
        }}
      />
    </div>
  );
}