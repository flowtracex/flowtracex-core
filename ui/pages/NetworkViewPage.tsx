import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Server, 
  LayoutGrid, 
  BarChart3, 
  ShieldAlert, 
  RefreshCcw, 
  Maximize, 
  ZoomIn, 
  ZoomOut, 
  Search, 
  Filter, 
  ArrowRight, 
  Activity,
  ChevronRight,
  Shield,
  Zap,
  MoreVertical,
  ArrowUpRight,
  Globe,
  Database,
  Clock,
  TrendingUp,
  TrendingDown,
  Lock,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  X,
  Monitor
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line, AreaChart, Area 
} from 'recharts';

// --- Types ---
type TabId = 'topology' | 'services' | 'matrix' | 'protocols';
type TimeRange = '1h' | '6h' | '24h' | '7d' | 'all';
type RiskFilter = 'all' | 'critical' | 'high' | 'medium';

interface NetworkNode {
  id: string;
  name: string;
  type: 'firewall' | 'server' | 'workstation' | 'database' | 'external';
  risk: number;
  ip: string;
  connections: string[];
}

interface ServiceData {
  id: string;
  port: number;
  protocol: string;
  service: string;
  assets: number;
  bandwidth: string;
  risk: 'low' | 'medium' | 'high';
}

// --- Mock Data ---
const NODES: NetworkNode[] = [
  { id: '1', name: 'FW-EDGE-01', type: 'firewall', risk: 10, ip: '192.168.1.1', connections: ['2', '3', '4', '6'] },
  { id: '2', name: 'DB-PROD-01', type: 'database', risk: 15, ip: '10.0.3.10', connections: ['1'] },
  { id: '3', name: 'DC-PRIMARY', type: 'server', risk: 65, ip: '10.0.1.5', connections: ['1', '4'] },
  { id: '4', name: 'WKSTN-FIN-042', type: 'workstation', risk: 92, ip: '10.0.5.42', connections: ['1', '3', '5'] },
  { id: '5', name: 'C2-MALICIOUS', type: 'external', risk: 100, ip: '185.234.52.18', connections: ['4'] },
  { id: '6', name: 'APP-WEB-01', type: 'server', risk: 42, ip: '10.0.2.15', connections: ['1'] },
];

const SERVICES: ServiceData[] = [
  { id: 's1', port: 443, protocol: 'TCP', service: 'HTTPS', assets: 142, bandwidth: '4.2 TB', risk: 'low' },
  { id: 's2', port: 53, protocol: 'UDP', service: 'DNS', assets: 850, bandwidth: '890 GB', risk: 'medium' },
  { id: 's3', port: 445, protocol: 'TCP', service: 'SMB', assets: 64, bandwidth: '2.1 TB', risk: 'high' },
  { id: 's4', port: 3389, protocol: 'TCP', service: 'RDP', assets: 12, bandwidth: '156 GB', risk: 'high' },
  { id: 's5', port: 22, protocol: 'TCP', service: 'SSH', assets: 28, bandwidth: '45 GB', risk: 'low' },
  { id: 's6', port: 80, protocol: 'TCP', service: 'HTTP', assets: 31, bandwidth: '12 GB', risk: 'medium' },
];

const PROTOCOL_STATS = [
  { name: 'HTTPS', value: 4500, color: '#00D4AA' },
  { name: 'DNS', value: 2100, color: '#3b82f6' },
  { name: 'SMB', value: 1800, color: '#f59e0b' },
  { name: 'SSH', value: 600, color: '#8b5cf6' },
  { name: 'RDP', value: 400, color: '#e11d48' },
  { name: 'Other', value: 900, color: '#6b7280' },
];

const PROTOCOL_TRENDS = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  HTTPS: 4000 + Math.random() * 1000,
  DNS: 2000 + Math.random() * 500,
  SMB: 1500 + Math.random() * 800,
  Other: 1000 + Math.random() * 400,
}));

