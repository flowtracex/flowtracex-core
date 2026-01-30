
import React from 'react';
import { Alert } from '../types';
import { ArrowUpRight, Clock, CheckCircle2, XCircle, Search, Download, Activity } from 'lucide-react';

interface Props {
  alerts: Alert[];
}

const RecentAlerts: React.FC<Props> = ({ alerts }) => {
  const handleExport = () => {
    console.log("Exporting alerts as CSV...");
  };

  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl h-full flex flex-col shadow-sm">
      <div className="p-6 flex justify-between items-center border-b border-[#1e1e20]">
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider">Recent Alerts</h3>
          <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">Real-time Zeek notice.log stream</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="p-2 bg-[#1e1e20] border border-[#333] rounded-lg text-gray-500 hover:text-white transition-all" 
            title="Export CSV"
          >
            <Download size={14} />
          </button>
          <button className="text-[#00D4AA] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-1 group">
            View All <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-[9px] text-gray-500 uppercase tracking-[0.2em] bg-[#1c1c1e]/50 border-b border-[#1e1e20]">
            <tr>
              <th className="px-6 py-4 font-black">Severity</th>
              <th className="px-6 py-4 font-black">Detection Detail</th>
              <th className="px-6 py-4 font-black">Network Flow (Src → Dest)</th>
              <th className="px-6 py-4 font-black">Time</th>
              <th className="px-6 py-4 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e20]">
            {alerts.map((alert) => (
              <tr key={alert.id} className="group hover:bg-[#1e1e20] transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-[#e11d48] animate-pulse shadow-[0_0_8px_#e11d4866]' : 'bg-[#f59e0b]'}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest ${alert.severity === 'critical' ? 'text-[#e11d48]' : 'text-[#f59e0b]'}`}>
                      {alert.severity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-bold text-white group-hover:text-[#00D4AA] transition-colors uppercase tracking-tight">{alert.name}</p>
                      <span className="px-1.5 py-0.5 rounded bg-[#1e1e20] border border-[#333] text-[8px] font-black text-zinc-500 uppercase tracking-tighter">
                        {alert.protocol || 'TCP/UNKNOWN'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{alert.mitreTactic}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-white font-black bg-[#0c0c0e] px-2 py-0.5 rounded border border-[#1e1e20]">
                      {alert.sourceIp}
                    </span>
                    <ArrowUpRight size={10} className="text-gray-700" />
                    <span className="text-[11px] font-mono text-zinc-400 font-black">
                      {alert.destinationIp}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Clock size={12} />
                    <span className="text-[10px] font-black uppercase whitespace-nowrap">2m ago</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-emerald-500/10 rounded-lg text-gray-600 hover:text-emerald-500 transition-all" title="Acknowledge">
                      <CheckCircle2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-blue-500/10 rounded-lg text-gray-600 hover:text-blue-500 transition-all" title="Flow Triage">
                      <Search size={16} />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-500 transition-all" title="Dismiss">
                      <XCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 border-t border-[#1e1e20] bg-[#0c0c0e]/30 flex justify-center">
         <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest flex items-center gap-2">
            <Activity size={10} /> Syncing NDR pipeline: Zeek conn.log active
         </span>
      </div>
    </div>
  );
};

export default RecentAlerts;
