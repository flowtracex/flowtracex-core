
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
  // Added missing icon imports
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
    <div className="bg-[#161618] border border-[#1e1e20] p-5 rounded-lg flex items-center gap-4 hover:border-[#333] transition-all group">
      <div className={`p-3 rounded-xl bg-[#0c0c0e] border border-[#1e1e20] ${color} group-hover:scale-105 transition-transform`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-white mt-0.5 tracking-tight">{value}</p>
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{sub}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in max-w-[1300px] mx-auto fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Network View</h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Real-time Visualization of Topology, Service Usage, and Cross-Segment Flows</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#161618] border border-[#1e1e20] rounded-lg p-1">
            {(['1h', '6h', '24h', '7d', 'all'] as TimeRange[]).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${timeRange === r ? 'bg-[#00D4AA] text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {r}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-1 bg-[#161618] border border-[#1e1e20] rounded-lg p-1">
            {(['all', 'critical', 'high'] as RiskFilter[]).map(rf => (
              <button
                key={rf}
                onClick={() => setRiskFilter(rf)}
                className={`px-3 py-1 text-[9px] font-black rounded-md transition-all uppercase tracking-widest ${riskFilter === rf ? 'bg-[#333] text-white' : 'text-gray-500 hover:text-white'}`}
              >
                {rf}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRefresh}
            className={`flex items-center gap-2 bg-[#161618] border border-[#1e1e20] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:text-white transition-all ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw size={14} className={isRefreshing ? 'animate-spin text-[#00D4AA]' : ''} /> 
            {isRefreshing ? 'Syncing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex flex-wrap gap-1 bg-[#161618] border border-[#1e1e20] p-1 rounded-xl w-max">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedNodeId(null);
              setSelectedServiceId(null);
              setSelectedCell(null);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all relative
              ${activeTab === tab.id ? 'bg-[#00D4AA] text-black' : 'text-gray-400 hover:text-white hover:bg-[#1e1e20]'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[650px] relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-[#0c0c0e]/60 backdrop-blur-[2px] z-[60] flex flex-col items-center justify-center gap-4 rounded-xl">
             <div className="w-12 h-12 border-4 border-[#00D4AA] border-t-transparent rounded-full animate-spin" />
             <p className="text-gray-400 text-xs font-bold uppercase tracking-widest animate-pulse">Syncing Global Network State...</p>
          </div>
        )}

        {/* --- TOPOLOGY TAB --- */}
        {activeTab === 'topology' && (
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[650px]">
            <div className="flex-1 relative bg-[#0c0c0e]">
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button className="p-2 bg-[#161618] border border-[#333] rounded-lg text-gray-400 hover:text-white"><ZoomIn size={18}/></button>
                <button className="p-2 bg-[#161618] border border-[#333] rounded-lg text-gray-400 hover:text-white"><ZoomOut size={18}/></button>
                <button className="p-2 bg-[#161618] border border-[#333] rounded-lg text-gray-400 hover:text-white"><Maximize size={18}/></button>
              </div>

              <div className="absolute inset-0 p-10 flex items-center justify-center">
                <div className="relative w-full h-full">
                  <div 
                    onClick={() => setSelectedNodeId('1')}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#00D4AA] flex items-center justify-center border-4 border-[#00D4AA33] shadow-[0_0_30px_rgba(0,212,170,0.2)] group-hover:scale-110 transition-transform">
                      <Shield size={24} className="text-black" />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-white whitespace-nowrap uppercase tracking-widest">FW-EDGE-01</span>
                  </div>

                  {NODES.filter(n => n.id !== '1').map((node, i) => {
                    const angle = (i / (NODES.length - 1)) * Math.PI * 2;
                    const radius = 220;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const riskColor = node.risk > 80 ? '#e11d48' : node.risk > 50 ? '#f59e0b' : '#00D4AA';
                    
                    return (
                      <React.Fragment key={node.id}>
                        <div className="absolute top-1/2 left-1/2 h-px bg-gradient-to-r from-[#00D4AA44] to-transparent origin-left"
                          style={{ width: `${radius}px`, transform: `rotate(${angle}rad)`, opacity: 0.3 }} />
                        <div onClick={() => setSelectedNodeId(node.id)} className="absolute cursor-pointer group"
                          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
                        >
                          <div className={`w-12 h-12 rounded-xl bg-[#161618] border-2 flex items-center justify-center group-hover:scale-110 transition-transform ${selectedNodeId === node.id ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-[#333]'}`}
                            style={{ borderColor: selectedNodeId === node.id ? '#fff' : riskColor }}
                          >
                            {node.type === 'server' && <Server size={20} style={{ color: riskColor }} />}
                            {node.type === 'database' && <Database size={20} style={{ color: riskColor }} />}
                            {node.type === 'workstation' && <Activity size={20} style={{ color: riskColor }} />}
                            {node.type === 'external' && <Globe size={20} style={{ color: riskColor }} className="animate-pulse" />}
                          </div>
                          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-gray-500 whitespace-nowrap uppercase tracking-tighter">{node.name}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div className="absolute bottom-6 left-6 bg-[#161618]/80 backdrop-blur-md border border-[#1e1e20] p-4 rounded-xl space-y-3 z-10">
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Topology Legend</p>
                 <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#e11d48]" /><span className="text-[8px] font-black text-gray-600 uppercase">Critical Risk</span></div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00D4AA]" /><span className="text-[8px] font-black text-gray-600 uppercase">Low Risk</span></div>
                    <div className="flex items-center gap-2"><Server size={10} className="text-gray-700"/><span className="text-[8px] font-black text-gray-600 uppercase">Server</span></div>
                    <div className="flex items-center gap-2"><Activity size={10} className="text-gray-700"/><span className="text-[8px] font-black text-gray-600 uppercase">Endpoint</span></div>
                 </div>
              </div>
            </div>

            <div className="w-full md:w-80 border-l border-[#1e1e20] bg-[#161618] p-6 overflow-y-auto">
              {selectedNode ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">{selectedNode.name}</h3>
                    <button onClick={() => setSelectedNodeId(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
                  </div>
                  <div className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1e1e20] space-y-4">
                    <div><p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">IP Address</p><p className="text-sm font-mono text-white font-bold">{selectedNode.ip}</p></div>
                    <div>
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Network Risk Score</p>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex-1 h-1.5 bg-[#1e1e20] rounded-full overflow-hidden">
                          <div className="h-full" style={{ width: `${selectedNode.risk}%`, backgroundColor: selectedNode.risk > 80 ? '#e11d48' : selectedNode.risk > 40 ? '#f59e0b' : '#00D4AA' }} />
                        </div>
                        <span className="text-xs font-black text-white">{selectedNode.risk}/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Contextual Flows</p>
                    <div className="space-y-2">
                       <div className="p-3 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] text-[9px] text-gray-500 flex justify-between font-black uppercase tracking-widest">
                          <span>Outbound to External</span>
                          <span className="text-white">2m ago</span>
                       </div>
                       <div className="p-3 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] text-[9px] text-gray-500 flex justify-between font-black uppercase tracking-widest">
                          <span>RPC Auth Attempt</span>
                          <span className="text-white">15m ago</span>
                       </div>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <button className="flex-1 py-2 bg-[#00D4AA] text-black text-[10px] font-black rounded-lg uppercase tracking-widest hover:opacity-80">Investigate</button>
                    <button className="flex-1 py-2 bg-[#1e1e20] text-gray-400 text-[10px] font-black rounded-lg uppercase border border-[#333] hover:text-white tracking-widest">Isolate</button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <div className="w-12 h-12 rounded-lg border border-dashed border-gray-600 flex items-center justify-center text-gray-600">
                    <Search size={24} />
                  </div>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Select node to analyze</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOTAL SERVICES" value="47" sub="Running now" icon={Zap} color="text-[#00D4AA]" />
              <StatCard label="HIGH RISK" value="3" sub="Needs review" icon={ShieldAlert} color="text-[#e11d48]" />
              <StatCard label="TOTAL BANDWIDTH" value="12.4 TB" sub="Last 24h" icon={Activity} color="text-blue-400" />
              <StatCard label="ACTIVE PORTS" value="234" sub="Monitored" icon={Database} color="text-purple-400" />
            </div>

            <div className="flex gap-6">
              <div className={`transition-all duration-300 ${selectedServiceId ? 'flex-1' : 'w-full'} space-y-4`}>
                <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 flex flex-col h-full space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Network Services</h3>
                    <div className="relative group max-w-xs w-full">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00D4AA] transition-colors" />
                      <input 
                        type="text" 
                        placeholder="Filter services..." 
                        className="w-full bg-[#0c0c0e] border border-[#1e1e20] pl-10 pr-4 py-2 rounded-lg text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em] border-b border-[#1e1e20]">
                        <tr>
                          <th className="px-4 py-4">Service</th>
                          <th className="px-4 py-4">Port / Protocol</th>
                          <th className="px-4 py-4">Assets</th>
                          <th className="px-4 py-4">Bandwidth</th>
                          <th className="px-4 py-4">Risk Profile</th>
                          <th className="px-4 py-4 text-right">Ops</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e20]">
                        {filteredServices.map((service) => (
                          <tr 
                            key={service.id} 
                            onClick={() => setSelectedServiceId(service.id === selectedServiceId ? null : service.id)}
                            className={`hover:bg-[#1e1e20] transition-colors group cursor-pointer ${selectedServiceId === service.id ? 'bg-[#1e1e20]' : ''}`}
                          >
                            <td className="px-4 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="p-2 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] text-[#00D4AA] group-hover:bg-[#00D4AA20] transition-all">
                                    <Zap size={14} />
                                 </div>
                                 <span className="text-xs font-bold text-white uppercase tracking-wide group-hover:text-[#00D4AA]">{service.service}</span>
                              </div>
                            </td>
                            <td className="px-4 py-5 font-mono text-[10px] text-gray-500">{service.port} / {service.protocol}</td>
                            <td className="px-4 py-5 text-xs text-gray-300 font-bold">{service.assets}</td>
                            <td className="px-4 py-5 text-xs text-gray-300 font-bold">{service.bandwidth}</td>
                            <td className="px-4 py-5">
                              <span className={`px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest ${
                                service.risk === 'high' ? 'bg-[#e11d4820] text-[#e11d48]' : 
                                service.risk === 'medium' ? 'bg-[#f59e0b20] text-[#f59e0b]' : 
                                'bg-[#00D4AA20] text-[#00D4AA]'
                              }`}>
                                {service.risk}
                              </span>
                            </td>
                            <td className="px-4 py-5 text-right"><MoreVertical size={14} className="text-gray-700 ml-auto" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {selectedService && (
                <div className="w-96 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 animate-in slide-in-from-right-4 duration-300 shadow-2xl flex flex-col gap-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{selectedService.service} Details</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-widest">Protocol Intelligence Analysis</p>
                    </div>
                    <button onClick={() => setSelectedServiceId(null)} className="text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1e1e20]">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Service Description</p>
                      <p className="text-xs text-gray-400 leading-relaxed">Encrypted web traffic using {selectedService.protocol} protocol on port {selectedService.port}. Primary entry/exit vector for web assets.</p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest">Top Assets Using Service</p>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#1e1e20] rounded-lg border border-[#333]">
                           <span className="text-[10px] font-mono font-bold text-white">10.0.5.{i + 40}</span>
                           <span className="text-[9px] font-black text-gray-600 uppercase">2.4 GB</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] font-black text-[#e11d48] uppercase tracking-widest">Associated Detections</p>
                      <div className="p-4 bg-[#e11d480a] border border-[#e11d4822] rounded-xl flex items-center gap-3">
                         <ShieldAlert size={16} className="text-[#e11d48]" />
                         <div>
                            <p className="text-[10px] font-black text-white uppercase">C2 Beaconing Found</p>
                            <p className="text-[9px] text-gray-500 mt-0.5">Jan 15, 08:02 PM • HIGH CONF.</p>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-[#1e1e20] flex gap-2">
                    <button className="flex-1 py-3 bg-[#e11d48] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:opacity-90">Block Service</button>
                    <button className="flex-1 py-3 bg-[#1e1e20] border border-[#333] text-gray-300 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white">Investigate</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TRAFFIC MATRIX TAB --- */}
        {activeTab === 'matrix' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOTAL FLOWS" value="2.4M" sub="Last 24h" icon={Activity} color="text-[#00D4AA]" />
              <StatCard label="ANOMALIES" value="2" sub="Needs attention" icon={ShieldAlert} color="text-[#e11d48]" />
              <StatCard label="BUSIEST SEGMENT" value="Workstations" sub="7.9K flows" icon={Monitor} color="text-blue-400" />
              <StatCard label="EXTERNAL TRAFFIC" value="847 GB" sub="Outbound" icon={Globe} color="text-purple-400" />
            </div>

            <div className="flex gap-6 h-[600px]">
              <div className="flex-1 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 flex flex-col space-y-8 overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cross-Segment Traffic Matrix</h3>
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#00D4AA22]" /><span className="text-[9px] font-black text-gray-600 uppercase">Low</span></div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#00D4AA]" /><span className="text-[9px] font-black text-gray-600 uppercase">High</span></div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-[#e11d48] animate-pulse" /><span className="text-[9px] font-black text-[#e11d48] uppercase">Anomaly</span></div>
                  </div>
                </div>
                
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-center border-separate border-spacing-2">
                    <thead>
                      <tr>
                        <th className="p-4"></th>
                        {SEGMENTS.map(h => (
                          <th key={h} className="text-[9px] font-black text-gray-500 uppercase tracking-widest p-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SEGMENTS.map((row, i) => (
                        <tr key={row}>
                          <td className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-left p-2 whitespace-nowrap">{row}</td>
                          {SEGMENTS.map((col, j) => {
                            const val = (Math.random() * 10).toFixed(1);
                            const isAnomaly = (i === 2 && j === 4) || (i === 1 && j === 0);
                            const isActive = selectedCell?.row === i && selectedCell?.col === j;
                            const intensity = parseFloat(val) / 10;
                            return (
                              <td 
                                key={j} 
                                onClick={() => setSelectedCell({ row: i, col: j })}
                                className={`p-6 rounded-xl text-xs font-black transition-all hover:scale-105 cursor-pointer relative group
                                  ${isAnomaly ? 'bg-[#e11d48] text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'text-gray-300'}
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
                <div className="w-96 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 animate-in slide-in-from-right-4 duration-300 shadow-2xl space-y-10 overflow-y-auto">
                   <div className="flex justify-between items-center">
                      <div>
                         <h4 className="text-sm font-black text-white uppercase tracking-widest">Flow Detail</h4>
                         <p className="text-[10px] text-[#00D4AA] font-bold uppercase mt-1">{SEGMENTS[selectedCell.row]} → {SEGMENTS[selectedCell.col]}</p>
                      </div>
                      <button onClick={() => setSelectedCell(null)} className="text-gray-600 hover:text-white transition-colors"><X size={20}/></button>
                   </div>

                   <div className="space-y-6">
                      <div className="p-5 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] space-y-4">
                         <div className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-600 uppercase">ACTIVE SESSIONS</span><span className="text-xs font-black text-white">1,423</span></div>
                         <div className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-600 uppercase">AVG BANDWIDTH</span><span className="text-xs font-black text-white">4.2 Gbps</span></div>
                         <div className="flex justify-between items-center"><span className="text-[9px] font-black text-gray-600 uppercase">UNIQUE ASSETS</span><span className="text-xs font-black text-white">84</span></div>
                      </div>

                      <div className="space-y-3">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Protocol Breakdown</p>
                         {['HTTPS (82%)', 'SMB (12%)', 'RDP (4%)', 'Other (2%)'].map(p => (
                            <div key={p} className="flex items-center gap-3">
                               <div className="h-1 flex-1 bg-[#1e1e20] rounded-full overflow-hidden">
                                  <div className="h-full bg-[#00D4AA]" style={{ width: p.split('(')[1].replace('%)', '') + '%' }} />
                               </div>
                               <span className="text-[9px] font-bold text-gray-500 uppercase">{p}</span>
                            </div>
                         ))}
                      </div>

                      <div className="pt-6 border-t border-[#1e1e20] space-y-4">
                         <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Recent Connections</p>
                         {[1, 2, 3].map(i => (
                            <div key={i} className="p-3 bg-[#1e1e20] rounded-xl border border-[#333] flex justify-between items-center">
                               <span className="text-[10px] font-mono font-bold text-gray-300">10.0.{i}.42 → 10.0.{i + 2}.1</span>
                               <span className="text-[8px] font-black text-gray-600 uppercase">2m ago</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <button className="w-full py-3 bg-[#00D4AA] text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:opacity-80">Download Flow Logs</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PROTOCOLS TAB --- */}
        {activeTab === 'protocols' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="TOP PROTOCOL" value="HTTPS (45%)" sub="45% of traffic" icon={Activity} color="text-[#00D4AA]" />
              <StatCard label="ENCRYPTED" value="78%" sub="TLS/SSL traffic" icon={Lock} color="text-blue-400" />
              <StatCard label="UNUSUAL DETECTED" value="3" sub="Last 24h" icon={ShieldAlert} color="text-[#e11d48]" />
              <StatCard label="WEEK CHANGE" value="+12% DNS" sub="vs last week" icon={TrendingUp} color="text-purple-400" />
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 h-[400px] flex flex-col space-y-8">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Volume (Last 24h)</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PROTOCOL_STATS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                      <Tooltip 
                         contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}}
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

               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 h-[400px] flex flex-col space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Distribution</h4>
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
                          <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                       </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {PROTOCOL_STATS.map((p, i) => (
                       <div key={i} className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter">
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: p.color}} />
                             <span className="text-gray-500">{p.name}</span>
                          </div>
                          <span className="text-white">{(p.value / 100).toFixed(1)}%</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-10">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Trends (Last 7 Days)</h4>
                    <div className="flex gap-4">
                       {['HTTPS', 'DNS', 'SMB'].map(p => (
                          <div key={p} className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PROTOCOL_STATS.find(s=>s.name===p)?.color }} /><span className="text-[8px] font-black text-gray-600 uppercase">{p}</span></div>
                       ))}
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={PROTOCOL_TRENDS}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 9}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 9}} />
                        <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                        <Line type="monotone" dataKey="HTTPS" stroke="#00D4AA" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="DNS" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="SMB" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 flex flex-col space-y-6">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unusual Protocols Detected</h4>
                  <div className="space-y-4 flex-1">
                     {UNUSUAL_PROTOCOLS.map((u, i) => (
                        <div key={i} className="bg-[#0c0c0e] border border-[#1e1e20] p-4 rounded-lg flex items-center justify-between group hover:border-[#333] transition-all">
                           <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-xl ${u.risk === 'critical' ? 'bg-[#e11d4820] text-[#e11d48]' : u.risk === 'high' ? 'bg-[#f59e0b20] text-[#f59e0b]' : 'bg-[#00D4AA20] text-[#00D4AA]'}`}>
                                 <ShieldAlert size={16} />
                              </div>
                              <div>
                                 <p className="text-xs font-black text-white uppercase tracking-wide group-hover:text-[#00D4AA] transition-colors">{u.proto}</p>
                                 <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-0.5">{u.conns} Connections • {u.firstSeen}</p>
                              </div>
                           </div>
                           <button className="p-2 text-gray-700 hover:text-white transition-colors"><MoreVertical size={16}/></button>
                        </div>
                     ))}
                  </div>
                  <div className="pt-4 border-t border-[#1e1e20] text-center">
                    <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-[#00D4AA] transition-colors">View All Unusual Traffic</button>
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
