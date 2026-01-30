
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, ShieldCheck, 
  AlertCircle, Users, Activity, BarChart2, PieChart as PieChartIcon,
  Download, Settings2, Target, Zap, Brain, CheckCircle2,
  // Comment: Fixed missing 'ArrowRight' icon import
  ChevronRight, ArrowUpRight, ArrowRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend, ComposedChart, Line
} from 'recharts';

const TIMELINE_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Jan ${i + 1}`,
  opened: 2 + Math.floor(Math.random() * 5),
  closed: 1 + Math.floor(Math.random() * 6),
  active: 10 + Math.floor(Math.random() * 15),
}));

const STATUS_DIST = [
  { name: 'New', value: 5, color: '#3b82f6' },
  { name: 'Active', value: 12, color: '#06b6d4' },
  { name: 'Escalated', value: 2, color: '#ef4444' },
  { name: 'On Hold', value: 3, color: '#6b7280' },
  { name: 'Closed', value: 45, color: '#10b981' },
];

const SEVERITY_MTTR = [
  { name: 'Critical', target: 2, actual: 2.1, color: '#ef4444' },
  { name: 'High', target: 4, actual: 4.5, color: '#f97316' },
  { name: 'Medium', target: 8, actual: 8.2, color: '#eab308' },
  { name: 'Low', target: 24, actual: 12.3, color: '#10b981' },
];

const ANALYST_WORKLOAD = [
  { name: 'Sarah Chen', critical: 3, high: 1, medium: 1, total: 5, age: 4.2 },
  { name: 'Mike Johnson', critical: 0, high: 2, medium: 2, total: 4, age: 6.8 },
  { name: 'Lisa Wang', critical: 0, high: 0, medium: 3, total: 3, age: 12.1 },
  { name: 'Unassigned', critical: 0, high: 0, medium: 3, total: 3, age: 24.0 },
];

const InvestigationAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('LAST 30D');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-xl">
        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {['LAST 24H', 'LAST 7D', 'LAST 30D', 'LAST 90D', 'CUSTOM'].map(r => (
            <button 
              key={r} 
              onClick={() => setTimeRange(r)}
              className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${timeRange === r ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-400 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
            <Download size={14}/> Export Full Report
          </button>
          <button className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white"><Settings2 size={18}/></button>
        </div>
      </div>

      {/* Key Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ACTIVE CASES', val: '12', trend: '+3', good: false, sub: 'vs last week', icon: Activity, color: 'text-white' },
          { label: 'AVG RESOLUTION', val: '4.2h', trend: '-1.3h', good: true, sub: 'Target: 6.0h', icon: Clock, color: 'text-[#00D4AA]' },
          { label: 'CLOSED (30D)', val: '45', trend: '+12', good: true, sub: 'vs last 30d', icon: ShieldCheck, color: 'text-blue-400' },
          { label: 'SLA BREACH', val: '3.2%', trend: '-1.5%', good: true, sub: 'Global Compliance', icon: AlertCircle, color: 'text-red-500' },
        ].map((m, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-sm space-y-4 hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</p>
              <m.icon size={16} className="text-zinc-700 group-hover:text-zinc-400" />
            </div>
            <div className="flex items-end justify-between">
              <h3 className={`text-xl font-black ${m.color} tracking-tighter`}>{m.val}</h3>
              <div className={`flex items-center gap-1 text-[11px] font-black ${m.good ? 'text-emerald-500' : 'text-red-500'}`}>
                {m.trend.startsWith('+') ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {m.trend}
              </div>
            </div>
            <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-tighter">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Distribution */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center justify-between">Case Status Distribution <PieChartIcon size={14}/></h3>
             <div className="h-56 relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie data={STATUS_DIST} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                         {STATUS_DIST.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <p className="text-[10px] font-black text-zinc-600 uppercase">Total</p>
                   <p className="text-xl font-black text-white">27</p>
                </div>
             </div>
             <div className="space-y-3">
                {STATUS_DIST.map(s => (
                   <div key={s.name} className="flex justify-between items-center text-[10px] font-black uppercase group cursor-pointer">
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: s.color}} />
                         <span className="text-zinc-500 group-hover:text-white transition-colors">{s.name}</span>
                      </div>
                      <span className="text-white font-mono">{s.value}</span>
                   </div>
                ))}
             </div>
             <p className="text-[10px] text-zinc-600 italic border-t border-zinc-800 pt-4">Average case age: <span className="text-white">8.5 hours</span></p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Severity vs Resolution</h3>
             <div className="space-y-6">
                {SEVERITY_MTTR.map(s => (
                   <div key={s.name} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                         <span className="text-zinc-500">{s.name}</span>
                         <span className="text-white">MTTR: {s.actual}h</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className="h-full" style={{ width: `${(s.actual / 24) * 100}%`, backgroundColor: s.color }} />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Top Investigated Tactics</h3>
             <div className="space-y-4">
                {[
                  { name: 'Command & Control', count: 12, pct: 45, color: '#ef4444' },
                  { name: 'Lateral Movement', count: 8, pct: 30, color: '#f97316' },
                  { name: 'Exfiltration', count: 5, pct: 15, color: '#eab308' },
                  { name: 'Discovery', count: 2, pct: 10, color: '#3b82f6' },
                ].map(t => (
                   <div key={t.name} className="flex items-center gap-4 group cursor-pointer">
                      <div className="flex-1 space-y-1.5">
                         <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-zinc-500 group-hover:text-white transition-colors">{t.name}</span>
                            <span className="text-white">{t.count}</span>
                         </div>
                         <div className="h-1 w-full bg-zinc-950 rounded-full overflow-hidden">
                            <div className="h-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                         </div>
                      </div>
                      <ArrowUpRight size={14} className="text-zinc-800 group-hover:text-zinc-500" />
                   </div>
                ))}
             </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Trends & MTTR */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-xl">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Case Volume Trend</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-red-500"/><span className="text-[8px] font-black text-gray-600 uppercase">Opened</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/><span className="text-[8px] font-black text-gray-600 uppercase">Closed</span></div>
                </div>
             </div>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <ComposedChart data={TIMELINE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="date" hide />
                      <YAxis hide />
                      <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px'}} />
                      <Area type="monotone" dataKey="active" fill="#3b82f611" stroke="none" />
                      <Line type="monotone" dataKey="opened" stroke="#ef4444" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="closed" stroke="#10b981" strokeWidth={2} dot={false} />
                   </ComposedChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight flex items-center gap-2">
                <Zap size={14} className="text-orange-500"/> Backlog growing by avg +2 cases/week
             </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mean Time to Resolve (Actual vs Target)</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={SEVERITY_MTTR}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                      <YAxis hide />
                      <Tooltip contentStyle={{backgroundColor: '#0a0a0a', border: '1px solid #27272a', borderRadius: '12px', fontSize: '10px'}} />
                      <Bar dataKey="target" fill="#27272a" radius={[2, 2, 0, 0]} name="Target (Hours)" />
                      <Bar dataKey="actual" fill="#00D4AA" radius={[2, 2, 0, 0]} name="Actual (Hours)" />
                   </BarChart>
                </ResponsiveContainer>
             </div>
             <div className="flex items-center justify-between p-4 bg-[#10b9810a] border border-[#10b98122] rounded-xl">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">SLA Compliance: 96.8% ✅</p>
                <button className="text-[8px] font-black text-white hover:underline uppercase">View Report</button>
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">SLA Performance Summary</h3>
             <div className="flex items-center justify-between">
                <div className="text-center flex-1 border-r border-zinc-800">
                   <p className="text-2xl font-black text-white">44</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Met SLA</p>
                </div>
                <div className="text-center flex-1 border-r border-zinc-800">
                   <p className="text-2xl font-black text-red-500">1</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Breached</p>
                </div>
                <div className="text-center flex-1">
                   <p className="text-2xl font-black text-emerald-400">+2.5h</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">Avg Margin</p>
                </div>
             </div>
             <button className="w-full py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">View Breached Case Details</button>
          </div>
        </div>

        {/* RIGHT COLUMN: Team & Insights */}
        <div className="space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-xl">
             <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Users size={14}/> Analyst Workload</h3>
                <button className="text-[9px] font-black text-[#00D4AA] uppercase hover:underline">Rebalance</button>
             </div>
             <div className="space-y-6">
                {ANALYST_WORKLOAD.map(a => (
                   <div key={a.name} className="space-y-3 group cursor-pointer">
                      <div className="flex justify-between items-start">
                         <div>
                            <p className="text-[11px] font-black text-white uppercase tracking-tight group-hover:text-[#00D4AA] transition-colors">{a.name}</p>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase mt-0.5">{a.total} Cases • Avg age {a.age}h</p>
                         </div>
                         <div className="flex gap-1">
                            {Array.from({length: a.critical}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500" />)}
                            {Array.from({length: a.high}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500" />)}
                            {Array.from({length: a.medium}).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-yellow-500" />)}
                         </div>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className={`h-full transition-all ${a.total > 4 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(a.total / 6) * 100}%` }} />
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl relative overflow-hidden">
             {/* <div className="absolute top-0 right-0 p-4 opacity-5">
                <Brain size={120} className="text-[#00D4AA]" />
             </div> */}
             <h3 className="text-[10px] font-black text-[#00D4AA] uppercase tracking-[0.2em] flex items-center gap-2 relative z-10"><Brain size={14}/> Intelligence Insights</h3>
             <div className="space-y-5 relative z-10">
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                   <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2">⚠️ Backlog Growing</p>
                   <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">Active cases increased <span className="text-white">25%</span> over last 2 weeks. Capacity re-evaluation recommended.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                   <p className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2">✅ Resolution Velocity</p>
                   <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">MTTR decreased by <span className="text-white">18%</span> month-over-month. Credited to improved playbooks.</p>
                </div>
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                   <p className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-2">💡 False Positive Risk</p>
                   <p className="text-[11px] text-zinc-400 leading-relaxed font-medium"><span className="text-white">33%</span> of cases closed as FP. Review "DNS-TUNNEL-01" rule logic.</p>
                </div>
             </div>
             <button className="w-full mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-all">View Detail Audit <ArrowRight size={14}/></button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
             <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mean Response Metrics</h3>
             <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                   <p className="text-lg font-black text-white">12m</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">MTTA</p>
                </div>
                <div className="text-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                   <p className="text-lg font-black text-white">3.2h</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">MTTI</p>
                </div>
                <div className="text-center p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                   <p className="text-lg font-black text-white">1.8h</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase mt-1">MTTR</p>
                </div>
             </div>
             <div className="pt-4 flex justify-center gap-2 text-[9px] font-black text-emerald-500 uppercase">
                <TrendingDown size={14}/> Efficiency increased by 18%
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationAnalytics;
