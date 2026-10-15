"use client";

import { useState, useTransition } from "react";

export default function DowntimeForm({
  machineId,
  action,
}: {
  machineId: string;
  action: (machineId: string, data: any) => Promise<void>;
}) {
  const [reasonCode, setReasonCode] = useState("");
  const [startTime, setStartTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await action(machineId, { reasonCode, startTime, remarks });
        setReasonCode("");
        setRemarks("");
      } catch (err: any) {
        setError(err?.message ?? "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
      {error && <p className="col-span-4 text-sm text-red-600">{error}</p>}

      <div>
        <label className="block text-xs font-medium mb-1">Reason</label>
        <input required placeholder="Power Failure, Yarn Breakage..." value={reasonCode} onChange={(e) => setReasonCode(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Start Time</label>
        <input required type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Remarks</label>
        <input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full rounded border px-2 py-1.5 text-sm" />
      </div>

      <div>
        <button disabled={isPending} className="w-full rounded bg-black text-white px-3 py-1.5 text-sm disabled:opacity-50">
          {isPending ? "Logging..." : "Log Downtime"}
        </button>
      </div>
    </form>
  );
}