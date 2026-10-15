import { notFound } from "next/navigation";
import { getMachineById, updateMachine, getMachineFormOptions } from "../../actions";

import MachineForm from "../../machine-form";
import { getSessionOrgId } from "@/lib/session";

export default async function EditMachinePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const [machine, branches] = await Promise.all([
    getMachineById(id),
    getMachineFormOptions(organizationId),
  ]);
  if (!machine) notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Edit Machine</h1>
      <MachineForm
        action={updateMachine.bind(null, machine.id)}
        branches={branches}
        defaultValues={{
          name: machine.name,
          machineType: machine.machineType as any,
          branchId: machine.branchId ?? "",
          spindles: machine.spindles?.toString() ?? "",
          capacityPerShift: machine.capacityPerShift?.toString() ?? "",
          manufacturer: machine.manufacturer ?? "",
          installedAt: machine.installedAt ? machine.installedAt.toISOString().slice(0, 10) : "",
          status: machine.status as any,
        }}
      />
    </div>
  );
}