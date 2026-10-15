"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type YarnOption = { id: string; countValue: number; countSystem: string; yarnType: string | null };

type FabricFormValues = {
  name: string;
  weaveType: string;
  warpYarnId: string;
  weftYarnId: string;
  warpCount: string;
  weftCount: string;
  epi: string;
  ppi: string;
  width: string;
  gsm: string;
  unit: string;
  standardCostPerUnit: string;
  isActive: boolean;
};

function emptyValues(yarns: YarnOption[]): FabricFormValues {
  return {
    name: "",
    weaveType: "",
    warpYarnId: yarns[0]?.id ?? "",
    weftYarnId: yarns[0]?.id ?? "",
    warpCount: "",
    weftCount: "",
    epi: "",
    ppi: "",
    width: "",
    gsm: "",
    unit: "METER",
    standardCostPerUnit: "",
    isActive: true,
  };
}

export default function FabricForm({
  action,
  yarns,
  defaultValues,
}: {
  action: (data: any) => Promise<void>;
  yarns: YarnOption[];
  defaultValues?: Partial<FabricFormValues>;
}) {
  const [values, setValues] = useState<FabricFormValues>({ ...emptyValues(yarns), ...defaultValues });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function update<K extends keyof FabricFormValues>(key: K, value: FabricFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function label(y: YarnOption) {
    return `${y.countValue} ${y.countSystem}${y.yarnType ? ` (${y.yarnType})` : ""}`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action({
          ...values,
          epi: Number(values.epi),
          ppi: Number(values.ppi),
          width: Number(values.width),
          gsm: values.gsm === "" ? null : Number(values.gsm),
          standardCostPerUnit: values.standardCostPerUnit === "" ? null : Number(values.standardCostPerUnit),
        });
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input required placeholder="Poplin 40x40 133x72 58 inch" className="w-full rounded border px-3 py-2" value={values.name} onChange={(e) => update("name", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weave Type</label>
          <select className="w-full rounded border px-3 py-2" value={values.weaveType} onChange={(e) => update("weaveType", e.target.value)} required>
            <option value="">Select...</option>
            <option value="Plain">Plain</option>
            <option value="Twill">Twill</option>
            <option value="Satin">Satin</option>
            <option value="Dobby">Dobby</option>
            <option value="Jacquard">Jacquard</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Warp Yarn</label>
          <select required className="w-full rounded border px-3 py-2" value={values.warpYarnId} onChange={(e) => update("warpYarnId", e.target.value)}>
            {yarns.map((y) => (
              <option key={y.id} value={y.id}>{label(y)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weft Yarn</label>
          <select required className="w-full rounded border px-3 py-2" value={values.weftYarnId} onChange={(e) => update("weftYarnId", e.target.value)}>
            {yarns.map((y) => (
              <option key={y.id} value={y.id}>{label(y)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Warp Count</label>
          <input className="w-full rounded border px-3 py-2" value={values.warpCount} onChange={(e) => update("warpCount", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weft Count</label>
          <input className="w-full rounded border px-3 py-2" value={values.weftCount} onChange={(e) => update("weftCount", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">EPI</label>
          <input type="number" required className="w-full rounded border px-3 py-2" value={values.epi} onChange={(e) => update("epi", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">PPI</label>
          <input type="number" required className="w-full rounded border px-3 py-2" value={values.ppi} onChange={(e) => update("ppi", e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Width (in)</label>
          <input type="number" step="0.01" required className="w-full rounded border px-3 py-2" value={values.width} onChange={(e) => update("width", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">GSM</label>
          <input type="number" step="0.01" className="w-full rounded border px-3 py-2" value={values.gsm} onChange={(e) => update("gsm", e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select className="w-full rounded border px-3 py-2" value={values.unit} onChange={(e) => update("unit", e.target.value)}>
            <option value="METER">METER</option>
            <option value="YARD">YARD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Std Cost / Unit</label>
          <input type="number" step="0.01" className="w-full rounded border px-3 py-2" value={values.standardCostPerUnit} onChange={(e) => update("standardCostPerUnit", e.target.value)} />
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
        <button type="button" onClick={() => router.back()} className="rounded border px-4 py-2 text-sm">Cancel</button>
      </div>
    </form>
  );
}