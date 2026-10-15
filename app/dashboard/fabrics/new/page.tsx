import { createFabric, getFabricFormOptions } from "../actions";

import FabricForm from "../fabric-form";
import { getSessionOrgId } from "@/lib/session";

export default async function NewFabricPage() {
  const organizationId = await getSessionOrgId();
  const yarns = await getFabricFormOptions(organizationId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">New Fabric Construction</h1>
      <FabricForm action={createFabric} yarns={yarns} />
    </div>
  );
}
