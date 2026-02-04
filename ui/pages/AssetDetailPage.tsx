import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, Clock, Lock, 
  Globe, Server, ArrowRight,
  Calendar, AlertCircle, ShieldCheck,
  CheckCircle, Eye, ChevronDown, MoreVertical, Shield
} from 'lucide-react';

interface Props {
  ip: string;
  onBack: () => void;
}

// ─── MOCK DATA ─────────────────────────────────────────────────────────────
const PROTOCOL_DATA = [
  { name: 'SMB',  count: 4821, pct: 46 },
  { name: 'DNS',  count: 2403, pct: 23 },
  { name: 'LDAP', count: 1572, pct: 15 },
  { name: 'HTTP', count: 838,  pct:  8 },
  { name: 'TLS',  count: 418,  pct:  4 },
];

const LISTENING_SERVICES = [
  { name: 'SMB',  port: 445, status: 'Listening', change: '+8.2%', up: true },
  { name: 'LDAP', port: 389, status: 'Listening', change: '-2.1%', up: false },
  { name: 'DNS',  port: 53,  status: 'Listening', change: '+3.0%', up: true },
];

const DETECTIONS = [
  { id: 'det-1', name: 'High-Entropy DNS Queries',        severity: 'medium', timeAgo: '2 days ago' },
  { id: 'det-2', name: 'SMB Lateral Movement Attempt',   severity: 'high',   timeAgo: '14 days ago' },
];

// ─── COMPONENT ─────────────────────────────────────────────────────────────
const AssetDetailPage: React.FC<Props> = ({ ip, onBack }) => {
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [activeWindow,   setActiveWindow]   = useState<'1h' | '24h' | '7d'>('24h');

  // max bar width reference (longest bar = 100%)
  const maxCount = Math.max(...PROTOCOL_DATA.map(p => p.count));

  return (
    <div className="animate-in max-w-[1300px] mx-auto fade-in duration-500 space-y-6 pb-32">

      {/* ════════════════════════════════════════════════════════════════════
          1. ASSET HEADER
          ════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">

        {/* Back + identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all hover:border-zinc-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-black text-white uppercase tracking-tight">{ip}</h2>
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-lg text-[9px] font-black uppercase tracking-widest">
                Normal
              </span>
              {/* Alerts-in-30-days badge */}
              <span className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                <AlertCircle size={10} className="text-amber-400" />
                2 Alerts · 30 d
              </span>
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5">
              MS-ENG-042 · Windows Server 2022 · Server Role (High Confidence)
            </p>
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="flex items-center gap-3 px-6 py-3 bg-[#161618] border border-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:border-zinc-700 transition-all"
          >
            <MoreVertical size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Actions</span>
            <ChevronDown size={14} className={`transition-transform ${showActionMenu ? 'rotate-180' : ''}`} />
          </button>

          {showActionMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a0b] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => setShowActionMenu(false)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-900 transition-colors border-b border-zinc-800/50"
              >
                <Lock size={14} className="text-red-400" />
                <span className="text-xs font-bold text-red-400">Isolate Asset (EDR)</span>
              </button>
              <button
                onClick={() => setShowActionMenu(false)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-zinc-900 transition-colors"
              >
                <Eye size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-400">Manual Review Cycle</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. CURRENT NETWORK STATUS  (full-width banner)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0a0a0b] border border-emerald-500/30 rounded-xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Current Network Status</p>
            <p className="text-sm font-bold text-white">Normal Network Activity Observed</p>
          </div>
        </div>
        {/* status tag */}
        <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          Normal
        </span>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. OBSERVED NETWORK ACTIVITY
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">

        {/* card header */}
        <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-emerald-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Observed Network Activity</h3>
            </div>
            {/* window toggle */}
            <div className="flex items-center gap-2">
              {(['1h', '24h', '7d'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWindow(w)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors
                    ${activeWindow === w
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-700'
                    }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* body: 2-col — left graph, right text */}
        <div className="p-6">

          {/* subtitle */}
          <p className="text-[10px] text-zinc-600 font-bold mb-6">
            Observed Protocol Distribution
            <span className="font-normal text-zinc-700 ml-2">Based on network traffic observed from Zeek logs</span>
          </p>

          <div className="grid grid-cols-[1fr_380px] gap-10">

            {/* ── LEFT: horizontal bar chart ── */}
            <div className="space-y-3">
              {PROTOCOL_DATA.map((proto) => {
                const widthPct = (proto.count / maxCount) * 100;
                return (
                  <div key={proto.name} className="flex items-center gap-4">
                    {/* label */}
                    <span className="text-xs font-black text-zinc-300 w-10 text-right shrink-0">{proto.name}</span>
                    {/* bar track */}
                    <div className="flex-1 h-5 bg-zinc-900 rounded-md overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-md transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                      {/* count label inside bar (only if bar wide enough) */}
                      {widthPct > 18 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/80">
                          {proto.count.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {/* count label outside bar (fallback when bar is narrow) */}
                    {widthPct <= 18 && (
                      <span className="text-[10px] font-black text-zinc-500 shrink-0 w-12">{proto.count.toLocaleString()}</span>
                    )}
                  </div>
                );
              })}

              {/* Traffic direction line */}
              <div className="pt-4 mt-2 border-t border-zinc-800 flex items-center gap-3">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Traffic Pattern</span>
                <span className="text-xs font-bold text-white">Inbound-dominant</span>
                <span className="text-[9px] text-zinc-700">·</span>
                <span className="text-[10px] text-zinc-500">Inbound: High</span>
                <span className="text-[9px] text-zinc-700">|</span>
                <span className="text-[10px] text-zinc-500">Outbound: Low</span>
              </div>
            </div>

            {/* ── RIGHT: text observations ── */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Observations</p>
              <div className="space-y-3">
                {[
                  'Traffic is primarily inbound and service-oriented.',
                  'SMB and directory-related protocols dominate activity.',
                  'Limited outbound application traffic observed.',
                ].map((obs, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <p className="text-xs text-zinc-400 leading-relaxed">{obs}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          4. OBSERVED LISTENING SERVICES
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-blue-400" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400">Observed Listening Services</h3>
          </div>
          <button className="text-[9px] font-bold text-blue-400 uppercase tracking-wider hover:text-blue-300 transition-colors">
            See Config Log
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {LISTENING_SERVICES.map((svc, i) => (
              <div key={i} className="bg-[#0d0d0f] border border-zinc-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">{svc.name}</span>
                    <span className="text-[9px] font-mono text-zinc-600">:{svc.port}</span>
                  </div>
                  <CheckCircle size={12} className="text-emerald-400" />
                </div>
                <div className="text-[9px] text-zinc-600 font-medium mb-2">{svc.status}</div>
                <div className={`text-xs font-bold ${svc.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {svc.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          5. DETECTION HISTORY  (new — essential)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#0a0a0b] border border-zinc-800 rounded-xl overflow-hidden">

        <div className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-400" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-400">Detections Involving This Host</h3>
          </div>
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Last 30 days</span>
        </div>

        <div className="p-6">
          {DETECTIONS.length === 0 ? (
            <p className="text-xs text-zinc-600 italic">No detections in the last 30 days.</p>
          ) : (
            <div className="space-y-2">
              {DETECTIONS.map((det) => {
                const severityStyles = {
                  critical: { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    dot: 'bg-red-500' },
                  high:     { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
                  medium:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   dot: 'bg-blue-500' },
                  low:      { bg: 'bg-zinc-900',      border: 'border-zinc-800',      text: 'text-zinc-400',   dot: 'bg-zinc-500' },
                };
                const s = severityStyles[det.severity as keyof typeof severityStyles] || severityStyles.low;

                return (
                  <div
                    key={det.id}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border cursor-pointer
                      ${s.bg} ${s.border} hover:brightness-125 transition-all group`}
                  >
                    {/* left: severity dot + name */}
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                      <span className={`text-sm font-bold ${s.text} group-hover:underline`}>
                        {det.name}
                      </span>
                    </div>

                    {/* right: time + arrow */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <Clock size={11} />
                        <span className="text-[10px] font-bold">{det.timeAgo}</span>
                      </div>
                      <ArrowRight size={14} className={`${s.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AssetDetailPage;