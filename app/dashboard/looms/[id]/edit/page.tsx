import { notFound } from "next/navigation";
import { getLoomById, updateLoom, getLoomFormOptions } from "../../actions";

import LoomForm from "../../loom-form";
import { getSessionOrgId } from "@/lib/session";

export default async function EditLoomPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const [loom, branches] = await Promise.all([
    getLoomById(id),
    getLoomFormOptions(organizationId),
  ]);
  if (!loom) notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Edit Loom</h1>
      <LoomForm
        action={updateLoom.bind(null, loom.id)}
        branches={branches}
        defaultValues={{
          name: loom.name,
          loomType: loom.loomType as any,
          branchId: loom.branchId ?? "",
          width: loom.width?.toString() ?? "",
          manufacturer: loom.manufacturer ?? "",
          installedAt: loom.installedAt ? loom.installedAt.toISOString().slice(0, 10) : "",
          status: loom.status as any,
        }}
      />
    </div>
  );
}