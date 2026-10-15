import { getInvoices, getInvoiceFormOptions, createInvoice } from "./actions";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PAID: "bg-green-100 text-green-700",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-700",
    UNPAID: "bg-gray-200 text-gray-700",
    OVERDUE: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-400 line-through",
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

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const [invoices, { salesOrders }] = await Promise.all([
    getInvoices(q),
    getInvoiceFormOptions(),
  ]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Sales Invoices</h1>
      </div>

      {/* Search */}
      <form className="mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by invoice number..."
          className="w-full max-w-sm rounded border px-3 py-2 text-sm"
        />
      </form>

      {/* Create form */}
      <form
        action={createInvoice}
        className="mb-6 grid grid-cols-1 gap-3 rounded border bg-gray-50 p-4 sm:grid-cols-3 lg:grid-cols-6 items-end"
      >
        <div className="lg:col-span-2">
          <label className="mb-1 block text-xs font-medium">Sales Order</label>
          <select
            name="salesOrderId"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="">Select order</option>
            {salesOrders.map((so) => (
              <option key={so.id} value={so.id}>
                {so.soNumber} — {so.customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Invoice #</label>
          <input
            name="invoiceNumber"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Invoice Date</label>
          <input
            name="invoiceDate"
            type="date"
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Due Date</label>
          <input
            name="dueDate"
            type="date"
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium">Total Amount</label>
          <input
            name="totalAmount"
            type="number"
            step="0.01"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>

        <div className="lg:col-span-6">
          <button className="rounded bg-black px-3 py-1.5 text-sm text-white">
            Create Invoice
          </button>
        </div>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Invoice #</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Sales Order</th>
              <th className="px-4 py-2">Invoice Date</th>
              <th className="px-4 py-2">Due Date</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Paid</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-t">
                <td className="px-4 py-2 font-medium">
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/dashboard/invoices/${inv.id}`}
                  >
                    {inv.invoiceNumber}
                  </a>
                </td>
                <td className="px-4 py-2">{inv.customer.name}</td>
                <td className="px-4 py-2">{inv.salesOrder.soNumber}</td>
                <td className="px-4 py-2">
                  {new Date(inv.invoiceDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  {inv.dueDate
                    ? new Date(inv.dueDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2">
                  {inv.currency} {inv.totalAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  {inv.currency} {inv.paidAmount.toFixed(2)}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-2 text-right">
                  <a
                    className="text-blue-600 hover:underline"
                    href={`/dashboard/invoices/${inv.id}`}
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No invoices yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}