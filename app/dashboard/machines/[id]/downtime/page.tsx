import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { getMachineDowntime, logMachineDowntime, resolveDowntime } from "./actions";
import DowntimeForm from "./downtime-form";
import { getSessionOrgId } from "@/lib/session";

export default async function MachineDowntimePage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const machine = await prisma.machine.findFirst({ where: { id, organizationId } });
  if (!machine) notFound();

  const logs = await getMachineDowntime(machine.id);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-1">{machine.name} — Downtime</h1>
      <p className="text-sm text-gray-500 mb-6">Status: {machine.status}</p>

      <DowntimeForm machineId={machine.id} action={logMachineDowntime} />

      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Reason</th>
              <th className="px-4 py-2">Start</th>
              <th className="px-4 py-2">End</th>
              <th className="px-4 py-2">Duration (min)</th>
              <th className="px-4 py-2">Remarks</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t">
                <td className="px-4 py-2 font-medium">{log.reasonCode}</td>
                <td className="px-4 py-2">{log.startTime.toLocaleString()}</td>
                <td className="px-4 py-2">{log.endTime ? log.endTime.toLocaleString() : "-"}</td>
                <td className="px-4 py-2">{log.durationMin ?? "-"}</td>
                <td className="px-4 py-2">{log.remarks ?? "-"}</td>
                <td className="px-4 py-2 text-right">
                  {!log.endTime && (
                    <form action={resolveDowntime.bind(null, machine.id, log.id)}>
                      <button className="text-green-700 hover:underline text-xs">Mark Resolved</button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-400">No downtime logged.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}