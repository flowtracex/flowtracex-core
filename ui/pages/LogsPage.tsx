import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Download, Save, ChevronRight, Play, Pause, X, 
  Activity, Database, Globe, Terminal, ChevronDown, RefreshCcw, 
  Zap, MoreVertical, Layers, CheckSquare, Plus, Trash2, Code, 
  Clock, HardDrive, ShieldAlert, ShieldCheck, AlertTriangle, 
  Flag, MapPin, ExternalLink, Info, CheckCircle2, TrendingUp, 
  TrendingDown, Minus, ArrowUpRight, Target, Brain, Server
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, ComposedChart
} from 'recharts';

// --- Types ---

type LogSeverity = 'critical' | 'high' | 'medium' | 'low';
type LogType = 'dns' | 'http' | 'tls' | 'flow' | 'smb' | 'ssh';

interface LogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  sourceIP: string;
  sourceAsset?: { hostname: string; owner: string; type: string; risk: number };
  destIP: string;
  destInfo?: { hostname: string; country: string; flag: string; reputation: string; malicious: boolean };
  type: LogType;
  protocol: string;
  port: number;
  message: string;
  bytes?: string;
  duration?: string;
  relatedDetection?: { id: string; title: string };
  threatIntel?: { malicious: boolean; sources: string[] };
}

// --- Mock Data ---

const MOCK_LOGS: LogEntry[] = [
  {
    id: 'dns_1234567890',
    timestamp: '2024-01-15 15:42:18.234',
    severity: 'critical',
    sourceIP: '10.0.5.42',
    sourceAsset: { hostname: 'WS-ENG-042', owner: 'John Smith', type: 'Engineering workstation', risk: 92 },
    destIP: '185.220.101.34',
    destInfo: { hostname: 'unknown', country: 'Russia', flag: '🇷🇺', reputation: 'Malicious', malicious: true },
    type: 'dns',
    protocol: 'UDP',
    port: 53,
    message: 'Suspicious DNS query for subdomain with high entropy (possible tunneling)',
    relatedDetection: { id: 'ALT-003', title: 'DNS Tunneling' },
    threatIntel: { malicious: true, sources: ['ThreatFox', 'AbuseIPDB'] }
  },
  {
    id: 'http_987654321',
    timestamp: '2024-01-15 15:42:15.891',
    severity: 'high',
    sourceIP: '192.168.1.105',
    sourceAsset: { hostname: 'SRV-FILE-01', owner: 'IT Admin', type: 'File Server', risk: 45 },
    destIP: '104.18.32.68',
    destInfo: { hostname: 'storage.cloud.com', country: 'USA', flag: '🇺🇸', reputation: 'Neutral', malicious: false },
    type: 'http',
    protocol: 'TCP',
    port: 443,
    message: 'POST /api/upload - Large data transfer detected',
    bytes: '842 MB'
  },
  {
    id: 'tls_456123789',
    timestamp: '2024-01-15 15:42:12.456',
    severity: 'low',
    sourceIP: '10.0.3.88',
    sourceAsset: { hostname: 'WS-DEV-088', owner: 'Jane Doe', type: 'Workstation', risk: 12 },
    destIP: '140.82.121.4',
    destInfo: { hostname: 'github.com', country: 'USA', flag: '🇺🇸', reputation: 'Safe', malicious: false },
    type: 'tls',
    protocol: 'TCP',
    port: 443,
    message: 'TLS 1.3 Handshake - Normal traffic'
  }
];

const ANALYTICS_DATA = {
  ingestionRate: Array.from({ length: 20 }, (_, i) => ({ time: `${i}s`, eps: 45000 + Math.random() * 15000, dropped: Math.random() > 0.8 ? 500 : 0 })),
  volumeTrend: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, volume: 2.2 + Math.random() * 0.8 })),
  latencyData: [
    { stage: 'Ingestion', value: 2, color: '#10b981' },
    { stage: 'Parsing', value: 15, color: '#3b82f6' },
    { stage: 'Enrichment', value: 45, color: '#f59e0b' },
    { stage: 'Detection', value: 70, color: '#ef4444' },
    { stage: 'Storage', value: 8, color: '#8b5cf6' },
  ],
  sourceDist: [
    { name: 'DNS', value: 35, color: '#3b82f6', count: '9.9M/day' },
    { name: 'Flow', value: 30, color: '#10b981', count: '8.5M/day' },
    { name: 'HTTP', value: 25, color: '#f97316', count: '7.1M/day' },
    { name: 'TLS', value: 10, color: '#8b5cf6', count: '2.8M/day' },
  ],
  errorTrend: Array.from({ length: 24 }, (_, i) => ({ time: `${i}:00`, errors: 0.01 + Math.random() * 0.05 })),
};

