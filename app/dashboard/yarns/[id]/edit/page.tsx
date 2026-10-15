import { notFound } from "next/navigation";
import { getYarnById, updateYarn } from "../../actions";
import YarnForm from "../../yarn-form";

export default async function EditYarnPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const yarn = await getYarnById(id);
  if (!yarn) notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Edit Yarn</h1>
      <YarnForm
        action={updateYarn.bind(null, yarn.id)}
        defaultValues={{
          countValue: yarn.countValue.toString(),
          countSystem: yarn.countSystem as any,
          ply: yarn.ply.toString(),
          blendRatio: yarn.blendRatio ?? "",
          yarnType: yarn.yarnType ?? "",
          unit: yarn.unit,
          standardCostPerKg: yarn.standardCostPerKg?.toString() ?? "",
          isActive: yarn.isActive,
        }}
      />
    </div>
  );
}