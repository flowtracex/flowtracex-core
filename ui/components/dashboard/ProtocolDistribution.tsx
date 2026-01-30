
import React from 'react';
import { ProtocolData } from '../../types';

interface Props {
  protocols: ProtocolData[];
  onBarClick?: (protocol: string) => void;
}

const ProtocolDistribution: React.FC<Props> = ({ protocols, onBarClick }) => {
  // Enhanced protocol data mapping for hybrid visibility
  const sourceMapping: Record<string, string> = {
    'HTTP/HTTPS': 'Zeek',
    'DNS': 'Zeek',
    'TLS': 'Zeek',
    'SMB': 'Zeek',
    'RDP': 'Flow + Zeek',
    'Other': 'Flow'
  };

  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 h-full flex flex-col">
      <div className="mb-8">
        <h3 className="text-white font-semibold">Protocol Distribution (by Data Source)</h3>
        <p className="text-[10px] text-gray-500 mt-0.5 uppercase font-black tracking-widest">Metadata Enrichment Visibility</p>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {protocols.map((p, idx) => {
          const source = sourceMapping[p.name] || 'Flow';
          const isZeek = source.includes('Zeek');
          
          return (
            <div 
              key={idx} 
              className="space-y-2 group cursor-pointer"
              onClick={() => onBarClick?.(p.name)}
            >
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 font-bold uppercase tracking-tight">{p.name}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                    isZeek ? 'bg-[#00D4AA10] text-[#00D4AA] border-[#00D4AA22]' : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                  }`}>
                    {source}
                  </span>
                  {p.anomaly && (
                    <span className="text-[9px] text-[#f59e0b] bg-[#f59e0b10] px-1.5 rounded font-black animate-pulse">
                      (!) {p.anomaly}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-white font-mono">{p.percentage}%</span>
                  <p className="text-[8px] text-gray-600 font-black uppercase">{p.volume}</p>
                </div>
              </div>
              <div className="relative w-full h-1.5 bg-[#0c0c0e] rounded-full overflow-hidden border border-[#1e1e20]">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${
                    p.anomaly ? 'bg-[#f59e0b]' : isZeek ? 'bg-[#00D4AA]' : 'bg-zinc-600'
                  }`}
                  style={{ width: `${p.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-[#1e1e20] flex justify-center">
         <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest italic">Note: Deep inspection (Zeek) only available in capture zones.</p>
      </div>
    </div>
  );
};

export default ProtocolDistribution;
