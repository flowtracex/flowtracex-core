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
    <div className="animate-in fade-in max-w-[1300px] mx-auto duration-500 space-y-8 pb-32">
      
      {/* Header with Back Button */}
      <div className="space-y-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack} 
            className="p-3 bg-[#161618] border border-[#1e1e20] rounded-xl text-zinc-500 hover:text-white transition-all hover:border-zinc-700"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{MOCK_USE_CASE.name}</h2>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1.5">
              Use Case ID: {useCaseId || 'UC-001'}
            </p>
          </div>
        </div>
        <div className="border border-zinc-800 rounded-lg py-3 px-4">
          {/* Description */}
        <p className="text-xs text-zinc-400">{MOCK_USE_CASE.description}</p>
        {/* Meta Info */}
        <div className="flex items-center gap-3 flex-wrap mt-3">
          <span className="px-3 py-1.5 bg-[#0a0a0b] border border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Layers size={12} className="text-cyan-400" />
            STAGES: {MOCK_USE_CASE.stages}
          </span>
          <span className="px-3 py-1.5 bg-[#0a0a0b] border border-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <AlertTriangle size={12} className="text-amber-400" />
            SIGNALS: {MOCK_USE_CASE.signals}
          </span>
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
            <Shield size={12} />
            ML: YES
          </span>
          <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-red-400 flex items-center gap-2">
            <CheckCircle2 size={12} />
            CONFIDENCE: {MOCK_USE_CASE.confidence}
          </span>
        </div>

        </div>

        
        
        
      </div>

      {/* Detection Lifecycle */}
      {/* <div className="space-y-4 border border-zinc-800 rounded-lg py-3 px-4">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Detection Lifecycle</h2>
        
       
        <div className="flex items-center gap-3 flex-wrap">
          {MOCK_STAGES.map((stage, idx) => (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => toggleStage(stage.id)}
                className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                  stage.status === 'active' ? 'bg-[#0a0a0b] border-zinc-800 text-white hover:border-cyan-600' :
                  stage.status === 'triggered' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 hover:border-amber-400' :
                  'bg-red-500/10 border-red-500/50 text-red-400 hover:border-red-400'
                }`}
              >
                {stage.name}
              </button>
              {idx < MOCK_STAGES.length - 1 && (
                <ChevronRight size={16} className="text-zinc-800" />
              )}
            </React.Fragment>
          ))}
          <div className="ml-auto px-5 py-2.5 bg-red-900/20 border border-red-700/50 rounded-lg">
            <span className="text-[10px] font-black text-red-400 uppercase tracking-tight">
              ALERT TRIGGERED
            </span>
          </div>
        </div>
      </div> */}

      {/* Execution Stages */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Execution Stages</h2>
        
        {MOCK_STAGES.map(stage => (
          <div
          key={stage.id}
          className={`bg-[#0a0a0b] border rounded-xl overflow-hidden transition-all shadow-xl ${
            expandedStages.includes(stage.id) 
              ? stage.status === 'active' ? 'border-cyan-500/50' :
                stage.status === 'triggered' ? 'border-amber-500/50' :
                'border-red-500/50'
              : 'border-zinc-800'
          }`}
        >
          {/* Stage Header */}
          <button
            onClick={() => toggleStage(stage.id)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-black">
                Stage {stage.id}
              </span>
              <span className="text-sm font-black text-white tracking-tight">
                — {stage.name}
              </span>
            </div>
            <ChevronDown 
              size={18} 
              className={`text-zinc-600 transition-transform ${
                expandedStages.includes(stage.id) ? '' : '-rotate-90'
              }`}
            />
          </button>
        
          {/* Stage Content */}
          {expandedStages.includes(stage.id) && (
            <div className="px-6 pb-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-6">
                
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Purpose */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      1. Purpose
                    </h3>
                    <p className="text-xs text-white font-medium leading-relaxed">
                      {stage.purpose}
                    </p>
                  </div>
        
                  {/* Input Dependency */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      2. Input Dependency
                    </h3>
                    <div className="px-3 py-2 bg-black border border-zinc-800 rounded-lg">
                      <code className="text-xs text-blue-400 font-mono">
                        {stage.inputDependency}
                      </code>
                    </div>
                  </div>
        
                  {/* Data Source */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      3. Data Source
                    </h3>
                    <div className="px-3 py-2 bg-black border border-zinc-800 rounded-lg flex items-center gap-2">
                      <Database size={12} className="text-purple-400" />
                      <code className="text-xs text-purple-400 font-mono font-bold">
                        {stage.dataSource}
                      </code>
                    </div>
                  </div>
        
                  {/* Fields Used */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      4. Fields Used
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {stage.fieldsUsed.map((field, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-mono text-zinc-300"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
        
                {/* Right Column */}
                <div className="space-y-4">
                  {/* Conditions */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      5. Conditions
                    </h3>
                    <div className="space-y-1.5">
                      {stage.conditions.map((condition, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1    rounded-lg flex items-start gap-2"
                        >
                          <span className="text-cyan-400 text-sm leading-none mt-0.5">•</span>
                          <code className="text-xs text-white font-mono flex-1">
                            {condition}
                          </code>
                        </div>
                      ))}
                    </div>
                  </div>
        
                  {/* Threshold Logic */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      6. Threshold Logic
                    </h3>
                    <div className="px-3 py-2 bg-black border border-zinc-800 rounded-lg">
                      <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">
                        {stage.thresholdLogic}
                      </pre>
                    </div>
                  </div>
        
                  {/* Output */}
                  <div className="space-y-2">
                    <h3 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                      7. Output
                    </h3>
                    <div className={`px-3 py-2 rounded-lg border ${
                      stage.status === 'active' ? 'bg-cyan-500/5 border-cyan-500/30' :
                      stage.status === 'triggered' ? 'bg-amber-500/5 border-amber-500/30' :
                      'bg-red-500/5 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className={
                          stage.status === 'active' ? 'text-cyan-400' :
                          stage.status === 'triggered' ? 'text-amber-400' :
                          'text-red-400'
                        } />
                        <code className={`text-xs font-mono font-bold ${
                          stage.status === 'active' ? 'text-cyan-400' :
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
            </div>
          )}
        </div>
        ))}
      </div>

      {/* Triggered When Section */}
      <div className="bg-[#0a0a0b] border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <AlertTriangle size={20} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-2">
              Triggered When:
            </h3>
            <p className="text-xs text-zinc-300 font-mono italic">
              stage_1 signal exists for same host and time difference &lt; 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseDetailPage;