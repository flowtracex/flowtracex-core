import React, { useState } from 'react';
import { 
  ArrowLeft, Layers, AlertTriangle, Shield, CheckCircle2, 
  ChevronDown, ChevronRight, Clock, Database, FileText
} from 'lucide-react';

interface Stage {
  id: number;
  name: string;
  purpose: string;
  inputDependency: string;
  dataSource: string;
  fieldsUsed: string[];
  conditions: string[];
  thresholdLogic: string;
  output: string;
  status: 'active' | 'triggered' | 'pending';
}

interface Props {
  useCaseId: string | null;
  onBack: () => void;
}

const MOCK_USE_CASE = {
  id: 'UC-001',
  name: 'Ransomware Detection',
  description: 'Detects crypto-locking activity using multi-stage behavioral signals.',
  stages: 3,
  signals: 5,
  mlEnabled: true,
  confidence: 'HIGH'
};

const MOCK_STAGES: Stage[] = [
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
      'activity_time between 00:00-05:00 local'
    ],
    thresholdLogic: 'baseline_window = 14 days\nwindow_size = 5 minutes',
    output: 'STAGE-1 SIGNAL EMITTED (LOW CONFIDENCE)',
    status: 'active'
  },
  {
    id: 2,
    name: 'File System Pressure',
    purpose: 'Identify rapid file operations characteristic of encryption.',
    inputDependency: 'stage_1 and stage_2 signals triggered within 15 minutes window',
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
    inputDependency: 'stage_1 and stage_2 signals triggered within 15 minutes window',
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

const UseCaseDetailPage: React.FC<Props> = ({ useCaseId, onBack }) => {
  const [expandedStages, setExpandedStages] = useState<number[]>([1]);

  const toggleStage = (stageId: number) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  return (
    <div className="max-w-[1300px] mx-auto space-y-4 pb-12">
      
      {/* Compact Header */}
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
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">
              {useCaseId || 'UC-001'} • {MOCK_USE_CASE.description}
            </p>
          </div>
        </div>
        
        {/* Inline Meta Info */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#0a0a0b] border border-zinc-800 rounded text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
            <Layers size={10} className="text-[#00D4AA]" />
            {MOCK_USE_CASE.stages}
          </span>
          <span className="px-2.5 py-1 bg-[#0a0a0b] border border-zinc-800 rounded text-[9px] font-black uppercase text-zinc-400 flex items-center gap-1.5">
            <AlertTriangle size={10} className="text-amber-400" />
            {MOCK_USE_CASE.signals}
          </span>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-[9px] font-black uppercase text-emerald-400">
            ML
          </span>
          <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded text-[9px] font-black uppercase text-red-400">
            {MOCK_USE_CASE.confidence}
          </span>
        </div>
      </div>

      {/* Why This Alert Was Triggered */}
      <div className="bg-[#0a0a0b] border border-zinc-800 rounded-lg p-4">
        <h3 className="text-[11px] font-black text-white uppercase tracking-tight mb-2">
          Why This Alert Was Triggered
        </h3>
        
        <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">
          This alert was triggered because the system detected <span className="text-white font-semibold">sustained abnormal outbound data transfer behavior</span> that deviated significantly from the host's historical baseline.
        </p>

        <div className="grid grid-cols-3 gap-6">
          
          {/* Detection Stages */}
          <div>
            <h4 className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest mb-2">
              Detection stages:
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-white font-bold text-[10px] min-w-[14px]">1.</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">Anomaly detected</span> – Initial abnormal outbound activity was identified compared to normal behavior.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white font-bold text-[10px] min-w-[14px]">2.</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">Behavior sustained</span> – The abnormal behavior persisted across multiple observation intervals.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-white font-bold text-[10px] min-w-[14px]">3.</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  <span className="text-white font-semibold">Alert threshold exceeded</span> – Combined signal confidence crossed the alert threshold, resulting in alert generation.
                </p>
              </div>
            </div>
          </div>

          {/* Key Contributing Factors */}
          <div>
            <h4 className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest mb-2">
              Key contributing factors:
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="text-[#00D4AA] text-xs">•</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Sustained outbound volume spike
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[#00D4AA] text-xs">•</span>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Abnormal upload-to-download ratio
                </p>
              </div>
            </div>
          </div>

          {/* Additional Context */}
          <div>
            <h4 className="text-[9px] font-black text-[#00D4AA] uppercase tracking-widest mb-2">
              Context:
            </h4>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              The activity was observed consistently over a defined time window and was not a single transient spike.
            </p>
          </div>

        </div>
      </div>

      {/* All Stages in Single View - Maximum Columns */}
      <div className="space-y-3">
        {MOCK_STAGES.map(stage => (
          <div
            key={stage.id}
            className="border border-zinc-800 rounded-lg overflow-hidden"
          >
            {/* Ultra Compact Stage Header */}
            <button
              onClick={() => toggleStage(stage.id)}
              className="w-full px-4 py-2 flex items-center justify-between bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors border-b border-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900 border border-zinc-800">
                  <span className="text-sm font-black text-white">{stage.id}</span>
                </div>
                <div className="text-left">
                  <span className="text-xs font-black text-white uppercase">{stage.name}</span>
                  <span className="text-[10px] text-zinc-500 ml-2">— {stage.purpose}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                  stage.status === 'active' ? 'bg-[#00D4AA]/10 text-[#00D4AA]' :
                  stage.status === 'triggered' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {stage.status}
                </span>
                <ChevronDown 
                  size={16} 
                  className={`text-zinc-600 transition-transform ${
                    expandedStages.includes(stage.id) ? '' : '-rotate-90'
                  }`}
                />
              </div>
            </button>
          
            {/* Ultra Compact Content - 4 Column Grid */}
            {expandedStages.includes(stage.id) && (
              <div className="px-4 py-3 bg-[#0a0a0b]">
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  
                  {/* Column 1: Input & Data Source */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Input Dependency</h4>
                      <code className="text-[10px] text-zinc-300 font-mono">{stage.inputDependency}</code>
                    </div>
                    <div className="pt-2 border-t border-zinc-800">
                      <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Data Source</h4>
                      <div className="flex items-center gap-1.5">
                        <Database size={10} className="text-purple-400" />
                        <code className="text-[10px] text-purple-300 font-mono font-semibold">{stage.dataSource}</code>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Fields Used */}
                  <div>
                    <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Fields Used</h4>
                    <div className="flex flex-wrap gap-1">
                      {stage.fieldsUsed.map((field, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-mono text-zinc-400"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Conditions - Box for Important Info */}
                  <div>
                    <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-2">Detection Conditions</h4>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-2 space-y-1">
                      {stage.conditions.map((condition, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#00D4AA] text-xs">•</span>
                          <code className="text-[9px] text-zinc-300 font-mono leading-tight flex-1">{condition}</code>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 4: Threshold & Output - Box for Important Info */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Threshold Logic</h4>
                      <pre className="text-[9px] text-zinc-400 font-mono">{stage.thresholdLogic}</pre>
                    </div>
                    <div className={`p-2 rounded-lg border ${
                      stage.status === 'active' ? 'bg-[#00D4AA]/10 border-[#00D4AA]/30' :
                      stage.status === 'triggered' ? 'bg-amber-500/10 border-amber-500/30' :
                      'bg-red-500/10 border-red-500/30'
                    }`}>
                      <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">Output Signal</h4>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={11} className={
                          stage.status === 'active' ? 'text-[#00D4AA]' :
                          stage.status === 'triggered' ? 'text-amber-400' :
                          'text-red-400'
                        } />
                        <code className={`text-[9px] font-mono font-bold ${
                          stage.status === 'active' ? 'text-[#00D4AA]' :
                          stage.status === 'triggered' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>
                          {stage.output}
                        </code>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Compact Triggered When Section */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center gap-3">
        <AlertTriangle size={16} className="text-amber-400" />
        <div>
          <h3 className="text-[8px] font-black text-amber-400 uppercase tracking-widest">Triggered When:</h3>
          <p className="text-[10px] text-zinc-300 font-mono">stage_1 signal exists for same host and time difference &lt; 15 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseDetailPage;