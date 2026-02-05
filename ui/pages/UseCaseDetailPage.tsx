import React, { useState } from 'react';
import {
  ArrowLeft, Layers, AlertTriangle, Shield, CheckCircle2,
  ChevronDown, ChevronRight, Clock, Database, FileText, Activity
} from 'lucide-react';

const MOCK_USE_CASE = {
  id: 'UC-001',
  name: 'Ransomware Detection',
  description: 'Detects crypto-locking activity using multi-stage behavioral signals.',
  stages: 3,
  signals: 5,
  mlEnabled: true,
  confidence: 'HIGH'
};

const MOCK_STAGES = [
  {
    id: 1,
    name: 'Behavioral Anomaly',
    purpose: 'Detect early abnormal host behavior before encryption starts.',
    inputDependency: 'NONE (ENTRY STAGE)',
    dataSource: 'ZEEK: CONN.LOG',
    fieldsUsed: ['id.orig_h', 'id.resp_h', 'orig_bytes', 'ts'],
    conditions: [
      'outbound_connection_count > (host_baseline + 3σ)',
      'upload_bytes > 5 * daily_average',
      'activity_time between 00:00–05:00 local'
    ],
    thresholdLogic: 'baseline_window = 14 days\nwindow_size = 5 minutes',
    output: 'STAGE-1 SIGNAL EMITTED (LOW CONFIDENCE)',
    status: 'active'
  },
  {
    id: 2,
    name: 'File System Pressure',
    purpose: 'Identify rapid file operations characteristic of encryption.',
    inputDependency: 'stage_1 signal within 15 min window',
    dataSource: 'OSQUERY: FILE_EVENTS',
    fieldsUsed: ['hostname', 'action', 'target_path', 'timestamp'],
    conditions: [
      'file_create_rate > 100/second',
      'file_extension_changes > 50% of total operations',
      'operations_target multiple directories'
    ],
    thresholdLogic: 'window_size = 2 minutes',
    output: 'STAGE-2 SIGNAL EMITTED (MEDIUM CONFIDENCE)',
    status: 'triggered'
  },
  {
    id: 3,
    name: 'Context Correlation',
    purpose: 'Combine behavioral and system indicators for high-confidence detection.',
    inputDependency: 'stage_1 and stage_2 within 15 min window',
    dataSource: 'MULTI-SOURCE',
    fieldsUsed: ['all_previous_stages', 'threat_intel', 'user_context'],
    conditions: [
      'both_previous_stages_triggered = true',
      'no_authorized_maintenance_window',
      'no_known_backup_process'
    ],
    thresholdLogic: 'correlation_window = 15 minutes',
    output: 'RANSOMWARE DETECTION ALERT (HIGH CONFIDENCE)',
    status: 'pending'
  }
];

