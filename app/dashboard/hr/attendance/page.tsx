import Link from "next/link";
import { getAttendanceForDate, markAttendance, getShifts } from "../actions";

const attendanceStatuses = ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE", "HOLIDAY", "WEEKEND"];

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string }> | { date?: string } }) {
  const sp = await Promise.resolve(searchParams);
  const date = sp?.date ? new Date(sp.date) : new Date(new Date().toDateString());
  const { employees, records } = await getAttendanceForDate(date);
  const shifts = await getShifts();
  const recordMap = new Map(records.map((r) => [r.employeeId, r]));

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Attendance Tracking</h1>
          <p className="text-xs text-gray-500 mt-1">Log daily shift check-ins, leaves, and overtime hours.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/hr" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Employees</Link>
          <Link href="/dashboard/hr/attendance" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Attendance</Link>
          <Link href="/dashboard/hr/leaves" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Leaves</Link>
          <Link href="/dashboard/hr/payroll" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Payroll Runs</Link>
          <Link href="/dashboard/hr/shifts" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Shifts</Link>
        </div>
      </div>

      <form className="mb-4">
        <input name="date" type="date" defaultValue={date.toISOString().slice(0, 10)} className="rounded border px-3 py-2 text-sm" />
        <button className="ml-2 rounded border px-3 py-2 text-sm">Go</button>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Employee</th><th className="px-4 py-2">Department</th><th className="px-4 py-2">Status</th></tr></thead>
        <tbody>
          {employees.map((e) => {
            const record = recordMap.get(e.id);
            return (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2">{e.firstName} {e.lastName}</td>
                <td className="px-4 py-2">{e.department}</td>
                <td className="px-4 py-2">
                  <form action={markAttendance} className="flex gap-2 items-center">
                    <input type="hidden" name="employeeId" value={e.id} />
                    <input type="hidden" name="date" value={date.toISOString().slice(0, 10)} />
                    <select name="status" defaultValue={record?.status ?? "PRESENT"} className="rounded border px-2 py-1 text-sm">
                      {attendanceStatuses.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <select name="shiftId" defaultValue={record?.shiftId ?? ""} className="rounded border px-2 py-1 text-sm">
                      <option value="">-</option>
                      {shifts.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                    </select>
                    <button className="text-blue-600 hover:underline text-xs">Save</button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}