const UNUSUAL_PROTOCOLS = [
  { proto: 'Custom Port 8888/TCP', conns: 234, risk: 'medium', firstSeen: '2h ago' },
  { proto: 'Unknown Protocol', conns: 45, risk: 'high', firstSeen: '5h ago' },
  { proto: 'Tunneling Detected', conns: 12, risk: 'critical', firstSeen: '15m ago' },
];

const SEGMENTS = ['DMZ', 'SERVERS', 'WORKSTATIONS', 'CLOUD', 'EXTERNAL'];

const NetworkViewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('topology');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  };

  const selectedNode = useMemo(() => NODES.find(n => n.id === selectedNodeId), [selectedNodeId]);
  const selectedService = useMemo(() => SERVICES.find(s => s.id === selectedServiceId), [selectedServiceId]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => 
      s.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.port.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const tabs: { id: TabId; label: string; icon: any; count?: number }[] = [
    { id: 'topology', label: 'Topology', icon: Network },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'matrix', label: 'Traffic Matrix', icon: LayoutGrid },
    { id: 'protocols', label: 'Protocols', icon: BarChart3 },
  ];

  const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-[#161618] border border-[#1e1e20] p-6 rounded-xl shadow-sm space-y-3">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-[#0a0a0b] border border-[#1e1e20] ${color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
          <h3 className="text-xl font-black text-white tracking-tighter mt-1">{value}</h3>
          <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-500 mt-1">{sub}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-48 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-tight">Network View</h1>
          <p className="text-xs text-zinc-500 font-medium mt-1">Real-time Visualization of Topology, Service Usage, and Cross-Segment Flows</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#0a0a0b] border border-zinc-800 rounded-lg p-1">
            {(['1h', '6h', '24h', '7d', 'all'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wide ${
                  timeRange === r 
                    ? 'bg-[#00D4AA] text-black' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1 bg-[#0a0a0b] border border-zinc-800 rounded-lg p-1">
            {(['all', 'critical', 'high'] as RiskFilter[]).map(rf => (
              <button
                key={rf}
                onClick={() => setRiskFilter(rf)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wide ${
                  riskFilter === rf 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {rf}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : 'text-zinc-300'
            }`}
            disabled={isRefreshing}
          >
            <RefreshCcw size={14} className={isRefreshing ? 'animate-spin text-[#00D4AA]' : ''} /> 
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-1 bg-[#0a0a0b] border border-zinc-800 p-1 rounded-xl w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedNodeId(null);
              setSelectedServiceId(null);
              setSelectedCell(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === tab.id 
                ? 'bg-[#00D4AA] text-black' 
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[650px] relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 rounded-xl">
             <div className="animate-spin rounded-full border-2 border-zinc-800 border-t-[#00D4AA] w-12 h-12" />
             <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider animate-pulse">Syncing Global Network State...</p>
          </div>
        )}

        {/* --- TOPOLOGY TAB --- */}
        {activeTab === 'topology' && (
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
            <div className="flex-1 relative bg-[#0a0a0b]">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button className="p-2 bg-[#161618] border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                  <ZoomIn size={18}/>
                </button>
                <button className="p-2 bg-[#161618] border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                  <ZoomOut size={18}/>
                </button>
                <button className="p-2 bg-[#161618] border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-all">
                  <Maximize size={18}/>
                </button>
              </div>

              <div className="absolute inset-0 p-10 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div 
                    onClick={() => setSelectedNodeId('1')}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#00D4AA] flex items-center justify-center border-4 border-[#00D4AA]/20 shadow-lg group-hover:scale-110 transition-transform">
                      <Shield size={24} className="text-black" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-white whitespace-nowrap uppercase tracking-widest">FW-EDGE-01</span>
                  </div>

                  {NODES.filter(n => n.id !== '1').map((node, i) => {
                    const angle = (i / (NODES.length - 1)) * Math.PI * 2;
                    const radius = 220;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const riskColor = node.risk > 80 ? '#e11d48' : node.risk > 50 ? '#f59e0b' : '#00D4AA';
                    
                    return (
                      <React.Fragment key={node.id}>
                        <div className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-[#00D4AA]/30 to-transparent origin-left"
                          style={{ width: `${radius}px`, transform: `rotate(${angle}rad)`, opacity: 0.3 }} />
                        <div onClick={() => setSelectedNodeId(node.id)} className="absolute cursor-pointer group"
                          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-[#161618] border-2 flex items-center justify-center group-hover:scale-110 transition-transform ${
                            selectedNodeId === node.id ? 'border-white shadow-lg' : 'border-zinc-800'
                          }`}
                            style={{ borderColor: selectedNodeId === node.id ? '#fff' : riskColor }}
                          >
                            {node.type === 'server' && <Server size={20} style={{ color: riskColor }} />}
                            {node.type === 'database' && <Database size={20} style={{ color: riskColor }} />}
                            {node.type === 'workstation' && <Activity size={20} style={{ color: riskColor }} />}
                            {node.type === 'external' && <Globe size={20} style={{ color: riskColor }} className="animate-pulse" />}
                          </div>
                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500 whitespace-nowrap uppercase tracking-tight">{node.name}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-[#161618]/90 backdrop-blur-md border border-[#1e1e20] p-4 rounded-xl space-y-3 z-10">
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Topology Legend</p>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs text-zinc-500 font-medium">Critical Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                      <span className="text-xs text-zinc-500 font-medium">Low Risk</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Server size={10} className="text-zinc-600"/>
                      <span className="text-xs text-zinc-500 font-medium">Server</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity size={10} className="text-zinc-600"/>
                      <span className="text-xs text-zinc-500 font-medium">Endpoint</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="w-full md:w-80 border-l border-[#1e1e20] bg-[#161618] p-6 overflow-y-auto">
              {selectedNode ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">{selectedNode.name}</h3>
                    <button onClick={() => setSelectedNodeId(null)} className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-white">
                      <X size={18}/>
                    </button>
                  </div>
                  <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">IP Address</p>
                      <p className="text-xs font-mono text-white mt-1">{selectedNode.ip}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Network Risk Score</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full transition-all" 
                            style={{ 
                              width: `${selectedNode.risk}%`, 
                              backgroundColor: selectedNode.risk > 80 ? '#e11d48' : selectedNode.risk > 40 ? '#f59e0b' : '#00D4AA' 
                            }} 
                          />
                        </div>
                        <span className="text-sm font-semibold text-white">{selectedNode.risk}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Contextual Flows</p>
                    <div className="space-y-2">
                       <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-3 flex justify-between">
                          <span className="text-xs text-zinc-400">Outbound to External</span>
                          <span className="text-xs font-medium text-zinc-500">2m ago</span>
                       </div>
                       <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-3 flex justify-between">
                          <span className="text-xs text-zinc-400">RPC Auth Attempt</span>
                          <span className="text-xs font-medium text-zinc-500">15m ago</span>
                       </div>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button className="flex-1 bg-[#00D4AA] hover:bg-[#00c399] text-black px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                      Investigate
                    </button>
                    <button className="flex-1 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all">
                      Isolate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                  <div className="w-12 h-12 rounded-lg border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600">
                    <Search size={24} />
                  </div>
                  <p className="text-xs text-zinc-500 font-medium">Select node to analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOTAL SERVICES" value="47" sub="Running now" icon={Zap} color="text-[#00D4AA]" />
              <StatCard label="HIGH RISK" value="3" sub="Needs review" icon={ShieldAlert} color="text-red-500" />
              <StatCard label="TOTAL BANDWIDTH" value="12.4 TB" sub="Last 24h" icon={Activity} color="text-blue-500" />
              <StatCard label="ACTIVE PORTS" value="234" sub="Monitored" icon={Database} color="text-zinc-400" />
            </div>

            <div className="flex gap-6">
              <div className={`transition-all duration-300 ${selectedServiceId ? 'flex-1' : 'w-full'}`}>
                <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Network Services</h3>
                    <div className="relative max-w-xs w-full">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                      <input 
                        type="text" 
                        placeholder="Filter services..." 
                        className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 outline-none focus:border-[#00D4AA] transition-all placeholder:text-zinc-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-zinc-900/50 border-b border-zinc-800">
                        <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">Service</th>
                          <th className="px-4 py-3 text-left">Port / Protocol</th>
                          <th className="px-4 py-3 text-left">Assets</th>
                          <th className="px-4 py-3 text-left">Bandwidth</th>
                          <th className="px-4 py-3 text-left">Risk Profile</th>
                          <th className="px-4 py-3 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {filteredServices.map((service) => (
                          <tr 
                            key={service.id} 
                            onClick={() => setSelectedServiceId(service.id === selectedServiceId ? null : service.id)}
                            className={`hover:bg-zinc-900/30 transition-colors group cursor-pointer ${
                              selectedServiceId === service.id ? 'bg-zinc-900/30' : ''
                            }`}
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-[#0a0a0b] rounded-lg border border-[#1e1e20] text-[#00D4AA] group-hover:bg-zinc-800 transition-all">
                                    <Zap size={14} />
                                 </div>
                                 <span className="text-sm font-semibold text-white uppercase tracking-wide group-hover:text-[#00D4AA] transition-colors">{service.service}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-xs text-zinc-500 font-medium">{service.port} / {service.protocol}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-white">{service.assets}</td>
                            <td className="px-4 py-4 text-sm font-semibold text-white">{service.bandwidth}</td>
                            <td className="px-4 py-4">
                              {service.risk === 'high' && (
                                <span className="inline-flex px-3 py-1 rounded border bg-red-500/10 border-red-500/20 text-xs font-bold uppercase text-red-500">
                                  High
                                </span>
                              )}
                              {service.risk === 'medium' && (
                                <span className="inline-flex px-3 py-1 rounded border bg-yellow-500/10 border-yellow-500/20 text-xs font-bold uppercase text-yellow-500">
                                  Medium
                                </span>
                              )}
                              {service.risk === 'low' && (
                                <span className="inline-flex px-3 py-1 rounded border bg-blue-500/10 border-blue-500/20 text-xs font-bold uppercase text-blue-500">
                                  Low
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button className="p-1.5 hover:bg-zinc-800 rounded transition-colors">
                                <MoreVertical size={14} className="text-zinc-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {selectedService && (
                <div className="w-96 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 shadow-2xl space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wide">{selectedService.service} Details</h4>
                      <p className="text-xs text-zinc-500 font-medium mt-1">Protocol Intelligence Analysis</p>
                    </div>
                    <button onClick={() => setSelectedServiceId(null)} className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-white">
                      <X size={20}/>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">Service Description</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Encrypted web traffic using {selectedService.protocol} protocol on port {selectedService.port}. Primary entry/exit vector for web assets.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Top Assets Using Service</p>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-3">
                           <span className="text-xs font-mono text-white">10.0.5.{i + 40}</span>
                           <span className="text-xs text-zinc-500 font-medium">2.4 GB</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Associated Detections</p>
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3">
                         <ShieldAlert size={16} className="text-red-500" />
                         <div>
                            <p className="text-xs font-bold text-white uppercase">C2 Beaconing Found</p>
                            <p className="text-xs text-zinc-500 font-medium mt-0.5">Jan 15, 08:02 PM • HIGH CONF.</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1e1e20] flex gap-2">
                    <button className="flex-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all">
                      Block Service
                    </button>
                    <button className="flex-1 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all">
                      Investigate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TRAFFIC MATRIX TAB --- */}
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOTAL FLOWS" value="2.4M" sub="Last 24h" icon={Activity} color="text-[#00D4AA]" />
              <StatCard label="ANOMALIES" value="2" sub="Needs attention" icon={ShieldAlert} color="text-red-500" />
              <StatCard label="BUSIEST SEGMENT" value="Workstations" sub="7.9K flows" icon={Monitor} color="text-blue-500" />
              <StatCard label="EXTERNAL TRAFFIC" value="847 GB" sub="Outbound" icon={Globe} color="text-zinc-400" />
            </div>

            <div className="flex gap-6 h-[600px]">
              <div className="flex-1 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cross-Segment Traffic Matrix</h3>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00D4AA]/20" />
                      <span className="text-xs text-zinc-500 font-medium">Low</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-[#00D4AA]" />
                      <span className="text-xs text-zinc-500 font-medium">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm bg-red-500 animate-pulse" />
                      <span className="text-xs font-bold text-red-500 uppercase">Anomaly</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-center border-separate border-spacing-2">
                    <thead>
                      <tr>
                        <th className="p-4"></th>
                        {SEGMENTS.map(h => (
                          <th key={h} className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider p-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SEGMENTS.map((row, i) => (
                        <tr key={row}>
                          <td className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider text-left p-2 whitespace-nowrap">{row}</td>
                          {SEGMENTS.map((col, j) => {
                            const val = (Math.random() * 10).toFixed(1);
                            const isAnomaly = (i === 2 && j === 4) || (i === 1 && j === 0);
                            const isActive = selectedCell?.row === i && selectedCell?.col === j;
                            const intensity = parseFloat(val) / 10;
                            return (
                              <td 
                                key={j} 
                                onClick={() => setSelectedCell({ row: i, col: j })}
                                className={`p-6 rounded-xl text-sm font-semibold transition-all hover:scale-105 cursor-pointer relative group
                                  ${isAnomaly ? 'bg-red-500 text-white shadow-lg' : 'text-white'}
                                  ${isActive ? 'ring-2 ring-white scale-105 z-10' : ''}`}
                                style={!isAnomaly ? { backgroundColor: `rgba(0, 212, 170, ${intensity * 0.4 + 0.1})` } : {}}
                              >
                                {val}K
                                {isAnomaly && <ShieldAlert size={12} className="absolute top-1 right-1" />}
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-xl pointer-events-none transition-opacity" />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedCell && (
                <div className="w-96 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 shadow-2xl space-y-6 overflow-y-auto">
                   <div className="flex justify-between items-center">
                      <div>
                         <h4 className="text-sm font-bold text-white uppercase tracking-wide">Flow Detail</h4>
                         <p className="text-xs text-[#00D4AA] font-medium mt-1">{SEGMENTS[selectedCell.row]} → {SEGMENTS[selectedCell.col]}</p>
                      </div>
                      <button onClick={() => setSelectedCell(null)} className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-white">
                        <X size={20}/>
                      </button>
                   </div>

                   <div className="space-y-6">
                      <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-3">
                         <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-zinc-500 uppercase">Active Sessions</span>
                           <span className="text-sm font-semibold text-white">1,423</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-zinc-500 uppercase">Avg Bandwidth</span>
                           <span className="text-sm font-semibold text-white">4.2 Gbps</span>
                         </div>
                         <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-zinc-500 uppercase">Unique Assets</span>
                           <span className="text-sm font-semibold text-white">84</span>
                         </div>
                      </div>

                      <div className="space-y-3">
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Protocol Breakdown</p>
                         {['HTTPS (82%)', 'SMB (12%)', 'RDP (4%)', 'Other (2%)'].map(p => (
                            <div key={p} className="flex items-center gap-3">
                               <div className="h-1 flex-1 bg-zinc-900 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#00D4AA] transition-all" style={{ width: p.split('(')[1].replace('%)', '') + '%' }} />
                               </div>
                               <span className="text-xs text-zinc-500 font-medium">{p}</span>
                            </div>
                         ))}
                      </div>

                      <div className="pt-6 border-t border-[#1e1e20] space-y-3">
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Recent Connections</p>
                         {[1, 2, 3].map(i => (
                            <div key={i} className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-3 flex justify-between items-center">
                               <span className="text-xs font-mono text-white">10.0.{i}.42 → 10.0.{i + 2}.1</span>
                               <span className="text-xs text-zinc-500 font-medium">2m ago</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <button className="w-full bg-[#00D4AA] hover:bg-[#00c399] text-black px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                     Download Flow Logs
                   </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PROTOCOLS TAB --- */}
        {activeTab === 'protocols' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOP PROTOCOL" value="HTTPS (45%)" sub="45% of traffic" icon={Activity} color="text-[#00D4AA]" />
              <StatCard label="ENCRYPTED" value="78%" sub="TLS/SSL traffic" icon={Lock} color="text-blue-500" />
              <StatCard label="UNUSUAL DETECTED" value="3" sub="Last 24h" icon={ShieldAlert} color="text-red-500" />
              <StatCard label="WEEK CHANGE" value="+12% DNS" sub="vs last week" icon={TrendingUp} color="text-green-500" />
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 h-[400px] flex flex-col">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Volume (Last 24h)</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PROTOCOL_STATS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                        <Tooltip 
                           contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px'}}
                           itemStyle={{color: '#fff'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                           {PROTOCOL_STATS.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 h-[400px] flex flex-col">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Global Distribution</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={PROTOCOL_STATS}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {PROTOCOL_STATS.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px'}} />
                       </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {PROTOCOL_STATS.map((p, i) => (
                       <div key={i} className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: p.color}} />
                             <span className="text-zinc-500 font-medium">{p.name}</span>
                          </div>
                          <span className="text-white font-semibold">{(p.value / 100).toFixed(1)}%</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Protocol Trends (Last 7 Days)</h4>
                    <div className="flex gap-4">
                       {['HTTPS', 'DNS', 'SMB'].map(p => (
                          <div key={p} className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PROTOCOL_STATS.find(s=>s.name===p)?.color }} />
                            <span className="text-xs text-zinc-500 font-medium">{p}</span>
                          </div>
                       ))}
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROTOCOL_TRENDS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 9}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 9}} />
                        <Tooltip contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid #27272a', borderRadius: '8px', fontSize: '10px'}} />
                        <Line type="monotone" dataKey="HTTPS" stroke="#00D4AA" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="DNS" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="SMB" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Unusual Protocols Detected</h4>
                  <div className="space-y-3">
                     {UNUSUAL_PROTOCOLS.map((u, i) => (
                        <div key={i} className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${
                                u.risk === 'critical' ? 'bg-red-500/10 text-red-500' : 
                                u.risk === 'high' ? 'bg-orange-500/10 text-orange-500' : 
                                'bg-yellow-500/10 text-yellow-500'
                              }`}>
                                 <ShieldAlert size={16} />
                              </div>
                              <div>
                                 <p className="text-sm font-semibold text-white uppercase tracking-wide group-hover:text-[#00D4AA] transition-colors">{u.proto}</p>
                                 <p className="text-xs text-zinc-500 font-medium mt-0.5">{u.conns} Connections • {u.firstSeen}</p>
                              </div>
                           </div>
                           <button className="p-1.5 hover:bg-zinc-800 rounded transition-colors">
                             <MoreVertical size={16} className="text-zinc-600"/>
                           </button>
                        </div>
                     ))}
                  </div>
                  <div className="pt-4 border-t border-[#1e1e20] text-center">
                    <button className="text-xs font-medium text-zinc-500 hover:text-[#00D4AA] transition-colors">
                      View All Unusual Traffic
                    </button>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkViewPage;