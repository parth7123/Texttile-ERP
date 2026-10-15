"use client";

import { useState, useTransition } from "react";

type Option = { id: string; name: string };

export default function YarnLotForm({
  yarnId,
  warehouses,
  action,
}: {
  yarnId: string;
  warehouses: Option[];
  action: (yarnId: string, data: any) => Promise<void>;
}) {
  const [lotNumber, setLotNumber] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [quantityIn, setQuantityIn] = useState("");
  const [qualityGrade, setQualityGrade] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action(yarnId, { lotNumber, warehouseId, quantityIn, qualityGrade });
        setLotNumber("");
        setQuantityIn("");
        setQualityGrade("");
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
      {error && <p className="col-span-5 text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-xs font-medium mb-1">Lot #</label>
        <input required value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
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
        <label className="block text-xs font-medium mb-1">Qty (KG)</label>
        <input required type="number" step="0.01" value={quantityIn} onChange={(e) => setQuantityIn(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Quality Grade</label>
        <input value={qualityGrade} onChange={(e) => setQualityGrade(e.target.value)} placeholder="A, B, C" className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <button disabled={isPending} className="w-full rounded bg-black text-white px-3 py-1.5 text-sm disabled:opacity-50">
          {isPending ? "Adding..." : "Add Lot"}
        </button>
      </div>
    </form>
  );
}