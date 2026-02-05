import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Monitor, ShieldAlert, Filter, Download, ChevronRight, 
  ChevronLeft, Plus, Database, Activity, Server, LayoutGrid, 
  ArrowUpRight, Clock, Info, Globe, MoreVertical, X,
  AlertTriangle, ArrowUp, ArrowDown, Cpu, ChevronDown, CheckCircle2,
  ShieldCheck, AlertCircle, Target, Trash2, Smartphone
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { fetchAssets } from '../api/assets';
import { Asset } from '../constants/mockData/assets';

interface EnhancedAsset extends Asset {
  connections: number;
  traffic: string;
  segment: 'DMZ' | 'Production' | 'Engineering' | 'Finance' | 'Corporate' | 'Guest Network';
  vulnerabilities: { critical: number; high: number; medium: number; low: number };
  os: string;
  services: string[];
  logSources: string[];
  lastActivity: string;
}

interface Props {
  onSelectAsset?: (ip: string) => void;
  defaultView?: 'inventory' | 'stats';
}

const RISK_DISTRIBUTION = [
  { name: 'Critical', value: 12, color: '#ef4444' },
  { name: 'High', value: 25, color: '#f97316' },
  { name: 'Medium', value: 45, color: '#eab308' },
  { name: 'Low', value: 18, color: '#3b82f6' },
];

const TYPE_DISTRIBUTION = [
  { name: 'Workstations', value: 840, color: '#00D4AA' },
  { name: 'Servers', value: 210, color: '#3b82f6' },
  { name: 'Databases', value: 45, color: '#6b7280' },
  { name: 'Network', value: 32, color: '#f97316' },
  { name: 'IoT/Other', value: 120, color: '#71717a' },
];

const DISCOVERY_TIMELINE = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  count: 1200 + Math.floor(Math.random() * 100),
  new: Math.floor(Math.random() * 15)
}));

const SEGMENT_RISK = [
  { name: 'Production', risk: 85, assets: 420 },
  { name: 'Engineering', risk: 62, assets: 150 },
  { name: 'DMZ', risk: 92, assets: 45 },
  { name: 'Finance', risk: 40, assets: 80 },
  { name: 'Corporate', risk: 25, assets: 550 },
];

