
import React from 'react';
import { ThreatCategory } from '../types';
import { ShieldAlert, ArrowUpRight, TrendingUp, TrendingDown, Minus, Target, Database } from 'lucide-react';

interface Props {
  threats: ThreatCategory[];
}

const TopThreats: React.FC<Props> = ({ threats }) => {
  // Enhanced Mock Data for Top Threats with NDR Evidence
  const ndrThreats: ThreatCategory[] = [
    { name: "Command & Control", category: "C2 Beaconing", count: 12, trend: "increasing", evidence: "Detected via periodicity analysis in conn.log" },
    { name: "Data Exfiltration", category: "DNS Tunneling", count: 8, trend: "stable", evidence: "High entropy payloads observed in dns.log" },
    { name: "Lateral Movement", category: "SMB Pivot", count: 15, trend: "stable", evidence: "Unusual admin share access in smb.log" },
    { name: "Discovery", category: "Internal Recon", count: 6, trend: "decreasing", evidence: "Scanning triggers detected in notice.log" }
  ];

  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Top Threats</h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Metadata-driven Intel</p>
        </div>
        <button className="text-[#00D4AA] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 group">
          Hunt <Target size={14} className="group-hover:scale-110 transition-transform" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {ndrThreats.map((threat, idx) => (
          <div key={idx} className="bg-[#1e1e20] border border-[#2a2a2c] rounded-xl p-4 hover:border-[#00D4AA44] transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute right-0 top-0 p-2 opacity-0 group-hover:opacity-100">
               <ArrowUpRight size={12} className="text-[#00D4AA]" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0c0c0e] rounded-lg border border-[#333] text-gray-400 group-hover:text-[#00D4AA] transition-all">
                <Database size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-white uppercase group-hover:text-[#00D4AA] transition-colors truncate">{threat.name}</h4>
                <div className="flex flex-col gap-0.5 mt-1">
                   <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tight truncate">
                     {threat.evidence}
                   </p>
                   <span className="text-[8px] font-mono text-zinc-700 uppercase">MITRE: {threat.category}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-black text-white tracking-tighter">{threat.count}</p>
                <div className="flex items-center justify-end gap-1 mt-0.5">
                  {threat.trend === 'increasing' && <TrendingUp size={10} className="text-[#10b981]" />}
                  {threat.trend === 'decreasing' && <TrendingDown size={10} className="text-[#e11d48]" />}
                  {threat.trend === 'stable' && <Minus size={10} className="text-gray-700" />}
                  <span className={`text-[8px] uppercase tracking-tighter font-black ${threat.trend === 'increasing' ? 'text-[#10b981]' : 'text-gray-600'}`}>
                    {threat.trend === 'increasing' ? '$+12.4\%$' : threat.trend === 'decreasing' ? '$-5.2\%$' : 'stable'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-[#1e1e20] flex justify-between items-center text-[9px] font-black uppercase text-gray-700">
         <span>Last Sync: Just Now</span>
         <button className="hover:text-white transition-colors">Re-scan</button>
      </div>
    </div>
  );
};

export default TopThreats;