const LOG_SOURCES = [
  { id: 'dns', label: 'DNS Queries', count: '2.4M/day' },
  { id: 'http', label: 'HTTP Traffic', count: '8.1M/day' },
  { id: 'tls', label: 'TLS Metadata', count: '5.6M/day' },
  { id: 'flow', label: 'Network Flows', count: '12.3M/day' },
];

const TOP_GENERATORS = [
  { ip: '10.0.5.42', hostname: 'WS-ENG-042', logs: '1.2M', pct: 4.2, anomaly: true, reason: 'Possible C2 beaconing', type: 'Engineering Workstation', owner: 'John Smith' },
  { ip: '10.0.3.15', hostname: 'SRV-DC-01', logs: '890K', pct: 3.1, anomaly: false, type: 'Domain Controller', owner: 'Admin' },
  { ip: '10.0.8.15', hostname: 'WEB-PROD-01', logs: '420K', pct: 1.5, anomaly: false, type: 'Production Server', owner: 'DevOps' },
];

const VULN_HEATMAP = [
  { segment: 'DMZ', critical: 12, high: 8, medium: 4, low: 2 },
  { segment: 'Prod', critical: 4, high: 12, medium: 15, low: 5 },
  { segment: 'Eng', critical: 2, high: 5, medium: 10, low: 20 },
  { segment: 'Corp', critical: 1, high: 2, medium: 5, low: 45 },
];

// --- Components ---

