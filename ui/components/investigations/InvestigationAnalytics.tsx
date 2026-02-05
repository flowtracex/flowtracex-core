import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Clock, ShieldCheck, 
  AlertCircle, Users, Activity, BarChart2, PieChart as PieChartIcon,
  Download, Settings2, Target, Zap, Brain, CheckCircle2,
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
  { name: 'Active', value: 12, color: '#3b82f6' },
  { name: 'Escalated', value: 2, color: '#ef4444' },
  { name: 'On Hold', value: 3, color: '#71717a' },
  { name: 'Closed', value: 45, color: '#22c55e' },
];

const SEVERITY_MTTR = [
  { name: 'Critical', target: 2, actual: 2.1, color: '#ef4444' },
  { name: 'High', target: 4, actual: 4.5, color: '#f97316' },
  { name: 'Medium', target: 8, actual: 8.2, color: '#eab308' },
  { name: 'Low', target: 24, actual: 12.3, color: '#3b82f6' },
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1300px] mx-auto px-4 pb-48">
      {/* Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-[#161618] border border-[#1e1e20] p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 bg-[#0a0a0b] p-1 rounded-lg border border-[#1e1e20]">
          {['LAST 24H', 'LAST 7D', 'LAST 30D', 'LAST 90D', 'CUSTOM'].map(r => (
            <button 
              key={r} 
              onClick={() => setTimeRange(r)}
              className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                timeRange === r 
                  ? 'bg-zinc-900/50 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all">
            <Download size={14}/> Export Full Report
          </button>
          <button className="p-1.5 hover:bg-zinc-800 rounded transition-colors text-zinc-500 hover:text-white">
            <Settings2 size={18}/>
          </button>
        </div>
      </div>

      {/* Key Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'ACTIVE CASES', val: '12', trend: '+3', good: false, sub: 'vs last week', icon: Activity, color: 'text-white' },
          { label: 'AVG RESOLUTION', val: '4.2h', trend: '-1.3h', good: true, sub: 'Target: 6.0h', icon: Clock, color: 'text-[#00D4AA]' },
          { label: 'CLOSED (30D)', val: '45', trend: '+12', good: true, sub: 'vs last 30d', icon: ShieldCheck, color: 'text-white' },
          { label: 'SLA BREACH', val: '3.2%', trend: '-1.5%', good: true, sub: 'Global Compliance', icon: AlertCircle, color: 'text-white' },
        ].map((m, i) => (
          <div key={i} className="bg-[#161618] border border-[#1e1e20] p-6 rounded-xl shadow-sm space-y-3 hover:border-zinc-700 transition-all group">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</p>
              <m.icon size={16} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
            </div>
            <div className="flex items-end justify-between"> 
              <h3 className={`text-xl font-black  tracking-tighter`}>{m.val}</h3>
              <div className={`flex items-center gap-1 text-xs font-black `}>
                {m.trend.startsWith('+') ? <TrendingUp size={14}/> : <TrendingDown size={14}/>} {m.trend}
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Distribution */}
        <div className="space-y-6">
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center justify-between">
              Case Status Distribution 
              <PieChartIcon size={14} className="text-zinc-400"/>
            </h3>
            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={STATUS_DIST} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {STATUS_DIST.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Total</p>
                <p className="text-xl font-black text-white tracking-tighter">27</p>
              </div>
            </div>
            <div className="space-y-2">
              {STATUS_DIST.map(s => (
                <div key={s.name} className="flex justify-between items-center text-xs font-bold uppercase group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}} />
                    <span className="text-zinc-500 group-hover:text-white transition-colors">{s.name}</span>
                  </div>
                  <span className="text-white">{s.value}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium italic border-t border-[#1e1e20] pt-4">
              Average case age: <span className="text-white font-semibold">8.5 hours</span>
            </p>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Severity vs Resolution</h3>
            <div className="space-y-4">
              {SEVERITY_MTTR.map(s => (
                <div key={s.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span className="text-zinc-500">{s.name}</span>
                    <span className="text-white">MTTR: {s.actual}h</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#0a0a0b] rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${(s.actual / 24) * 100}%`, backgroundColor: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Top Investigated Tactics</h3>
            <div className="space-y-3">
              {[
                { name: 'Command & Control', count: 12, pct: 45, color: '#ef4444' },
                { name: 'Lateral Movement', count: 8, pct: 30, color: '#f97316' },
                { name: 'Exfiltration', count: 5, pct: 15, color: '#eab308' },
                { name: 'Discovery', count: 2, pct: 10, color: '#3b82f6' },
              ].map(t => (
                <div key={t.name} className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold uppercase">
                      <span className="text-zinc-500 group-hover:text-white transition-colors">{t.name}</span>
                      <span className="text-white">{t.count}</span>
                    </div>
                    <div className="h-1 w-full bg-[#0a0a0b] rounded-full overflow-hidden">
                      <div className="h-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-zinc-500 group-hover:text-zinc-400 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Trends & MTTR */}
        <div className="space-y-6">
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Case Volume Trend</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500"/>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Opened</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"/>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Closed</span>
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={TIMELINE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid #1e1e20', borderRadius: '8px', fontSize: '10px'}} />
                  <Area type="monotone" dataKey="active" fill="#3b82f611" stroke="none" />
                  <Line type="monotone" dataKey="opened" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="closed" stroke="#22c55e" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-500 font-medium flex items-center gap-2">
              <Zap size={14} className="text-orange-500"/> Backlog growing by avg +2 cases/week
            </p>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mean Time to Resolve (Actual vs Target)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SEVERITY_MTTR}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 10}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{backgroundColor: '#0a0a0b', border: '1px solid #1e1e20', borderRadius: '8px', fontSize: '10px'}} />
                  <Bar dataKey="target" fill="#27272a" radius={[2, 2, 0, 0]} name="Target (Hours)" />
                  <Bar dataKey="actual" fill="#00D4AA" radius={[2, 2, 0, 0]} name="Actual (Hours)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-xs font-bold text-green-500 uppercase tracking-tight">SLA Compliance: 96.8% ✅</p>
              <button className="text-[10px] font-bold text-white hover:underline uppercase tracking-tight">View Report</button>
            </div>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">SLA Performance Summary</h3>
            <div className="flex items-center justify-between">
              <div className="text-center flex-1 border-r border-[#1e1e20]">
                <p className="text-xl font-black text-white tracking-tighter">44</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">Met SLA</p>
              </div>
              <div className="text-center flex-1 border-r border-[#1e1e20]">
                <p className="text-xl font-black text-white tracking-tighter">1</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">Breached</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-xl font-black text-white tracking-tighter">+2.5h</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">Avg Margin</p>
              </div>
            </div>
            <button className="w-full bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all">
              View Breached Case Details
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Team & Insights */}
        <div className="space-y-6">
          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-zinc-400"/> Analyst Workload
              </h3>
              <button className="text-[10px] font-black text-white uppercase tracking-widest hover:underline">Rebalance</button>
            </div>
            <div className="space-y-4">
              {ANALYST_WORKLOAD.map(a => (
                <div key={a.name} className="space-y-2 group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-white uppercase tracking-tight group-hover:text-[#00D4AA] transition-colors">{a.name}</p>
                      <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight mt-0.5">{a.total} Cases • Avg age {a.age}h</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({length: a.critical}).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-red-500" />)}
                      {Array.from({length: a.high}).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-orange-500" />)}
                      {Array.from({length: a.medium}).map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-yellow-500" />)}
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-[#0a0a0b] rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${a.total > 4 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(a.total / 6) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-4 shadow-sm relative overflow-hidden">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 relative z-10">
              <Brain size={14}/> Intelligence Insights
            </h3>
            <div className="space-y-3 relative z-10">
              <div className="p-4 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-2">⚠️ Backlog Growing</p>
                <p className="text-sm text-zinc-400 leading-relaxed">Active cases increased <span className="text-white font-semibold">25%</span> over last 2 weeks. Capacity re-evaluation recommended.</p>
              </div>
              <div className="p-4 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-2">✅ Resolution Velocity</p>
                <p className="text-sm text-zinc-400 leading-relaxed">MTTR decreased by <span className="text-white font-semibold">18%</span> month-over-month. Credited to improved playbooks.</p>
              </div>
              <div className="p-4 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg space-y-2">
                <p className="text-xs font-bold text-white uppercase tracking-tight flex items-center gap-2">💡 False Positive Risk</p>
                <p className="text-sm text-zinc-400 leading-relaxed"><span className="text-white font-semibold">33%</span> of cases closed as FP. Review "DNS-TUNNEL-01" rule logic.</p>
              </div>
            </div>
            <button className="w-full mt-4 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-white transition-all">
              View Detail Audit <ArrowRight size={14}/>
            </button>
          </div>

          <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mean Response Metrics</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg">
                <p className="text-xl font-black text-white tracking-tighter">12m</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">MTTA</p>
              </div>
              <div className="text-center p-3 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg">
                <p className="text-xl font-black text-white tracking-tighter">3.2h</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">MTTI</p>
              </div>
              <div className="text-center p-3 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg">
                <p className="text-xl font-black text-white tracking-tighter">1.8h</p>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mt-1">MTTR</p>
              </div>
            </div>
            <div className="pt-4 flex justify-center gap-2 text-xs font-black text-white uppercase tracking-tight">
              <TrendingDown size={14}/> Efficiency increased by 18%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationAnalytics;