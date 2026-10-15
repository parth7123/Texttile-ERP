import Link from "next/link";
import { getEmployees, getEmployeeFormOptions, createEmployee } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-500",
    ON_LEAVE: "bg-yellow-100 text-yellow-700",
    TERMINATED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default async function HRPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [employees, { branches, roles }] = await Promise.all([
    getEmployees(q),
    getEmployeeFormOptions(),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">HR & Payroll Management</h1>
          <p className="text-xs text-gray-500 mt-1">Manage workforce, shift rosters, attendance records, and monthly payroll runs.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/hr" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Employees</Link>
          <Link href="/dashboard/hr/attendance" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Attendance</Link>
          <Link href="/dashboard/hr/leaves" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Leaves</Link>
          <Link href="/dashboard/hr/payroll" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Payroll Runs</Link>
          <Link href="/dashboard/hr/shifts" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Shifts</Link>
        </div>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by name, code, or department..."
          className="w-full max-w-sm rounded border px-3 py-2 text-sm"
        />
      </form>

      {/* Create form */}
      <form
        action={createEmployee}
        className="mb-6 grid grid-cols-1 gap-3 rounded border bg-gray-50 p-4 sm:grid-cols-3 lg:grid-cols-6 items-end"
      >
        <div>
          <label className="mb-1 block text-xs font-medium">Employee Code</label>
          <input
            name="employeeCode"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">First Name</label>
          <input
            name="firstName"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Last Name</label>
          <input
            name="lastName"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Phone</label>
          <input
            name="phone"
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Department</label>
          <input
            name="department"
            required
            placeholder="Spinning, Weaving..."
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Designation</label>
          <input
            name="designation"
            required
            placeholder="Operator, Supervisor..."
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Employment Type</label>
          <select
            name="employmentType"
            defaultValue="PERMANENT"
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="PERMANENT">Permanent</option>
            <option value="CONTRACT">Contract</option>
            <option value="DAILY_WAGE">Daily Wage</option>
            <option value="APPRENTICE">Apprentice</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Wage Type</label>
          <select
            name="wageType"
            defaultValue="MONTHLY"
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="DAILY">Daily</option>
            <option value="PIECE_RATE">Piece Rate</option>
            <option value="HOURLY">Hourly</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Basic Salary</label>
          <input
            name="basicSalary"
            type="number"
            step="0.01"
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Piece Rate</label>
          <input
            name="pieceRate"
            type="number"
            step="0.01"
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Branch</label>
          <select
            name="branchId"
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="">-</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Role</label>
          <select
            name="roleId"
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="">-</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-6">
          <button className="rounded bg-black px-3 py-1.5 text-sm text-white">
            Add Employee
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Designation</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="px-4 py-2 font-medium">{e.employeeCode}</td>
                <td className="px-4 py-2">
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/dashboard/hr/${e.id}`}
                  >
                    {e.firstName} {e.lastName}
                  </a>
                </td>
                <td className="px-4 py-2">{e.department}</td>
                <td className="px-4 py-2">{e.designation}</td>
                <td className="px-4 py-2">{e.employmentType.replace("_", " ")}</td>
                <td className="px-4 py-2">{e.branch?.name ?? "-"}</td>
                <td className="px-4 py-2">
                  <StatusBadge status={e.status} />
                </td>
                <td className="px-4 py-2 text-right">
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/dashboard/hr/${e.id}`}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No employees yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}