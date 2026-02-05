
import React from 'react';
import { Alert } from '../../types';
import { ArrowUpRight, Search, Activity, ShieldCheck, Zap } from 'lucide-react';

interface Props {
  alerts: Alert[];
  onAlertClick?: (alert: Alert) => void;
}

const RecentAlertsTable: React.FC<Props> = ({ alerts, onAlertClick }) => {
  // Conceptual source mapping based on detection name for Phase-1 truth
  const getSource = (name: string) => {
    if (name.includes('Beaconing')) return 'Hybrid';
    if (name.includes('Lateral') || name.includes('SMB') || name.includes('DNS')) return 'Zeek';
    return 'Flow';
  };

  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl h-full flex flex-col shadow-sm">
      <div className="p-6 flex justify-between items-center border-b border-[#1e1e20]">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Recent Alerts</h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Real-time Hybrid Detection Stream</p>
        </div>
        <button className="text-[#00D4AA] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 group">
          View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[9px] text-gray-600 uppercase tracking-[0.2em] bg-[#1c1c1e]/50 border-b border-[#1e1e20]">
            <tr>
              <th className="px-6 py-4 font-black">Severity</th>
              <th className="px-6 py-4 font-black">Detection Detail</th>
              <th className="px-6 py-4 font-black">Network Flow</th>
              <th className="px-6 py-4 font-black">Confidence Source</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e20]">
            {alerts.map((alert) => {
              const source = getSource(alert.name);
              return (
                <tr 
                  key={alert.id} 
                  onClick={() => onAlertClick?.(alert)}
                  className="group hover:bg-[#1e1e20] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-[#e11d48] animate-pulse shadow-[0_0_8px_#e11d48]' : 'bg-[#f59e0b]'}`} />
                      <span className={`text-[9px] font-black uppercase tracking-widest ${alert.severity === 'critical' ? 'text-[#e11d48]' : 'text-[#f59e0b]'}`}>
                        {alert.severity}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-white group-hover:text-[#00D4AA] transition-colors uppercase tracking-tight">{alert.name}</p>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{alert.mitreTactic}</p>
                  </td>
                  <td className="px-6 py-4 text-[11px]  text-zinc-400">
                    <span className="text-white">{alert.sourceIp}</span>
                    <span className="mx-2 text-zinc-700">→</span>
                    <span>{alert.destinationIp}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {source === 'Hybrid' && <Zap size={10} className="text-[#00D4AA]" />}
                      {source === 'Zeek' && <ShieldCheck size={10} className="text-blue-400" />}
                      {source === 'Flow' && <Activity size={10} className="text-zinc-500" />}
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        source === 'Hybrid' ? 'text-[#00D4AA]' : source === 'Zeek' ? 'text-blue-400' : 'text-zinc-600'
                      }`}>
                        {source}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="p-1.5 hover:bg-zinc-800 rounded-lg inline-block text-zinc-500 group-hover:text-white transition-colors">
                        <ArrowUpRight size={16} />
                     </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentAlertsTable;