const LogsPage: React.FC<{ defaultView?: 'search' | 'stats' | 'live' }> = ({ defaultView = 'search' }) => {
  const [view, setView] = useState<'search' | 'stats' | 'live'>(defaultView);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [queryBuilderOpen, setQueryBuilderOpen] = useState(false);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [isLivePaused, setIsLivePaused] = useState(false);

  // Filter States
  const [timeRange, setTimeRange] = useState('Last 24h');
  const [activeSources, setActiveSources] = useState<string[]>(['dns', 'http', 'tls', 'flow']);
  const [severities, setSeverities] = useState<LogSeverity[]>(['critical', 'high', 'medium', 'low']);
  const [searchTerm, setSearchTerm] = useState('');

  const Breadcrumbs = () => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <span>Home</span>
        <ChevronRight size={10} />
        <span className="text-gray-300">Logs</span>
        <ChevronRight size={10} />
        <span className="text-[#00D4AA] font-black uppercase">{view}</span>
      </div>
      <div className="flex items-center gap-2 bg-[#161618] border border-[#1e1e20] p-1 rounded-xl shadow-xl">
        <button onClick={() => setView('search')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'search' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Search</button>
        <button onClick={() => setView('stats')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'stats' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Analytics</button>
        <button onClick={() => setView('live')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'live' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Live</button>
      </div>
    </div>
  );

  const MetricCard = ({ label, value, trend, trendGood, sub, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4 hover:border-zinc-700 transition-all group shadow-sm">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className={`text-xl font-black text-white tracking-tighter ${color}`}>{value}</h3>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-black ${trendGood ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.startsWith('↑') ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {trend}
          </div>
        )}
      </div>
      {sub && <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{sub}</p>}
    </div>
  );

  const renderSearch = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      <Breadcrumbs />

      {/* SEARCH BAR SECTION */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4AA] opacity-[0.02] blur-[80px] pointer-events-none" />
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative group">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00D4AA] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by IP, domain, keyword, message or source_ip:10.0.5.42..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-6 py-3.5 text-sm text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all placeholder:text-zinc-700" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setQueryBuilderOpen(true)} className="bg-zinc-950 border border-zinc-800 text-[#00D4AA] px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#00D4AA10] transition-all flex items-center gap-2">
              <Code size={16}/> Query Builder
            </button>
            <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-6 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
              <Download size={16}/> Export
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Time range</span>
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {['Last Hour', 'Last 24h', 'Last 7d', 'Custom'].map(r => (
                  <button 
                    key={r} 
                    onClick={() => setTimeRange(r)}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${timeRange === r ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                Sources
              </span>

              <div className="relative w-56">
                <select
                  value={activeSources[0] || ''}
                  onChange={(e) => setActiveSources([e.target.value])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled className="bg-zinc-950 text-zinc-500">
                    Select source
                  </option>

                  {LOG_SOURCES.map(src => (
                    <option
                      key={src.id}
                      value={src.id}
                      className="bg-zinc-950 text-white"
                    >
                      {src.id}
                    </option>
                  ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={14} className="text-zinc-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                Severity
              </span>

              <div className="relative w-48">
                <select
                  value={severities[0] || ''}
                  onChange={(e) => setSeverities([e.target.value as LogSeverity])}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition-all appearance-none cursor-pointer pr-10"
                >
                  <option value="" disabled className="bg-zinc-950 text-zinc-500">
                    Select severity
                  </option>

                  {(['critical', 'high', 'medium', 'low'] as LogSeverity[]).map(s => (
                    <option
                      key={s}
                      value={s}
                      className="bg-zinc-950 text-white"
                    >
                      {s}
                    </option>
                  ))}
                </select>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown size={14} className="text-zinc-400" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
              className={`ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${advancedFiltersOpen ? 'text-[#00D4AA]' : 'text-zinc-500 hover:text-white'}`}
            >
              <Filter size={14}/> {advancedFiltersOpen ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>

          {advancedFiltersOpen && (
            <div className="grid grid-cols-4 gap-6 pt-6 border-t border-zinc-800 animate-in slide-in-from-top-2 duration-200">
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-600 uppercase">Traffic Direction</label>
                 <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-white outline-none appearance-none">
                   <option>All Directions</option>
                   <option>Inbound</option>
                   <option>Outbound</option>
                   <option>Internal</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-600 uppercase">Source IP/CIDR</label>
                 <input type="text" placeholder="10.0.0.0/8" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-white outline-none" />
               </div>
               <div className="space-y-2">
                 <label className="text-[9px] font-black text-zinc-600 uppercase">Dest Port</label>
                 <input type="text" placeholder="443" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-[11px] text-white outline-none" />
               </div>
               <div className="flex items-end">
                 <button className="w-full bg-[#00D4AA] text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#059669]">Apply Advanced</button>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE FILTERS SUMMARY */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active:</span>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-300 flex items-center gap-1.5 uppercase">{timeRange} <X size={10} className="cursor-pointer hover:text-white"/></span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-300 flex items-center gap-1.5 uppercase">{activeSources.length} Sources <X size={10} className="cursor-pointer hover:text-white"/></span>
            <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline ml-2">Clear All</button>
          </div>
        </div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Showing 1,247 log events</p>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-950/50 border-b border-zinc-800 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
            <tr>
              <th className="px-6 py-4 w-32">Timestamp</th>
              <th className="px-6 py-4 w-32 text-center">Severity</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Destination</th>
              <th className="px-6 py-4 w-20 text-center">Type</th>
              <th className="px-6 py-4">Message</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {MOCK_LOGS.map(log => (
              <tr 
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="hover:bg-zinc-800/50 transition-colors cursor-pointer group"
              >
                <td className="px-6 py-4 text-[11px] font-mono text-zinc-500">{log.timestamp.split(' ')[1]}</td>
                <td className="px-6 py-4 text-center">
                  <div className={`w-2.5 h-2.5 rounded-full mx-auto ${
                    log.severity === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 
                    log.severity === 'high' ? 'bg-orange-500' : 
                    log.severity === 'medium' ? 'bg-yellow-500' : 'bg-zinc-600'
                  }`} />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-mono font-bold text-white group-hover:text-[#00D4AA] transition-colors">{log.sourceIP}</p>
                    {log.sourceAsset && <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{log.sourceAsset.hostname}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-mono font-bold text-zinc-400">{log.destIP}</p>
                    {log.destInfo && <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter flex items-center gap-1.5">{log.destInfo.flag} {log.destInfo.hostname} {log.destInfo.malicious && <AlertTriangle size={10} className="text-red-500"/>}</p>}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-500 text-[8px] font-black uppercase tracking-widest">{log.type}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-zinc-300 line-clamp-1">{log.message}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-white" title="View PCAP"><Terminal size={14}/></button>
                    <button className="p-1.5 hover:bg-zinc-700 rounded-lg text-zinc-500 hover:text-white" title="Quick Investigate"><Search size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <Breadcrumbs />

      {/* TOP METRICS */}
      <div className="grid grid-cols-6 gap-4">
        <MetricCard label="INGESTION RATE" value="52.4K/s" trend="↑ +2.1K" trendGood={true} sub="Events per second" color="text-[#00D4AA]" />
        <MetricCard label="DAILY VOLUME" value="2.8TB" trend="↑ +240GB" trendGood={false} sub="Data ingested (24h)" />
        <MetricCard label="LATENCY (E2E)" value="140ms" trend="↓ -15ms" trendGood={true} sub="Capture to Index" color="text-blue-400" />
        <MetricCard label="ACTIVE SOURCES" value="12" trend="→ stable" trendGood={true} sub="Reporting now" color="text-purple-400" />
        <MetricCard label="DROP RATE" value="0.02%" trend="↓ -0.01%" trendGood={true} sub="Global data loss" color="text-emerald-500" />
        <MetricCard label="STORAGE USED" value="12.4TB" sub="45 days headroom" color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="space-y-8">
          {/* REAL-TIME INGESTION */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-xl">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Activity size={14} className="text-[#00D4AA]"/> Real-Time Ingestion (EPS)</h3>
                <div className="flex gap-2">
                   <button className="px-2 py-1 bg-zinc-950 border border-zinc-800 text-[8px] font-black uppercase text-zinc-500 rounded">5m</button>
                   <button className="px-2 py-1 bg-zinc-800 border border-zinc-700 text-[8px] font-black uppercase text-white rounded">1h</button>
                </div>
             </div>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={ANALYTICS_DATA.ingestionRate}>
                      <defs>
                        <linearGradient id="colorEps" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00D4AA" stopOpacity={0.2}/><stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                      <XAxis dataKey="time" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                      <Area type="monotone" dataKey="eps" stroke="#00D4AA" fill="url(#colorEps)" strokeWidth={2} dot={false} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[8px] font-black text-zinc-700 uppercase">Avg EPS</p><p className="text-xl font-black text-white">49.8K</p></div>
                <div><p className="text-[8px] font-black text-zinc-700 uppercase">Peak EPS</p><p className="text-xl font-black text-white">68.2K</p></div>
             </div>
          </div>

          {/* INGESTION VOLUME */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><HardDrive size={14} className="text-blue-400"/> Ingestion Volume (30 Days)</h3>
             <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={ANALYTICS_DATA.volumeTrend}>
                      <Bar dataKey="volume" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                      <XAxis dataKey="day" hide />
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3 pt-4 border-t border-zinc-800">
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-zinc-600 uppercase">Storage Growth Rate</span><span className="text-xs font-black text-white">85GB/Day</span></div>
                <div className="flex justify-between items-center"><span className="text-[9px] font-bold text-zinc-600 uppercase">Days Until Full</span><span className="text-xs font-black text-orange-500">45 Days ⚠️</span></div>
             </div>
          </div>

          {/* PIPELINE HEALTH */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Data Pipeline Health</h3>
             <div className="flex flex-col gap-4">
                {[
                  { name: 'INGESTION', pct: 99.98, rate: '52.4K/s', drop: '10', color: 'bg-emerald-500' },
                  { name: 'PARSING', pct: 98.5, rate: '51.3K/s', fail: '770', color: 'bg-orange-500', warn: true },
                  { name: 'ENRICHMENT', pct: 97.2, rate: '49.9K/s', skip: '1.4K', color: 'bg-orange-500', warn: true },
                  { name: 'STORAGE', pct: 99.9, rate: '49.8K/s', err: '50', color: 'bg-emerald-500' },
                ].map((stage, i) => (
                  <div key={stage.name} className="relative">
                    <div className="flex justify-between items-end mb-2">
                       <div><p className="text-[9px] font-black text-zinc-400 uppercase">{stage.name}</p><p className="text-xs font-black text-white">{stage.rate}</p></div>
                       <div className="text-right"><p className={`text-[10px] font-black uppercase ${stage.warn ? 'text-orange-500' : 'text-emerald-500'}`}>{stage.pct}%</p></div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                       <div className={`h-full ${stage.color}`} style={{ width: `${stage.pct}%` }} />
                    </div>
                  </div>
                ))}
             </div>
             <p className="text-[9px] text-zinc-600 italic border-t border-zinc-800 pt-4">Pipeline Efficiency Index: <span className="text-[#00D4AA] font-black">97.8%</span></p>
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-8">
          {/* LOG SOURCE DISTRIBUTION */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-xl flex flex-col">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center justify-between">
              Log Sources Distribution <Database size={14} />
            </h3>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={ANALYTICS_DATA.sourceDist} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                       {ANALYTICS_DATA.sourceDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-[10px] font-black text-zinc-600 uppercase">Events/Day</p>
                 <p className="text-xl font-black text-white">28.4M</p>
              </div>
            </div>
            <div className="space-y-3">
               {ANALYTICS_DATA.sourceDist.map(s => (
                  <div key={s.name} className="flex justify-between items-center group">
                     <div className="flex items-center gap-3 text-[10px] font-black uppercase">
                        <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: s.color}} />
                        <span className="text-zinc-500">{s.name}</span>
                        <span className="text-zinc-700">{s.value}%</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-zinc-500">{s.count}</span>
                        <button className="text-[8px] font-black text-zinc-600 hover:text-[#00D4AA] uppercase opacity-0 group-hover:opacity-100 transition-all">View Logs</button>
                     </div>
                  </div>
               ))}
            </div>
            <div className="p-3 bg-red-900/10 border border-red-900/20 rounded-xl flex items-center gap-3">
               <AlertTriangle size={14} className="text-red-500"/>
               <p className="text-[9px] font-black text-red-500 uppercase">Missing: Syslog, Windows Events (Not configured)</p>
            </div>
          </div>

          {/* TOP LOG GENERATORS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center justify-between">Top Log Generators (Assets) <Activity size={14}/></h3>
             <div className="space-y-4">
                {TOP_GENERATORS.map((gen, i) => (
                   <div key={gen.ip} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4 hover:border-zinc-700 transition-all group">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-sm font-black text-white font-mono">{gen.ip}</p>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">{gen.hostname} • {gen.type}</p>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${gen.anomaly ? 'bg-red-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{gen.anomaly ? 'Anomaly' : 'Normal'}</span>
                            <button className="text-[9px] font-black text-[#00D4AA] uppercase hover:underline opacity-0 group-hover:opacity-100 transition-all">Investigate</button>
                         </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                           <span className="text-zinc-600">{gen.logs} logs/day</span>
                           <span className="text-zinc-400">{gen.pct}% total</span>
                        </div>
                        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                           <div className={`h-full ${gen.anomaly ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${gen.pct * 15}%` }} />
                        </div>
                      </div>
                      {gen.anomaly && <p className="text-[9px] text-red-400 font-bold uppercase tracking-tighter flex items-center gap-2"><Zap size={10}/> {gen.reason} - Spike +340%</p>}
                   </div>
                ))}
             </div>
             <button className="w-full text-center text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">View All Generators →</button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-8">
          {/* DATA QUALITY METRICS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-6 shadow-xl">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Data Quality</h3>
                <span className="text-xl font-black text-emerald-500 tracking-tighter">97.8%</span>
             </div>
             <div className="space-y-4">
                {[
                  { label: 'Successfully Parsed', val: 98.5, color: '#10b981' },
                  { label: 'Enriched Metadata', val: 97.2, color: '#10b981' },
                  { label: 'Complete Fields', val: 99.1, color: '#10b981' },
                  { label: 'Valid Timestamps', val: 99.9, color: '#10b981' },
                ].map(q => (
                  <div key={q.label} className="space-y-1.5">
                     <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase"><span>{q.label}</span><span>{q.val}%</span></div>
                     <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{ width: `${q.val}%` }} /></div>
                  </div>
                ))}
             </div>
             <div className="pt-4 border-t border-zinc-800 space-y-4">
                <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">Common Issues (24h)</p>
                <div className="space-y-2">
                   <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">770 Malformed JSON logs</span>
                      <button className="text-[8px] font-black text-[#00D4AA] opacity-0 group-hover:opacity-100 uppercase transition-all">Fix Parser</button>
                   </div>
                   <div className="flex justify-between items-center p-3 bg-zinc-950 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer group">
                      <span className="text-[10px] text-zinc-400 uppercase font-bold">1.4K Failed GeoIP lookups</span>
                      <button className="text-[8px] font-black text-[#00D4AA] opacity-0 group-hover:opacity-100 uppercase transition-all">Update DB</button>
                   </div>
                </div>
             </div>
          </div>

          {/* STORAGE HEALTH */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 space-y-8 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><HardDrive size={14} /> Storage Status</h3>
             <div className="space-y-6">
                <div>
                   <div className="flex justify-between items-end mb-3">
                      <p className="text-xl font-black text-white tracking-tighter">12.4 <span className="text-sm text-zinc-700">/ 20 TB</span></p>
                      <span className="text-xs font-black text-[#00D4AA]">62% USED</span>
                   </div>
                   <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00D4AA]" style={{ width: '62%' }} />
                   </div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500"><span>Hot Storage (7d)</span><span className="text-white">850GB</span></div>
                   <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500"><span>Warm Storage (30d)</span><span className="text-white">3.2TB</span></div>
                   <div className="flex justify-between items-center text-[10px] uppercase font-bold text-zinc-500"><span>Cold Storage (90d)</span><span className="text-white">8.4TB</span></div>
                </div>
                <div className="p-4 bg-orange-900/10 border border-orange-900/20 rounded-xl text-center space-y-1">
                   <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Storage Exhaustion Warning ⚠️</p>
                   <p className="text-xs font-bold text-white uppercase">Projected full in 45 days</p>
                </div>
                <button className="w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] hover:text-white transition-all">Configure Lifecycle</button>
             </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: AI INSIGHTS */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-[#00D4AA]" />
        <div className="flex items-center justify-between">
           <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.4em] flex items-center gap-3">
              <Brain size={18} className="text-[#00D4AA]" /> System Intelligence Insights
           </h3>
           <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Last 24h Analysis • Build v2.4.1</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <div className="space-y-4">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2"><ShieldAlert size={12}/> Critical Anomalies</p>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">C2 Traffic detected:</span> Asset 10.0.5.42 log volume increased 340% following unusual DNS entropy peaks.</p>
                 <div className="flex gap-2">
                    <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">Investigate</button>
                    <button className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:underline">Dismiss</button>
                 </div>
              </div>
           </div>
           <div className="space-y-4">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={12}/> Pipeline Alerts</p>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">Exhaustion Risk:</span> Total telemetry storage will be at capacity in ~45 days based on current growth rate.</p>
                 <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">Adjust Retention</button>
              </div>
           </div>
           <div className="space-y-4">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={12}/> Performance Hits</p>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">Latency Optimized:</span> End-to-end pipeline latency improved by 10% following recent cluster reconfiguration.</p>
                 <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">View Benchmark</button>
              </div>
           </div>
           <div className="space-y-4">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Layers size={12}/> Optimization</p>
              <div className="space-y-4">
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">Rule Tuning:</span> "DNS-TUNNEL-001" is causing 40% of detection latency. Consider regex optimization.</p>
                 <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">Open Rules</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderLive = () => (
    <div className="animate-in fade-in duration-500 space-y-6 flex flex-col h-full min-h-[700px]">
      <Breadcrumbs />
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg flex-1 flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-6">
             <button onClick={() => setIsLivePaused(!isLivePaused)} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLivePaused ? 'bg-[#f59e0b] text-black' : 'bg-emerald-500 text-black'}`}>
                {isLivePaused ? <Play size={14}/> : <Pause size={14}/>} {isLivePaused ? 'Resume' : 'Pause Live'}
             </button>
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLivePaused ? 'bg-zinc-600' : 'bg-emerald-500 animate-pulse'}`} />
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Streaming: 52 events/sec</span>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:text-white transition-all">Auto-Scroll ON</button>
             <button className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:text-white transition-all">Export View</button>
          </div>
        </div>
        <div className="flex-1 bg-[#0c0c0e] font-mono text-[11px] p-6 overflow-y-auto space-y-2 no-scrollbar">
           {MOCK_LOGS.map((log, i) => (
             <div key={i} className="flex items-center gap-6 py-1 group cursor-pointer hover:bg-white/5 transition-all">
                <span className="text-zinc-700 w-24">{log.timestamp.split(' ')[1]}</span>
                <span className={`w-2 h-2 rounded-full ${log.severity === 'critical' ? 'bg-red-500' : 'bg-emerald-500 opacity-40'}`} />
                <span className="text-[#00D4AA] w-32 font-bold">{log.sourceIP}</span>
                <span className="text-zinc-600 w-4">→</span>
                <span className="text-zinc-400 w-32">{log.destIP}</span>
                <span className="text-zinc-600 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] uppercase font-black w-16 text-center">{log.type}</span>
                <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">{log.message}</span>
             </div>
           ))}
           <div className="animate-pulse flex items-center gap-6 py-1">
              <span className="text-zinc-800 w-24">15:43:01</span>
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
              <div className="h-2 w-32 bg-zinc-900 rounded" />
              <span className="text-zinc-800">→</span>
              <div className="h-2 w-32 bg-zinc-900 rounded" />
              <div className="h-2 w-16 bg-zinc-900 rounded" />
              <div className="h-2 w-64 bg-zinc-900 rounded" />
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-48 px-6 relative">
      {view === 'search' && renderSearch()}
      {view === 'stats' && renderAnalytics()}
      {view === 'live' && renderLive()}

      {/* LOG DETAILS SIDEBAR */}
      {selectedLog && (
        <div className="fixed inset-y-0 right-0 w-[600px] bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 p-6 flex items-center justify-between z-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Log Details</h3>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">{selectedLog.id}</p>
            </div>
            <button 
              onClick={() => setSelectedLog(null)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X size={20} className="text-zinc-500 hover:text-white" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* LOG CONTEXT */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Info size={14} className="text-[#00D4AA]"/> Log Context
              </h4>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
  <div className="flex items-center justify-between">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-wider">Timestamp (UTC)</p>
    <p className="text-sm font-mono text-white">{selectedLog.timestamp}</p>
  </div>
  <div className="flex items-center justify-between">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-wider">Internal Log ID</p>
    <p className="text-sm font-mono text-zinc-400">{selectedLog.id}</p>
  </div>
  <div className="flex items-center justify-between">
    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-wider">Global Severity</p>
    <p className={`text-sm font-black uppercase ${selectedLog.severity === 'critical' ? 'text-red-500' : 'text-zinc-400'}`}>
      {selectedLog.severity}
    </p>
  </div>
</div>
            </div>

            {/* NETWORK INTELLIGENCE */}
            {/* <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Database size={14} className="text-blue-400"/> Network Intelligence
              </h4>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase">Protocol</span>
                  <span className="text-xs font-bold text-white uppercase">{selectedLog.protocol} (Port {selectedLog.port})</span>
                </div>
                {selectedLog.bytes && (
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-zinc-600 uppercase">Payload Size</span>
                    <span className="text-xs font-bold text-white uppercase">{selectedLog.bytes}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
                  <span className="text-[9px] font-bold text-zinc-600 uppercase">Reputation</span>
                  <span className={`text-xs font-bold ${selectedLog.destInfo?.malicious ? 'text-red-500' : 'text-emerald-500'}`}>
                    {selectedLog.destInfo?.reputation}
                  </span>
                </div>
              </div>
            </div> */}

            {/* BEHAVIORAL PATTERN */}
            {/* <div className="space-y-4">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-[#00D4AA]"/> Behavioral Pattern
              </h4>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed font-medium uppercase tracking-tight">
                  {selectedLog.message}
                </p>
                {selectedLog.type === 'dns' && (
                  <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 font-mono text-[10px] text-zinc-500 break-all leading-relaxed">
                    Query: abc123xyz789.evil-domain.com<br/>
                    Response: TXT record with encrypted payload (base64)
                  </div>
                )}
                <div className="pt-4 border-t border-zinc-800 space-y-4">
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                    Temporal Analysis (Last Hour)
                  </p>
                  <div className="h-20 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={Array.from({length: 20}).map((_, i) => ({v: Math.random() * 10}))}>
                        <Area type="monotone" dataKey="v" stroke="#00D4AA" fill="#00D4AA22" strokeWidth={2} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-[#00D4AA] font-bold uppercase text-center">
                    Pattern: Periodic beaconing identified (60s jitter)
                  </p>
                </div>
              </div>
            </div> */}

            {/* ACTIONABLE INTELLIGENCE */}
            {/* <div className="space-y-4 bg-zinc-950/50 p-4 rounded-lg border border-zinc-800/50">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Brain size={14} className="text-purple-400"/> Actionable Intelligence
              </h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:border-[#00D4AA44] transition-all">
                  <span>Create Detection</span>
                  <Plus size={14}/>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white hover:border-[#00D4AA44] transition-all">
                  <span>Escalate Investigation</span>
                  <Activity size={14}/>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-[#e11d4810] border border-[#e11d4822] rounded-xl text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                  <span>Block Destination</span>
                  <ShieldAlert size={14}/>
                </button>
                <button className="w-full flex items-center justify-between px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-white transition-all">
                  <span>Export PCAP</span>
                  <Download size={14}/>
                </button>
              </div>
            </div> */}

            {/* RELATED LOGS */}
            {/* <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} /> Related Logs
              </h4>
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="text-[10px] text-zinc-500 hover:text-white cursor-pointer transition-colors flex justify-between uppercase tracking-tighter">
                    <span>DNS query to evil.domain</span>
                    <span className="font-mono text-[9px] text-zinc-700">15:{42 - i}:18</span>
                  </div>
                ))}
                <button className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline mt-2">
                  View all correlated logs
                </button>
              </div>
            </div> */}
          </div>
        </div>
      )}

      {/* QUERY BUILDER MODAL */}
      {queryBuilderOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-zinc-900 border border-zinc-800 rounded-lg w-full max-w-4xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-zinc-800 flex justify-between items-start">
                 <div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">Advanced Query Builder</h3>
                    <p className="text-[11px] text-[#00D4AA] font-black uppercase tracking-[0.3em] mt-1">Telemetry Search Engine Interface</p>
                 </div>
                 <button onClick={() => setQueryBuilderOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-all"><X size={20}/></button>
              </div>

              <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
                 {/* LOG SOURCE SELECTION */}
                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                       <Database size={12} /> Target Log Source
                    </p>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#00D4AA] appearance-none font-bold uppercase tracking-tight cursor-pointer">
                       <option value="all">All Log Sources</option>
                       <option value="dns">DNS Queries (Zeek)</option>
                       <option value="http">HTTP Traffic (Zeek)</option>
                       <option value="tls">TLS Metadata (Zeek)</option>
                       <option value="flow">Network Flows (NetFlow)</option>
                       <option value="syslog">System Logs (Syslog-ng)</option>
                       <option value="smb">SMB / File Activities</option>
                       <option value="auth">Authentication Events</option>
                    </select>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Search Scope</p>
                    <div className="grid grid-cols-4 gap-4">
                       {['Last Hour', 'Last 24h', 'Last 7d', 'All Time'].map(r => (
                          <button key={r} className={`py-3 rounded-xl text-[11px] font-black uppercase border transition-all ${r === 'Last 24h' ? 'bg-[#00D4AA] border-[#00D4AA] text-black shadow-lg shadow-[#00D4AA33]' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-white'}`}>{r}</button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Search Logic (AND/OR Cluster)</p>
                       <button className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">+ New Group</button>
                    </div>
                    <div className="space-y-3">
                       {[
                         { field: 'source_ip', op: '==', val: '10.0.5.42' },
                         { field: 'dest_port', op: 'in', val: '80, 443, 8080' },
                         { field: 'bytes_out', op: '>', val: '1000000' },
                       ].map((cond, i) => (
                          <div key={i} className="flex items-center gap-3">
                             <select className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-[#00D4AA] appearance-none font-bold uppercase tracking-tight">
                                <option>{cond.field}</option>
                             </select>
                             <select className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-zinc-500 outline-none focus:border-[#00D4AA] appearance-none font-black text-center">
                                <option>{cond.op}</option>
                             </select>
                             <input type="text" defaultValue={cond.val} className="flex-[2] bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white outline-none font-mono focus:border-[#00D4AA]" />
                             <button className="p-3 text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </div>
                       ))}
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-black text-[#00D4AA] uppercase tracking-widest pt-2"><Plus size={14}/> Add Condition</button>
                 </div>

                 <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Quick Patterns</p>
                    <div className="flex flex-wrap gap-2">
                       {['High Volume', 'Failed Conns', 'DNS Tunnel', 'Large Trans', 'After Hours'].map(p => (
                          <button key={p} className="px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-600 hover:text-white hover:border-zinc-700 transition-all uppercase tracking-tighter">{p}</button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-zinc-950/80 border-t border-zinc-800 flex justify-between items-center">
                 <button className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white transition-all">Save as Template</button>
                 <div className="flex gap-4">
                    <button onClick={() => setQueryBuilderOpen(false)} className="px-8 py-3 rounded-lg text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:text-white transition-all">Cancel</button>
                    <button className="px-10 py-3 bg-[#00D4AA] text-black rounded-lg text-[11px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 shadow-xl shadow-[#00D4AA22] transition-all">Run Search</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LogsPage;