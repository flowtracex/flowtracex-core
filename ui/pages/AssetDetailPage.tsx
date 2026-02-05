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
    <div className="animate-in max-w-[1300px] mx-auto fade-in duration-500 space-y-6 pb-32 px-4">

      {/* ════════════════════════════════════════════════════════════════════
          1. ASSET HEADER
          ════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between">

        {/* Back + identity */}
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
          >
            <ArrowLeft size={20} className="text-zinc-400 hover:text-white transition-colors" />
          </button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">{ip}</h2>
              <div className="inline-flex px-3 py-1 rounded border bg-green-500/10 border-green-500/20">
                <span className="text-xs font-bold uppercase text-green-500">Normal</span>
              </div>
              {/* Alerts-in-30-days badge */}
              <span className="px-3 py-1 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg text-[10px] font-bold uppercase tracking-tight text-zinc-500 flex items-center gap-1.5">
                <AlertCircle size={10} className="text-orange-500" />
                2 Alerts · 30 d
              </span>
            </div>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1.5">
              MS-ENG-042 · Windows Server 2022 · Server Role (High Confidence)
            </p>
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActionMenu(!showActionMenu)}
            className="flex items-center gap-3 bg-[#0a0a0b] border border-[#1e1e20] hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <MoreVertical size={18} />
            <span className="text-xs font-bold uppercase tracking-wide">Actions</span>
            <ChevronDown size={14} className={`transition-transform ${showActionMenu ? 'rotate-180' : ''}`} />
          </button>

          {showActionMenu && (
            <div className="absolute right-0 top-full mt-2 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg shadow-2xl min-w-[200px] z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => setShowActionMenu(false)}
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors border-b border-zinc-800/50 flex items-center gap-3"
              >
                <Lock size={14} className="text-red-500" />
                <span className="text-sm font-semibold text-red-500">Isolate Asset (EDR)</span>
              </button>
              <button
                onClick={() => setShowActionMenu(false)}
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-3"
              >
                <Eye size={14} className="text-blue-500" />
                <span className="text-sm font-semibold text-blue-500">Manual Review Cycle</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          2. CURRENT NETWORK STATUS  (full-width banner)
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-green-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Current Network Status</p>
            <p className="text-sm font-semibold text-white">Normal Network Activity Observed</p>
          </div>
        </div>
        {/* status tag */}
        <div className="inline-flex px-3 py-1 rounded border bg-green-500/10 border-green-500/20">
          <span className="text-xs font-bold uppercase text-green-500 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Normal
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          3. OBSERVED NETWORK ACTIVITY
          ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">

        {/* card header */}
        <div className="px-6 py-4 border-b border-[#1e1e20] bg-[#0a0a0b]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-green-500" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Observed Network Activity</h3>
            </div>
            {/* window toggle */}
            <div className="flex items-center gap-2">
              {(['1h', '24h', '7d'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => setActiveWindow(w)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all
                    ${activeWindow === w
                      ? 'bg-[#00D4AA] text-black'
                      : 'bg-[#0a0a0b] border border-[#1e1e20] text-zinc-500 hover:text-white hover:border-zinc-700'
                    }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* body: 2-col — left graph, right text */}
        <div className="p-6 space-y-6">

          {/* subtitle */}
          <div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Observed Protocol Distribution
            </p>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              Based on network traffic observed from Zeek logs
            </p>
          </div>

          <div className="grid grid-cols-[1fr_380px] gap-6">

            {/* ── LEFT: horizontal bar chart ── */}
            <div className="space-y-3">
              {PROTOCOL_DATA.map((proto) => {
                const widthPct = (proto.count / maxCount) * 100;
                return (
                  <div key={proto.name} className="flex items-center gap-4">
                    {/* label */}
                    <span className="text-xs font-bold text-white w-12 text-right shrink-0">{proto.name}</span>
                    {/* bar track */}
                    <div className="flex-1 h-6 bg-zinc-900 rounded-lg overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-lg transition-all duration-500"
                        style={{ width: `${widthPct}%` }}
                      />
                      {/* count label inside bar (only if bar wide enough) */}
                      {widthPct > 18 && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white/90">
                          {proto.count.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {/* count label outside bar (fallback when bar is narrow) */}
                    {widthPct <= 18 && (
                      <span className="text-xs text-zinc-500 font-medium shrink-0 w-16">{proto.count.toLocaleString()}</span>
                    )}
                  </div>
                );
              })}

              {/* Traffic direction line */}
              <div className="pt-4 mt-3 border-t border-[#1e1e20] flex items-center gap-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Traffic Pattern</span>
                <span className="text-sm font-semibold text-white">Inbound-dominant</span>
                <span className="text-xs text-zinc-600">·</span>
                <span className="text-xs text-zinc-500 font-medium">Inbound: High</span>
                <span className="text-xs text-zinc-600">|</span>
                <span className="text-xs text-zinc-500 font-medium">Outbound: Low</span>
              </div>
            </div>

            {/* ── RIGHT: text observations ── */}
            <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-6 space-y-4">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Observations</p>
              <div className="space-y-3">
                {[
                  'Traffic is primarily inbound and service-oriented.',
                  'SMB and directory-related protocols dominate activity.',
                  'Limited outbound application traffic observed.',
                ].map((obs, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <p className="text-sm text-zinc-400 leading-relaxed">{obs}</p>
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
      <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">

        <div className="px-6 py-4 border-b border-[#1e1e20] bg-[#0a0a0b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Observed Listening Services</h3>
          </div>
          <button className="text-xs font-bold text-blue-500 uppercase tracking-wide hover:text-blue-400 transition-colors">
            See Config Log
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {LISTENING_SERVICES.map((svc, i) => (
              <div key={i} className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{svc.name}</span>
                    <span className="text-xs text-zinc-600 font-medium">:{svc.port}</span>
                  </div>
                  <CheckCircle size={12} className="text-green-500" />
                </div>
                <div className="text-xs text-zinc-500 font-medium">{svc.status}</div>
                <div className={`text-xs font-bold `}>
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
      <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">

        <div className="px-6 py-4 border-b border-[#1e1e20] bg-[#0a0a0b] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-orange-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Detections Involving This Host</h3>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">Last 30 days</span>
        </div>

        <div className="p-6">
          {DETECTIONS.length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No detections in the last 30 days.</p>
          ) : (
            <div className="space-y-3">
              {DETECTIONS.map((det) => {
                const severityStyles = {
                  critical: { bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-500',    dot: 'bg-red-500' },
                  high:     { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-500', dot: 'bg-orange-500' },
                  medium:   { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-500', dot: 'bg-yellow-500' },
                  low:      { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-500',   dot: 'bg-blue-500' },
                };
                const s = severityStyles[det.severity as keyof typeof severityStyles] || severityStyles.low;

                return (
                  <div
                    key={det.id}
                    className={`flex items-center justify-between px-5 py-4 rounded-lg border cursor-pointer
                      ${s.bg} ${s.border} hover:bg-zinc-900/30 transition-all group`}
                  >
                    {/* left: severity dot + name */}
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className={`text-sm font-semibold ${s.text}`}>
                        {det.name}
                      </span>
                    </div>

                    {/* right: time + arrow */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <Clock size={11} />
                        <span className="text-xs font-medium">{det.timeAgo}</span>
                      </div>
                      <ArrowRight size={14} className={`${s.text} opacity-0 group-hover:opacity-100 transition-all`} />
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