import { createYarn } from "../actions";
import YarnForm from "../yarn-form";

export default function NewYarnPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">New Yarn</h1>
      <YarnForm action={createYarn} />
    </div>
  );
}