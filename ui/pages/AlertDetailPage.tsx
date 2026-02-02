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

const AlertDetailPage: React.FC<Props> = ({ id, onBack }) => {
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
    <div className="animate-in fade-in duration-500 max-w-[1300px] mx-auto  pb-32">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Network Live</span>
        </div>
        {/* <div className="flex items-center gap-3">
           <button className="bg-[#161618] border border-[#1e1e20] px-4 py-1.5 rounded-lg text-[10px] font-black text-zinc-400 uppercase flex items-center gap-2">
             Last 24 Hours <ChevronRight size={12} className="rotate-90" />
           </button>
        </div> */}
      </div>

      {/* Title Block */}
      <div className="flex items-center justify-between  py-4">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">High Entropy DNS Queries</h2>
              <span className="px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">Zeek Analyzed</span>
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5">Alert ID: {id || 'ALT-001'}</p>
          </div>
        </div>
        <div className="flex gap-3 relative">
           <div className="relative">
             <button 
               onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
               className="bg-[#161618] border border-[#1e1e20] text-zinc-400 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
             >
               Actions <ChevronDown size={14} />
             </button>
             {actionsDropdownOpen && (
               <div className="absolute right-0 top-full mt-2 w-56 bg-[#161618] border border-[#1e1e20] rounded-lg shadow-2xl z-50 overflow-hidden">
                 <button 
                   onClick={() => {
                     setIsEscalateOpen(true);
                     setActionsDropdownOpen(false);
                   }}
                   className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3"
                 >
                   <ArrowUpRight size={14} className="text-blue-400" />
                   Escalate Case
                 </button>
                 <button 
                   onClick={() => {
                     handleMarkFalsePositive();
                     setActionsDropdownOpen(false);
                   }}
                   className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3 border-t border-[#1e1e20]"
                 >
                   <AlertCircle size={14} className="text-amber-400" />
                   Mark False Positive
                 </button>
                 <button 
                   onClick={() => {
                     console.log('Mark resolved');
                     setActionsDropdownOpen(false);
                   }}
                   className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3 border-t border-[#1e1e20]"
                 >
                   <CheckCircle2 size={14} className="text-emerald-400" />
                   Mark Resolved
                 </button>
               </div>
             )}
           </div>
           <div className="relative">
             <button 
               
               className="bg-[#161618] border border-[#1e1e20] text-zinc-400 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
             >
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
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
  {/* Header */}
  <div className="border-b border-[#1e1e20] px-6 py-4">
    <div className="flex items-center gap-2">
      <AlertTriangle size={16} className="text-amber-400" />
      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
        Why This Alert Was Triggered
      </h3>
    </div>
  </div>

  {/* Body */}
  <div className="p-6">
    <div className="grid grid-cols-1 gap-4">
      {/* Summary */}
      <p className="text-sm text-zinc-400 leading-relaxed">
        This alert was triggered because the system detected
        <span className="text-zinc-200 font-medium">
          {" "}sustained abnormal outbound data transfer behavior
        </span>
        , which deviated significantly from the host’s historical baseline.
      </p>

      {/* Detection stages */}
      <div>
        <h4 className="text-md font-semibold text-zinc-300  tracking-wide mb-2">
          Detection Stages
        </h4>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
          <li>
            <span className="text-zinc-200 font-medium">Anomaly detected:</span>{" "}
            Initial abnormal outbound activity was identified compared to normal behavior.
          </li>
          <li>
            <span className="text-zinc-200 font-medium">Behavior sustained:</span>{" "}
            The abnormal behavior persisted across multiple observation intervals.
          </li>
          <li>
            <span className="text-zinc-200 font-medium">Alert threshold exceeded:</span>{" "}
            Combined signal confidence crossed the alert threshold, resulting in alert generation.
          </li>
        </ul>
      </div>

      {/* Key factors */}
      <div>
        <h4 className="text-md font-semibold text-zinc-300  tracking-wide mb-2">
          Key Contributing Factors
        </h4>
        <ul className="list-disc list-inside text-sm text-zinc-400 space-y-1">
          <li>Sustained outbound volume spike</li>
          <li>Abnormal upload-to-download ratio</li>
        </ul>
      </div>

      {/* Footer note */}
      <p className="text-xs text-zinc-500 italic">
        The activity was observed consistently over a defined time window and was not a single transient spike.
      </p>
    </div>
  </div>
</div>


          {/* Attack Progression */}
          {/* <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-[#00D4AA]" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Attack Progression</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between">
                {[
                  { stage: 'Initial Activity', time: '13:40', status: 'complete', color: 'cyan' },
                  { stage: 'Suspicious Behavior', time: '13:45', status: 'complete', color: 'cyan' },
                  { stage: 'Escalation', time: '13:48', status: 'active', color: 'red' },
                  { stage: 'Impact', time: '13:51', status: 'pending', color: 'red' },
                ].map((item, idx) => (
                  <React.Fragment key={idx}>
                    <button
                      onClick={() => openSidebar(`stage-${idx}`)}
                      className="flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all
                        ${item.status === 'complete' ? `bg-${item.color}-900/20 border-${item.color}-600/40` : 
                          item.status === 'active' ? `bg-${item.color}-900/20 border-${item.color}-500 shadow-lg shadow-${item.color}-500/20` : 
                          'bg-zinc-900/30 border-zinc-700'}`}
                      >
                        {item.status === 'complete' && <CheckCircle2 size={24} className={`text-${item.color}-400`} />}
                        {item.status === 'active' && <AlertCircle size={24} className={`text-${item.color}-400 animate-pulse`} />}
                        {item.status === 'pending' && <Clock size={24} className="text-zinc-600" />}
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] font-black text-white uppercase tracking-tight">{item.stage}</div>
                        <div className="text-[8px] text-zinc-500 font-mono">{item.time}</div>
                      </div>
                    </button>
                    {idx < 3 && (
                      <div className={`flex-1 h-0.5 ${item.status === 'complete' ? `bg-${item.color}-600/30` : 'bg-zinc-700'}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div> */}

          {/* Attack Timeline - Detailed Signal Observations */}
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#00D4AA]" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Attack Timeline</h3>
              </div>
            </div>
            
            <div className="p-6">
            <div className="space-y-0">
  {/* Timeline Item 1 */}
  <div onClick={() => openSidebar('signal-outbound')} className="flex gap-3 cursor-pointer">
    <div  className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-[#0f0f10] flex items-center justify-center text-xs font-black text-black z-10">
        1
      </div>
      <div className="w-0.5 h-full bg-cyan-500/30 -mt-1"></div>
    </div>
    
    <div className="flex-1 pb-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-black text-white uppercase">Initial Activity</span>
        <span className="text-xs text-zinc-500 font-mono">13:40</span>
      </div>
      
      <div className=" rounded-lg p-1">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Outbound Volume Spike</div>
            <div className="text-xs text-zinc-400">The host sent significantly more data than it normally does.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Timeline Item 2 */}
  <div onClick={() => openSidebar('signal-ratio')} className="flex gap-3 cursor-pointer">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-[#0f0f10] flex items-center justify-center text-xs font-black text-black z-10">
        2
      </div>
      <div className="w-0.5 h-full bg-cyan-500/30 -mt-1"></div>
    </div>
    
    <div className="flex-1 pb-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-black text-white uppercase">Initial Activity</span>
        <span className="text-xs text-zinc-500 font-mono">13:40</span>
      </div>
      
      <div className=" rounded-lg p-1">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Outbound Volume Spike</div>
            <div className="text-xs text-zinc-400">The host sent significantly more data than it normally does.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Timeline Item 3 */}
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-[#0f0f10] flex items-center justify-center text-xs font-black text-black z-10">
        3
      </div>
      <div className="w-0.5 h-full bg-cyan-500/30 -mt-1"></div>
    </div>
    
    <div className="flex-1 pb-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-black text-white uppercase">Initial Activity</span>
        <span className="text-xs text-zinc-500 font-mono">13:40</span>
      </div>
      
      <div className=" rounded-lg p-1">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Outbound Volume Spike</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Timeline Item 4 - Final */}
  <div className="flex gap-3">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-[#0f0f10] flex items-center justify-center text-xs font-black text-black z-10">
        4
      </div>
    </div>
    
    <div className="flex-1 max-w-2xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm font-black text-white uppercase">Initial Activity</span>
        <span className="text-xs text-zinc-500 font-mono">13:40</span>
      </div>
      
      <div className=" rounded-lg p-1">
        <div className="flex items-start gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0"></div>
          <div className="flex-1">
            <div className="text-sm font-bold text-white mb-1">Triggered Rule</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>

          {/* Observed Network Behavior - With Two Tabs */}
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
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
                    ? 'bg-[#00D4AA10] text-[#00D4AA] border-b-2 border-[#00D4AA10]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#00D4AA10]'}`}
              >
                Observed Network Behavior
              </button>
              <button
                onClick={() => setBehaviorTab('data')}
                className={`flex-1 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all
                  ${behaviorTab === 'data' 
                    ? 'bg-[#00D4AA10] text-[#00D4AA] border-b-2 border-[#00D4AA10]' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#00D4AA10]'}`}
              >
                Associated Data
              </button>
            </div>

            <div className="p-6">
              {behaviorTab === 'network' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 uppercase tracking-widest font-black text-[9px]">Total Data</span>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-cyan-500"></div>
                        <span className="text-white font-bold">2.6 GB</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-zinc-700"></div>
                        <span className="text-zinc-400">12.1</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-zinc-700"></div>
                        <span className="text-zinc-400">45 Mbps</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={NETWORK_ACTIVITY_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#475569', fontSize: 9}} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{fill: '#475569', fontSize: 9}} 
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#0f0f10', 
                            border: '1px solid #164e63', 
                            borderRadius: '8px', 
                            fontSize: '10px'
                          }} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#22d3ee"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="text-xs text-zinc-500 italic mt-4">
                    Network traffic shifted from normal download behavior to sustained outbound data transfer.
                  </p>
                </div>
              )}

              {behaviorTab === 'data' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-cyan-900/10 border-b border-[#1e1e20]">
                        <tr className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-3">Timestamp</th>
                          <th className="px-4 py-3">Protocol</th>
                          <th className="px-4 py-3">Bytes Sent</th>
                          <th className="px-4 py-3">Destination</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-900/10 text-xs font-mono">
                        {[
                          { ts: '13:40:15', proto: 'HTTPS', bytes: '524 KB', dest: '185.12.45.23' },
                          { ts: '13:42:33', proto: 'HTTPS', bytes: '892 KB', dest: '185.12.45.23' },
                          { ts: '13:45:12', proto: 'HTTPS', bytes: '1.2 MB', dest: '185.12.45.23' },
                          { ts: '13:48:45', proto: 'HTTPS', bytes: '1.5 MB', dest: '185.12.45.23' },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-[#00D4AA10] transition-colors">
                            <td className="px-4 py-3 text-zinc-400">{row.ts}</td>
                            <td className="px-4 py-3 text-[#00D4AA]">{row.proto}</td>
                            <td className="px-4 py-3 text-zinc-300">{row.bytes}</td>
                            <td className="px-4 py-3 text-zinc-400">{row.dest}</td>
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
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Affected Systems and Destinations</h3>
            </div>
            
            <div className="p-4 space-y-3">
              {/* Source System */}
              <button 
                onClick={() => openSidebar('source')}
                className="w-full bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4 hover:border-cyan-600/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server size={16} className="text-[#00D4AA]" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Source System: WS-FINAN...</div>
                    <div className="text-xs font-mono text-white mt-1">192.168.1.45</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded">
                    Critical Asset
                  </span>
                  <span className="text-[8px] text-zinc-500">VLAN: 10</span>
                </div>
              </button>

              {/* Internal Systems */}
              <button 
                onClick={() => openSidebar('internal')}
                className="w-full bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4 hover:border-cyan-600/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server size={16} className="text-blue-400" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Internal systems involved: 35</div>
                    <div className="text-xs text-white mt-1">FVLAN</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-600/20 border border-blue-600/30 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded">
                    File Server
                  </span>
                </div>
              </button>

              {/* External Destination */}
              <button 
                onClick={() => openSidebar('external')}
                className="w-full bg-zinc-900/30 border border-red-900/20 rounded-lg p-4 hover:border-red-600/40 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Globe size={16} className="text-red-400" />
                  <div className="flex-1">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">External destinations: 3 un...</div>
                    <div className="text-xs text-white mt-1">DESTINATION</div>
                  </div>
                  <ChevronRight size={16} className="text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-red-600/20 border border-red-600/30 text-red-400 text-[8px] font-black uppercase tracking-widest rounded">
                    External (IP)
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* What Should I Check Next */}
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
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
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-cyan-900/30 border border-cyan-600/40 flex items-center justify-center text-[#00D4AA] text-[10px] font-black">
                    {idx + 1}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Threat Classification */}
          <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
            <div className="border-b border-[#1e1e20] px-6 py-4">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Threat Classification</h3>
            </div>
            
            <div className="p-6">
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Mitre Attack</div>
              <div className="text-sm text-white font-bold mb-1">TA0010 - Exfiltration</div>
              <p className="text-xs text-zinc-400">
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
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#0c0c0e] border-l border-[#1e1e20] shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full">
              {/* Sidebar Header */}
              <div className="border-b border-[#1e1e20] px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
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
                  className="p-2 hover:bg-[#161618] rounded-lg transition-colors"
                >
                  <X size={20} className="text-zinc-500" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto">
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
                              ? 'bg-[#00D4AA10] text-[#00D4AA] border-b-2 border-[#00D4AA10]' 
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#00D4AA10]'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-6">
                      {activeTab === 'explanation' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="bg-cyan-900/10 border border-cyan-600/30 rounded-lg p-4">
                            <p className="text-sm text-cyan-100 italic leading-relaxed">
                              {sidebarOpen === 'signal-outbound' 
                                ? '"This signal indicates that the observed network behavior deviated significantly from what is normally expected for this system over a sustained period."'
                                : '"The host uploaded much more data than it downloaded, which is unusual for typical network behavior."'
                              }
                            </p>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed">
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
                            <ul className="space-y-2 text-xs text-zinc-300">
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
                            <ul className="space-y-2 text-xs text-zinc-300">
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
                            <p className="text-xs text-zinc-300">
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
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                              Time Window
                            </div>
                            <div className="text-sm font-mono text-white">13:40 - 13:58</div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Related Evidence:</div>
                            
                            <button 
                              onClick={() => setSidebarOpen('evidence1')}
                              className="w-full bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4 text-left hover:border-cyan-600/40 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-[#00D4AA]" />
                                <div className="flex-1">
                                  <div className="text-xs font-mono text-white">HTTP_105 - UID: C934228</div>
                                </div>
                                <ChevronRight size={16} className="text-zinc-500" />
                              </div>
                            </button>

                            <button 
                              onClick={() => setSidebarOpen('evidence2')}
                              className="w-full bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4 text-left hover:border-cyan-600/40 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <FileText size={16} className="text-[#00D4AA]" />
                                <div className="flex-1">
                                  <div className="text-xs font-mono text-white">HTTP_105 - UID: C8442594</div>
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

                {/* Other sidebar content */}
                {sidebarOpen === 'source' && (
                  <div className="p-6">
                    <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-[#00D4AA10] border border-cyan-600/30 rounded-lg">
                          <Server size={32} className="text-[#00D4AA]" />
                        </div>
                        <div>
                          <div className="text-xl font-black text-white uppercase">WS-FINAN-01</div>
                          <div className="text-sm text-[#00D4AA] font-mono mt-1">192.168.1.45</div>
                        </div>
                      </div>
                      
                      <div className="space-y-4 pt-4 border-t border-[#1e1e20]">
                        <div>
                          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">VLAN</div>
                          <div className="text-sm text-white">FINANCE-VLAN (VLAN 10)</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Asset Classification</div>
                          <span className="px-3 py-1 bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-xs font-bold uppercase rounded">
                            Critical Asset
                          </span>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Last Seen</div>
                          <div className="text-sm text-white">2026-01-27 13:58:34 UTC</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {sidebarOpen.startsWith('stage-') && (
                  <div className="p-6 space-y-6">
                    {/* What Happened in This Stage */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">What Happened in This Stage</div>
                      <div className="bg-cyan-900/10 border border-cyan-600/30 rounded-lg p-4">
                        <p className="text-sm text-cyan-100 italic leading-relaxed">
                          "Internal exploration activity targeting sensitive systems was observed."
                        </p>
                      </div>
                    </div>

                    {/* Signals Involved in This Stage */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Signals Involved in This Stage</div>
                      <button className="w-full bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4 hover:border-cyan-600/40 transition-all text-left flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-amber-900/20 border border-amber-600/30 flex items-center justify-center">
                            <AlertTriangle size={16} className="text-amber-400" />
                          </div>
                          <span className="text-sm text-white font-bold">SIG_DR_EXAM</span>
                        </div>
                        <ChevronRight size={16} className="text-zinc-500" />
                      </button>
                    </div>

                    {/* Evidence Summary */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Evidence Summary</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4">
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Time Window</div>
                          <div className="text-base font-black text-white">13:58 UTC</div>
                        </div>
                        <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-4">
                          <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Affected Systems</div>
                          <div className="text-base font-black text-white">Affected system(s) and associated network logs</div>
                        </div>
                      </div>
                    </div>

                    {/* Why This Stage Matters */}
                    <div>
                      <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3">Why This Stage Matters</div>
                      <p className="text-xs text-zinc-400 leading-relaxed italic">
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

export default AlertDetailPage;