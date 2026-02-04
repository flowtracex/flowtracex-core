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
  active:    { bg: 'rgba(0,212,170,0.1)',  border: 'rgba(0,212,170,0.3)',  text: '#00D4AA', dot: '#00D4AA' },
  triggered: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.2)', text: '#FFFFFF', dot: '#FFFFFF' },
  pending:   { bg: 'rgba(113,113,122,0.1)' , border: 'rgba(113,113,122,0.3)', text: '#71717A', dot: '#71717A' }
}[status]);

export default function UseCaseDetailPage({ useCaseId, onBack }) {
  const [expandedStages, setExpandedStages] = useState([1]);

  const toggleStage = (id) =>
    setExpandedStages(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[1300px] mx-auto px-6 pb-16 pt-6 space-y-4">

        {/* COMPACT HEADER */}
        <div className="flex items-center justify-between gap-8 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 bg-[#161618] border border-[#1e1e20] rounded-lg text-zinc-500 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">{MOCK_USE_CASE.name}</h2>
              <p className="text-[13px] font-bold text-zinc-600 uppercase tracking-wider">
                {useCaseId || 'UC-001'} • {MOCK_USE_CASE.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#0f0f10] border border-[#1e1e20] rounded text-[13px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
              <Layers size={12} className="text-[#00D4AA]" /> {MOCK_USE_CASE.stages}
            </span>
            <span className="px-2.5 py-1 bg-[#0f0f10] border border-[#1e1e20] rounded text-[13px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
              <AlertTriangle size={12} className="text-zinc-400" /> {MOCK_USE_CASE.signals}
            </span>
            <span className="px-2.5 py-1 bg-cyan-900/30 border border-cyan-600/40 rounded text-[13px] font-black uppercase text-[#00D4AA]">ML</span>
            <span className="px-2.5 py-1 bg-zinc-700/50 border border-zinc-600/40 rounded text-[13px] font-black uppercase text-white">{MOCK_USE_CASE.confidence}</span>
          </div>
        </div>

        {/* WHY THIS ALERT */}
        <div className="border border-[#1e1e20] rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 p-4 bg-[#0f0f10] border-b border-[#1e1e20]">
            <Activity size={14} className="text-[#00D4AA]" />
            <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">Why This Alert Was Triggered</span>
          </div>

          <div className="bg-[#0f0f10] p-4">
            <p className="text-[13px] text-zinc-400 leading-relaxed mb-3 max-w-2xl">
              This alert fired because the system detected{' '}
              <span className="text-white font-semibold">sustained abnormal outbound data transfer behavior</span>
              {' '}that deviated significantly from the host's historical baseline.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {/* Detection Stages */}
              <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
                  <span className="text-[13px] font-black text-[#00D4AA] uppercase tracking-widest">Detection Stages</span>
                </div>
                {[
                  ['Anomaly detected', 'Initial abnormal outbound activity identified vs. normal behavior.'],
                  ['Behavior sustained', 'Abnormal behavior persisted across multiple observation intervals.'],
                  ['Threshold exceeded', 'Combined signal confidence crossed the alert threshold.']
                ].map(([title, desc], i) => (
                  <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
                    <span className="text-[13px] font-black text-zinc-600 min-w-[14px] leading-tight">{i + 1}</span>
                    <div>
                      <span className="text-[13px] font-bold text-white">{title}: </span>
                      <span className="text-[13px] text-zinc-500">{desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Factors */}
              <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
                  <span className="text-[13px] font-black text-white uppercase tracking-widest">Key Factors</span>
                </div>
                {[
                  'Sustained outbound volume spike over baseline window.',
                  'Abnormal upload-to-download ratio detected.',
                  'Activity concentrated in off-hours (00:00–05:00).',
                  'No corresponding authorized process found.'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
                    <span className="text-[#00D4AA] mt-0.5 text-[13px]">▸</span>
                    <span className="text-[13px] text-zinc-400 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>

              {/* Context */}
              <div className="bg-zinc-900/30 border border-[#1e1e20] rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">Context</span>
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">
                  Activity was observed consistently over a defined time window and was <span className="text-white">not</span> a single transient spike. Host had no scheduled maintenance or backup activity during the flagged period.
                </p>
                <div className="flex gap-3 mt-2.5 pt-2 border-t border-[#1e1e20]">
                  <div>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Window</p>
                    <p className="text-[13px] font-black text-white">15 min</p>
                  </div>
                  <div className="w-px bg-[#1e1e20]" />
                  <div>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Baseline</p>
                    <p className="text-[13px] font-black text-white">14 days</p>
                  </div>
                  <div className="w-px bg-[#1e1e20]" />
                  <div>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider">Conf.</p>
                    <p className="text-[13px] font-black text-[#00D4AA]">HIGH</p>
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
                    className="relative z-10 mt-[18px] rounded-full flex items-center justify-center text-[13px] font-black"
                    style={{
                      width: 30, height: 30,
                      background: col.bg,
                      border: `2px solid ${col.border}`,
                      color: col.text
                    }}
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
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-t-lg border border-[#1e1e20] bg-[#0f0f10] hover:border-cyan-600/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-black text-white uppercase tracking-tight">{stage.name}</span>
                      <span className="text-[13px] text-zinc-500">— {stage.purpose}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span
                        className="px-2.5 py-0.5 rounded text-[13px] font-black uppercase"
                        style={{ background: col.bg, border: `1px solid ${col.border}`, color: col.text }}
                      >
                        {stage.status}
                      </span>
                      <ChevronDown
                        size={14}
                        className="text-zinc-600 transition-transform duration-200"
                        style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                      />
                    </div>
                  </button>

                  {open && (
                    <div className="border border-t-0 border-[#1e1e20] rounded-b-lg bg-[#0f0f10] px-4 py-3">
                      <div className="grid grid-cols-4 gap-x-4 gap-y-3">

                        {/* col 1 – source */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-1">Input Dependency</p>
                            <div className="text-[13px] text-zinc-300">{stage.inputDependency}</div>
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-1">Data Source</p>
                            <div className="flex items-center gap-1.5">
                              <Database size={12} className="text-[#00D4AA]" />
                              <div className="text-[13px] text-[#00D4AA] font-semibold">{stage.dataSource}</div>
                            </div>
                          </div>
                        </div>

                        {/* col 2 – fields */}
                        <div>
                          <p className="text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Fields Used</p>
                          <div className="flex flex-wrap gap-1">
                            {stage.fieldsUsed.map((f, i) => (
                              <span key={i} className="px-2 py-0.5 bg-zinc-900/50 border border-[#1e1e20] rounded text-[13px] text-zinc-400">{f}</span>
                            ))}
                          </div>
                        </div>

                        {/* col 3 – conditions */}
                        <div>
                          <p className="text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Detection Conditions</p>
                          <div className="bg-zinc-900/50 border border-[#1e1e20] rounded-lg p-2 space-y-1.5">
                            {stage.conditions.map((c, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-[#00D4AA] text-sm leading-tight">•</span>
                                <div className="text-[13px] text-zinc-300 leading-tight">{c}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* col 4 – threshold + output */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-1">Threshold Logic</p>
                            <pre className="text-[13px] text-zinc-400 whitespace-pre-wrap">{stage.thresholdLogic}</pre>
                          </div>
                          <div
                            className="p-2 rounded-lg border"
                            style={{ background: col.bg, borderColor: col.border }}
                          >
                            <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Output Signal</p>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 size={13} style={{ color: col.text }} />
                              <div className="text-[13px] font-bold" style={{ color: col.text }}>{stage.output}</div>
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
        <div className="flex items-center gap-4 border border-[#1e1e20] rounded-lg overflow-hidden bg-[#0f0f10]">
          <div className="flex items-center justify-center px-3 py-3 bg-cyan-900/20">
            <AlertTriangle size={20} className="text-[#00D4AA]" />
          </div>
          <div className="py-2 flex-1">
            <span className="text-[13px] font-black text-[#00D4AA] uppercase tracking-widest">Triggered When: </span>
            <div className="text-[13px] text-zinc-300 ml-1">
              stage_1 signal exists for same host &amp;&amp; time_diff {'<'} 15 minutes
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}