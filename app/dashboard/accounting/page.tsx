import Link from "next/link";
import { getChartOfAccounts, createAccount } from "./actions";

const accountTypes = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

export default async function ChartOfAccountsPage() {
  const accounts = await getChartOfAccounts();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Chart of Accounts</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/accounting" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Chart of Accounts</Link>
          <Link href="/dashboard/accounting/journal" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Journal Entries</Link>
          <Link href="/dashboard/accounting/banks" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Bank Accounts</Link>
        </div>
      </div>

      <form action={createAccount} className="grid grid-cols-4 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Code</label>
          <input name="code" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Name</label>
          <input name="name" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Type</label>
          <select name="accountType" className="w-full rounded border px-2 py-1.5 text-sm">
            {accountTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Parent</label>
          <select name="parentId" className="w-full rounded border px-2 py-1.5 text-sm">
            <option value="">-</option>
            {accounts.map((a) => (<option key={a.id} value={a.id}>{a.code} — {a.name}</option>))}
          </select>
        </div>
        <div className="col-span-4">
          <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Add Account</button>
        </div>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Code</th><th className="px-4 py-2">Name</th><th className="px-4 py-2">Type</th></tr></thead>
        <tbody>
          {accounts.map((a) => (
            <tr key={a.id} className="border-t"><td className="px-4 py-2 font-medium">{a.code}</td><td className="px-4 py-2">{a.name}</td><td className="px-4 py-2">{a.accountType}</td></tr>
          ))}
          {accounts.length === 0 && (<tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No accounts yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}