const AssetsPage: React.FC<Props> = ({ onSelectAsset, defaultView = 'inventory' }) => {
  const [view, setView] = useState<'inventory' | 'stats'>(defaultView);
  const [assets, setAssets] = useState<EnhancedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState('all');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  const [activeTab, setActiveTab] = useState<'active' | 'threat'>('active');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAssets().then(data => {
      const segments: EnhancedAsset['segment'][] = ['Production', 'Engineering', 'DMZ', 'Finance', 'Corporate', 'Guest Network'];
      const osList = ['Windows Server 2022', 'macOS 14.2 (Sonoma)', 'Linux (Embedded)', 'Ubuntu 22.04', 'Windows 11'];
      const enriched = data.map((a, i) => ({
        ...a,
        connections: Math.floor(Math.random() * 20000),
        traffic: (Math.random() * 10).toFixed(1) + ' GB',
        segment: segments[i % segments.length],
        os: osList[i % osList.length],
        services: i === 0 ? ['HTTP', 'SMB', 'LDAP', 'DNS'] : i === 1 ? ['SSH'] : ['RTSP', 'HTTP'],
        logSources: i === 0 ? ['known_hosts.log', 'known_services.log'] : i === 1 ?  ['dhcp.log', 'notice.log'] : ['known_hosts.log', 'conn.log'],
        lastActivity: i === 0 ? '2 mins ago' : i === 1 ? 'Just now' : '15 mins ago',
        vulnerabilities: { 
          critical: Math.floor(Math.random() * 5),
          high: Math.floor(Math.random() * 10),
          medium: Math.floor(Math.random() * 20),
          low: Math.floor(Math.random() * 50)
        }
      }));
      setAssets(enriched);
      setLoading(false);
    });
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = !searchTerm || 
        asset.ip.includes(searchTerm) || 
        asset.hostname.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedAssetType === 'all' || asset.type === selectedAssetType;
      const matchesSegment = selectedSegment === 'all' || asset.segment === selectedSegment;
      const matchesRisk = selectedRiskLevel === 'all' || asset.riskLevel === selectedRiskLevel;
      return matchesSearch && matchesType && matchesSegment && matchesRisk;
    });
  }, [assets, searchTerm, selectedAssetType, selectedSegment, selectedRiskLevel]);

  const renderInventory = () => (
    <div className="animate-in fade-in duration-500 space-y-6 max-w-[1300px] mx-auto px-4 pb-32">
      
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Field */}
        <div className="flex-1 min-w-[300px] relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 z-10 pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search by IP, Hostname, or MAC..." 
            className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-lg pl-12 pr-6 py-3 text-sm text-zinc-200 outline-none focus:border-[#00D4AA] transition-all placeholder:text-zinc-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Asset Type Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Asset Type</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className="flex items-center gap-2 bg-[#0a0a0b] border border-[#1e1e20] hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all min-w-[140px]"
            >
              <span className="capitalize">{selectedAssetType === 'all' ? 'All Types' : selectedAssetType}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'type' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
              {['All Types', 'Server', 'Workstation', 'Network Device', 'Database'].map(type => (
                <button 
                  key={type}
                  onClick={() => {
                    setSelectedAssetType(type === 'All Types' ? 'all' : type.toLowerCase());
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Segment Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Segment</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'segment' ? null : 'segment')}
              className="flex items-center gap-2 bg-[#0a0a0b] border border-[#1e1e20] hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all min-w-[160px]"
            >
              <span className="capitalize">{selectedSegment === 'all' ? 'All Segments' : selectedSegment}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'segment' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'segment' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
              {['All Segments', 'Production', 'Engineering', 'DMZ', 'Finance', 'Corporate', 'Guest Network'].map(seg => (
                <button 
                  key={seg}
                  onClick={() => {
                    setSelectedSegment(seg === 'All Segments' ? 'all' : seg);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {seg}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Risk Level Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Risk Level</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'risk' ? null : 'risk')}
              className="flex items-center gap-2 bg-[#0a0a0b] border border-[#1e1e20] hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all min-w-[140px]"
            >
              <span className="capitalize">{selectedRiskLevel === 'all' ? 'All Risks' : selectedRiskLevel}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'risk' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'risk' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg shadow-2xl min-w-[160px] z-50 py-2">
              {['All Risks', 'Critical', 'High', 'Medium', 'Low'].map(risk => (
                <button 
                  key={risk}
                  onClick={() => {
                    setSelectedRiskLevel(risk === 'All Risks' ? 'all' : risk.toLowerCase());
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {risk}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#1e1e20]">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            activeTab === 'active' 
              ? 'text-[#00D4AA] border-b-2 border-[#00D4AA]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Active Inventory
        </button>
        <button
          onClick={() => setActiveTab('threat')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all ${
            activeTab === 'threat' 
              ? 'text-[#00D4AA] border-b-2 border-[#00D4AA]' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          Threat Linked
        </button>
        <div className="ml-auto flex items-center gap-2 px-4">
          <CheckCircle2 size={12} className="text-green-500" />
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight">Live Asset Polling Active</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-900/50 border-b border-zinc-800">
            <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Identity</th>
              <th className="px-4 py-3 text-left">OS / Environment</th>
              <th className="px-4 py-3 text-left">Risk Status</th>
              <th className="px-4 py-3 text-left">Services</th>
              <th className="px-4 py-3 text-left">Log Provenance</th>
              <th className="px-4 py-3 text-left">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-20 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full border-2 border-zinc-800 border-t-[#00D4AA] w-5 h-5" />
                    <span className="text-xs text-zinc-500 uppercase tracking-wide">Synchronizing Inventory...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.slice(0, 10).map((asset, idx) => {
                const riskScore = asset.riskLevel === 'critical' ? 82 : asset.riskLevel === 'high' ? 51 : asset.riskLevel === 'medium' ? 45 : 12;
                const riskColor = asset.riskLevel === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                  asset.riskLevel === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                  asset.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                  'bg-green-500/10 text-green-500 border-green-500/20';
                
                return (
                  <tr 
                    key={asset.ip} 
                    className="hover:bg-zinc-900/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectAsset?.(asset.ip)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-[#161618] border ${asset.riskLevel === 'critical' ? 'border-red-500/20' : 'border-[#1e1e20]'}`}>
                          {asset.type === 'server' ? <Server size={16} className="text-blue-500" /> : <Monitor size={16} className="text-zinc-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white group-hover:text-[#00D4AA] transition-colors">
                            {asset.hostname}
                          </div>
                          <div className="text-xs text-zinc-500 font-medium mt-0.5">
                            {asset.ip}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1.5">
                        <div className="text-sm font-semibold text-white">{asset.os}</div>
                        <div className="flex gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-zinc-900 border border-[#1e1e20] text-zinc-400 rounded text-[10px] font-bold uppercase">
                            {asset.segment}
                          </span>
                          {idx === 0 && (
                            <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded text-[10px] font-bold uppercase">
                              Active Directory
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`inline-flex px-3 py-1 rounded border text-xs font-bold uppercase ${riskColor}`}>
                        {riskScore}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {asset.services.map(service => (
                          <span 
                            key={service}
                            className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded text-[10px] font-bold uppercase"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {asset.logSources.map(log => (
                          <div key={log} className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            {log}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                          <Clock size={12} />
                          <span>{asset.lastActivity}</span>
                        </div>
                        <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-tight">
                          {idx === 0 ? 'INTERNAL-SERVERS-VLAN' : idx === 1 ? 'WIFI USERS' : 'IOT-SENSORS'}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <X size={32} className="text-zinc-600 mb-2" />
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
                      No matching assets
                    </h3>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/30">
          <div className="text-xs text-zinc-500">
            Asset classification derived from SSL, HTTP, and DHCP flows.
          </div>
          <div className="text-xs text-zinc-500">
            Total: <span className="font-bold text-white">{filteredAssets.length}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wide">
          <span>Home</span>
          <ChevronRight size={10} />
          <span>Assets</span>
          <ChevronRight size={10} />
          <span className="text-[#00D4AA]">Risk Analytics</span>
        </div>
        <div className="flex items-center gap-1 bg-[#161618] border border-[#1e1e20] p-1 rounded-lg">
          <button 
            onClick={() => setView('inventory')} 
            className={`px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              view === 'inventory' ? 'bg-[#00D4AA] text-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setView('stats')} 
            className={`px-6 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              view === 'stats' ? 'bg-[#00D4AA] text-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL ASSETS', value: '1,247', trend: '+12', icon: Monitor, trendUp: true },
          { label: 'HIGH RISK ENTITIES', value: '32', trend: '+3', icon: ShieldAlert, trendUp: true },
          { label: 'ACTIVE THREATS', value: '145', trend: '-8', icon: Activity, trendUp: false },
          { label: 'CRITICAL VULNS', value: '28', trend: '+2', icon: AlertTriangle, trendUp: true },
        ].map((stat, i) => (
          <div key={i} className="bg-[#161618] border border-[#1e1e20] p-6 rounded-xl shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
              <stat.icon size={16} className="text-zinc-600" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tighter">{stat.value}</h3>
            <p className="text-[10px] font-bold uppercase tracking-tight text-zinc-500">
              <span className={stat.trendUp ? 'text-red-500' : 'text-green-500'}>{stat.trend}</span> vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 shadow-sm flex flex-col">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Risk Level Distribution</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={RISK_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {RISK_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0b', 
                    border: '1px solid #1e1e20', 
                    borderRadius: '8px', 
                    fontSize: '10px',
                    color: '#fff'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Avg Risk</p>
              <p className="text-2xl font-black text-white">42%</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {RISK_DISTRIBUTION.map(r => (
              <div key={r.name} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                <span className="text-zinc-500">{r.name}</span>
                <span className="text-white ml-auto">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Category Breakdown */}
        <div className="lg:col-span-2 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Asset Category Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TYPE_DISTRIBUTION} layout="vertical" margin={{ left: 40, right: 40 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }} 
                  width={100} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }} 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0b', 
                    border: '1px solid #1e1e20', 
                    borderRadius: '8px', 
                    fontSize: '10px',
                    color: '#fff'
                  }} 
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {TYPE_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold uppercase text-center tracking-wide">
            Infrastructure classified via OUI, MAC analysis, and port fingerprinting.
          </p>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovery Timeline */}
        <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Discovery Timeline</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DISCOVERY_TIMELINE}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4AA" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00D4AA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 9 }} 
                  interval={5} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 9 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0b', 
                    border: '1px solid #1e1e20', 
                    borderRadius: '8px', 
                    fontSize: '10px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#00D4AA" 
                  fill="url(#colorCount)" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Exposure by Segment */}
        <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Risk Exposure by Network Segment</h3>
          <div className="space-y-6">
            {SEGMENT_RISK.map(s => (
              <div key={s.name} className="space-y-2 group cursor-pointer">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wide">
                  <span className="text-zinc-500 group-hover:text-white transition-colors">
                    {s.name} <span className="text-zinc-600">({s.assets} Assets)</span>
                  </span>
                  <span className={s.risk > 80 ? 'text-red-500' : s.risk > 50 ? 'text-orange-500' : 'text-white'}>
                    {s.risk}%
                  </span>
                </div>
                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      s.risk > 80 
                        ? 'bg-red-500' 
                        : s.risk > 50 
                        ? 'bg-orange-500' 
                        : 'bg-[#00D4AA]'
                    }`} 
                    style={{ width: `${s.risk}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-[#1e1e20]">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide text-center">
              Risk calculation integrates vulnerabilities, lateral movement proximity, and asset sensitivity.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Timestamp */}
      <div className="flex justify-center pt-6">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
          Inventory Analytics Sync: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-48 px-4">
      {view === 'inventory' ? renderInventory() : renderStats()}
    </div>
  );
};

export default AssetsPage;