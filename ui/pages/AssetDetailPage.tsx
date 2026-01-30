import React, { useState } from 'react';
import { 
  ArrowLeft, Monitor, ShieldAlert, Wifi, Activity, Clock, Lock, 
  Info, Globe, Shield, Terminal, Server, ArrowRight, Database,
  TrendingUp, Calendar, Zap, AlertTriangle, ExternalLink, ShieldCheck,
  Layers, CheckCircle, XCircle, AlertCircle, Eye, ChevronDown, MoreVertical
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  ip: string;
  onBack: () => void;
}

const AssetDetailPage: React.FC<Props> = ({ ip, onBack }) => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [showActionMenu, setShowActionMenu] = useState(false);

  const riskData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}h`,
    score: 60 + Math.random() * 30
  }));

  const trafficData = [
    { name: 'SMB', value: 46, color: '#10b981' },
    { name: 'DNS', value: 23, color: '#3b82f6' },
    { name: 'LDAP', value: 15, color: '#f59e0b' },
  ];

  return (
    <div className="animate-in max-w-[1300px] mx-auto fade-in duration-500 space-y-8 pb-32">
      
      {/* Header Section */}
      <div className="space-y-6">
        {/* Top Bar with Back Button and Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack} 
              className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all hover:border-zinc-700"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">{ip}</h2>
                <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  STABLE ASSET
                </span>
              </div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5">
                MS-ENG-042 • Windows Server 2022 • Server Role (High Confidence)
              </p>
            </div>
          </div>

          {/* Action Button Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="flex items-center gap-3 px-6 py-3 bg-[#161618] border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
            >
              <MoreVertical size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Actions</span>
              <ChevronDown size={14} className={`transition-transform ${showActionMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {showActionMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    // Handle isolate action
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-900 transition-colors border-b border-zinc-800/50"
                >
                  <Lock size={14} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400">Isolate Asset (EDR)</span>
                </button>
                <button
                  onClick={() => {
                    setShowActionMenu(false);
                    // Handle manual review action
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-900 transition-colors"
                >
                  <Eye size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-400">Manual Review Cycle</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Summary Banner */}
        {/* <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
          <Info size={16} className="text-blue-400 mt-0.5" />
          <p className="text-xs text-blue-200 leading-relaxed">
            <span className="font-black">Summary:</span> This server is behaving like a predictable internal service host. Current activity is 92% consistent with its 30-day baseline.
          </p>
        </div> */}

        {/* Risk Score Card */}
       
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* How This Host Uses the Network */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-emerald-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">How This Host Uses the Network</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest text-emerald-400">
                    1h
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors">
                    24h
                  </button>
                  <button className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors">
                    7d
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-xs text-zinc-500 mb-6">
                This shows what kind of network activity this host primarily generates.
              </p>

              <div className="grid grid-cols-2 gap-8">
                {/* Traffic Volume */}
                <div>
                  <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Traffic Volume</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-emerald-400">Inbound (92%)</span>
                        <span className="text-sm font-black text-white">1.2 GB</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-blue-400">Outbound (8%)</span>
                        <span className="text-sm font-black text-white">104 MB</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: '8%' }} />
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-4 italic">
                    Volume is consistent with typical internal server behavior (Inbound  Outbound).
                  </p>
                </div>

                {/* Main Types of Traffic */}
                <div>
                  <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-4">Main Types of Traffic</h4>
                  <div className="flex items-center gap-6">
                    <div className="relative w-40 h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={trafficData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {trafficData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">ZEEK</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">SMB</span>
                          <span className="text-xs font-black text-zinc-500">46%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">DNS</span>
                          <span className="text-xs font-black text-zinc-500">23%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">LDAP</span>
                          <span className="text-xs font-black text-zinc-500">15%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-4 italic">
                    Traffic distribution matches standard Active Directory server role profile.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How Predictable This Host Is */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">How Predictable This Host Is</h3>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-xs text-zinc-500 mb-6">
                Current activity closely matches learned behavior.
              </p>

              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-end justify-center gap-2 h-32">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = 30 + Math.random() * 70;
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-emerald-400 mb-2">92%</div>
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Match</div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Services */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server size={14} className="text-blue-400" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Active Services</h3>
              </div>
              <button className="text-[9px] font-bold text-blue-400 uppercase tracking-wider hover:text-blue-300 transition-colors">
                See Config Log
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { name: 'LDAP', status: 'Listening', change: '+8.2%' },
                  { name: 'DNS', status: 'Listening', change: '-2%' },
                  { name: 'HTTP', status: 'Listening', change: '+3%' },
                ].map((service, i) => (
                  <div key={i} className="bg-[#0d0d0f] border border-zinc-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-white">{service.name}</span>
                      <CheckCircle size={12} className="text-emerald-400" />
                    </div>
                    <div className="text-[9px] text-zinc-600 font-medium mb-2">{service.status}</div>
                    <div className={`text-xs font-bold ${service.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {service.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
        <div className="bg-[#0a0a0b] border border-emerald-500/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Asset Risk Score</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-black text-emerald-400">12</span>
                <span className="text-sm font-black text-emerald-500 uppercase">Nominal</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>
          
          {/* Why This Host Is Considered Stable */}
          <div className="bg-[#0a0a0b] border border-emerald-500/30 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-emerald-500/20 bg-emerald-950/10">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-wider">Why This Host Is Considered Stable</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={14} className="text-emerald-400 mt-1" />
                <div>
                  <div className="text-xs font-bold text-white mb-1">LDAP / SMB usage within learned baseline</div>
                  <div className="text-[10px] text-zinc-500">-15</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={14} className="text-emerald-400 mt-1" />
                <div>
                  <div className="text-xs font-bold text-white mb-1">No lateral movement detected</div>
                  <div className="text-[10px] text-zinc-500">-15</div>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Risk Summary */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="text-[9px] font-black text-zinc-600 uppercase tracking-wider mb-2">Operational Risk Summary</div>
              <div className="text-2xl font-black text-emerald-400">Low Risk</div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-wider mb-3">Things to Watch For</div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="text-xs text-zinc-400">Outbound SMB to new subnets</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="text-xs text-zinc-400">LDAP spikes outside business hours</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 mt-1">•</span>
                    <span className="text-xs text-zinc-400">Anomalous DNS query patterns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Who It Talks To */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="flex items-center gap-2 text-blue-400">
                <Globe size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-wider">Who It Talks To</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-600 uppercase">Production Segment</span>
                <div className="flex items-center gap-2">
                  <Database size={10} className="text-emerald-400" />
                  <span className="text-xs font-mono text-white">Production Segment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Where It Reaches Out */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="flex items-center gap-2 text-blue-400">
                <ArrowRight size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-wider">Where It Reaches Out</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 bg-[#0d0d0f] border border-blue-500/30 rounded-lg p-3">
                <Globe size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-white">Known Update Servers</span>
              </div>
            </div>
          </div>

          {/* Recent Milestones */}
          <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
              <div className="flex items-center gap-2 text-blue-400">
                <Clock size={14} />
                <h3 className="text-[10px] font-black uppercase tracking-wider">Recent Milestones</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={14} className="text-emerald-400 mt-1" />
                <div>
                  <div className="text-[10px] text-zinc-600 font-medium">80 days ago</div>
                  <div className="text-xs font-bold text-white mt-1">Baseline learning cycle complete</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={14} className="text-blue-400 mt-1" />
                <div>
                  <div className="text-[10px] text-zinc-600 font-medium">Yesterday</div>
                  <div className="text-xs font-bold text-white mt-1">Scheduled Patch Window observed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailPage;