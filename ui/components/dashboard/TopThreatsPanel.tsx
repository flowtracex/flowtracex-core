import React from 'react';
import { ThreatCategory } from '../../types';
import { Target, Database, TrendingUp, TrendingDown, Minus, ArrowUpRight } from 'lucide-react';

interface Props {
  threats: ThreatCategory[];
}

const TopThreatsPanel: React.FC<Props> = ({ threats }) => {
  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Top Threats</h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Metadata-driven Intel</p>
        </div>
        <button className="text-[#00D4AA] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1">
          Hunt <Target size={14} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {threats.map((threat, idx) => (
          <div key={idx} className="bg-[#1e1e20] border border-[#2a2a2c] rounded-xl p-4 hover:border-[#00D4AA44] transition-all group cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0c0c0e] rounded-lg border border-[#333] text-gray-400 group-hover:text-[#00D4AA]">
                <Database size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-white uppercase group-hover:text-[#00D4AA] truncate">{threat.name}</h4>
                <p className="text-[9px] text-gray-600 font-bold uppercase truncate">{threat.evidence}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-white">{threat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopThreatsPanel;