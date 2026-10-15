'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Users, 
  Package, 
  Activity,
  Cpu,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Clock,
  ShieldAlert,
  Percent,
  Calendar,
  Layers3,
  TrendingUp,
  Inbox
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState<'ALL' | 'UNIT1' | 'UNIT2'>('ALL');
  const [timeRange, setTimeRange] = useState<'7D' | '30D'>('7D');
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  // Raw mock database representing different departments, orders, and compliance
  const activeOrders = [
    { id: 'WEV-2026-08', fabric: 'Premium Denim Fabric', target: '25,000 M', completed: '18,500 M', progress: 74, loom: 'Loom #12', status: 'RUNNING', eta: '2 days' },
    { id: 'SPN-2026-14', yarn: '30 Ne Combed Cotton', target: '10,000 KG', completed: '9,200 KG', progress: 92, machine: 'Ring Frame #3', status: 'RUNNING', eta: '5 hrs' },
    { id: 'WEV-2026-09', fabric: 'Organic Cotton Twill', target: '15,000 M', completed: '3,000 M', progress: 20, loom: 'Loom #04', status: 'SETUP', eta: '6 days' },
    { id: 'SPN-2026-15', yarn: '24 Ne Carded Blend', target: '8,000 KG', completed: '0 KG', progress: 0, machine: 'OE Rotor #1', status: 'PLANNED', eta: 'Starts tomorrow' }
  ];

  const qualityGrades = [
    { grade: 'Grade A (Premium Fabric)', percentage: 91.2, count: '382 rolls', color: 'bg-emerald-500' },
    { grade: 'Grade B (Minor Defect)', percentage: 6.8, count: '28 rolls', color: 'bg-amber-500' },
    { grade: 'Grade C (Major Defect)', percentage: 1.5, count: '6 rolls', color: 'bg-orange-500' },
    { grade: 'Reject (Scrap Yarn/Fabric)', percentage: 0.5, count: '2 rolls', color: 'bg-red-500' }
  ];

  const complianceAlerts = [
    { id: 1, type: 'CRITICAL', title: 'UFLPA Xinjiang Screening Alert', description: 'Raw material batch COT-XJ-098 matches UFLPA entity list. Customs presumption flag triggered.', date: '30 mins ago' },
    { id: 2, type: 'WARNING', title: 'CSDDD High Risk Supplier finding', description: 'Supplier TexSpun Yarns Ltd logged Severity 4, Likelihood 2 (Risk Score: 8) with no closed CAPA record.', date: '2 hrs ago' },
    { id: 3, type: 'INFO', title: 'AGEC Public Disclosure Ready', description: 'Annual repairability index for Cotton Twill (TEX-COTTON-02) recalculation is complete.', date: '1 day ago' }
  ];

  // Helper to filter KPIs based on Branch selection
  const getKPIs = () => {
    switch (selectedBranch) {
      case 'UNIT1': // Spinning Mill focus
        return [
          { title: 'Yarn Production Output', value: '32,450 KG', change: '+8.2%', isPositive: true, icon: Layers, desc: 'Month to date', href: '/dashboard/spinning-orders' },
          { title: 'Ring Frame Utilization', value: '94.8%', change: '+1.5%', isPositive: true, icon: Cpu, desc: '8 active machines', href: '/dashboard/machines' },
          { title: 'Raw Fiber Stock (Cotton)', value: '18,500 KG', change: '-4.2%', isPositive: false, icon: Package, desc: '12 days of backup', href: '/dashboard/fibers' },
          { title: 'Quality Grade A Rate', value: '96.2%', change: '+0.8%', isPositive: true, icon: Percent, desc: 'Spinning average', href: '/dashboard/quality' }
        ];
      case 'UNIT2': // Weaving Focus
        return [
          { title: 'Fabric Production Output', value: '48,200 M', change: '+12.4%', isPositive: true, icon: Activity, desc: 'Month to date', href: '/dashboard/weaving-orders' },
          { title: 'Air-Jet Loom Efficiency', value: '88.2%', change: '-2.1%', isPositive: false, icon: Cpu, desc: '14 active looms', href: '/dashboard/looms' },
          { title: 'Yarn Lot Stock (WIP)', value: '8,400 KG', change: '+15.1%', isPositive: true, icon: Package, desc: 'Sufficient warping supply', href: '/dashboard/yarns' },
          { title: 'Fabric Grade A Rate', value: '91.2%', change: '+1.1%', isPositive: true, icon: Percent, desc: 'Weaving rolls average', href: '/dashboard/quality' }
        ];
      case 'ALL':
      default:
        return [
          { title: 'Total Enterprise Revenue', value: '$248,930.50', change: '+20.1%', isPositive: true, icon: DollarSign, desc: 'Sales & invoices', href: '/dashboard/sales' },
          { title: 'Active Production Orders', value: '12 Orders', change: '+4.5%', isPositive: true, icon: Activity, desc: 'Across all factory units', href: '/dashboard/weaving-orders' },
          { title: 'Active Looms & Rings', value: '22 / 24 Running', change: '+9.2%', isPositive: true, icon: Cpu, desc: '91% facility capacity', href: '/dashboard/looms' },
          { title: 'Enterprise Compliance Rate', value: '96.8%', change: '-0.5%', isPositive: false, icon: ShieldAlert, desc: '1 critical UFLPA flag', href: '/dashboard/compliance' }
        ];
    }
  };

  // Raw coordinates for drawing custom SVG graphs of output trends
  // 7 days of Weaving Output (meters) & Spinning Output (kg)
  const productionChartData = timeRange === '7D' 
    ? [
        { day: 'Mon', weaving: 4500, spinning: 2100 },
        { day: 'Tue', weaving: 5200, spinning: 2400 },
        { day: 'Wed', weaving: 4800, spinning: 2250 },
        { day: 'Thu', weaving: 5900, spinning: 2600 },
        { day: 'Fri', weaving: 6300, spinning: 2800 },
        { day: 'Sat', weaving: 3200, spinning: 1500 },
        { day: 'Sun', weaving: 1200, spinning: 600 }
      ]
    : [
        { day: 'Wk 1', weaving: 25000, spinning: 12000 },
        { day: 'Wk 2', weaving: 28000, spinning: 13500 },
        { day: 'Wk 3', weaving: 31000, spinning: 14200 },
        { day: 'Wk 4', weaving: 32400, spinning: 15000 }
      ];

  const dismissAlert = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  return (
    <div className="space-y-8 fade-in">
      
      {/* Top Banner Info & Filter bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.05] pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Enterprise Overview</h2>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time status of spinning mill outputs, looms efficiency, product quality distributions, and ESG checkpoints.
          </p>
        </div>
        
        {/* Interactive Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Branch Picker */}
          <div className="bg-[#0a0a0a] border border-white/[0.05] p-1.5 rounded-xl flex gap-1">
            <button 
              onClick={() => setSelectedBranch('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedBranch === 'ALL' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              All Facilities
            </button>
            <button 
              onClick={() => setSelectedBranch('UNIT1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedBranch === 'UNIT1' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Unit-1 Spinning
            </button>
            <button 
              onClick={() => setSelectedBranch('UNIT2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedBranch === 'UNIT2' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Unit-2 Weaving
            </button>
          </div>

          {/* Time Picker */}
          <div className="bg-[#0a0a0a] border border-white/[0.05] p-1.5 rounded-xl flex gap-1">
            <button 
              onClick={() => setTimeRange('7D')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === '7D' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              7D
            </button>
            <button 
              onClick={() => setTimeRange('30D')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${timeRange === '30D' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      {/* Compliance / Risk banner alerts (Conditional display) */}
      {complianceAlerts.filter(a => !dismissedAlerts.includes(a.id)).length > 0 && (
        <div className="space-y-3">
          {complianceAlerts.filter(a => !dismissedAlerts.includes(a.id)).map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-2xl border flex items-start gap-4 transition-all relative overflow-hidden ${
                alert.type === 'CRITICAL' 
                  ? 'bg-red-500/5 border-red-500/20 text-red-200' 
                  : alert.type === 'WARNING'
                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                  : 'bg-violet-500/5 border-violet-500/20 text-violet-200'
              }`}
            >
              {/* Alert Glow */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                alert.type === 'CRITICAL' ? 'bg-red-500' : alert.type === 'WARNING' ? 'bg-amber-500' : 'bg-violet-500'
              }`} />
              
              <div className="p-1.5 bg-white/[0.02] border border-white/[0.05] rounded-xl mt-0.5 shrink-0">
                <AlertTriangle size={18} className={
                  alert.type === 'CRITICAL' ? 'text-red-400' : alert.type === 'WARNING' ? 'text-amber-400' : 'text-violet-400'
                } />
              </div>
              
              <Link href="/dashboard/compliance" className="flex-1 min-w-0 pr-6 group">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-white group-hover:text-violet-300 transition-colors">{alert.title}</span>
                  <span className="text-[10px] text-zinc-500">• {alert.date}</span>
                </div>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{alert.description}</p>
              </Link>

              <button 
                onClick={() => dismissAlert(alert.id)}
                className="absolute top-4 right-4 text-xs text-zinc-500 hover:text-zinc-300 font-semibold"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getKPIs().map((kpi, idx) => (
          <Link key={idx} href={kpi.href} className="bg-[#0a0a0a] border border-white/[0.05] p-6 rounded-2xl relative overflow-hidden group hover:border-violet-500/40 hover:bg-white/[0.02] transition-all block cursor-pointer">
            {/* Hover top highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-white/[0.03] rounded-xl border border-white/[0.05] shrink-0 group-hover:bg-violet-500/10 transition-colors">
                <kpi.icon size={20} className="text-zinc-400 group-hover:text-violet-300 transition-colors" />
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                kpi.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {kpi.isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {kpi.change}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 tracking-tight group-hover:text-violet-100 transition-colors">{kpi.value}</h3>
              <p className="text-zinc-400 text-xs font-semibold uppercase">{kpi.title}</p>
              <p className="text-zinc-500 text-[10px] mt-1">{kpi.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Production Output Chart - SVG Based (2 cols width) */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white">Production Output Trends</h3>
              <p className="text-xs text-zinc-500">Weaving output (meters) vs. Spinning output (KG)</p>
            </div>
            
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-violet-500" />
                <span className="text-zinc-300">Weaving (M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-fuchsia-500" />
                <span className="text-zinc-300">Spinning (KG)</span>
              </div>
            </div>
          </div>

          {/* Simple Custom SVG bar graph */}
          <div className="h-64 w-full relative flex items-end justify-between px-4 pb-6 pt-4 border-b border-white/[0.05]">
            
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-[0.03] py-4">
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
              <div className="border-b border-white w-full" />
            </div>

            {/* Custom Bar Elements */}
            {productionChartData.map((data, i) => {
              // scaling values to fit the height of the 256px chart container
              const weavingScale = timeRange === '7D' ? 0.03 : 0.006;
              const spinningScale = timeRange === '7D' ? 0.06 : 0.012;
              const wHeight = data.weaving * weavingScale;
              const sHeight = data.spinning * spinningScale;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center group relative z-10 mx-1">
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 bg-[#121212] border border-white/[0.1] rounded-lg p-2 text-[10px] text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-25 text-center min-w-[90px] shadow-2xl">
                    <p className="font-bold text-white">{data.day}</p>
                    <p className="text-violet-400">Weaving: {data.weaving.toLocaleString()} M</p>
                    <p className="text-fuchsia-400">Spinning: {data.spinning.toLocaleString()} KG</p>
                  </div>

                  <div className="flex items-end gap-1 w-full justify-center">
                    {/* Weaving Bar */}
                    <div 
                      style={{ height: `${wHeight}px` }}
                      className="w-4 sm:w-6 bg-gradient-to-t from-violet-600 to-violet-400 rounded-t-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] transition-all duration-500 hover:brightness-125" 
                    />
                    {/* Spinning Bar */}
                    <div 
                      style={{ height: `${sHeight}px` }}
                      className="w-4 sm:w-6 bg-gradient-to-t from-fuchsia-600 to-fuchsia-400 rounded-t-sm shadow-[0_0_15px_rgba(217,70,239,0.15)] transition-all duration-500 hover:brightness-125" 
                    />
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 font-bold mt-2">{data.day}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center text-xs text-zinc-500 mt-4 px-2">
            <span>Enterprise aggregate reporting</span>
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>Updated live 5 mins ago</span>
            </div>
          </div>
        </div>

        {/* Quality distribution cards / Donut indicators */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Fabric Quality Breakdown</h3>
            <p className="text-xs text-zinc-500">Output grading based on automated inspection rolls.</p>
          </div>

          <div className="space-y-4 my-6">
            {qualityGrades.map((q, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-zinc-300">{q.grade}</span>
                  <span className="text-zinc-400">{q.percentage}% <span className="text-zinc-500">({q.count})</span></span>
                </div>
                {/* Visual Progress bar */}
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${q.percentage}%` }}
                    className={`h-full rounded-full ${q.color} transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 size={15} className="text-violet-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-violet-300 leading-relaxed">
              Automated loom lasers flag weaving defects. Substandard rolls (Grade C & Reject) trigger immediate tension warnings in the looms registry.
            </p>
          </div>
        </div>

      </div>

      {/* Production Operations & Supply Chain Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Loom & Spinning Runs (WIP progress) */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/[0.05] rounded-2xl p-6">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Live Production Runs</h3>
              <p className="text-xs text-zinc-500">Active spinning and weaving orders on the factory floor</p>
            </div>
            <Link href="/dashboard/weaving-orders" className="text-xs text-violet-400 hover:text-violet-300 font-semibold cursor-pointer">View Schedule</Link>
          </div>

          <div className="space-y-4">
            {activeOrders.map((order) => (
              <Link 
                key={order.id} 
                href={order.id.startsWith('SPN') ? '/dashboard/spinning-orders' : '/dashboard/weaving-orders'}
                className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all text-xs space-y-3 block"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-200">{order.id}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 font-medium">{order.fabric || order.yarn}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-1">
                      <span>Target: {order.target}</span>
                      <span>Completed: {order.completed}</span>
                      <span>Resource: {order.loom || order.machine}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      order.status === 'RUNNING' ? 'bg-emerald-500/10 text-emerald-400' :
                      order.status === 'SETUP' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-zinc-500 block mt-1">ETA: {order.eta}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-500">
                    <span>Progress</span>
                    <span className="font-semibold text-zinc-300">{order.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      style={{ width: `${order.progress}%` }} 
                      className={`h-full rounded-full ${order.progress === 100 ? 'bg-emerald-500' : 'bg-violet-600'}`} 
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Warehouse Inventories & Raw Material Backups */}
        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">Warehouses Capacity</h3>
              <Layers3 size={16} className="text-zinc-500" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Raw Fiber Warehouse A</span>
                  <span className="text-zinc-200 font-semibold">72% <span className="text-zinc-500 text-[10px]">(85 tons)</span></span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-violet-500 h-1.5 rounded-full w-[72%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Yarn Store (WIP) B</span>
                  <span className="text-zinc-200 font-semibold">45% <span className="text-zinc-500 text-[10px]">(32 tons)</span></span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-fuchsia-500 h-1.5 rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Finished Fabric rolls warehouse</span>
                  <span className="text-zinc-200 font-semibold">82% <span className="text-zinc-500 text-[10px]">(140 rolls)</span></span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[82%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-400">Chemicals & Dyes store</span>
                  <span className="text-zinc-200 font-semibold">28% <span className="text-zinc-500 text-[10px]">(Critical levels)</span></span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full w-[28%]" />
                </div>
              </div>
            </div>
          </div>

          <Link href="/dashboard/purchase-orders" className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs block hover:bg-violet-500/15 hover:border-violet-500/40 transition-all group">
            <div className="flex items-start gap-2.5">
              <Clock size={16} className="text-violet-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-violet-300 group-hover:underline">Auto-restock forecast</p>
                <p className="text-[10px] text-violet-400/80 mt-1 leading-relaxed">
                  Dyes & Chemical inventory is running low. Purchase requisition PO-2026-98 is currently awaiting approval. Click to view.
                </p>
              </div>
            </div>
          </Link>
        </div>

      </div>

    </div>
  );
}