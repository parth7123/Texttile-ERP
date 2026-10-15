import { notFound } from "next/navigation";
import { getFiberById, updateFiber } from "../../actions";
import FiberForm from "../../fiber-form";

export default async function EditFiberPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const fiber = await getFiberById(id);
  if (!fiber) notFound();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Edit Fiber</h1>
      <FiberForm
        action={updateFiber.bind(null, fiber.id)}
        defaultValues={{
          name: fiber.name,
          fiberType: fiber.fiberType,
          grade: fiber.grade ?? "",
          origin: fiber.origin ?? "",
          micronaire: fiber.micronaire?.toString() ?? "",
          staple: fiber.staple?.toString() ?? "",
          unit: fiber.unit,
          reorderLevel: fiber.reorderLevel.toString(),
          isActive: fiber.isActive,
        }}
      />
    </div>
  );
}