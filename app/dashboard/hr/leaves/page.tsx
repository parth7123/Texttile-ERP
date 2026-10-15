import Link from "next/link";
import { prisma } from "@/lib/prisma";

import { getLeaveRequests, requestLeave, decideLeave } from "../actions";
import { getSessionOrgId } from "@/lib/session";

const leaveTypes = ["CASUAL", "SICK", "EARNED", "MATERNITY", "UNPAID"];

export default async function LeavesPage() {
  const organizationId = await getSessionOrgId();
  const [leaves, employees] = await Promise.all([
    getLeaveRequests(),
    prisma.employee.findMany({ where: { organizationId, status: "ACTIVE" } }),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Leave Requests & Approvals</h1>
          <p className="text-xs text-gray-500 mt-1">Submit leave requests and process managerial approvals.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/hr" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Employees</Link>
          <Link href="/dashboard/hr/attendance" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Attendance</Link>
          <Link href="/dashboard/hr/leaves" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Leaves</Link>
          <Link href="/dashboard/hr/payroll" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Payroll Runs</Link>
          <Link href="/dashboard/hr/shifts" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Shifts</Link>
        </div>
      </div>

      <form action={requestLeave} className="grid grid-cols-5 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Employee</label>
          <select name="employeeId" required className="w-full rounded border px-2 py-1.5 text-sm">
            {employees.map((e) => (<option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select name="leaveType" className="w-full rounded border px-2 py-1.5 text-sm">
            {leaveTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Start</label>
          <input name="startDate" type="date" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">End</label>
          <input name="endDate" type="date" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Request</button>
        </div>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Employee</th><th className="px-4 py-2">Type</th><th className="px-4 py-2">Dates</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr></thead>
        <tbody>
          {leaves.map((l) => (
            <tr key={l.id} className="border-t">
              <td className="px-4 py-2">{l.employee.firstName} {l.employee.lastName}</td>
              <td className="px-4 py-2">{l.leaveType}</td>
              <td className="px-4 py-2">{l.startDate.toLocaleDateString()} â€“ {l.endDate.toLocaleDateString()}</td>
              <td className="px-4 py-2">{l.status}</td>
              <td className="px-4 py-2 text-right">
                {l.status === "PENDING" && (
                  <>
                    <form action={decideLeave.bind(null, l.id, "APPROVED")} className="inline"><button className="text-green-700 hover:underline text-xs mr-2">Approve</button></form>
                    <form action={decideLeave.bind(null, l.id, "REJECTED")} className="inline"><button className="text-red-600 hover:underline text-xs">Reject</button></form>
                  </>
                )}
              </td>
            </tr>
          ))}
          {leaves.length === 0 && (<tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No leave requests yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
