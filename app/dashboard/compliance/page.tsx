'use client';

import { useState } from 'react';
import { 
  Shield, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Search, 
  FileText, 
  Layers, 
  Globe, 
  Activity, 
  Clock, 
  User, 
  Building, 
  ChevronRight, 
  Info, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  PlusCircle,
  Check,
  RotateCcw
} from 'lucide-react';

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'agec' | 'csrd' | 'csddd' | 'lksg' | 'uflpa'>('agec');
  const [notification, setNotification] = useState<string | null>(null);

  // MOCK DATA STORES FOR INTERACTION
  // 1. AGEC Products compliance
  const [agecProducts, setAgecProducts] = useState([
    { id: 'PRD-001', name: 'Premium Denim Fabric', durabilityScore: 8.5, repairabilityIndex: 7.2, recycledPercent: 40, hazardousSubstances: 'None', countryOfManufacture: 'Bangladesh', stepDetail: 'Spinning & Weaving in Dhaka' },
    { id: 'PRD-002', name: 'Organic Cotton Twill', durabilityScore: 9.0, repairabilityIndex: 8.0, recycledPercent: 60, hazardousSubstances: 'None', countryOfManufacture: 'India', stepDetail: 'Ginning & Spinning in Gujarat' },
    { id: 'PRD-003', name: 'Recycled Polyester Blended Yarn', durabilityScore: 7.8, repairabilityIndex: 6.5, recycledPercent: 85, hazardousSubstances: 'Antimony Trioxide (<0.01%)', countryOfManufacture: 'China', stepDetail: 'Extrusion in Zhejiang' },
  ]);

  // 2. CSRD double materiality topics
  const [csrdMateriality, setCsrdMateriality] = useState([
    { topic: 'E1: Climate Change', impactType: 'Double Materiality', significance: 'High', status: 'ESRS Data points aligned' },
    { topic: 'E2: Pollution (Water & Air)', impactType: 'Double Materiality', significance: 'High', status: 'Effluent limits tracked' },
    { topic: 'E4: Biodiversity & Ecosystems', impactType: 'Impact Materiality', significance: 'Medium', status: 'Supply chain audit pending' },
    { topic: 'S1: Own Workforce (Social)', impactType: 'Double Materiality', significance: 'High', status: 'Wage tracking active' },
    { topic: 'G1: Business Conduct (Governance)', impactType: 'Financial Materiality', significance: 'High', status: 'Anti-corruption policy signed' }
  ]);

  // Scope 3 calculator state
  const [scope3Input, setScope3Input] = useState({ supplierWeight: 5000, materialType: 'cotton', transportKm: 1200 });
  const [scope3Result, setScope3Result] = useState<number | null>(null);

  // 3. CSDDD Supplier Risk & Policy State
  const [supplierRisks, setSupplierRisks] = useState([
    { id: 'SUP-001', name: 'Apex Electronics Mfg', severity: 2, likelihood: 3, riskScore: 6, status: 'Risk Assessment Done', capaStatus: 'None Required', tier: 'Tier 2' },
    { id: 'SUP-002', name: 'TexSpun Yarns Ltd', severity: 4, likelihood: 2, riskScore: 8, status: 'High Water Risk', capaStatus: 'CAPA-2026-01 (In Progress)', tier: 'Tier 1' },
    { id: 'SUP-003', name: 'Zhejiang Synthetics', severity: 5, likelihood: 1, riskScore: 5, status: 'Chemical Handling Warning', capaStatus: 'CAPA-2026-02 (Closed)', tier: 'Tier 2' },
  ]);

  const [policyVersion, setPolicyVersion] = useState({ version: 'v3.2', updated: '2026-01-15', annualFlag: 'Valid' });
  const [grievanceLogs, setGrievanceLogs] = useState([
    { id: 'GRV-001', date: '2026-05-12', supplier: 'TexSpun Yarns Ltd', category: 'Working Conditions', detail: 'Overtime hours mismatch reported by local labor representative.', status: 'Investigating' },
    { id: 'GRV-002', date: '2026-02-28', supplier: 'Zhejiang Synthetics', category: 'Chemical Safety', detail: 'Improper storage of finishing chemicals reported during internal audit.', status: 'Closed' },
  ]);

  // CSDDD CAPA Form
  const [newCapa, setNewCapa] = useState({ supplierId: 'SUP-002', severity: 3, likelihood: 3, description: '' });

  // 4. LkSG records
  const [lksgReports, setLksgReports] = useState([
    { id: 'REP-2025', name: 'LkSG BAFA Compliance Report 2025', status: 'Submitted', submissionDate: '2025-11-20' },
    { id: 'REP-2026', name: 'LkSG BAFA Compliance Report 2026 (Draft)', status: 'Drafting', submissionDate: 'Pending' }
  ]);

  // 5. UFLPA tracking
  const [uflpaScreenings, setUflpaScreenings] = useState([
    { id: 'FAC-01', name: 'Urumqi Cotton Ginning Co.', region: 'Xinjiang, China', matches: 'UFLPA Entity List Match Found', action: 'Flagged - Imports Blocked', status: 'CRITICAL WARNING' },
    { id: 'FAC-02', name: 'Gujarat Organic Ginning', region: 'Gujarat, India', matches: 'Clear', action: 'Approved Source', status: 'Compliant' },
    { id: 'FAC-03', name: 'Thanh Cong Textile Mill', region: 'Ho Chi Minh, Vietnam', matches: 'Clear', action: 'Approved Source', status: 'Compliant' }
  ]);

  const [uflpaCertificateUploaded, setUflpaCertificateUploaded] = useState(true);

  // TRIGGER NOTIFICATION SYSTEM
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleExport = (framework: string) => {
    triggerNotification(`Generating audit-ready ${framework} export package... Downloading started.`);
  };

  // Scope 3 calculation: Cotton has ~5.8 kg CO2e/kg, Polyester ~6.4, Transport ~0.15 kg CO2e/ton-km
  const calculateScope3 = () => {
    const materialFactor = scope3Input.materialType === 'cotton' ? 5.8 : 6.4;
    const materialEmissions = scope3Input.supplierWeight * materialFactor;
    // transport = weight (tons) * km * factor
    const transportEmissions = (scope3Input.supplierWeight / 1000) * scope3Input.transportKm * 0.15;
    const total = Math.round(materialEmissions + transportEmissions);
    setScope3Result(total);
    triggerNotification(`Scope 3 emissions updated based on primary supplier data.`);
  };

  const addCapaRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRisk = supplierRisks.map(s => {
      if (s.id === newCapa.supplierId) {
        return {
          ...s,
          severity: newCapa.severity,
          likelihood: newCapa.likelihood,
          riskScore: newCapa.severity * newCapa.likelihood,
          capaStatus: `CAPA-${new Date().getFullYear()}-03 (Open: ${newCapa.description})`
        };
      }
      return s;
    });
    setSupplierRisks(newRisk);
    triggerNotification(`Supplier risk recalculated and Corrective Action (CAPA) logged.`);
    setNewCapa({ supplierId: 'SUP-002', severity: 3, likelihood: 3, description: '' });
  };

  return (
    <div className="space-y-6 relative pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-violet-600/90 text-white border border-violet-400/30 px-6 py-3 rounded-2xl backdrop-blur-md shadow-2xl flex items-center gap-3 animate-slide-in">
          <ShieldCheck size={18} className="text-violet-200" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-violet-400 text-xs font-semibold uppercase tracking-wider">
            <Shield size={14} /> Regulatory & ESG Hub
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">Compliance Dashboard</h2>
          <p className="text-zinc-400 text-sm mt-1">Cross-border regulatory tracking, supply chain mappings, and audit evidence trails.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleExport('Global Master')}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] rounded-xl text-zinc-300 hover:text-white text-sm font-medium transition-all"
          >
            <Download size={15} /> Full Audit Export
          </button>
        </div>
      </div>

      {/* Overall Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0a0a0a] border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase">AGEC SKU Disclosure</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">100%</p>
            <p className="text-zinc-500 text-[11px] mt-1">All 3 active SKUs sheet-ready</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-emerald-400" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase">CSRD Scope 3 Align</p>
            <p className="text-2xl font-bold text-violet-400 mt-1">Active</p>
            <p className="text-zinc-500 text-[11px] mt-1">Supplier portal inputs mapping</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-violet-400" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase">CSDDD Supplier Risk</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">Medium</p>
            <p className="text-zinc-500 text-[11px] mt-1">1 Supplier CAPA in progress</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-amber-400" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-white/[0.05] p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-semibold uppercase">UFLPA Xinjiang Screening</p>
            <p className="text-2xl font-bold text-red-500 mt-1">1 Warning</p>
            <p className="text-zinc-500 text-[11px] mt-1">Entity List match blocked</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/[0.05] flex overflow-x-auto gap-2">
        <button 
          onClick={() => setActiveTab('agec')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === 'agec' ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          1. AGEC (France Circularity)
        </button>
        <button 
          onClick={() => setActiveTab('csrd')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === 'csrd' ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          2. CSRD (EU Sustainability)
        </button>
        <button 
          onClick={() => setActiveTab('csddd')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === 'csddd' ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          3. CSDDD (EU Due Diligence)
        </button>
        <button 
          onClick={() => setActiveTab('lksg')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === 'lksg' ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          4. LkSG (German Supply Chain)
        </button>
        <button 
          onClick={() => setActiveTab('uflpa')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === 'uflpa' ? 'border-violet-500 text-violet-400 bg-violet-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
        >
          5. UFLPA (US Forced Labor)
        </button>
      </div>

      {/* Main Tab content container */}
      <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-2xl p-6">
        
        {/* ======================= TABS 1: AGEC ======================= */}
        {activeTab === 'agec' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">AGEC (French Circular Economy Law)</h3>
                <p className="text-xs text-zinc-400 mt-1">Targets product durability, repairability indices, and raw material recycled content per SKU.</p>
              </div>
              <button 
                onClick={() => handleExport('AGEC Product Sheet')}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <Download size={13} /> Export AGEC Disclosure Sheets
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product catalog durability overview */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-zinc-300">Registered SKU Circularity Parameters</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-white/[0.05] rounded-xl overflow-hidden">
                    <thead className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] border-b border-white/[0.05]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">SKU Name</th>
                        <th className="px-4 py-3 font-semibold">Durability (1-10)</th>
                        <th className="px-4 py-3 font-semibold">Repairability (1-10)</th>
                        <th className="px-4 py-3 font-semibold">Recycled content</th>
                        <th className="px-4 py-3 font-semibold">Haz. Substances</th>
                        <th className="px-4 py-3 font-semibold">Traceability Origin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {agecProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-3 font-medium text-zinc-200">
                            <div>{p.name}</div>
                            <span className="text-[10px] text-zinc-500">{p.id}</span>
                          </td>
                          <td className="px-4 py-3 text-zinc-300 font-bold">{p.durabilityScore}</td>
                          <td className="px-4 py-3 text-zinc-300 font-bold">{p.repairabilityIndex}</td>
                          <td className="px-4 py-3 text-emerald-400 font-bold">{p.recycledPercent}%</td>
                          <td className="px-4 py-3 text-zinc-400">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${p.hazardousSubstances === 'None' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {p.hazardousSubstances === 'None' ? 'No' : 'Yes'}
                            </span>
                            {p.hazardousSubstances !== 'None' && <div className="text-[9px] text-zinc-500 mt-1">{p.hazardousSubstances}</div>}
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            <div className="flex items-center gap-1"><Globe size={11} className="text-zinc-500" /> {p.countryOfManufacture}</div>
                            <span className="text-[9px] text-zinc-600 block">{p.stepDetail}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Scope & Audit logic info */}
              <div className="space-y-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-violet-400 flex items-center gap-1.5">
                  <Info size={14} /> AGEC Audit Logic
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  France Circular Economy rules require digital customer access to product attributes. Field-level data is entered per product SKU and verified via supplier-uploaded declarations.
                </p>
                <div className="pt-2 space-y-2 border-t border-white/[0.05]">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Target Sector:</span>
                    <span className="text-zinc-300 font-semibold">Textile & Apparel</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Traceability Rule:</span>
                    <span className="text-zinc-300 font-semibold">Disclose country of main steps</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">Public Access:</span>
                    <span className="text-emerald-400 font-semibold">Via QR code / sheet</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-violet-500/5 rounded-xl border border-violet-500/10 flex items-start gap-2.5">
                  <ShieldCheck size={16} className="text-violet-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-violet-300 leading-relaxed">
                    You can update individual product scores directly from the <a href="/dashboard/products" className="underline font-semibold text-white">Products Catalog page</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TABS 2: CSRD ======================= */}
        {activeTab === 'csrd' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">CSRD (Corporate Sustainability Reporting Directive)</h3>
                <p className="text-xs text-zinc-400 mt-1">EU mandate requiring reporting of double materiality, governance transparency, and Scope 3 supply chain footprint.</p>
              </div>
              <button 
                onClick={() => handleExport('CSRD ESRS Audit Trail')}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <Download size={13} /> Export ESRS CSRD Package
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Materiality topics */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-zinc-300">CSRD Double Materiality Assessment Status</h4>
                  <span className="text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">Year 2026 Active</span>
                </div>
                <div className="space-y-2">
                  {csrdMateriality.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all">
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{topic.topic}</p>
                        <span className="text-[9px] text-violet-400">{topic.impactType}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${topic.significance === 'High' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                          {topic.significance} significance
                        </span>
                        <p className="text-[9px] text-zinc-500 mt-1">{topic.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emissions & Social Indicators Calculator */}
              <div className="space-y-6">
                <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-200">Scope 3 Emissions Estimator</h4>
                  <p className="text-[11px] text-zinc-500">Calculates CO2e for textile shipping & materials (cotton/polyester).</p>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Raw Fiber Quantity (KG)</label>
                      <input 
                        type="number" 
                        value={scope3Input.supplierWeight}
                        onChange={(e) => setScope3Input({...scope3Input, supplierWeight: Number(e.target.value)})}
                        className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Fiber Type</label>
                      <select 
                        value={scope3Input.materialType} 
                        onChange={(e) => setScope3Input({...scope3Input, materialType: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        <option value="cotton">Organic/Standard Cotton</option>
                        <option value="polyester">Polyester Blend</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Supply Chain Transport Distance (KM)</label>
                      <input 
                        type="number" 
                        value={scope3Input.transportKm}
                        onChange={(e) => setScope3Input({...scope3Input, transportKm: Number(e.target.value)})}
                        className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white" 
                      />
                    </div>
                    <button 
                      onClick={calculateScope3}
                      className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Calculate Scope 3 CO2
                    </button>
                    {scope3Result !== null && (
                      <div className="mt-3 p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl text-center">
                        <span className="text-[10px] text-zinc-400 uppercase block">Total Scope 3 Carbon</span>
                        <span className="text-lg font-bold text-violet-400">{scope3Result.toLocaleString()} kg CO2e</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-300">Social & Governance Flags</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/[0.02]">
                      <span className="text-zinc-500">Living Wage compliance</span>
                      <span className="text-emerald-400 font-semibold">100% Active</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/[0.02]">
                      <span className="text-zinc-500">Freedom of Association</span>
                      <span className="text-emerald-400 font-semibold">100% Signed</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Whistleblower hotlines</span>
                      <span className="text-emerald-400 font-semibold">Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TABS 3: CSDDD ======================= */}
        {activeTab === 'csddd' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">CSDDD (Corporate Sustainability Due Diligence Directive)</h3>
                <p className="text-xs text-zinc-400 mt-1">Requires companies to enforce human rights and environmental due diligence across Tier 1, 2, and upstream partners.</p>
              </div>
              <button 
                onClick={() => handleExport('CSDDD Audit Package')}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <Download size={13} /> Export CSDDD Audit Package
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Supplier Risk Score Matrix */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-zinc-300">Supplier Risk Metrics (Severity × Likelihood)</h4>
                  <span className="text-[10px] text-zinc-500">Standalone scores rejected; findings must link to CAPAs.</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-white/[0.05] rounded-xl">
                    <thead className="bg-white/[0.02] text-zinc-400 uppercase text-[10px] border-b border-white/[0.05]">
                      <tr>
                        <th className="px-4 py-3">Supplier</th>
                        <th className="px-4 py-3">Tier</th>
                        <th className="px-4 py-3 text-center">Severity</th>
                        <th className="px-4 py-3 text-center">Likelihood</th>
                        <th className="px-4 py-3 text-center">Risk Score</th>
                        <th className="px-4 py-3">CAPA Status / Finding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {supplierRisks.map((s, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.01]">
                          <td className="px-4 py-3 font-semibold text-zinc-200">{s.name}</td>
                          <td className="px-4 py-3 text-zinc-400">{s.tier}</td>
                          <td className="px-4 py-3 text-center text-zinc-300 font-medium">{s.severity}</td>
                          <td className="px-4 py-3 text-center text-zinc-300 font-medium">{s.likelihood}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              s.riskScore >= 8 ? 'bg-red-500/10 text-red-400' :
                              s.riskScore >= 5 ? 'bg-amber-500/10 text-amber-400' :
                              'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {s.riskScore}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-zinc-400">
                            <div className="text-zinc-200 font-medium text-[11px]">{s.capaStatus}</div>
                            <span className="text-[9px] text-zinc-500">{s.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Grievance Log */}
                <div className="space-y-3 pt-4 border-t border-white/[0.05]">
                  <h4 className="text-sm font-semibold text-zinc-300">Grievance Mechanism Log</h4>
                  <div className="space-y-2">
                    {grievanceLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl text-xs flex justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-zinc-200">{log.id}</span>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400 font-medium">{log.supplier}</span>
                            <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">{log.category}</span>
                          </div>
                          <p className="text-zinc-400 text-[11px]">{log.detail}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${log.status === 'Closed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {log.status}
                          </span>
                          <p className="text-[9px] text-zinc-500 mt-1">{log.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Policy controller and Risk assessor */}
              <div className="space-y-6">
                
                {/* Due diligence policy info */}
                <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-300">Policy Document Controller</h4>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-white/[0.03]">
                    <span className="text-zinc-500">Active Version:</span>
                    <span className="text-white font-mono font-semibold">{policyVersion.version}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 border-b border-white/[0.03]">
                    <span className="text-zinc-500">Last Annual Update:</span>
                    <span className="text-zinc-300">{policyVersion.updated}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-zinc-500">Audit Status:</span>
                    <span className="text-emerald-400 font-semibold">{policyVersion.annualFlag}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setPolicyVersion({ version: 'v3.3', updated: new Date().toISOString().split('T')[0], annualFlag: 'Valid' });
                      triggerNotification('Due Diligence Policy updated and logged in version controller.');
                    }}
                    className="w-full mt-2 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.05] text-zinc-200 text-xs rounded-lg transition-all"
                  >
                    Flag Annual Policy Review
                  </button>
                </div>

                {/* Recalculate Risk & CAPA logger form */}
                <div className="bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-300">Log Corrective Action (CAPA)</h4>
                  <form onSubmit={addCapaRecord} className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">Target Supplier</label>
                      <select 
                        value={newCapa.supplierId} 
                        onChange={(e) => setNewCapa({...newCapa, supplierId: e.target.value})}
                        className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white"
                      >
                        {supplierRisks.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">Severity (1-5)</label>
                        <input 
                          type="number" min="1" max="5" 
                          value={newCapa.severity}
                          onChange={(e) => setNewCapa({...newCapa, severity: Number(e.target.value)})}
                          className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 mb-1">Likelihood (1-5)</label>
                        <input 
                          type="number" min="1" max="5" 
                          value={newCapa.likelihood}
                          onChange={(e) => setNewCapa({...newCapa, likelihood: Number(e.target.value)})}
                          className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">CAPA Description / Exception Reason</label>
                      <textarea 
                        required
                        value={newCapa.description}
                        onChange={(e) => setNewCapa({...newCapa, description: e.target.value})}
                        placeholder="Log corrective measures or remediation actions taken..."
                        className="w-full bg-zinc-900 border border-white/[0.05] rounded-lg px-3 py-1.5 text-xs text-white h-16 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all"
                    >
                      Assess Risk & Apply CAPA
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TABS 4: LKSG ======================= */}
        {activeTab === 'lksg' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">LkSG (German Supply Chain Act)</h3>
                <p className="text-xs text-zinc-400 mt-1">Requires annual risk reports pre-formatted for digital submission to the Federal Office for Economic Affairs (BAFA).</p>
              </div>
              <button 
                onClick={() => handleExport('LkSG BAFA XML submission file')}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <Download size={13} /> Export BAFA XML Package
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* BAFA reports logs & self declarations */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-semibold text-zinc-300">BAFA Submission Archives & Declarations</h4>
                <div className="space-y-3">
                  {lksgReports.map((r, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.01] border border-white/[0.05] hover:bg-white/[0.03]">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-white/[0.05] flex items-center justify-center">
                          <FileSpreadsheet size={16} className="text-violet-400" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{r.name}</p>
                          <span className="text-[10px] text-zinc-500">Submission Code: {r.id}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${r.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-violet-500/10 text-violet-400'}`}>
                          {r.status}
                        </span>
                        <p className="text-[9px] text-zinc-500 mt-1">Date: {r.submissionDate}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
                  <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wide">Preventive Training Registry</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">Documented training records of tier 1 and tier 2 suppliers regarding code of conduct compliance.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="bg-[#0f0f0f] border border-white/[0.05] p-3 rounded-xl">
                      <span className="text-[10px] text-zinc-500 block">Supplier CoC Training</span>
                      <span className="text-xs text-zinc-200 font-semibold">TexSpun Operations</span>
                      <span className="text-[9px] text-emerald-400 block mt-1">Completed: April 2026</span>
                    </div>
                    <div className="bg-[#0f0f0f] border border-white/[0.05] p-3 rounded-xl">
                      <span className="text-[10px] text-zinc-500 block">Supplier CoC Training</span>
                      <span className="text-xs text-zinc-200 font-semibold">Apex Logistics Team</span>
                      <span className="text-[9px] text-emerald-400 block mt-1">Completed: June 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* LkSG Audit Rules */}
              <div className="space-y-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-violet-400 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> LkSG Evidence Rules
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  The German Supply Chain Act demands structured remediation logs, annual BAFA report submission, and signed supplier self-declarations regarding occupational safety and freedom of association.
                </p>
                <div className="pt-3 space-y-2 border-t border-white/[0.05] text-[11px]">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <CheckCircle2 size={13} className="text-emerald-400" /> Compliant Remediation Log
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <CheckCircle2 size={13} className="text-emerald-400" /> Signed Self-Declarations
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <CheckCircle2 size={13} className="text-emerald-400" /> Pre-formatted BAFA Digital Form
                  </div>
                </div>
                <button 
                  onClick={() => triggerNotification('LkSG complaints procedure log updated. No unresolved issues.')}
                  className="w-full py-2 bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-zinc-300 rounded-lg text-xs font-semibold mt-4 transition-all"
                >
                  Verify Complaints Log Status
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TABS 5: UFLPA ======================= */}
        {activeTab === 'uflpa' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">UFLPA (Uyghur Forced Labor Prevention Act)</h3>
                <p className="text-xs text-zinc-400 mt-1">US import rules enforcing a rebuttable presumption that any materials sourced wholly or in part from Xinjiang are tainted by forced labor.</p>
              </div>
              <button 
                onClick={() => handleExport('UFLPA Chain-of-Custody package')}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]"
              >
                <Download size={13} /> Export UFLPA Package
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Interactive Supply Chain Map & Presumption Status */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Supply Chain Traceability & Xinjiang Nexus Check</h4>
                  
                  {/* Visual SVG Sourcing Map */}
                  <div className="bg-[#030303] border border-white/[0.05] p-5 rounded-2xl">
                    <div className="flex flex-col sm:flex-row justify-around items-center gap-4 text-center">
                      
                      {/* Step 1: Raw Fiber */}
                      <div className="p-3 bg-zinc-900 border border-white/[0.05] rounded-xl w-full max-w-[150px] relative">
                        <span className="text-[9px] text-zinc-500 uppercase block">1. Raw Fiber</span>
                        <p className="text-xs text-white font-bold mt-1">Organic Cotton</p>
                        <span className="text-[10px] text-emerald-400 block font-medium mt-1">Origin: Gujarat, IN</span>
                        <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Clear of Xinjiang</div>
                      </div>

                      <ChevronRight size={18} className="text-zinc-600 rotate-90 sm:rotate-0" />

                      {/* Step 2: Yarn spinning */}
                      <div className="p-3 bg-zinc-900 border border-white/[0.05] rounded-xl w-full max-w-[150px] relative">
                        <span className="text-[9px] text-zinc-500 uppercase block">2. Yarn Spinning</span>
                        <p className="text-xs text-white font-bold mt-1">TexSpun Spinning</p>
                        <span className="text-[10px] text-zinc-400 block font-medium mt-1">Location: Dhaka, BD</span>
                        <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Entity Clear</div>
                      </div>

                      <ChevronRight size={18} className="text-zinc-600 rotate-90 sm:rotate-0" />

                      {/* Step 3: Finished fabric */}
                      <div className="p-3 bg-[#110e1a] border border-violet-500/20 rounded-xl w-full max-w-[150px] relative">
                        <span className="text-[9px] text-violet-400 uppercase block">3. Fabric Weaving</span>
                        <p className="text-xs text-white font-bold mt-1">Denim Mills</p>
                        <span className="text-[10px] text-violet-300 block font-medium mt-1">Location: Chittagong</span>
                        <div className="mt-2 text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">Certified Compliant</div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Entity list screenings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-300">Official UFLPA Entity List Screening Status</h4>
                  <div className="space-y-2">
                    {uflpaScreenings.map((facility, idx) => (
                      <div key={idx} className="p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-zinc-200">{facility.name}</p>
                          <span className="text-[10px] text-zinc-500">{facility.region}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            facility.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {facility.status}
                          </span>
                          <p className="text-[9px] text-zinc-500 mt-1">{facility.matches}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legal Overrides & Evidence declarations */}
              <div className="space-y-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl">
                <h4 className="text-sm font-semibold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle size={15} /> Rebuttable Presumption
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Imports containing cotton will be detained by US Customs unless "clear and convincing evidence" proves they have zero raw material ties to Xinjiang.
                </p>

                <div className="pt-4 border-t border-white/[0.05] space-y-4 text-xs">
                  <div>
                    <label className="flex items-center gap-2.5 text-zinc-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={uflpaCertificateUploaded} 
                        onChange={(e) => {
                          setUflpaCertificateUploaded(e.target.checked);
                          triggerNotification(e.target.checked ? 'Accredited third-party audits linked to current fabric lots.' : 'Audit certificate unlinked.');
                        }}
                        className="rounded border-zinc-700 bg-zinc-950 text-violet-600 focus:ring-violet-500" 
                      />
                      <span>Transaction Certificate uploaded</span>
                    </label>
                    <p className="text-[10px] text-zinc-500 ml-7 mt-0.5">Signed Importer of Record Declaration attached</p>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-white/[0.05] rounded-xl space-y-2">
                    <span className="text-[9px] text-zinc-500 block uppercase font-semibold">Audit Record Linkageage</span>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">SGS Third-party Audit</span>
                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">DNA Cotton Marker testing</span>
                      <span className="text-emerald-400 font-bold">VERIFIED</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 flex items-start gap-2.5">
                  <Info size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-300 leading-relaxed">
                    Zero raw cotton, viscose, or polyester components are allowed to originate in Xinjiang. Screening is run against the UFLPA Entity List on every PO creation.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
