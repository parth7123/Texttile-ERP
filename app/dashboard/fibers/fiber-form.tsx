"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type FiberFormValues = {
  name: string;
  fiberType: string;
  grade: string;
  origin: string;
  micronaire: string;
  staple: string;
  unit: string;
  reorderLevel: string;
  isActive: boolean;
};

const emptyValues: FiberFormValues = {
  name: "",
  fiberType: "",
  grade: "",
  origin: "",
  micronaire: "",
  staple: "",
  unit: "KG",
  reorderLevel: "0",
  isActive: true,
};

export default function FiberForm({
  action,
  defaultValues,
}: {
  action: (data: any) => Promise<void>;
  defaultValues?: Partial<FiberFormValues>;
}) {
  const [values, setValues] = useState<FiberFormValues>({ ...emptyValues, ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update<K extends keyof FiberFormValues>(key: K, value: FiberFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action({
          ...values,
          micronaire: values.micronaire === "" ? null : Number(values.micronaire),
          staple: values.staple === "" ? null : Number(values.staple),
          reorderLevel: Number(values.reorderLevel),
        });
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          className="w-full rounded border px-3 py-2"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fiber Type</label>
          <input
            className="w-full rounded border px-3 py-2"
            placeholder="Cotton, Polyester, Viscose..."
            value={values.fiberType}
            onChange={(e) => update("fiberType", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Grade</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={values.grade}
            onChange={(e) => update("grade", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input
            className="w-full rounded border px-3 py-2"
            value={values.origin}
            onChange={(e) => update("origin", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Micronaire</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded border px-3 py-2"
            value={values.micronaire}
            onChange={(e) => update("micronaire", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Staple (mm)</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded border px-3 py-2"
            value={values.staple}
            onChange={(e) => update("staple", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select
            className="w-full rounded border px-3 py-2"
            value={values.unit}
            onChange={(e) => update("unit", e.target.value)}
          >
            <option value="KG">KG</option>
            <option value="LB">LB</option>
            <option value="BALE">BALE</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Reorder Level (KG)</label>
          <input
            type="number"
            step="0.01"
            className="w-full rounded border px-3 py-2"
            value={values.reorderLevel}
            onChange={(e) => update("reorderLevel", e.target.value)}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
        />
        Active
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border px-4 py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}