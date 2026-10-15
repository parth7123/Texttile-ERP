// app/dashboard/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Building2, 
  ShoppingCart, 
  Users, 
  Briefcase, 
  Truck, 
  UserCog, 
  Key, 
  History, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu,
  Shield,
  Layers,
  Disc,
  Grid,
  Anchor,
  Kanban,
  Cpu,
  FileSpreadsheet,
  PlayCircle,
  Activity,
  ClipboardList,
  Receipt,
  ShoppingBag,
  DollarSign,
  Landmark,
  ShieldCheck,
  Bell
} from 'lucide-react';

const menuGroups = [
  {
    title: 'Core ERP',
    items: [
      { icon: Home, label: 'Dashboard', href: '/dashboard' },
      { icon: Package, label: 'Products', href: '/dashboard/products' },
      { icon: Building2, label: 'Warehouses', href: '/dashboard/warehouses' },
      { icon: Truck, label: 'Suppliers', href: '/dashboard/suppliers' },
      { icon: Briefcase, label: 'Customers', href: '/dashboard/customers' },
    ]
  },
  {
    title: 'Textile Production',
    items: [
      { icon: Layers, label: 'Fibers Sourcing', href: '/dashboard/fibers' },
      { icon: Disc, label: 'Yarns Master', href: '/dashboard/yarns' },
      { icon: Grid, label: 'Fabrics Master', href: '/dashboard/fabrics' },
      { icon: Anchor, label: 'Warp Beams', href: '/dashboard/warp-beams' },
      { icon: Kanban, label: 'Looms Registry', href: '/dashboard/looms' },
      { icon: Cpu, label: 'Machines Registry', href: '/dashboard/machines' },
      { icon: FileSpreadsheet, label: 'BOMs / Recipes', href: '/dashboard/boms' },
      { icon: PlayCircle, label: 'Spinning Orders', href: '/dashboard/spinning-orders' },
      { icon: Activity, label: 'Weaving Orders', href: '/dashboard/weaving-orders' },
    ]
  },
  {
    title: 'Financials & Sales',
    items: [
      { icon: ShoppingCart, label: 'Sales Registry', href: '/dashboard/sales' },
      { icon: ClipboardList, label: 'Sales Orders', href: '/dashboard/sales-orders' },
      { icon: Receipt, label: 'Invoices', href: '/dashboard/invoices' },
      { icon: ShoppingBag, label: 'Purchase Orders', href: '/dashboard/purchase-orders' },
      { icon: DollarSign, label: 'Accounting Ledger', href: '/dashboard/accounting' },
    ]
  },
  {
    title: 'HR & Quality Assurance',
    items: [
      { icon: Users, label: 'Employees List', href: '/dashboard/employees' },
      { icon: Landmark, label: 'HR / Payroll', href: '/dashboard/hr' },
      { icon: ShieldCheck, label: 'Quality Control', href: '/dashboard/quality' },
    ]
  },
  {
    title: 'System & Governance',
    items: [
      { icon: Shield, label: 'Compliance & ESG', href: '/dashboard/compliance' },
      { icon: UserCog, label: 'System Users', href: '/dashboard/users' },
      { icon: Key, label: 'Roles / RBAC', href: '/dashboard/roles' },
      { icon: History, label: 'Audit Logs', href: '/dashboard/audit' },
      { icon: BarChart3, label: 'Reports', href: '/dashboard/reports' },
      { icon: Settings, label: 'System Settings', href: '/dashboard/settings' },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-violet-500/30">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-72' : 'w-20'
        } bg-[#0a0a0a] border-r border-white/[0.05] transition-all duration-300 ease-in-out flex flex-col relative z-20`}
      >
        <div className="h-16 flex items-center gap-3 px-6 border-b border-white/[0.05] shrink-0">
          <div className="min-w-[36px] h-9 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <span className="font-bold text-white text-lg leading-none">E</span>
          </div>
          {sidebarOpen && (
            <h1 className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 whitespace-nowrap overflow-hidden">
              Textile ERP
            </h1>
          )}
        </div>

        <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              {sidebarOpen && (
                <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                  {group.title}
                </h3>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative ${
                      isActive 
                        ? 'bg-violet-500/10 text-violet-300' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-500 rounded-r-full" />
                    )}
                    
                    <item.icon 
                      size={18} 
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'
                      }`} 
                    />
                    {sidebarOpen && (
                      <span className="font-medium text-xs whitespace-nowrap overflow-hidden transition-opacity">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-white/[0.05] shrink-0">
          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl transition-all duration-200 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 group">
            <LogOut size={20} className="shrink-0 text-zinc-500 group-hover:text-red-400 transition-colors" />
            {sidebarOpen && <span className="font-medium text-sm whitespace-nowrap">Logout</span>}
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

        <header className="h-16 border-b border-white/[0.05] bg-[#030303]/70 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-10">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 -ml-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/system/notifications" 
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.05] transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#030303]" />
            </Link>

            <Link href="/dashboard/settings" className="flex items-center gap-4 cursor-pointer group" title="Account Settings">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">JYOT PP</p>
                <p className="text-xs text-zinc-500">CTO • Acme Corp</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-full flex items-center justify-center font-medium text-sm text-white ring-2 ring-transparent group-hover:ring-violet-500/30 transition-all shadow-md">
                JP
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative z-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}