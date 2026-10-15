import { getSettings, upsertSetting } from "../actions";

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Organization Settings</h1>

      <form action={upsertSetting} className="grid grid-cols-3 gap-3 items-end mb-6 p-4 border rounded bg-gray-50">
        <div>
          <label className="block text-xs font-medium mb-1">Key</label>
          <input name="key" required placeholder="invoice_footer_text" className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Value</label>
          <input name="value" required className="w-full rounded border px-2 py-1.5 text-sm" />
        </div>
        <button className="rounded bg-black text-white px-3 py-1.5 text-sm">Save Setting</button>
      </form>

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-50 text-left"><tr><th className="px-4 py-2">Key</th><th className="px-4 py-2">Value</th></tr></thead>
        <tbody>
          {settings.map((s) => (<tr key={s.id} className="border-t"><td className="px-4 py-2 font-mono text-xs">{s.key}</td><td className="px-4 py-2">{s.value}</td></tr>))}
          {settings.length === 0 && (<tr><td colSpan={2} className="px-4 py-6 text-center text-gray-400">No settings configured.</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}