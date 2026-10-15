import { createMachine, getMachineFormOptions } from "../actions";

import MachineForm from "../machine-form";
import { getSessionOrgId } from "@/lib/session";

export default async function NewMachinePage() {
  const organizationId = await getSessionOrgId();
  const branches = await getMachineFormOptions(organizationId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">New Machine</h1>
      <MachineForm action={createMachine} branches={branches} />
    </div>
  );
}
