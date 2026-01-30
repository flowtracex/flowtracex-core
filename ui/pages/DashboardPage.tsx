
import React, { useEffect, useState, useMemo } from 'react';
import { RefreshCcw, Database, Clock, Sparkles, ShieldCheck, Zap, Activity, Info, ChevronRight, LayoutGrid, Calendar, ChevronDown } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import NetworkTrafficChart from '../components/dashboard/NetworkTrafficChart';
import ProtocolDistribution from '../components/dashboard/ProtocolDistribution';
import RecentAlertsTable from '../components/dashboard/RecentAlertsTable';
import TopThreatsPanel from '../components/dashboard/TopThreatsPanel';
import { fetchDashboardOverview, fetchNetworkTraffic, fetchProtocolDistribution } from '../api/dashboard';
import { fetchRecentAlerts } from '../api/detections';
import { fetchTopThreats } from '../api/threats';
import { DashboardOverview, TrafficPoint, ProtocolData, Alert, ThreatCategory } from '../types';

const DashboardPage: React.FC<{ onNavigate?: (pageId: any, filters?: any) => void }> = ({ onNavigate }) => {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [traffic, setTraffic] = useState<TrafficPoint[]>([]);
  const [protocols, setProtocols] = useState<ProtocolData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [threats, setThreats] = useState<ThreatCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [timeRange, setTimeRange] = useState('Last 24h');
  const [showTimeMenu, setShowTimeMenu] = useState(false);
  const timeRanges = ['Last 15m', 'Last 1h', 'Last 6h', 'Last 24h', 'Last 7d', 'Custom'];

  const sparklines = useMemo(() => ({
    alerts: Array.from({length: 10}, () => ({ val: Math.random() * 100 })),
    assets: Array.from({length: 10}, () => ({ val: 1200 + Math.random() * 100 })),
    health: Array.from({length: 10}, () => ({ val: 95 + Math.random() * 5 }))
  }), []);

  useEffect(() => {
    const load = async () => {
      try {
        const [ov, tr, pr, al, th] = await Promise.all([
          fetchDashboardOverview(), fetchNetworkTraffic(), fetchProtocolDistribution(),
          fetchRecentAlerts(), fetchTopThreats()
        ]);
        setOverview(ov); setTraffic(tr); setProtocols(pr); setAlerts(al); setThreats(th);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Syncing HQ...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-[#00D4AA10] border border-[#00D4AA33] rounded-xl px-4 py-2 flex items-center gap-3">
            <Zap size={14} className="text-[#00D4AA]" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Telemetry Scope: Flow + Zeek (Hybrid)</span>
              <span className="px-1.5 py-0.5 rounded-[4px] bg-[#00D4AA] text-black text-[8px] font-black uppercase">Phase-1 Active</span>
            </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowTimeMenu(!showTimeMenu)}
              className="bg-[#161618] border border-[#1e1e20] rounded-xl px-4 py-2 flex items-center gap-3 hover:border-[#333] transition-all group shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#00D4AA]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Time Scope: {timeRange}</span>
                <div className="group/scope relative inline-block">
                  <Info size={12} className="text-gray-600 cursor-help" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[9px] text-gray-300 opacity-0 group-hover/scope:opacity-100 transition-opacity pointer-events-none z-50 leading-tight shadow-2xl">
                    Time range applied to all Dashboard metrics.
                  </div>
                </div>
              </div>
              <ChevronDown size={12} className={`text-gray-500 transition-transform ${showTimeMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showTimeMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#161618] border border-[#333] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {timeRanges.map(range => (
                  <button 
                    key={range}
                    onClick={() => { setTimeRange(range); setShowTimeMenu(false); }}
                    className={`w-full text-left px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors ${timeRange === range ? 'text-[#00D4AA] bg-[#00D4AA05]' : 'text-gray-500 hover:bg-[#1e1e20] hover:text-white'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-6 text-[9px] font-black text-gray-500 uppercase tracking-widest">
           <div className="flex items-center gap-2 border-r border-[#1e1e20] pr-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Flow Pipeline: 100% Active</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span>Zeek Metadata: Partial Visibility</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Critical Alerts" 
          value={overview?.critical_alerts.count || 0} 
          subtitle="Triage Required" 
          trend={overview?.critical_alerts.change} 
          type="critical" 
          sparklineData={sparklines.alerts} 
          threshold={10} 
          tooltipText="Critical findings identified via behavioral flow analysis and Zeek protocol metadata matching."
          onClick={() => onNavigate?.('detections-feed', { severity: ['critical'], timeRange })}
        />
        <MetricCard 
          title="High Alerts" 
          value={overview?.high_alerts.count || 0} 
          subtitle="Pending Investigation" 
          trend={overview?.high_alerts.change} 
          type="warning" 
          sparklineData={sparklines.alerts} 
          onClick={() => onNavigate?.('detections-feed', { severity: ['high'], timeRange })}
        />
        <MetricCard 
          title="Observed Network Assets" 
          value={overview?.assets_monitored.count || 0} 
          subtitle="Inferred Identity" 
          trend={overview?.assets_monitored.change} 
          type="info" 
          sparklineData={sparklines.assets} 
          tooltipText="Assets are inferred from AF-PACKET flows and Zeek fingerprints observed on the wire."
          onClick={() => onNavigate?.('assets-inventory', { timeRange })}
          breakdown={
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-gray-500 uppercase flex justify-between"><span>• Zeek-fingerprinted:</span> <span className="text-white">842</span></p>
              <p className="text-[9px] font-bold text-gray-500 uppercase flex justify-between"><span>• Flow-only:</span> <span className="text-white">405</span></p>
            </div>
          }
        />
        <MetricCard 
          title="Telemetry Health" 
          value={`${overview?.network_health.percentage || 0}%`} 
          subtitle="Data Integrity Index" 
          type="success" 
          sparklineData={sparklines.health} 
          tooltipText="Telemetry health is calculated from AF-PACKET flow capture and Zeek metadata availability."
          onClick={() => onNavigate?.('operations-data-sources', { view: 'telemetry', timeRange })}
          breakdown={
            <div className="space-y-0.5">
              <p className="text-[9px] font-bold text-gray-500 uppercase flex justify-between"><span>Flow Coverage:</span> <span className="text-[#10b981]">100%</span></p>
              <p className="text-[9px] font-bold text-gray-500 uppercase flex justify-between"><span>Zeek Depth:</span> <span className="text-blue-400">72%</span></p>
              <p className="text-[9px] font-bold text-gray-500 uppercase flex justify-between"><span>Packet Drop:</span> <span className="text-white">0.02%</span></p>
            </div>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[#161618] border border-[#1e1e20] rounded-xl p-6 flex flex-col justify-between group overflow-hidden relative">
          {/* <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <LayoutGrid size={120} className="text-[#00D4AA]" />
          </div> */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-white font-bold text-sm uppercase tracking-tight">Deep Inspection Coverage  </h3>
              <ContextHelp text="Zeek metadata is only available where packet capture is enabled at the segment level." />
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-8">Metadata Enrichment Matrix</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-gray-400 uppercase">Total Network Capacity</p>
                   <p className="text-xs font-black text-white">100% FLOW</p>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-[#1e1e20]">
                   <div className="h-full bg-zinc-600" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-blue-400 uppercase">Zeek-Inspected Zones</p>
                   <p className="text-xs font-black text-blue-400">72% METADATA</p>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-[#1e1e20]">
                   <div className="h-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.3)]" style={{ width: '72%' }} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-gray-600 uppercase">Flow-Only (Blind) Zones</p>
                   <p className="text-xs font-black text-gray-500">28% AGGREGATE</p>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-[#1e1e20]">
                   <div className="h-full bg-zinc-800" style={{ width: '28%' }} />
                </div>
              </div>
            </div>
          </div>
          <button className="mt-8 text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline flex items-center gap-1">
             Manage Sensor Placement <ChevronRight size={10} />
          </button>
        </div>

        <div className="lg:col-span-2 h-[450px]">
          <NetworkTrafficChart data={traffic} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <ProtocolDistribution 
            protocols={protocols} 
            onBarClick={(p) => onNavigate?.('logs-search', { query: `protocol:"${p}"`, timeRange })}
          />
        </div>
        <div className="lg:col-span-2 h-[400px]">
          <RecentAlertsTable 
            alerts={alerts} 
            onAlertClick={(a) => onNavigate?.('detections-feed', { alertId: a.id, timeRange })}
          />
        </div>
      </div>
    </div>
  );
};

const ContextHelp = ({ text }: { text: string }) => (
  <div className="group/help relative inline-block">
    <Info size={12} className="text-gray-600 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-zinc-800 border border-zinc-700 rounded-lg text-[9px] text-gray-300 opacity-0 group-hover/help:opacity-100 transition-opacity pointer-events-none z-50 leading-tight shadow-2xl">
      {text}
    </div>
  </div>
);

export default DashboardPage;
