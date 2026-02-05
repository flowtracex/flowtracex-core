import React, { useState } from 'react';
import { 
  ArrowLeft, Info, Clock, Share2, Download, Code, 
  ArrowUpRight, RotateCcw, AlertTriangle, Target, MoreHorizontal,
  ChevronRight, ChevronDown, User, Plus, MessageSquare, Monitor, Zap, BarChart2,
  CheckCircle2, Globe, ShieldCheck, Activity, Server, ExternalLink,
  TrendingUp, Waves, AlertCircle, X, FileText, Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import CreateInvestigationModal from '../components/modals/CreateInvestigationModal';

interface Props {
  id: string;
  onBack: () => void;
}

const NETWORK_ACTIVITY_DATA = [
  { time: '00', value: 45, alert: false },
  { time: '01', value: 52, alert: false },
  { time: '02', value: 48, alert: false },
  { time: '03', value: 41, alert: false },
  { time: '04', value: 38, alert: false },
  { time: '05', value: 55, alert: false },
  { time: '06', value: 62, alert: false },
  { time: '07', value: 58, alert: false },
  { time: '08', value: 51, alert: false },
  { time: '09', value: 47, alert: false },
  { time: '10', value: 53, alert: false },
  { time: '11', value: 49, alert: false },
  { time: '12', value: 56, alert: false },
  { time: '13', value: 61, alert: false },
  { time: '14', value: 67, alert: false },
  { time: '15', value: 72, alert: false },
  { time: '16', value: 85, alert: true },
  { time: '17', value: 91, alert: true },
  { time: '18', value: 78, alert: false },
  { time: '19', value: 65, alert: false },
  { time: '20', value: 59, alert: false },
  { time: '21', value: 54, alert: false },
  { time: '22', value: 48, alert: false },
  { time: '23', value: 43, alert: false },
];

const DetectionDetailPage: React.FC<Props> = ({ id, onBack }) => {
  const [activeTab, setActiveTab] = useState('explanation');
  const [behaviorTab, setBehaviorTab] = useState('network');
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isThreatConfirmed, setIsThreatConfirmed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState<string | null>(null);
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);

  const handleConfirmThreat = () => {
    setIsThreatConfirmed(true);
    console.log('Threat confirmed for alert:', id);
  };

  const handleMarkFalsePositive = () => {
    console.log('Marked as false positive:', id);
    onBack();
  };

  const openSidebar = (type: string) => {
    setSidebarOpen(type);
  };

  const closeSidebar = () => {
    setSidebarOpen(null);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-[1300px] mx-auto pb-48 px-4">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Network Live</span>
        </div>
      </div>

      {/* Title Block */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">High Entropy DNS Queries</h2>
              <span className="inline-flex px-3 py-1 rounded border bg-blue-500/10 border-blue-500/20">
                <span className="text-xs font-bold uppercase text-blue-500">Zeek Analyzed</span>
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1.5">Alert ID: {id || 'ALT-001'}</p>
          </div>
        </div>
        <div className="flex gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
              className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2"
            >
              Actions <ChevronDown size={14} />
            </button>
            {actionsDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
                <button 
                  onClick={() => {
                    setIsEscalateOpen(true);
                    setActionsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-3"
                >
                  <ArrowUpRight size={14} className="text-blue-500" />
                  Escalate Case
                </button>
                <button 
                  onClick={() => {
                    handleMarkFalsePositive();
                    setActionsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-3"
                >
                  <AlertCircle size={14} className="text-yellow-500" />
                  Mark False Positive
                </button>
                <button 
                  onClick={() => {
                    console.log('Mark resolved');
                    setActionsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-3"
                >
                  <CheckCircle2 size={14} className="text-green-500" />
                  Mark Resolved
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <button className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all">
              Last 24 Hours
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Content (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Why This Alert Was Triggered */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Why This Alert Was Triggered
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Summary */}
              <p className="text-sm text-zinc-400 leading-relaxed">
                This alert was triggered because the system detected
                <span className="text-white font-semibold">
                  {" "}sustained abnormal outbound data transfer behavior
                </span>
                , which deviated significantly from the host's historical baseline.
              </p>

              {/* Detection stages */}
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
                  Detection Stages
                </h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                  <li>
                    <span className="text-white font-semibold">Anomaly detected:</span>{" "}
                    Initial abnormal outbound activity was identified compared to normal behavior.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Behavior sustained:</span>{" "}
                    The abnormal behavior persisted across multiple observation intervals.
                  </li>
                  <li>
                    <span className="text-white font-semibold">Alert threshold exceeded:</span>{" "}
                    Combined signal confidence crossed the alert threshold, resulting in alert generation.
                  </li>
                </ul>
              </div>

              {/* Key factors */}
              <div>
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-2">
                  Key Contributing Factors
                </h4>
                <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
                  <li>Sustained outbound volume spike</li>
                  <li>Abnormal upload-to-download ratio</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Attack Timeline - Detailed Signal Observations */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#00D4AA]" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Attack Timeline</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-0">
                {/* Timeline Item 1 */}
                <div onClick={() => openSidebar('signal-outbound')} className="flex gap-3 cursor-pointer hover:bg-zinc-900/30 transition-colors rounded-lg p-2 -ml-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00D4AA] border-2 border-[#161618] flex items-center justify-center text-xs font-black text-black z-10">
                      1
                    </div>
                    <div className="w-0.5 h-full bg-[#00D4AA]/30 -mt-1"></div>
                  </div>
                  
                  <div className="flex-1 pb-6 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white uppercase">Initial Activity</span>
                      <span className="text-xs text-zinc-500 ">13:40</span>
                    </div>
                    
                    <div className="rounded-lg p-1">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white mb-1">Outbound Volume Spike</div>
                          <div className="text-xs text-zinc-500 font-medium">The host sent significantly more data than it normally does.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 2 */}
                <div onClick={() => openSidebar('signal-ratio')} className="flex gap-3 cursor-pointer hover:bg-zinc-900/30 transition-colors rounded-lg p-2 -ml-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00D4AA] border-2 border-[#161618] flex items-center justify-center text-xs font-black text-black z-10">
                      2
                    </div>
                    <div className="w-0.5 h-full bg-[#00D4AA]/30 -mt-1"></div>
                  </div>
                  
                  <div className="flex-1 pb-6 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white uppercase">Suspicious Behavior</span>
                      <span className="text-xs text-zinc-500 ">13:45</span>
                    </div>
                    
                    <div className="rounded-lg p-1">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white mb-1">Upload/Download Ratio Shift</div>
                          <div className="text-xs text-zinc-500 font-medium">Unusual upload pattern detected compared to downloads.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 3 */}
                <div className="flex gap-3 hover:bg-zinc-900/30 transition-colors rounded-lg p-2 -ml-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#00D4AA] border-2 border-[#161618] flex items-center justify-center text-xs font-black text-black z-10">
                      3
                    </div>
                    <div className="w-0.5 h-full bg-[#00D4AA]/30 -mt-1"></div>
                  </div>
                  
                  <div className="flex-1 pb-6 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white uppercase">Escalation</span>
                      <span className="text-xs text-zinc-500 ">13:48</span>
                    </div>
                    
                    <div className="rounded-lg p-1">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white mb-1">Sustained Activity Pattern</div>
                          <div className="text-xs text-zinc-500 font-medium">Behavior persisted beyond normal threshold.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 4 - Final */}
                <div className="flex gap-3 hover:bg-zinc-900/30 transition-colors rounded-lg p-2 -ml-2">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-[#161618] flex items-center justify-center text-xs font-black text-black z-10">
                      4
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white uppercase">Alert Generated</span>
                      <span className="text-xs text-zinc-500 ">13:51</span>
                    </div>
                    
                    <div className="rounded-lg p-1">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-white mb-1">Alert Threshold Triggered</div>
                          <div className="text-xs text-zinc-500 font-medium">Combined signals exceeded detection threshold.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Observed Network Behavior - With Two Tabs */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <div className="flex items-center gap-2">
                <BarChart2 size={16} className="text-[#00D4AA]" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Observed Network Behavior</h3>
              </div>
            </div>

            <div className="flex border-b border-[#1e1e20]">
              <button
                onClick={() => setBehaviorTab('network')}
                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                  ${behaviorTab === 'network' 
                    ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-b-2 border-[#00D4AA]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                Network Activity
              </button>
              <button
                onClick={() => setBehaviorTab('data')}
                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                  ${behaviorTab === 'data' 
                    ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-b-2 border-[#00D4AA]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
              >
                Associated Data
              </button>
            </div>

            <div className="p-6">
              {behaviorTab === 'network' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Data</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-[#00D4AA]"></div>
                        <span className="text-sm font-semibold text-white">2.6 GB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-zinc-700"></div>
                        <span className="text-sm text-zinc-400">12.1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-zinc-700"></div>
                        <span className="text-sm text-zinc-400">45 Mbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={NETWORK_ACTIVITY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#71717a', fontSize: 10}} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#71717a', fontSize: 10}} 
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#0a0a0b', 
                            border: '1px solid #1e1e20', 
                            borderRadius: '8px', 
                            fontSize: '10px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#00D4AA"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium italic mt-4">
                    Network traffic shifted from normal download behavior to sustained outbound data transfer.
                  </p>
                </div>
              )}

              {behaviorTab === 'data' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-zinc-900/50 border-b border-zinc-800">
                        <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3 text-left">Timestamp</th>
                          <th className="px-4 py-3 text-left">Protocol</th>
                          <th className="px-4 py-3 text-left">Bytes Sent</th>
                          <th className="px-4 py-3 text-left">Destination</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {[
                          { ts: '13:40:15', proto: 'HTTPS', bytes: '524 KB', dest: '185.12.45.23' },
                          { ts: '13:42:33', proto: 'HTTPS', bytes: '892 KB', dest: '185.12.45.23' },
                          { ts: '13:45:12', proto: 'HTTPS', bytes: '1.2 MB', dest: '185.12.45.23' },
                          { ts: '13:48:45', proto: 'HTTPS', bytes: '1.5 MB', dest: '185.12.45.23' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-zinc-900/30 transition-colors cursor-pointer">
                            <td className="px-4 py-4">
                              <span className="text-xs  text-zinc-400">{row.ts}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-xs  text-[#00D4AA]">{row.proto}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-semibold text-white">{row.bytes}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="text-xs  text-zinc-400">{row.dest}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Info (1/3 width) */}
        <div className="space-y-6">
          
          {/* Affected Systems and Destinations */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Affected Systems and Destinations</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Source System */}
              <button 
                onClick={() => openSidebar('source')}
                className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 hover:border-[#00D4AA] transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server size={16} className="text-[#00D4AA]" />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Source System: WS-FINAN...</div>
                    <div className="text-xs  text-white mt-1">192.168.1.45</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded text-[10px] font-bold uppercase">
                    Critical Asset
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">VLAN: 10</span>
                </div>
              </button>

              {/* Internal Systems */}
              <button 
                onClick={() => openSidebar('internal')}
                className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 hover:border-[#00D4AA] transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server size={16} className="text-blue-500" />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Internal systems involved: 35</div>
                    <div className="text-xs text-white mt-1">FVLAN</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded text-[10px] font-bold uppercase">
                    File Server
                  </span>
                </div>
              </button>

              {/* External Destination */}
              <button 
                onClick={() => openSidebar('external')}
                className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 hover:border-red-500/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe size={16} className="text-red-500" />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">External destinations: 3 un...</div>
                    <div className="text-xs text-white mt-1">DESTINATION</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[10px] font-bold uppercase">
                    External (IP)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* What Should I Check Next */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">What Should I Check Next?</h3>
            </div>
            
            <div className="p-6 space-y-3">
              {[
                'Verify whether activity from WS-FINAN was expected.',
                'Review recent activity on the affected system.',
                'Monitor external connections for continued activity.',
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#00D4AA]/20 border border-[#00D4AA]/40 flex items-center justify-center text-[#00D4AA] text-[10px] font-black">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Classification */}
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Threat Classification</h3>
            </div>
            
            <div className="p-6 space-y-3">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Mitre Attack</div>
              <div className="text-sm font-semibold text-white">TA0010 - Exfiltration</div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Adversary is attempting to steal data from your network.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Modal */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
          onClick={closeSidebar}
        >
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-black border-l border-[#1e1e20] shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="border-b border-[#1e1e20] px-6 py-4 flex items-center justify-between bg-[#161618]">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  {(sidebarOpen === 'signal-outbound' || sidebarOpen === 'signal-ratio') && 'Signal Detail: ' + (sidebarOpen === 'signal-outbound' ? 'Outbound Volume Spike' : 'Upload/Download Ratio Shift')}
                  {sidebarOpen === 'source' && 'Source System Details'}
                  {sidebarOpen === 'internal' && 'Internal Systems'}
                  {sidebarOpen === 'external' && 'External Destinations'}
                  {sidebarOpen === 'evidence1' && 'Evidence: HTTP_105 - C934228'}
                  {sidebarOpen === 'evidence2' && 'Evidence: HTTP_105 - C8442594'}
                  {sidebarOpen === 'stage-0' && 'Attack Stage: Initial Activity'}
                  {sidebarOpen === 'stage-1' && 'Attack Stage: Suspicious Behavior'}
                  {sidebarOpen === 'stage-2' && 'Attack Stage: Escalation'}
                  {sidebarOpen === 'stage-3' && 'Attack Stage: Impact'}
                </h3>
                <button 
                  onClick={closeSidebar}
                  className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto bg-black">
                {/* Signal Detail Tabs */}
                {(sidebarOpen === 'signal-outbound' || sidebarOpen === 'signal-ratio') && (
                  <>
                    <div className="flex border-b border-[#1e1e20]">
                      {[
                        { id: 'explanation', label: 'Explanation' },
                        { id: 'detection', label: 'Detection Logic' },
                        { id: 'evidence', label: 'Evidence' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                            ${activeTab === tab.id 
                              ? 'bg-[#00D4AA]/10 text-[#00D4AA] border-b-2 border-[#00D4AA]' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {activeTab === 'explanation' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg p-4">
                            <p className="text-sm text-white italic leading-relaxed">
                              {sidebarOpen === 'signal-outbound' 
                                ? '"This signal indicates that the observed network behavior deviated significantly from what is normally expected for this system over a sustained period."'
                                : '"The host uploaded much more data than it downloaded, which is unusual for typical network behavior."'
                              }
                            </p>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {sidebarOpen === 'signal-outbound'
                              ? 'This signal indicates that the observed network behavior deviated significantly from what is normally expected for this system over a sustained period.'
                              : 'This pattern often indicates data exfiltration where an attacker is uploading stolen data to an external server while minimizing downloads to avoid detection.'
                            }
                          </p>
                        </div>
                      )}

                      {activeTab === 'detection' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div>
                            <h4 className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest mb-3">What was monitored:</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                              {sidebarOpen === 'signal-outbound' ? (
                                <>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Outbound network data volume</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Duration of sustained transfers</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Upload versus download behavior</span>
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Ratio of uploaded to downloaded data</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Historical baseline of normal traffic patterns</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Sustained upload activity over time</span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-[#1e1e20]">
                            <h4 className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest mb-3">When it is considered suspicious:</h4>
                            <ul className="space-y-2 text-sm text-zinc-400">
                              {sidebarOpen === 'signal-outbound' ? (
                                <>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Data transfer is significantly higher than the system's normal behavior</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Activity persists beyond short or burst-like patterns</span>
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Upload volume significantly exceeds download volume</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <span className="text-[#00D4AA] mt-1">•</span>
                                    <span>Pattern deviates from the host's typical behavior</span>
                                  </li>
                                </>
                              )}
                            </ul>
                          </div>

                          <div className="pt-4 border-t border-[#1e1e20]">
                            <h4 className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest mb-3">Why this matters:</h4>
                            <p className="text-sm text-zinc-400">
                              {sidebarOpen === 'signal-outbound'
                                ? 'This pattern is commonly associated with unauthorized data transfer or exfiltration.'
                                : 'Unusual upload patterns often indicate data theft where attackers extract sensitive information to external servers.'
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {activeTab === 'evidence' && (
                        <div className="space-y-3 animate-in fade-in duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                              Time Window
                            </div>
                            <div className="text-xs  text-white">13:40 - 13:58</div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Related Evidence:</div>
                            
                            <button 
                              onClick={() => setSidebarOpen('evidence1')}
                              className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 text-left hover:border-[#00D4AA] transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-[#00D4AA]" />
                                <div className="flex-1">
                                  <div className="text-xs  text-white">HTTP_105 - UID: C934228</div>
                                </div>
                                <ChevronRight size={16} className="text-zinc-500" />
                              </div>
                            </button>

                            <button 
                              onClick={() => setSidebarOpen('evidence2')}
                              className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 text-left hover:border-[#00D4AA] transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-[#00D4AA]" />
                                <div className="flex-1">
                                  <div className="text-xs  text-white">HTTP_105 - UID: C8442594</div>
                                </div>
                                <ChevronRight size={16} className="text-zinc-500" />
                              </div>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Source System Details */}
                {sidebarOpen === 'source' && (
                  <div className="p-6">
                    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-6 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg">
                          <Server size={32} className="text-[#00D4AA]" />
                        </div>
                        <div>
                          <div className="text-xl font-bold text-white uppercase tracking-tight">WS-FINAN-01</div>
                          <div className="text-xs  text-[#00D4AA] mt-1">192.168.1.45</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-[#1e1e20]">
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-2">VLAN</div>
                          <div className="text-sm font-semibold text-white">FINANCE-VLAN (VLAN 10)</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-2">Asset Classification</div>
                          <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-500 rounded text-[10px] font-bold uppercase">
                            Critical Asset
                          </span>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-2">Last Seen</div>
                          <div className="text-sm font-semibold text-white">2026-01-27 13:58:34 UTC</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attack Stage Details */}
                {sidebarOpen.startsWith('stage-') && (
                  <div className="p-6 space-y-6">
                    {/* What Happened in This Stage */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">What Happened in This Stage</div>
                      <div className="bg-[#00D4AA]/10 border border-[#00D4AA]/30 rounded-lg p-4">
                        <p className="text-sm text-white italic leading-relaxed">
                          "Internal exploration activity targeting sensitive systems was observed."
                        </p>
                      </div>
                    </div>

                    {/* Signals Involved in This Stage */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Signals Involved in This Stage</div>
                      <button className="w-full bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 hover:border-[#00D4AA] transition-all text-left flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-yellow-500" />
                          </div>
                          <span className="text-sm font-semibold text-white">SIG_DR_EXAM</span>
                        </div>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </button>
                    </div>

                    {/* Evidence Summary */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Evidence Summary</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-2">Time Window</div>
                          <div className="text-sm font-semibold text-white">13:58 UTC</div>
                        </div>
                        <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4">
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-2">Affected Systems</div>
                          <div className="text-xs text-white">Multiple systems</div>
                        </div>
                      </div>
                    </div>

                    {/* Why This Stage Matters */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Why This Stage Matters</div>
                      <p className="text-sm text-zinc-400 leading-relaxed italic">
                        "Activity in this stage is often observed before escalation or data loss."
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      <CreateInvestigationModal 
        isOpen={isEscalateOpen} 
        onClose={() => setIsEscalateOpen(false)} 
        initialData={{ title: `High Entropy DNS Queries [192.168.1.45]`, severity: 'high' }}
        onSubmit={(data) => {
          console.log('Case Created:', data);
          setIsEscalateOpen(false);
        }}
      />
    </div>
  );
};

export default DetectionDetailPage;