import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronRight, Monitor, Activity, ShieldCheck, 
  Clock, Download, ChevronDown, CheckCircle2, Zap, AlertTriangle,
  Shield, Cpu, Hash, Wifi, Globe, Lock, Server, AlertCircle,
  FileText, Eye, Users, Target, TrendingUp, Plus
} from 'lucide-react';

interface Props {
  id: string;
  onBack: () => void;
}

const InvestigationDetailPage: React.FC<Props> = ({ id, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);

  return (
    <div className="animate-in fade-in duration-500 max-w-[1300px] mx-auto space-y-6 pb-32">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Ingestion: Healthy</span>
        </div>
      </div>

      {/* Title Block */}
      <div className="flex items-center justify-between  py-4">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Persistent C2 Beaconing Activity</h2>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5">Case ID: {id || 'INV-2024-001'}</p>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setActionsDropdownOpen(!actionsDropdownOpen)}
            className="bg-[#161618] border border-[#1e1e20] text-zinc-400 px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2"
          >
            Actions <ChevronDown size={14} />
          </button>
          {actionsDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#161618] border border-[#1e1e20] rounded-lg shadow-2xl z-50 overflow-hidden">
              <button 
                onClick={() => {
                  console.log('Resolve case');
                  setActionsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3"
              >
                <CheckCircle2 size={14} className="text-emerald-400" />
                Resolve Case
              </button>
              <button 
                onClick={() => {
                  console.log('Escalate to me');
                  setActionsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3 border-t border-[#1e1e20]"
              >
                <TrendingUp size={14} className="text-blue-400" />
                Escalate to Me
              </button>
              <button 
                onClick={() => {
                  console.log('Isolate host');
                  setActionsDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-left text-xs text-zinc-300 hover:bg-[#1e1e20] transition-colors flex items-center gap-3 border-t border-[#1e1e20]"
              >
                <Shield size={14} className="text-red-400" />
                Isolate Host
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-zinc-800">
        <div className="flex gap-1">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'alerts', label: 'Alerts & Signals', icon: AlertTriangle },
            { id: 'evidence', label: 'Evidence', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'notes', label: 'Notes & Decisions', icon: CheckCircle2 },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all relative flex items-center gap-2 ${
                  activeTab === tab.id 
                    ? 'text-emerald-400 border-b-2 border-emerald-500' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-300">
        {activeTab === 'overview' && (
          <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Case Header Card - Compact */}
        <div className="bg-[#0f0f10] border border-[#1e1e20] border-l-4 border-l-red-500 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-2.5 py-0.5 bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-black uppercase rounded">
              Critical - P1
            </span>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Persistent DNS Tunneling & SMB Lateral Movement</h2>
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Lead Analyst</div>
              <div className="text-white font-bold">Alex Rivera</div>
            </div>
            <div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Time Open</div>
              <div className="text-white font-bold">2 hours ago</div>
            </div>
            <div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Primary Entity</div>
              <div className="text-white font-bold">MGMT-CHQ-K02 (10.0.2.88)</div>
            </div>
            <div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-0.5">Connected Alerts</div>
              <div className="text-white font-bold">3 Records</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Column */}
          <div className="space-y-4">
            
            {/* Case Origin */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <Target size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Case Origin</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Created From</div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-[#00D4AA]" />
                    <span className="text-sm text-white font-bold">Signal: DNS Tunneling Detected</span>
                  </div>
                </div>
                <div className="bg-cyan-900/10 border border-cyan-600/30 rounded-lg p-3">
                  <p className="text-sm text-cyan-100 italic leading-relaxed">
                    "Auto-escalated due to related SMB lateral movement"
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <FileText size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Executive Summary</h3>
                </div>
              </div>
              <div className="p-4">
                <ul className="text-sm text-zinc-300 leading-relaxed space-y-1.5 list-disc list-inside">
                  <li>Investigation into a series of high-entropy DNS queries</li>
                  <li>Unauthorized SMB enumeration from the management workstation</li>
                  <li>Patterns suggest data exfiltration attempt</li>
                  <li>Following local credential compromise</li>
                </ul>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recent Activity</h3>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { time: '18:05:12', text: 'Evidence item EV-01 (dns.log) attached to case' },
                  { time: '17:40:03', text: 'Isolated host MGMT-CHQ-K02 from Guest VLAN' },
                  { time: '17:12:18', text: 'Related Use Case UC-1021-SMB associated with this case' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <span className="text-zinc-600 font-mono min-w-[4.5rem]">{item.time}</span>
                    <span className="text-zinc-400">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            
            {/* Affected Scope */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <Target size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Affected Scope</h3>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Server size={14} />
                    <span className="text-xs uppercase font-bold">Affected Host(s)</span>
                  </div>
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Users size={14} />
                    <span className="text-xs uppercase font-bold">Internal Systems Involved</span>
                  </div>
                  <span className="text-white font-bold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Globe size={14} />
                    <span className="text-xs uppercase font-bold">External Destinations</span>
                  </div>
                  <span className="text-white font-bold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock size={14} />
                    <span className="text-xs uppercase font-bold">Observed Time Window</span>
                  </div>
                  <span className="text-white font-bold">22 minutes</span>
                </div>
              </div>
            </div>

            {/* Current Assessment */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <ShieldCheck size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Assessment</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Status</span>
                    <span className="text-sm text-amber-400 font-bold">Under Investigation</span>
                  </div>
                  <div className="h-[30px] w-[1px] bg-zinc-700"></div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Verdict</span>
                    <span className="text-sm text-red-400 font-bold">Likely Malicious</span>
                  </div>
                  <div className="h-[30px] w-[1px] bg-zinc-700"></div>
                  
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-zinc-500 font-bold uppercase">Confidence</span>
                    <span className="text-sm text-emerald-400 font-bold">High</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1e1e20]">
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Analyst Stance</div>
                  <p className="text-xs text-zinc-400">
                    Initial indicators strongly support an active exfiltration attempt. Containment protocol is currently active.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <Zap size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Recommended Actions</h3>
                </div>
              </div>
              <div className="p-4 space-y-2.5">
                {[
                  'Validate DNS destination ownership (not unknown-host.nl)',
                  'Review SMB access logs on MGMT-CHQ-K02',
                ].map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded bg-cyan-900/30 border border-cyan-600/40 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-[#00D4AA] font-black">{idx + 1}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Linked Detection</h3>
            </div>
            
            {[
              { name: 'DNS Tunneling Detected', type: 'SIGNAL', time: '2 hours ago', severity: 'HIGH' },
              { name: 'Lateral Movement via SMB', type: 'USE CASE', time: '45 mins ago', severity: 'CRITICAL' },
              { name: 'TLS Beaconing Pattern', type: 'SIGNAL', time: '1 hour ago', severity: 'MEDIUM' },
            ].map((alert, idx) => (
              <div key={idx} className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg p-3 hover:border-cyan-600/30 transition-all cursor-pointer">
  <div className="flex items-center justify-between gap-4">
  <div className="flex items-center gap-3 flex-shrink-0">
  <div className="text-sm font-bold text-white truncate">
      {alert.name}
    </div>
    <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-400 font-bold uppercase rounded text-[10px] whitespace-nowrap">
        {alert.type}
      </span>

  </div>
   
    <div className="flex items-center gap-3 flex-shrink-0">
      
      <span className="text-[10px] text-zinc-500 whitespace-nowrap">
        {alert.time}
      </span>
      <span className={`px-2 py-0.5 font-black text-[10px] uppercase rounded whitespace-nowrap ${
        alert.severity === 'CRITICAL' ? 'bg-red-600/20 border border-red-600/30 text-red-400' :
        alert.severity === 'HIGH' ? 'bg-red-600/20 border border-red-600/30 text-red-400' :
        'bg-amber-600/20 border border-amber-600/30 text-amber-400'
      }`}>
        {alert.severity}
      </span>
    </div>
  </div>
</div>
            ))}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Evidence Locker</h3>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                <Plus size={14} />
                Attach Evidence
              </button>
            </div>

            {[
              { name: 'dns.log (16:20-16:25)', type: 'LOG EXCERPT - VERIFIED', status: 'verified' },
              { name: 'MGMT-CHQ-K02_Tunnel_Traffic.pcap', type: 'PCAP REF - PENDING ANALYSIS', status: 'pending' },
              { name: 'conn.log Summary (Port 445 Activity)', type: 'LOG EXCERPT - VERIFIED', status: 'verified' },
            ].map((evidence, idx) => (
              <div key={idx} className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg p-3 hover:border-cyan-600/30 transition-all">
  <div className="flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-cyan-900/20 border border-cyan-600/30 rounded-lg flex-shrink-0">
        <FileText size={16} className="text-emerald-400" />
      </div>
      <div>
        <div className="text-xs font-bold text-white">{evidence.name}</div>
        <div className="text-[10px] text-zinc-500 uppercase font-bold">{evidence.type}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
        <Eye size={14} className="text-zinc-500" />
      </button>
      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
        <Download size={14} className="text-zinc-500" />
      </button>
    </div>
  </div>
</div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="relative pl-12 space-y-2 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
              {[
                { time: '16:08:42', label: 'SYSTEM', type: 'system', text: 'Case created via auto-escalation from Signal SIG-8821', color: 'blue' },
                { time: '16:34:41', label: 'ANALYST', type: 'analyst', text: 'Analyst Alex Rivera assigned to investigation', color: 'purple' },
                { time: '17:12:18', label: 'SYSTEM', type: 'system', text: 'Related Use Case UC-1021-SMB associated with this case', color: 'blue' },
                { time: '17:18:00', label: 'ACTION', type: 'action', text: 'Isolated host MGMT-CHQ-K02 from Guest VLAN', color: 'green' },
                { time: '18:05:05', label: 'ANALYST', type: 'analyst', text: 'Evidence item EV-01 (dns.log) attached to case', color: 'purple' },
              ].map((event, idx) => (
                <div key={idx} className="relative group">
  <div className={`absolute -left-[44px] top-0.5 w-6 h-6 rounded-full border-2 border-[#0c0c0e] z-10 flex items-center justify-center ${
    event.color === 'blue' ? 'bg-blue-600' :
    event.color === 'purple' ? 'bg-purple-600' :
    'bg-emerald-600'
  }`}>
    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
  </div>
  <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg p-3 hover:border-cyan-600/30 transition-all">
    <div className="flex justify-between items-center gap-3 mb-1">
      <span className="text-[10px] font-mono text-zinc-500">{event.time}</span>
      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded whitespace-nowrap ${
        event.color === 'blue' ? 'bg-blue-600/20 border border-blue-600/30 text-blue-400' :
        event.color === 'purple' ? 'bg-purple-600/20 border border-purple-600/30 text-purple-400' :
        'bg-emerald-600/20 border border-emerald-600/30 text-emerald-400'
      }`}>
        {event.label}
      </span>
    </div>
    <p className="text-xs text-white leading-relaxed">{event.text}</p>
  </div>
</div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Left Column - Analyst Journal */}
          <div className="space-y-4">
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Analyst Journal</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { author: 'ALEX RIVERA', time: '5 hours ago', initial: 'A', text: '"Confirmed that the destination domain has no business justification. Entropy tests are consistent with tunneling."' },
                  { author: 'SOC LEAD', time: '48 mins ago', initial: 'S', text: '"High priority. Check if any other hosts in the management subnet have contacted the same external IP."' },
                ].map((note, idx) => (
                  <div key={idx} className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-[#00D4AA] flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-black text-black">{note.initial}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-white uppercase">{note.author}</span>
                          <span className="text-[10px] text-zinc-600">{note.time}</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{note.text}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <button className="w-full bg-zinc-900/50 hover:bg-zinc-900 border border-[#1e1e20] text-zinc-400 hover:text-zinc-300 px-4 py-2.5 rounded-lg text-xs font-bold uppercase transition-all text-left">
                  Add an observation or update analysis...
                </button>

                <button className="w-full bg-[#00D4AA] hover:bg-[#00c399] text-black px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                  Add Entry
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Final Decision */}
          <div className="space-y-4">
            <div className="bg-[#0f0f10] border border-[#1e1e20] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e1e20]">
                <div className="flex items-center gap-2 text-[#00D4AA]">
                  <CheckCircle2 size={14} />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Final Decision</h3>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Select Verdict</div>
                  <select className="w-full bg-zinc-900/30 border border-[#1e1e20] text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-600/40 hover:border-cyan-600/40 transition-colors">
                    <option>True Positive (Malicious)</option>
                    <option>False Positive</option>
                    <option>Benign True Positive</option>
                    <option>Requires Escalation</option>
                  </select>
                </div>

                <div>
                  <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Resolution Justification</div>
                  <textarea 
                    className="w-full bg-zinc-900/30 border border-[#1e1e20] text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-cyan-600/40 hover:border-cyan-600/40 transition-colors resize-none"
                    rows={4}
                    placeholder="Provide reasoning for the verdict..."
                  ></textarea>
                </div>

                <button className="w-full bg-[#00D4AA] hover:bg-[#00c399] text-black px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                  Submit Final Verdict
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationDetailPage;