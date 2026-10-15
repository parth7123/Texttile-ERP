"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { yarnCountSystems } from "@/lib/validations/yarn";

type YarnFormValues = {
  countValue: string;
  countSystem: (typeof yarnCountSystems)[number];
  ply: string;
  blendRatio: string;
  yarnType: string;
  unit: string;
  standardCostPerKg: string;
  isActive: boolean;
};

const emptyValues: YarnFormValues = {
  countValue: "",
  countSystem: "NE",
  ply: "1",
  blendRatio: "",
  yarnType: "",
  unit: "KG",
  standardCostPerKg: "",
  isActive: true,
};

export default function YarnForm({
  action,
  defaultValues,
}: {
  action: (data: any) => Promise<void>;
  defaultValues?: Partial<YarnFormValues>;
}) {
  const [values, setValues] = useState<YarnFormValues>({ ...emptyValues, ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update<K extends keyof YarnFormValues>(key: K, value: YarnFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action({
          ...values,
          countValue: Number(values.countValue),
          ply: Number(values.ply),
          standardCostPerKg: values.standardCostPerKg === "" ? null : Number(values.standardCostPerKg),
        });
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Count Value</label>
          <input type="number" step="0.1" required className="w-full rounded border px-3 py-2" value={values.countValue} onChange={(e) => update("countValue", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Count System</label>
          <select className="w-full rounded border px-3 py-2" value={values.countSystem} onChange={(e) => update("countSystem", e.target.value as any)}>
            {yarnCountSystems.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ply</label>
          <input type="number" min={1} className="w-full rounded border px-3 py-2" value={values.ply} onChange={(e) => update("ply", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Blend Ratio</label>
          <input placeholder="60% Cotton / 40% Polyester" className="w-full rounded border px-3 py-2" value={values.blendRatio} onChange={(e) => update("blendRatio", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Yarn Type</label>
          <input placeholder="Combed, Carded, OE, Compact" className="w-full rounded border px-3 py-2" value={values.yarnType} onChange={(e) => update("yarnType", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select className="w-full rounded border px-3 py-2" value={values.unit} onChange={(e) => update("unit", e.target.value)}>
            <option value="KG">KG</option>
            <option value="LB">LB</option>
            <option value="CONE">CONE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Standard Cost / KG</label>
          <input type="number" step="0.01" className="w-full rounded border px-3 py-2" value={values.standardCostPerKg} onChange={(e) => update("standardCostPerKg", e.target.value)} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={values.isActive} onChange={(e) => update("isActive", e.target.checked)} />
        Active
      </label>

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50">
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2 text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}