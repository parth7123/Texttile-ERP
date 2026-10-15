import Link from "next/link";
import { notFound } from "next/navigation";
import { getPayrollRunDetail, markPayslipPaid } from "../../actions";

export default async function PayrollRunDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const run = await getPayrollRunDetail(id);
  if (!run) notFound();

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payroll — {run.month}/{run.year}</h1>
        <Link href="/dashboard/hr/payroll" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">← Back to Payroll Runs</Link>
      </div>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Employee</th><th className="px-4 py-2">Basic</th><th className="px-4 py-2">Piece Rate</th><th className="px-4 py-2">Net Pay</th><th className="px-4 py-2">Status</th><th className="px-4 py-2"></th></tr></thead>
        <tbody>
          {run.payslips.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="px-4 py-2">{p.employee.firstName} {p.employee.lastName}</td>
              <td className="px-4 py-2">{p.basicSalary.toFixed(2)}</td>
              <td className="px-4 py-2">{p.pieceRatePay.toFixed(2)}</td>
              <td className="px-4 py-2 font-medium">{p.netPay.toFixed(2)}</td>
              <td className="px-4 py-2">{p.paidAt ? "Paid" : "Unpaid"}</td>
              <td className="px-4 py-2 text-right">
                {!p.paidAt && (
                  <form action={markPayslipPaid.bind(null, p.id)}>
                    <button className="text-green-700 hover:underline text-xs">Mark Paid</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}