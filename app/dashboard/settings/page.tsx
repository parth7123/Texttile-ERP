import { Building2, Bell, Shield, Sliders, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getOrganizationDetails, updateOrganizationDetails } from '../system/actions';

export default async function SettingsPage() {
  const org = await getOrganizationDetails();

  return (
    <div className="space-y-6 max-w-4xl fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h2>
        <p className="text-zinc-400 text-sm mt-1">Manage your enterprise profile, base currencies, and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <nav className="w-full md:w-64 space-y-1.5 shrink-0">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-violet-500/10 text-violet-300 font-medium text-sm border border-violet-500/20">
            <Building2 size={18} /> Organization Info
          </Link>
          <Link href="/dashboard/roles" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] font-medium text-sm transition-colors">
            <Shield size={18} /> Roles & Permissions
          </Link>
          <Link href="/dashboard/system/notifications" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] font-medium text-sm transition-colors">
            <Bell size={18} /> Notifications Inbox
          </Link>
          <Link href="/dashboard/system/settings" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02] font-medium text-sm transition-colors">
            <Sliders size={18} /> System Parameters
          </Link>
        </nav>

        {/* Settings Content Area */}
        <div className="flex-1 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Company Profile</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Primary multi-tenant enterprise data and contact details</p>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <CheckCircle size={12} /> Active Tenant
            </span>
          </div>
          
          <form action={updateOrganizationDetails} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Company Name</label>
                <input 
                  type="text" 
                  name="name"
                  defaultValue={org?.name ?? "Acme Corporation"} 
                  required
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Contact Email</label>
                <input 
                  type="email" 
                  name="email"
                  defaultValue={org?.email ?? "hello@acmecorp.com"} 
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="text" 
                  name="phone"
                  defaultValue={org?.phone ?? "+880 1711-234567"} 
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Base Currency</label>
                <input 
                  type="text" 
                  defaultValue={org?.baseCurrency ?? "BDT"} 
                  disabled
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl px-4 py-2.5 text-sm text-zinc-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Registered Address</label>
              <textarea 
                rows={3}
                name="address"
                defaultValue={org?.address ?? "Level 7, Gulshan Avenue, Dhaka 1212, Bangladesh"} 
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/[0.05]">
              <span className="text-xs text-zinc-500">Tenant Slug: <span className="font-mono text-zinc-400">{org?.slug ?? "acme-corp"}</span></span>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}