import { createLoom, getLoomFormOptions } from "../actions";

import LoomForm from "../loom-form";
import { getSessionOrgId } from "@/lib/session";

export default async function NewLoomPage() {
  const organizationId = await getSessionOrgId();
  const branches = await getLoomFormOptions(organizationId);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">New Loom</h1>
      <LoomForm action={createLoom} branches={branches} />
    </div>
  );
}
