import Link from "next/link";
import { getShifts, createShift } from "../actions";

export default async function ShiftsPage() {
  const shifts = await getShifts();

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Shift Roster Management</h1>
          <p className="text-xs text-gray-500 mt-1">Configure shifts, work hours, and factory rotational timetables.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/hr" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Employees</Link>
          <Link href="/dashboard/hr/attendance" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Attendance</Link>
          <Link href="/dashboard/hr/leaves" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Leaves</Link>
          <Link href="/dashboard/hr/payroll" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Payroll Runs</Link>
          <Link href="/dashboard/hr/shifts" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Shifts</Link>
        </div>
      </div>

      <form action={createShift} className="grid grid-cols-4 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Name</label>
          <input name="name" placeholder="A Shift" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Start</label>
          <input name="startTime" placeholder="06:00" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">End</label>
          <input name="endTime" placeholder="14:00" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Shift</button>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Name</th><th className="px-4 py-2">Start</th><th className="px-4 py-2">End</th></tr></thead>
        <tbody>
          {shifts.map((s) => (<tr key={s.id} className="border-t"><td className="px-4 py-2">{s.name}</td><td className="px-4 py-2">{s.startTime}</td><td className="px-4 py-2">{s.endTime}</td></tr>))}
          {shifts.length === 0 && (<tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No shifts yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}