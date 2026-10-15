import Link from "next/link";
import { getChartOfAccounts, getBankAccounts, createBankAccount } from "../actions";

export default async function BankAccountsPage() {
  const [banks, accounts] = await Promise.all([getBankAccounts(), getChartOfAccounts()]);
  const assetAccounts = accounts.filter((a) => a.accountType === "ASSET");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Bank Accounts</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/accounting" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Chart of Accounts</Link>
          <Link href="/dashboard/accounting/journal" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Journal Entries</Link>
          <Link href="/dashboard/accounting/banks" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Bank Accounts</Link>
        </div>
      </div>

      <form action={createBankAccount} className="grid grid-cols-4 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Ledger Account</label>
          <select name="accountId" required className="w-full rounded border px-2 py-1.5 text-sm">
            {assetAccounts.map((a) => (<option key={a.id} value={a.id}>{a.code} — {a.name}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Bank Name</label>
          <input name="bankName" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Account Number</label>
          <input name="accountNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Branch</label>
          <input name="branchName" className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div className="col-span-4">
          <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Bank Account</button>
        </div>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Bank</th><th className="px-4 py-2">Account #</th><th className="px-4 py-2">Ledger</th><th className="px-4 py-2">Balance</th></tr></thead>
        <tbody>
          {banks.map((b) => (
            <tr key={b.id} className="border-t"><td className="px-4 py-2">{b.bankName}</td><td className="px-4 py-2">{b.accountNumber}</td><td className="px-4 py-2">{b.account.name}</td><td className="px-4 py-2">{b.currentBalance.toFixed(2)}</td></tr>
          ))}
          {banks.length === 0 && (<tr><td colSpan={4} className="px-4 py-6 text-center text-gray-400">No bank accounts yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}