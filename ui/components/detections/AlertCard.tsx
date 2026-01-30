
import React from 'react';
import { Alert } from '../../types';
import { 
  ArrowRight, 
  ChevronRight, 
  ShieldAlert,
  Radio,
  Download,
  Zap,
  Activity
} from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onViewDetails?: (alert: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onViewDetails }) => {
  const severityStyles = {
    critical: { bg: 'bg-[#e11d48]', shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.2)]', text: 'text-white', label: 'CRITICAL', color: '#e11d48' },
    high: { bg: 'bg-[#f59e0b]', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]', text: 'text-black', label: 'HIGH', color: '#f59e0b' },
    medium: { bg: 'bg-[#eab308]', shadow: 'shadow-[0_0_15px_rgba(234,179,8,0.15)]', text: 'text-black', label: 'MEDIUM', color: '#eab308' },
    low: { bg: 'bg-zinc-700', shadow: '', text: 'text-white', label: 'LOW', color: '#71717a' },
  };

  const style = severityStyles[alert.severity as keyof typeof severityStyles] || severityStyles.medium;

  // Icon logic based on alert name
  const getIcon = () => {
    const name = alert.name.toLowerCase();
    if (name.includes('beaconing')) return <Radio size={22} className="text-[#e11d48]" />;
    if (name.includes('discovery') || name.includes('scan')) return <Download size={22} className="text-[#eab308]" />;
    if (name.includes('exfiltration')) return <Zap size={22} className="text-[#3b82f6]" />;
    return <ShieldAlert size={22} className="text-zinc-400" />;
  };

  return (
    <div 
      className="bg-[#161618] border border-[#1e1e20] rounded-xl p-5 hover:border-[#333] transition-all group cursor-pointer shadow-sm mb-4"
      onClick={() => onViewDetails?.(alert)}
    >
      <div className="flex items-start gap-6">
        {/* Detection Icon */}
        <div className="mt-1 flex-shrink-0 w-12 h-12 rounded-xl bg-[#0c0c0e] border border-[#1e1e20] flex items-center justify-center group-hover:scale-105 transition-transform">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4 min-w-0">
              <h3 className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[400px]">
                {alert.name}
              </h3>
              <div className="flex items-center gap-2.5 font-mono text-[11px] font-bold">
                <span className="text-zinc-400">{alert.sourceIp}</span>
                {alert.assetContext?.hostname && (
                  <span className="text-blue-400/90 uppercase text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-400/5 border border-blue-400/10">
                    {alert.assetContext.hostname} (ZEEK DHCP)
                  </span>
                )}
                <ArrowRight size={12} className="text-zinc-700 shrink-0" />
                <span className="text-zinc-400">{alert.destinationIp}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-shrink-0">
              <div className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${style.bg} ${style.text} ${style.shadow}`}>
                {style.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[9px] text-zinc-600 font-black uppercase tracking-tighter">Score:</span>
                <span className="text-sm font-black" style={{ color: style.color }}>{alert.confidence || 0}</span>
              </div>
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1e1e20]/60">
            <div className="flex items-center gap-10">
              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Telemetry Origin</p>
                <div className="flex gap-1.5">
                  {alert.sources?.map((src, i) => (
                    <span key={i} className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-[4px] text-[8px] font-black text-zinc-400 uppercase tracking-tight">
                      {src.replace('ZEEK:', 'ZEEK-').replace('FLOW', 'FLOW-8TAT')}
                    </span>
                  )) || <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[8px] font-black text-zinc-600 uppercase">FLOW-GENERIC</span>}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">MITRE Mapping</p>
                <div className="text-[10px] font-black text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-tight flex items-center gap-1 cursor-pointer">
                  {alert.mitreTactic || 'Command & Control'} <span className="text-zinc-600">({alert.mitreId || 'T1071.001'})</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Window Size</p>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">
                  {alert.blastRadius?.affectedAssets ? '12 Minutes' : '1 Minute'}
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 bg-[#1e1e20] border border-[#333] text-blue-400 px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all shadow-sm active:scale-95">
              Investigate <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
