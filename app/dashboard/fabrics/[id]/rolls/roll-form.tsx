"use client";

import { useState, useTransition } from "react";
import { fabricGrades } from "@/lib/validations/fabric";

type Option = { id: string; name: string };

export default function FabricRollForm({
  fabricId,
  warehouses,
  looms,
  action,
}: {
  fabricId: string;
  warehouses: Option[];
  looms: Option[];
  action: (fabricId: string, data: any) => Promise<void>;
}) {
  const [rollNumber, setRollNumber] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [loomId, setLoomId] = useState("");
  const [lengthMeters, setLengthMeters] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [qualityGrade, setQualityGrade] = useState<(typeof fabricGrades)[number]>("A");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action(fabricId, {
          rollNumber,
          warehouseId,
          loomId,
          lengthMeters,
          weightKg: weightKg === "" ? null : Number(weightKg),
          qualityGrade,
        });
        setRollNumber("");
        setLengthMeters("");
        setWeightKg("");
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
      {error && <p className="col-span-6 text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-xs font-medium mb-1">Roll #</label>
        <input required value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Warehouse</label>
        <select required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm">
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Loom</label>
        <select value={loomId} onChange={(e) => setLoomId(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm">
          <option value="">-</option>
          {looms.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Length (m)</label>
        <input required type="number" step="0.01" value={lengthMeters} onChange={(e) => setLengthMeters(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Weight (kg)</label>
        <input type="number" step="0.01" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Grade</label>
        <select value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value as any)} className="w-full rounded border px-2 py-1.5 text-sm">
          {fabricGrades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="col-span-6">
        <button disabled={isPending} className="rounded bg-black text-white px-4 py-1.5 text-sm disabled:opacity-50">
          {isPending ? "Adding..." : "Add Roll"}
        </button>
      </div>
    </form>
  );
}