"use client";

import { useState, useTransition } from "react";

type Option = { id: string; name: string };

export default function FiberLotForm({
  fiberId,
  warehouses,
  suppliers,
  action,
}: {
  fiberId: string;
  warehouses: Option[];
  suppliers: Option[];
  action: (fiberId: string, data: any) => Promise<void>;
}) {
  const [lotNumber, setLotNumber] = useState("");
  const [warehouseId, setWarehouseId] = useState(warehouses[0]?.id ?? "");
  const [supplierId, setSupplierId] = useState("");
  const [quantityIn, setQuantityIn] = useState("");
  const [bags, setBags] = useState("");
  const [qualityNotes, setQualityNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action(fiberId, {
          lotNumber,
          warehouseId,
          supplierId,
          quantityIn,
          bags: bags === "" ? null : Number(bags),
          qualityNotes,
        });
        setLotNumber("");
        setQuantityIn("");
        setBags("");
        setQualityNotes("");
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
      {error && <p className="col-span-6 text-sm text-red-600">{error}</p>}

      <div className="col-span-1">
        <label className="block text-xs font-medium mb-1">Lot #</label>
        <input required value={lotNumber} onChange={(e) => setLotNumber(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div className="col-span-1">
        <label className="block text-xs font-medium mb-1">Warehouse</label>
        <select required value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm">
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>{w.name}</option>
          ))}
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-xs font-medium mb-1">Supplier</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm">
          <option value="">-</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="col-span-1">
        <label className="block text-xs font-medium mb-1">Qty (KG)</label>
        <input required type="number" step="0.01" value={quantityIn} onChange={(e) => setQuantityIn(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div className="col-span-1">
        <label className="block text-xs font-medium mb-1">Bags</label>
        <input type="number" value={bags} onChange={(e) => setBags(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div className="col-span-1">
        <button disabled={isPending} className="w-full rounded bg-black text-white px-3 py-1.5 text-sm disabled:opacity-50">
          {isPending ? "Adding..." : "Add Lot"}
        </button>
      </div>

      <div className="col-span-6">
        <label className="block text-xs font-medium mb-1">Quality Notes</label>
        <input value={qualityNotes} onChange={(e) => setQualityNotes(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>
    </form>
  );
}