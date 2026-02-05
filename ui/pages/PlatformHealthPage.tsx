
import React, { useState } from 'react';
import { 
  Activity, 
  Server, 
  Database, 
  Wifi, 
  Layers, 
  Zap, 
  Clock, 
  ShieldAlert, 
  RefreshCcw,
  AlertTriangle,
  Settings,
  MoreVertical,
  Maximize2,
  CheckCircle2,
  XCircle,
  HardDrive,
  Cpu,
  ArrowUpRight,
  Filter,
  Search,
  Plus,
  Terminal,
  Globe,
  Lock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

type TabId = 'overview' | 'sources' | 'pipeline' | 'detection';

const PlatformHealthPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'sources', label: 'Data Sources' },
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'detection', label: 'Detection' },
  ];

  const StatCard = ({ label, value, sub, icon: Icon, color }: any) => (
    <div className="bg-[#161618] border border-[#1e1e20] p-5 rounded-lg flex items-center gap-4 hover:border-[#333] transition-all group">
      <div className={`p-3 rounded-xl bg-[#0c0c0e] border border-[#1e1e20] ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-black text-white mt-0.5 tracking-tight">{value}</p>
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mt-1">{sub}</p>
      </div>
    </div>
  );

  const StatusCard = ({ label, status, sub, color }: any) => (
    <div className="bg-[#161618] border border-[#1e1e20] p-5 rounded-lg space-y-3">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-[#10b981]' : color === 'yellow' ? 'bg-[#f59e0b]' : 'bg-[#e11d48]'} animate-pulse`} />
        <span className="text-sm font-bold text-white uppercase tracking-wide">{status}</span>
      </div>
      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">{sub}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto animate-in fade-in duration-500 pb-20">
      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-8 border-b border-[#1e1e20] -mt-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-[11px] font-black uppercase tracking-widest transition-all relative
              ${activeTab === tab.id ? 'text-white border-b-2 border-[#00D4AA]' : 'text-gray-500 hover:text-gray-300'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Pipeline Capacity" value="8.5 Gbps" sub="Max Tested: 12 Gbps" icon={Zap} color="text-[#00D4AA]" />
            <StatCard label="E2E Latency" value="140ms" sub="Capture → Alert" icon={Clock} color="text-blue-400" />
            <StatCard label="Data Loss Rate" value="0.00%" sub="Healthy Ingestion" icon={ShieldAlert} color="text-[#10b981]" />
            <StatCard label="Detection Coverage" value="98%" sub="Segment Visibility" icon={Layers} color="text-purple-400" />
          </div>

          <div className="grid grid-cols-4 gap-4">
            <StatusCard label="Data Sources" status="Operational" sub="5/5 Sensors Online" color="green" />
            <StatusCard label="Pipeline" status="Degraded" sub="Kafka lag 30s detected" color="yellow" />
            <StatusCard label="Detection" status="Operational" sub="247 Rules Active" color="green" />
            <StatusCard label="System Integrity" status="Healthy" sub="All modules validated" color="green" />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
               <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-6 space-y-4">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     <AlertTriangle size={14} className="text-[#f59e0b]" /> Active Infrastructure Alerts
                  </h3>
                  <div className="space-y-3">
                     <div className="bg-[#f59e0b0a] border border-[#f59e0b22] p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-[#f59e0b15] rounded-lg text-[#f59e0b]"><Activity size={16} /></div>
                           <p className="text-[11px] text-white font-bold uppercase tracking-tight">Kafka lag warning: 30s lag detected in 'zeek-conn' topic</p>
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">2m ago</span>
                     </div>
                     <div className="bg-[#f59e0b0a] border border-[#f59e0b22] p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                           <div className="p-2 bg-[#f59e0b15] rounded-lg text-[#f59e0b]"><Cpu size={16} /></div>
                           <p className="text-[11px] text-white font-bold uppercase tracking-tight">Zeek worker-03: Sustained High CPU (85%) utilization</p>
                        </div>
                        <span className="text-[9px] text-gray-500 font-bold uppercase">15m ago</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-8 space-y-8 shadow-xl">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Capacity Planning</h3>
               <div className="text-center space-y-2">
                  <p className="text-5xl font-black text-white tracking-tighter">41<span className="text-lg text-gray-600">%</span></p>
                  <p className="text-[9px] text-[#10b981] font-black uppercase tracking-widest">Available Headroom ✓</p>
               </div>
               <div className="space-y-4 pt-6 border-t border-[#1e1e20]">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                     <span className="text-gray-600">Scale Trigger</span><span className="text-orange-500">10.0 Gbps</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                     <span className="text-gray-600">Estimated Depletion</span><span className="text-gray-400">45 Days</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DATA SOURCES TAB --- */}
      {activeTab === 'sources' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="bg-[#161618] border border-[#1e1e20] rounded-lg overflow-hidden shadow-xl">
             <div className="p-6 border-b border-[#1e1e20] bg-[#1c1c1e]/30 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Network Sensors Cluster (Zeek)</h3>
                <span className="text-[9px] font-bold text-[#10b981] bg-[#10b98110] px-2 py-0.5 rounded border border-[#10b98122]">6 NODES ACTIVE</span>
             </div>
             <table className="w-full text-left text-[11px] ">
                <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#0c0c0e]/50 border-b border-[#1e1e20]">
                   <tr>
                      <th className="px-6 py-4 font-black">Component</th>
                      <th className="px-6 py-4 font-black">Status</th>
                      <th className="px-6 py-4 font-black">Throughput</th>
                      <th className="px-6 py-4 font-black">Drop %</th>
                      <th className="px-6 py-4 font-black">CPU</th>
                      <th className="px-6 py-4 text-right">Last Sync</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e20]">
                   {[
                      { name: 'zeek-worker-01', status: 'Healthy', throughput: '1.2 Gbps', drop: '0.01%', cpu: '12%', last: '2s' },
                      { name: 'zeek-worker-02', status: 'Healthy', throughput: '1.8 Gbps', drop: '0.02%', cpu: '34%', last: '2s' },
                      { name: 'zeek-worker-03', status: 'Warning', throughput: '0.9 Gbps', drop: '0.05%', cpu: '85%', last: '3s', warn: true },
                      { name: 'zeek-worker-04', status: 'Healthy', throughput: '2.1 Gbps', drop: '0.01%', cpu: '28%', last: '2s' },
                      { name: 'zeek-worker-05', status: 'Healthy', throughput: '2.5 Gbps', drop: '0.02%', cpu: '41%', last: '2s' },
                      { name: 'zeek-manager', status: 'Healthy', throughput: '0.1 Gbps', drop: '0.00%', cpu: '8%', last: '1s' },
                   ].map(sensor => (
                      <tr key={sensor.name} className="hover:bg-[#1e1e20] transition-colors">
                         <td className="px-6 py-4 text-white font-bold">{sensor.name}</td>
                         <td className="px-6 py-4">
                            <span className={`flex items-center gap-2 ${sensor.warn ? 'text-orange-500' : 'text-[#10b981]'}`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${sensor.warn ? 'bg-orange-500' : 'bg-[#10b981]'}`} />
                               {sensor.status}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-400">{sensor.throughput}</td>
                         <td className="px-6 py-4 text-gray-500">{sensor.drop}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-12 h-1 bg-[#1e1e20] rounded-full overflow-hidden">
                                  <div className={`h-full ${parseInt(sensor.cpu) > 80 ? 'bg-orange-500' : 'bg-[#00D4AA]'}`} style={{ width: sensor.cpu }} />
                               </div>
                               <span className="text-gray-500">{sensor.cpu}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right text-gray-600">{sensor.last}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>

          <div className="grid grid-cols-2 gap-8">
             <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-8 space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol Coverage Intelligence</h3>
                <div className="space-y-4">
                   {[
                      { name: 'DNS', val: '1.2M qps', status: 'Healthy' },
                      { name: 'HTTP', val: '850K rps', status: 'Healthy' },
                      { name: 'TLS', val: '420K flows', status: 'Healthy' },
                      { name: 'DHCP', val: '45K leases', status: 'Healthy' },
                      { name: 'Conn', val: '2.1M flows', status: 'Healthy' },
                   ].map(proto => (
                      <div key={proto.name} className="flex items-center justify-between p-4 bg-[#0c0c0e] border border-[#1e1e20] rounded-xl hover:border-[#333] transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-[#161618] border border-[#1e1e20] flex items-center justify-center text-[10px] font-black text-gray-400 uppercase">{proto.name[0]}</div>
                            <div>
                               <p className="text-[11px] font-black text-white uppercase">{proto.name}</p>
                               <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{proto.val}</p>
                            </div>
                         </div>
                         <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                      </div>
                   ))}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-[#161618] border border-dashed border-gray-800 p-8 rounded-lg flex flex-col items-center text-center space-y-4 opacity-40 grayscale">
                   <Database size={32} className="text-gray-600" />
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Flow Collectors (NetFlow/IPFIX)</p>
                   <button className="px-6 py-2 bg-[#1e1e20] border border-[#333] rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest">Configure Collector</button>
                </div>
                <div className="bg-[#161618] border border-dashed border-gray-800 p-8 rounded-lg flex flex-col items-center text-center space-y-4 opacity-40 grayscale">
                   <Globe size={32} className="text-gray-600" />
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">API Integrations (Syslog/Cloud)</p>
                   <button className="px-6 py-2 bg-[#1e1e20] border border-[#333] rounded-xl text-[9px] font-black text-gray-400 uppercase tracking-widest">Connect Source</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- PIPELINE TAB --- */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-[#161618] border border-[#1e1e20] rounded-lg p-8 space-y-8 shadow-xl">
                 <div className="flex justify-between items-center">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingestion Layer (Kafka)</h3>
                    <div className="flex gap-4">
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Brokers: <span className="text-[#10b981]">3/3 Healthy</span></span>
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Throughput: <span className="text-white">85K msgs/sec</span></span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                       { name: 'zeek-dns', rate: '30K/s', lag: '0s', status: 'green' },
                       { name: 'zeek-http', rate: '25K/s', lag: '0s', status: 'green' },
                       { name: 'zeek-conn', rate: '20K/s', lag: '30s', status: 'yellow' },
                       { name: 'zeek-ssl', rate: '10K/s', lag: '0s', status: 'green' },
                    ].map(topic => (
                       <div key={topic.name} className="p-4 bg-[#0c0c0e] border border-[#1e1e20] rounded-xl flex items-center justify-between group hover:border-[#333] transition-all">
                          <div>
                             <p className="text-[10px]  text-gray-500 uppercase font-bold tracking-widest">{topic.name}</p>
                             <p className="text-[11px] font-black text-white mt-1">{topic.rate} <span className="text-[9px] text-gray-600">INBOUND</span></p>
                          </div>
                          <div className="text-right">
                             <p className={`text-[10px] font-black uppercase ${topic.status === 'yellow' ? 'text-orange-500' : 'text-gray-600'}`}>Lag: {topic.lag}</p>
                             <div className={`w-1.5 h-1.5 rounded-full ml-auto mt-2 ${topic.status === 'yellow' ? 'bg-orange-500 animate-pulse' : 'bg-[#10b981]'}`} />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-8 space-y-6">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing Metadata</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase">
                       <span className="text-gray-600 tracking-widest">Backpressure</span><span className="text-[#10b981]">None</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase">
                       <span className="text-gray-600 tracking-widest">Checkpoints</span><span className="text-[#10b981]">Healthy (2m)</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] font-black uppercase">
                       <span className="text-gray-600 tracking-widest">Restarts (24h)</span><span className="text-white">0</span>
                    </div>
                    <div className="pt-4 border-t border-[#1e1e20]">
                       <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest mb-4">Pipeline Latency (ms)</p>
                       <div className="h-20">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={Array.from({length: 12}).map((_, i) => ({v: 120 + Math.random() * 40}))}>
                                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="#3b82f611" dot={false} />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-[#161618] border border-[#1e1e20] rounded-lg overflow-hidden shadow-xl">
             <div className="p-6 border-b border-[#1e1e20] bg-[#1c1c1e]/30">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Processing Engine (Flink Clusters)</h3>
             </div>
             <table className="w-full text-left text-[11px] ">
                <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#0c0c0e]/50 border-b border-[#1e1e20]">
                   <tr>
                      <th className="px-6 py-4 font-black">Job Name</th>
                      <th className="px-6 py-4 font-black">Status</th>
                      <th className="px-6 py-4 font-black">Throughput</th>
                      <th className="px-6 py-4 font-black">Latency (p99)</th>
                      <th className="px-6 py-4 text-right">CPU</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e20]">
                   {[
                      { name: 'detection-engine', status: 'Running', throughput: '45K eps', latency: '188ms', cpu: '34%' },
                      { name: 'enrichment-stage', status: 'Running', throughput: '50K eps', latency: '140ms', cpu: '28%' },
                      { name: 'flow-aggregator', status: 'Running', throughput: '30K eps', latency: '120ms', cpu: '18%' },
                      { name: 'baseline-builder', status: 'Running', throughput: '15K eps', latency: '95ms', cpu: '12%' },
                   ].map(job => (
                      <tr key={job.name} className="hover:bg-[#1e1e20] transition-colors">
                         <td className="px-6 py-4 text-white font-bold uppercase">{job.name}</td>
                         <td className="px-6 py-4 text-[#10b981] font-bold uppercase tracking-widest">{job.status}</td>
                         <td className="px-6 py-4 text-gray-400">{job.throughput}</td>
                         <td className="px-6 py-4 text-gray-500">{job.latency}</td>
                         <td className="px-6 py-4 text-right text-gray-600">{job.cpu}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      )}

      {/* --- DETECTION TAB --- */}
      {activeTab === 'detection' && (
        <div className="space-y-8 animate-in fade-in duration-300">
           <div className="grid grid-cols-4 gap-4">
              <StatCard label="Active Detections" value="247" sub="In-stream" icon={ShieldAlert} color="text-blue-400" />
              <StatCard label="Alert Rate" value="12/min" sub="Last 60m" icon={Activity} color="text-[#00D4AA]" />
              <StatCard label="Deduplication" value="8:1" sub="Ratio Optimized" icon={RefreshCcw} color="text-purple-400" />
              <StatCard label="Model Freshness" value="2h ago" sub="Last Trained" icon={Clock} color="text-gray-500" />
           </div>

           <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-[#161618] border border-[#1e1e20] rounded-lg overflow-hidden shadow-xl">
                 <div className="p-6 border-b border-[#1e1e20] bg-[#1c1c1e]/30 flex items-center justify-between">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Detection Performance Breakdown</h3>
                 </div>
                 <table className="w-full text-left text-[11px] ">
                    <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#0c0c0e]/50 border-b border-[#1e1e20]">
                       <tr>
                          <th className="px-6 py-4 font-black">Detection Type</th>
                          <th className="px-6 py-4 font-black">Active</th>
                          <th className="px-6 py-4 font-black">Throughput</th>
                          <th className="px-6 py-4 font-black">Latency</th>
                          <th className="px-6 py-4 text-right">Hits (24h)</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e20]">
                       {[
                          { type: 'Behavioral', count: 89, rate: '15K eps', latency: '200ms', hits: 240 },
                          { type: 'Statistical', count: 67, rate: '12K eps', latency: '180ms', hits: 89 },
                          { type: 'Signature', count: 54, rate: '10K eps', latency: '120ms', hits: 145 },
                          { type: 'Anomaly', count: 37, rate: '8K eps', latency: '250ms', hits: 67 },
                       ].map(row => (
                          <tr key={row.type} className="hover:bg-[#1e1e20] transition-colors">
                             <td className="px-6 py-4 text-white font-bold uppercase">{row.type}</td>
                             <td className="px-6 py-4 text-gray-400">{row.count}</td>
                             <td className="px-6 py-4 text-gray-500">{row.rate}</td>
                             <td className="px-6 py-4 text-gray-600">{row.latency}</td>
                             <td className="px-6 py-4 text-right text-[#00D4AA] font-bold">{row.hits}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-8 space-y-8 shadow-xl">
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Baseline Engine</h3>
                 <div className="space-y-6">
                    <div className="space-y-1.5">
                       <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Baseline Coverage</p>
                       <p className="text-sm font-black text-white uppercase tracking-tight">2.3M IPs | 850K Domains</p>
                    </div>
                    <div className="space-y-1.5">
                       <p className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Baseline Queue</p>
                       <p className="text-sm font-black text-white uppercase tracking-tight">240 Pending Updates</p>
                    </div>
                    <div className="pt-6 border-t border-[#1e1e20] space-y-4">
                       <h4 className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Alert Pipeline (24h)</h4>
                       <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                          <div><p className="text-[8px] font-bold text-gray-700 uppercase">Generated</p><p className="text-sm font-black text-white">17,280</p></div>
                          <div><p className="text-[8px] font-bold text-gray-700 uppercase">After Dedup</p><p className="text-sm font-black text-[#00D4AA]">2,160</p></div>
                       </div>
                       <div className="flex justify-between items-center bg-[#0c0c0e] p-3 rounded-lg border border-[#1e1e20]">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">MTTR Avg</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest">18m</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PlatformHealthPage;
