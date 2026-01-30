import React, { useState } from 'react';
// Comment: Added missing 'Target' to lucide-react imports
import { X, Shield, Zap, Search, Globe, Terminal, Database, ArrowRight, Eye, Sliders, Box, ChevronDown, Target } from 'lucide-react';

interface Template {
  id: string;
  mitreId: string;
  title: string;
  description: string;
  icon: any;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  groups: number;
  conditions: number;
}

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

const TEMPLATES: Template[] = [
  { id: 'T1071', mitreId: 'T1071.001', title: 'C2 Beaconing Detection', description: 'Detects periodic HTTP/HTTPS connections to suspicious IPs indicating C2 beaconing activity.', icon: Zap, severity: 'Critical', groups: 3, conditions: 8 },
  { id: 'T1048', mitreId: 'T1048.003', title: 'DNS Tunneling Detection', description: 'Identifies DNS queries with unusually long subdomains or high entropy indicating data exfiltration via DNS.', icon: Globe, severity: 'High', groups: 2, conditions: 6 },
  // Comment: Fixed ReferenceError by importing 'Target' from lucide-react
  { id: 'T1041', mitreId: 'T1041', title: 'Data Exfiltration over C2', description: 'Detects large outbound data transfers to external IPs that may indicate data theft.', icon: Target, severity: 'Critical', groups: 2, conditions: 5 },
  { id: 'T1021', mitreId: 'T1021.001', title: 'RDP Lateral Movement', description: 'Monitor for unusual internal movement across segments via administrative protocols.', icon: Shield, severity: 'Medium', groups: 2, conditions: 4 },
  { id: 'T1567', mitreId: 'T1567', title: 'Exfiltration to Cloud', description: 'Monitor for large outbound transfers to unapproved public cloud storage providers.', icon: Database, severity: 'High', groups: 2, conditions: 7 },
  { id: 'T1110', mitreId: 'T1110', title: 'Brute Force Attempts', description: 'Correlate high-frequency authentication failures across multiple internal targets.', icon: Search, severity: 'Medium', groups: 1, conditions: 4 },
];

// Re-using Target icon locally for consistent mapping
const TargetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;

const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  if (!isOpen) return null;

  const filtered = TEMPLATES.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || t.title.toLowerCase().includes(activeFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-8 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div>
            <h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
              <Shield className="text-[#00D4AA]" size={24} />
              Detection Templates
            </h3>
            <p className="text-[11px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">Accelerate your detection engineering with verified threat patterns</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all shadow-xl">
            <X size={24} />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-8 py-6 bg-zinc-900 border-b border-zinc-800 flex gap-4">
           <div className="flex-1 relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#00D4AA] transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates (e.g. C2, DNS Tunneling, Exfil)..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-12 pr-6 py-4 text-sm text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex bg-zinc-950 p-1.5 rounded-lg border border-zinc-800">
              {['All', 'C2', 'Exfil', 'Lateral', 'Brute Force'].map(f => (
                <button 
                  key={f} 
                  onClick={() => setActiveFilter(f)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 p-8 overflow-y-auto no-scrollbar bg-zinc-950/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((t) => (
              <div 
                key={t.id}
                className="bg-zinc-900 border border-zinc-800 p-8 rounded-lg hover:border-blue-500/40 transition-all group relative overflow-hidden shadow-xl flex flex-col justify-between h-full"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                   {t.id === 'T1041' ? <TargetIcon /> : <t.icon size={120} />}
                </div>

                <div>
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[#00D4AA] group-hover:scale-110 transition-transform shadow-inner">
                           {t.id === 'T1041' ? <TargetIcon /> : <t.icon size={24} />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors leading-tight">{t.title}</h4>
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">MITRE: {t.mitreId}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        t.severity === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        t.severity === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }`}>
                        {t.severity}
                      </span>
                   </div>

                   <p className="text-xs text-zinc-400 leading-relaxed mb-8 font-medium uppercase tracking-tighter line-clamp-3">
                      {t.description}
                   </p>
                </div>

                <div className="space-y-6 mt-auto">
                   <div className="flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest border-t border-zinc-800/50 pt-6">
                      <span className="flex items-center gap-2"><Box size={14}/> {t.groups} Logic Groups</span>
                      <span className="flex items-center gap-2"><Sliders size={14}/> {t.conditions} Conditions</span>
                   </div>

                   <div className="flex gap-2">
                      <button 
                        onClick={() => onSelect(t)}
                        className="flex-1 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-lg hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10"
                      >
                        Use Template <ArrowRight size={16} />
                      </button>
                      <button className="px-5 py-4 bg-zinc-950 border border-zinc-800 text-zinc-600 hover:text-white rounded-lg transition-all shadow-inner">
                        <Eye size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center gap-6 opacity-30">
               <div className="p-8 border-2 border-dashed border-zinc-800 rounded-full">
                  <Search size={48} />
               </div>
               <p className="text-xl font-black text-zinc-500 uppercase tracking-widest">No templates match search</p>
            </div>
          )}
        </div>
        
        {/* Footer info */}
        <div className="p-8 bg-zinc-950/80 border-t border-zinc-800 flex justify-center items-center gap-10">
           <button className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-2">
             Load More Verified Patterns <ChevronDown size={14}/>
           </button>
           <div className="h-4 w-px bg-zinc-800" />
           <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-tight">Vulnerability Database v2.4.1 Connected</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibraryModal;