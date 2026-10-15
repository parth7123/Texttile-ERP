import Link from "next/link";
import { getPayrollRuns, generatePayrollRun } from "../actions";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default async function PayrollPage() {
  const runs = await getPayrollRuns();
  const now = new Date();

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Payroll Runs & Payslips</h1>
          <p className="text-xs text-gray-500 mt-1">Generate monthly payroll, calculate wages, and review employee payslips.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/hr" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Employees</Link>
          <Link href="/dashboard/hr/attendance" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Attendance</Link>
          <Link href="/dashboard/hr/leaves" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Leaves</Link>
          <Link href="/dashboard/hr/payroll" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Payroll Runs</Link>
          <Link href="/dashboard/hr/shifts" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Shifts</Link>
        </div>
      </div>

      <form action={generatePayrollRun} className="grid grid-cols-3 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Month</label>
          <select name="month" defaultValue={now.getMonth() + 1} className="w-full rounded border px-2 py-1.5 text-sm">
            {months.map((m, idx) => (<option key={m} value={idx + 1}>{m}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Year</label>
          <input name="year" type="number" defaultValue={now.getFullYear()} className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Generate / Refresh Run</button>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Period</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr></thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="px-4 py-2">{months[r.month - 1]} {r.year}</td>
              <td className="px-4 py-2">{r.totalAmount.toFixed(2)}</td>
              <td className="px-4 py-2">{r.status}</td>
              <td className="px-4 py-2 text-right"><Link href={`/dashboard/hr/payroll/${r.id}`} className="text-blue-600 hover:underline">Open</Link></td>
            </tr>
          ))}
          {runs.length === 0 && (<tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No payroll runs yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}