"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loomTypes, machineStatuses } from "@/lib/validations/machine";

type Option = { id: string; name: string };

type LoomFormValues = {
  name: string;
  loomType: (typeof loomTypes)[number];
  branchId: string;
  width: string;
  manufacturer: string;
  installedAt: string;
  status: (typeof machineStatuses)[number];
};

function emptyValues(): LoomFormValues {
  return { name: "", loomType: "AIR_JET", branchId: "", width: "", manufacturer: "", installedAt: "", status: "RUNNING" };
}

export default function LoomForm({
  action,
  branches,
  defaultValues,
}: {
  action: (data: any) => Promise<void>;
  branches: Option[];
  defaultValues?: Partial<LoomFormValues>;
}) {
  const [values, setValues] = useState<LoomFormValues>({ ...emptyValues(), ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update<K extends keyof LoomFormValues>(key: K, value: LoomFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action({
          ...values,
          width: values.width === "" ? null : Number(values.width),
          installedAt: values.installedAt === "" ? null : values.installedAt,
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
        <input required placeholder="Loom #12" className="w-full rounded border px-3 py-2" value={values.name} onChange={(e) => update("name", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Loom Type</label>
          <select className="w-full rounded border px-3 py-2" value={values.loomType} onChange={(e) => update("loomType", e.target.value as any)}>
            {loomTypes.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Branch</label>
          <select className="w-full rounded border px-3 py-2" value={values.branchId} onChange={(e) => update("branchId", e.target.value)}>
            <option value="">-</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reed Width (in)</label>
          <input type="number" step="0.01" className="w-full rounded border px-3 py-2" value={values.width} onChange={(e) => update("width", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Manufacturer</label>
          <input className="w-full rounded border px-3 py-2" value={values.manufacturer} onChange={(e) => update("manufacturer", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Installed On</label>
          <input type="date" className="w-full rounded border px-3 py-2" value={values.installedAt} onChange={(e) => update("installedAt", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select className="w-full rounded border px-3 py-2" value={values.status} onChange={(e) => update("status", e.target.value as any)}>
          {machineStatuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={isPending} className="rounded bg-black text-white px-4 py-2 text-sm disabled:opacity-50">
          {isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}