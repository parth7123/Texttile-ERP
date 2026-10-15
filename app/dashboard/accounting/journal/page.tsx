import Link from "next/link";
import { getChartOfAccounts, getJournalEntries, createJournalEntry } from "../actions";

export default async function JournalPage() {
  const [entries, accounts] = await Promise.all([getJournalEntries(), getChartOfAccounts()]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Journal Entries</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/accounting" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Chart of Accounts</Link>
          <Link href="/dashboard/accounting/journal" className="rounded-lg bg-black text-white px-3 py-1.5 text-xs font-medium">Journal Entries</Link>
          <Link href="/dashboard/accounting/banks" className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-gray-50">Bank Accounts</Link>
        </div>
      </div>

      <form action={createJournalEntry} className="space-y-3 p-4 border rounded bg-gray-50">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Entry Number</label>
            <input name="entryNumber" required className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Description</label>
            <input name="description" className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
        </div>

        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="grid grid-cols-3 gap-3">
            <select name="accountId" className="w-full rounded border px-2 py-1.5 text-sm">
              <option value="">-</option>
              {accounts.map((a) => (<option key={a.id} value={a.id}>{a.code} — {a.name}</option>))}
            </select>
            <input name="debit" type="number" step="0.01" placeholder="Debit" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
            <input name="credit" type="number" step="0.01" placeholder="Credit" defaultValue="0" className="w-full rounded border px-2 py-1.5 text-sm" />
          </div>
        ))}
        <p className="text-xs text-gray-500">Fill in the lines you need; leave unused rows blank. Debits must equal credits.</p>
        <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Post Entry</button>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Entry #</th><th className="px-4 py-2">Date</th><th className="px-4 py-2">Lines</th></tr></thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-t align-top">
              <td className="px-4 py-2 font-medium">{e.entryNumber}</td>
              <td className="px-4 py-2">{e.entryDate.toLocaleDateString()}</td>
              <td className="px-4 py-2">
                {e.lines.map((l) => (
                  <div key={l.id}>{l.account.name}: Dr {l.debit.toFixed(2)} / Cr {l.credit.toFixed(2)}</div>
                ))}
              </td>
            </tr>
          ))}
          {entries.length === 0 && (<tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400">No entries yet.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}