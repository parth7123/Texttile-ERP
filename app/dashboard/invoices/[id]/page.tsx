import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { recordReceipt } from "@/app/dashboard/sales-orders/actions";
import { getSessionOrgId } from "@/lib/session";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const { id } = await Promise.resolve(params);
  const organizationId = await getSessionOrgId();
  const invoice = await prisma.salesInvoice.findFirst({
    where: { id, customer: { organizationId } },
    include: { customer: true, items: true, receipts: true },
  });
  if (!invoice) notFound();

  const bankAccounts = await prisma.bankAccount.findMany({});

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{invoice.invoiceNumber}</h1>
        <p className="text-sm text-gray-500">{invoice.customer.name} · {invoice.status} · Paid {invoice.paidAmount.toFixed(2)} / {invoice.totalAmount.toFixed(2)} {invoice.currency}</p>
      </div>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Description</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Rate</th><th className="px-4 py-2">Amount</th></tr></thead>
        <tbody>
          {invoice.items.map((i) => (
            <tr key={i.id} className="border-t"><td className="px-4 py-2">{i.description}</td><td className="px-4 py-2">{i.quantity} {i.unit}</td><td className="px-4 py-2">{i.rate.toFixed(2)}</td><td className="px-4 py-2">{i.amount.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>

      {invoice.status !== "PAID" && (
        <section>
          <h2 className="font-medium mb-3">Record Payment</h2>
          <form action={recordReceipt.bind(null, invoice.id)} className="grid grid-cols-3 gap-3 items-end p-4 border rounded bg-gray-50">
            <div>
              <label className="block text-xs font-medium mb-1">Amount</label>
              <input name="amount" type="number" step="0.01" required className="w-full rounded border px-2 py-1.5 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Bank Account</label>
              <select name="bankAccountId" className="w-full rounded border px-2 py-1.5 text-sm">
                <option value="">-</option>
                {bankAccounts.map((b) => (<option key={b.id} value={b.id}>{b.bankName} — {b.accountNumber}</option>))}
              </select>
            </div>
            <div>
              <button className="rounded bg-green-700 text-white px-3 py-1.5 text-sm">Record Receipt</button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="font-medium mb-3">Payment History</h2>
        {invoice.receipts.map((r) => (
          <p key={r.id} className="text-sm border-t py-2">{r.receiptDate.toLocaleDateString()} — {r.amount.toFixed(2)} via {r.method}</p>
        ))}
        {invoice.receipts.length === 0 && <p className="text-gray-400 text-sm">No payments recorded.</p>}
      </section>
    </div>
  );
}