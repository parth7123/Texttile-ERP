'use client';

import { useState } from 'react';
import { Truck, Search, MoreHorizontal, Edit, Trash2, X, Plus, Mail, Phone, MapPin } from 'lucide-react';

const initialSuppliers = [
  { id: 'SUP-001', name: 'TexSpun Yarns Ltd', email: 'sales@texspunyarns.co.in', phone: '+91 22 4910 2030', address: 'Gujarat, India', riskSeverity: 4, riskLikelihood: 2, lksgCodeSigned: true, uflpaStatus: 'Compliant', tierLevel: 'Tier 2' },
  { id: 'SUP-002', name: 'Apex Dyes & Chemicals', email: 'info@apexdyes.com', phone: '+880 2 9845522', address: 'Dhaka, Bangladesh', riskSeverity: 2, riskLikelihood: 3, lksgCodeSigned: true, uflpaStatus: 'Compliant', tierLevel: 'Tier 1' },
  { id: 'SUP-003', name: 'Zhejiang Synthetic Fibers', email: 'export@zjsynthetic.cn', phone: '+86 571 8820 1100', address: 'Zhejiang, China', riskSeverity: 5, riskLikelihood: 1, lksgCodeSigned: false, uflpaStatus: 'Flagged - Xinjiang cotton match', tierLevel: 'Tier 2' },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', email: '', phone: '', address: '', 
    riskSeverity: 2, riskLikelihood: 2, lksgCodeSigned: false, uflpaStatus: 'Compliant', tierLevel: 'Tier 1' 
  });

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({ 
      name: '', email: '', phone: '', address: '',
      riskSeverity: 2, riskLikelihood: 2, lksgCodeSigned: false, uflpaStatus: 'Compliant', tierLevel: 'Tier 1'
    });
    setIsModalOpen(true);
  };

  const handleEditClick = (s: any) => {
    setEditingId(s.id);
    setFormData({ 
      name: s.name, 
      email: s.email, 
      phone: s.phone, 
      address: s.address,
      riskSeverity: s.riskSeverity ?? 2,
      riskLikelihood: s.riskLikelihood ?? 2,
      lksgCodeSigned: s.lksgCodeSigned ?? false,
      uflpaStatus: s.uflpaStatus ?? 'Compliant',
      tierLevel: s.tierLevel ?? 'Tier 1'
    });
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClick = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    setActiveDropdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setSuppliers(suppliers.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      const newId = `SUP-00${suppliers.length + 1}`;
      setSuppliers([{ ...formData, id: newId }, ...suppliers]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Suppliers</h2>
          <p className="text-zinc-400 text-sm mt-1">Manage vendor details and supply chain contacts.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-2xl overflow-visible">
        <div className="p-4 border-b border-white/[0.05]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-violet-500/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-white/[0.02] border-b border-white/[0.05]">
              <tr>
                <th className="px-6 py-4 font-medium">Vendor Name</th>
                <th className="px-6 py-4 font-medium">Contact Details</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium text-violet-400 font-semibold">Regulatory Compliance</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/[0.05] flex items-center justify-center shrink-0">
                        <Truck size={14} className="text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{s.name}</p>
                        <p className="text-xs text-zinc-500">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-zinc-400"><Mail size={12} className="shrink-0" /> {s.email}</div>
                      <div className="flex items-center gap-2 text-zinc-400"><Phone size={12} className="shrink-0" /> {s.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <div className="flex items-center gap-2"><MapPin size={12} className="shrink-0" /> {s.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-zinc-400">CSDDD Risk:</span>
                        <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                          (s.riskSeverity * s.riskLikelihood) >= 8 ? 'bg-red-500/10 text-red-400' :
                          (s.riskSeverity * s.riskLikelihood) >= 5 ? 'bg-amber-500/10 text-amber-400' :
                          'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {s.riskSeverity * s.riskLikelihood}
                        </span>
                        <span className="text-zinc-500 text-[10px]">({s.tierLevel || 'Tier 1'})</span>
                      </div>
                      <div className="text-[10px] flex items-center gap-1.5 text-zinc-400">
                        <span>LkSG CoC:</span>
                        <span className={s.lksgCodeSigned ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                          {s.lksgCodeSigned ? 'Signed' : 'Unsigned'}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">
                        UFLPA: <span className={s.uflpaStatus === 'Compliant' ? "text-emerald-400" : "text-red-400"}>{s.uflpaStatus}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === s.id ? null : s.id)}
                      className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors focus:outline-none"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {activeDropdown === s.id && (
                      <div className="absolute right-8 top-10 w-36 bg-[#121212] border border-white/[0.1] rounded-xl shadow-2xl z-20 py-1 overflow-hidden">
                        <button onClick={() => handleEditClick(s)} className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-white flex items-center gap-2"><Edit size={14} /> Edit</button>
                        <button onClick={() => handleDeleteClick(s.id)} className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/[0.1] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01] shrink-0">
              <h3 className="text-lg font-semibold text-white">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Supplier / Company Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Phone Number</label>
                  <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Location / Address</label>
                  <input required type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                </div>
              </div>

              {/* Compliance Fields */}
              <div className="border-t border-white/[0.05] pt-4 space-y-4 shrink-0">
                <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wide">ESG & Regulatory Due Diligence</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">CSDDD Severity (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.riskSeverity} onChange={(e) => setFormData({...formData, riskSeverity: parseInt(e.target.value) || 2})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">CSDDD Likelihood (1-5)</label>
                    <input type="number" min="1" max="5" value={formData.riskLikelihood} onChange={(e) => setFormData({...formData, riskLikelihood: parseInt(e.target.value) || 2})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Tier Level</label>
                    <select value={formData.tierLevel} onChange={(e) => setFormData({...formData, tierLevel: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 appearance-none bg-[#0a0a0a]">
                      <option value="Tier 1">Tier 1 (Direct Supplier)</option>
                      <option value="Tier 2">Tier 2 (Indirect Yarn/Fiber)</option>
                      <option value="Upstream">Upstream Sourcing</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">UFLPA Status</label>
                    <select value={formData.uflpaStatus} onChange={(e) => setFormData({...formData, uflpaStatus: e.target.value})} className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500/50 appearance-none bg-[#0a0a0a]">
                      <option value="Compliant">Compliant</option>
                      <option value="Flagged - Xinjiang cotton match">Flagged (Xinjiang Cotton Link)</option>
                      <option value="Pending screening">Pending Screening</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2.5 text-zinc-300 cursor-pointer pt-2">
                    <input type="checkbox" checked={formData.lksgCodeSigned} onChange={(e) => setFormData({...formData, lksgCodeSigned: e.target.checked})} className="rounded border-zinc-700 bg-zinc-950 text-violet-600 focus:ring-violet-500" />
                    <span className="text-xs font-medium">LkSG Code of Conduct Signed</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-zinc-300 hover:text-white bg-white/[0.02] border border-white/[0.05] rounded-xl">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}