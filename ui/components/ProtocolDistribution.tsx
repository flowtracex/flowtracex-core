
import React from 'react';
import { ProtocolData } from '../types';

interface Props {
  protocols: ProtocolData[];
}

const ProtocolDistribution: React.FC<Props> = ({ protocols }) => {
  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 h-full flex flex-col">
      <h3 className="text-white font-semibold">Protocol Distribution</h3>
      <p className="text-xs text-gray-500 mt-0.5 mb-8">Network traffic by protocol</p>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {protocols.map((p, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-gray-300 font-medium">{p.name}</span>
                {p.anomaly && (
                  <span className="text-[10px] text-[#f59e0b] bg-[#f59e0b15] px-1.5 rounded uppercase tracking-tighter">
                    ({p.anomaly})
                  </span>
                )}
              </div>
              <span className="text-gray-500">{p.percentage}%</span>
            </div>
            <div className="relative w-full h-1.5 bg-[#1e1e20] rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${p.anomaly ? 'bg-[#f59e0b]' : 'bg-[#10b981]'}`}
                style={{ width: `${p.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProtocolDistribution;