const statusColor = (status) => ({
  active:    { bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-500', dot: 'bg-green-500' },
  triggered: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-500', dot: 'bg-blue-500' },
  pending:   { bg: 'bg-zinc-900' , border: 'border-[#1e1e20]', text: 'text-zinc-500', dot: 'bg-zinc-500' }
}[status]);

export default function UseCaseDetailPage({ useCaseId, onBack }) {
  const [expandedStages, setExpandedStages] = useState([1]);

  const toggleStage = (id) =>
    setExpandedStages(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen">
      <div className="max-w-[1300px] mx-auto px-4 pb-32 pt-6 space-y-6">

        {/* COMPACT HEADER */}
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
            >
              <ArrowLeft size={18} className="text-zinc-400 hover:text-white transition-colors" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">{MOCK_USE_CASE.name}</h2>
              <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide mt-1">
                {useCaseId || 'UC-001'} • {MOCK_USE_CASE.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg text-xs font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers size={12} className="text-[#00D4AA]" /> {MOCK_USE_CASE.stages}
            </span>
            <span className="px-3 py-1.5 bg-[#0a0a0b] border border-[#1e1e20] rounded-lg text-xs font-bold uppercase text-zinc-400 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-zinc-500" /> {MOCK_USE_CASE.signals}
            </span>
            <div className="inline-flex px-3 py-1.5 rounded-lg border bg-blue-500/10 border-blue-500/20">
              <span className="text-xs font-bold uppercase text-blue-500">ML</span>
            </div>
            <div className="inline-flex px-3 py-1.5 rounded-lg border bg-green-500/10 border-green-500/20">
              <span className="text-xs font-bold uppercase text-green-500">{MOCK_USE_CASE.confidence}</span>
            </div>
          </div>
        </div>

        {/* WHY THIS ALERT */}
        <div className="bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-6 py-4 bg-[#0a0a0b] border-b border-[#1e1e20]">
            <Activity size={14} className="text-[#00D4AA]" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Why This Alert Was Triggered</span>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl">
              This alert fired because the system detected{' '}
              <span className="text-white font-semibold">sustained abnormal outbound data transfer behavior</span>
              {' '}that deviated significantly from the host's historical baseline.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {/* Detection Stages */}
              <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Detection Stages</span>
                </div>
                {[
                  ['Anomaly detected', 'Initial abnormal outbound activity identified vs. normal behavior.'],
                  ['Behavior sustained', 'Abnormal behavior persisted across multiple observation intervals.'],
                  ['Threshold exceeded', 'Combined signal confidence crossed the alert threshold.']
                ].map(([title, desc], i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-xs font-bold text-zinc-600 min-w-[14px] leading-tight">{i + 1}</span>
                    <div>
                      <span className="text-xs font-semibold text-white">{title}: </span>
                      <span className="text-xs text-zinc-500">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Factors */}
              <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Key Factors</span>
                </div>
                {[
                  'Sustained outbound volume spike over baseline window.',
                  'Abnormal upload-to-download ratio detected.',
                  'Activity concentrated in off-hours (00:00–05:00).',
                  'No corresponding authorized process found.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-[#00D4AA] mt-0.5 text-xs">▸</span>
                    <span className="text-xs text-zinc-400 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Context */}
              <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Context</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Activity was observed consistently over a defined time window and was <span className="text-white font-semibold">not</span> a single transient spike. Host had no scheduled maintenance or backup activity during the flagged period.
                </p>
                <div className="flex gap-3 pt-3 border-t border-[#1e1e20]">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight font-bold">Window</p>
                    <p className="text-xs font-bold text-white">15 min</p>
                  </div>
                  <div className="w-px bg-[#1e1e20]" />
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight font-bold">Baseline</p>
                    <p className="text-xs font-bold text-white">14 days</p>
                  </div>
                  <div className="w-px bg-[#1e1e20]" />
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tight font-bold">Conf.</p>
                    <p className="text-xs font-bold text-[#00D4AA]">HIGH</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DETECTION STAGES */}
        <div className="space-y-0">
          {MOCK_STAGES.map((stage, idx) => {
            const col = statusColor(stage.status);
            const open = expandedStages.includes(stage.id);
            return (
              <div key={stage.id} className="relative flex">
                {/* timeline rail */}
                <div className="flex flex-col items-center" style={{ width: 42 }}>
                  <div
                    className={`relative z-10 mt-[18px] rounded-full flex items-center justify-center text-xs font-bold border-2 border-[#1e1e20]`}
                    style={{ width: 30, height: 30 }}
                  >
                    {stage.id}
                  </div>
                  {idx < MOCK_STAGES.length - 1 && (
                    <div className="flex-1 w-px bg-[#1e1e20]" style={{ minHeight: 28 }} />
                  )}
                </div>

                {/* card */}
                <div className="flex-1 mb-2">
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-t-lg border border-[#1e1e20] bg-[#161618] hover:border-[#00D4AA] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white uppercase tracking-tight">{stage.name}</span>
                      <span className="text-xs text-zinc-500">— {stage.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className={`inline-flex px-3 py-1 rounded border ${col.bg} ${col.border}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${col.text}`}>
                          {stage.status}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className="text-zinc-500 transition-transform duration-200"
                        style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                      />
                    </div>
                  </button>

                  {open && (
                    <div className="border border-t-0 border-[#1e1e20] rounded-b-lg bg-[#161618] px-4 py-4">
                      <div className="grid grid-cols-4 gap-4">

                        {/* col 1 – source */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Input Dependency</p>
                            <div className="text-xs text-zinc-300 font-medium">{stage.inputDependency}</div>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Data Source</p>
                            <div className="flex items-center gap-1.5">
                              <Database size={12} className="text-[#00D4AA]" />
                              <div className="text-xs text-[#00D4AA] font-semibold">{stage.dataSource}</div>
                            </div>
                          </div>
                        </div>

                        {/* col 2 – fields */}
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Fields Used</p>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.fieldsUsed.map((f, i) => (
                              <span key={i} className="px-2 py-0.5 bg-[#0a0a0b] border border-[#1e1e20] rounded text-[10px] text-zinc-400 font-medium">{f}</span>
                            ))}
                          </div>
                        </div>

                        {/* col 3 – conditions */}
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Detection Conditions</p>
                          <div className="bg-[#0a0a0b] border border-[#1e1e20] rounded-lg p-3 space-y-2">
                            {stage.conditions.map((c, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-[#00D4AA] text-sm leading-tight">•</span>
                                <div className="text-xs text-zinc-300 leading-tight font-medium">{c}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* col 4 – threshold + output */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1.5">Threshold Logic</p>
                            <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono">{stage.thresholdLogic}</pre>
                          </div>
                          <div className={`p-3 rounded-lg border ${col.bg} ${col.border}`}>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight mb-1.5">Output Signal</p>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} className={col.text} />
                              <div className={`text-xs font-semibold ${col.text}`}>{stage.output}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TRIGGERED WHEN */}
        <div className="flex items-center gap-4 border border-[#1e1e20] rounded-xl overflow-hidden bg-[#161618] shadow-sm">
          <div className="flex items-center justify-center px-4 py-4 bg-[#0a0a0b]">
            <AlertTriangle size={20} className="text-[#00D4AA]" />
          </div>
          <div className="py-3 flex-1">
            <span className="text-xs font-bold text-[#00D4AA] uppercase tracking-wide">Triggered When: </span>
            <span className="text-sm text-zinc-300 font-medium">
              stage_1 signal exists for same host &amp;&amp; time_diff {'<'} 15 minutes
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}