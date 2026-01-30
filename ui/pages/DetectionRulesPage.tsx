import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, Search, Zap, Activity, Shield, Plus, X, 
  ChevronDown, RefreshCcw, Code, AlertTriangle, Fingerprint, 
  Trash2, Copy, Edit2, Filter, CheckCircle2, Lock, Database, 
  Layers, TrendingUp, Target, Monitor, MoreVertical, Cpu, 
  BarChart2, Download, Eye, Play, Save, HelpCircle, Info, 
  Check, Sliders, Box, MousePointer2, AlertCircle, PieChart as PieChartIcon,
  Settings2, Terminal, Clock, Send, Sparkles, TrendingDown,
  Brain, BookOpen, ArrowRight, User, Users, Globe, Hash, Link,
  CheckSquare, Square, Layout, ListChecks, ArrowUpRight, Maximize2,
  ShieldCheck, ToggleLeft, ToggleRight, FileText, Calendar, Network,
  HardDrive, Smartphone, Mail, Bell, Workflow, Tag, History as HistoryIcon,
  Minus, MessageSquare
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line, AreaChart, Area, Legend, ComposedChart
} from 'recharts';
import { MOCK_RULES, MOCK_RULE_ANALYTICS } from '../constants/mockData/rules';
import { Rule, Severity } from '../types';

type TabId = 'library' | 'analytics' | 'builder';
type EngineType = 'query' | 'threshold' | 'ml';

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface LogicGroup {
  id: string;
  source: string;
  conditions: Condition[];
}

const DetectionRulesPage: React.FC<{ defaultView?: TabId }> = ({ defaultView = 'library' }) => {
  const [activeTab, setActiveTab] = useState<TabId>(defaultView);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Builder State
  const [ruleName, setRuleName] = useState('Suspicious SMB Inbound');
  const [severity, setSeverity] = useState<Severity>('medium');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<'realtime' | 'scheduled'>('realtime');
  const [repeatValue, setRepeatValue] = useState(5);
  const [repeatUnit, setRepeatUnit] = useState('Minutes');
  const [lookback, setLookback] = useState(1);
  const [riskScore, setRiskScore] = useState(50);
  const [engineType, setEngineType] = useState<EngineType>('query');
  const [tactic, setTactic] = useState('Initial Access');
  const [techniqueId, setTechniqueId] = useState('T1078');
  
  // Logic Step State
  const [groupBy, setGroupBy] = useState('none');
  const [thresholdHits, setThresholdHits] = useState(5);
  const [thresholdWindow, setThresholdWindow] = useState(5);
  const [thresholdUnit, setThresholdUnit] = useState('MINUTES');
  const [thresholdField, setThresholdField] = useState('source.ip');
  
  const [logicGroups, setLogicGroups] = useState<LogicGroup[]>([
    { id: 'lb1', source: 'Network Data', conditions: [
      { id: 'c1', field: 'source.ip', operator: 'is', value: '10.0.0.1' },
      { id: 'c2', field: 'destination.port', operator: 'is', value: '445' }
    ]}
  ]);

  // Modal State
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [activeFieldInput, setActiveFieldInput] = useState<{groupId: string, condId: string, fieldType: 'field' | 'value'} | null>(null);
  const [modalTab, setModalTab] = useState<'default' | 'enriched' | 'datasets' | 'static'>('default');
  const [selectedDefaultField, setSelectedDefaultField] = useState<string | null>(null);
  // Field Catalog Data
  const fieldCatalog = {
    default: [
      { id: 'source.ip', desc: 'Raw Source IP Address' },
      { id: 'destination.ip', desc: 'Raw Destination IP Address' },
      { id: 'destination.port', desc: 'Destination Port (Integer)' },
      { id: 'service', desc: 'Detected Protocol' },
      { id: 'query', desc: 'DNS Query String' },
      { id: 'user.id', desc: 'User Identifier' },
      { id: 'host.name', desc: 'Host Name' },
    ],
    enriched: [
      { id: 'enrichment.is_public', desc: 'True if non-RFC1918' },
      { id: 'enrichment.reputation', desc: 'Local trust score (0-100)' },
      { id: 'enrichment.asset_role', desc: 'DB, Web, etc' },
      { id: 'enrichment.geo_country', desc: 'Country Code' },
    ]
  };

  const valueCatalog = {
    datasets: [
      { id: 'dataset.in_blacklist', table: 'ip_blacklist_10m', desc: '10M+ Malicious IPs' },
      { id: 'dataset.top_1m', table: 'top_1m_domains', desc: 'Alexa Top 1M' },
      { id: 'dataset.threat_intel', table: 'threat_intel_feed', desc: 'Real-time Threat Intel' },
    ],
    static: [
      { id: 'true', desc: 'Boolean True' },
      { id: 'false', desc: 'Boolean False' },
      { id: 'null', desc: 'Undefined' },
    ]
  };

  useEffect(() => {
    setActiveTab(defaultView);
  }, [defaultView]);

  const addLogicGroup = () => {
    const newId = `lb${logicGroups.length + 1}`;
    setLogicGroups([...logicGroups, { id: newId, source: 'Endpoint Logs', conditions: [{ id: Math.random().toString(), field: 'user.id', operator: 'is', value: '' }] }]);
  };

  const removeLogicGroup = (id: string) => setLogicGroups(logicGroups.filter(g => g.id !== id));
  
  const addCondition = (groupId: string) => {
    setLogicGroups(logicGroups.map(g => g.id === groupId ? { ...g, conditions: [...g.conditions, { id: Math.random().toString(), field: '', operator: 'is', value: '' }] } : g));
  };

  const removeCondition = (groupId: string, condId: string) => {
    setLogicGroups(logicGroups.map(g => g.id === groupId ? { ...g, conditions: g.conditions.filter(c => c.id !== condId) } : g));
  };

  const updateCondition = (groupId: string, condId: string, data: Partial<Condition>) => {
    setLogicGroups(logicGroups.map(g => g.id === groupId ? { ...g, conditions: g.conditions.map(c => c.id === condId ? { ...c, ...data } : c) } : g));
  };

  // Modal Functions
  const openFieldModal = (groupId: string, condId: string, fieldType: 'field' | 'value') => {
    setActiveFieldInput({ groupId, condId, fieldType });
    setModalTab(fieldType === 'field' ? 'default' : 'datasets');
    setSelectedDefaultField(null); // Reset selected field
    setShowFieldModal(true);
  };
  
  const closeFieldModal = () => {
    setShowFieldModal(false);
    setActiveFieldInput(null);
    setSelectedDefaultField(null); // Reset when closing
  };

  const selectFieldValue = (value: string) => {
   if (activeFieldInput) {
     const { groupId, condId, fieldType } = activeFieldInput;
     
     // Handle correlation join keys
     if (groupId === 'correlation-g1' && condId === 'join-key') {
       setThresholdField(value);
     } else if (groupId === 'correlation-g2' && condId === 'join-key') {
       // Handle second correlation key (you might want to add state for this)
       console.log('Group B join key:', value);
     } else if (groupId === 'dedup' && condId === 'key') {
       // Handle deduplication key addition
       console.log('Add dedup key:', value);
       // You can add logic here to add the key to a deduplication keys array
     } else {
       // Handle normal condition fields/values
       updateCondition(groupId, condId, fieldType === 'field' ? { field: value } : { value });
     }
   }
   closeFieldModal();
 };

  // Field Picker Modal Component
// Update the FieldPickerModal component - replace the entire value picker section:

const FieldPickerModal = () => {
  if (!showFieldModal) return null;

  const isFieldPicker = activeFieldInput?.fieldType === 'field';
  
  if (isFieldPicker) {
    // Field picker - show enriched fields only when a default field is selected
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className={`bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 transition-all ${
            selectedDefaultField ? 'w-[720px]' : 'w-[450px]'
          }`}
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Select Field
            </h3>
            <button 
              onClick={() => {
                setSelectedDefaultField(null);
                closeFieldModal();
              }}
              className="text-zinc-500 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
          
          <div className={`grid ${selectedDefaultField ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Left Side - Default Fields */}
            <div className={selectedDefaultField ? 'border-r border-zinc-800' : ''}>
              <div className="p-3 bg-zinc-900/20 border-b border-zinc-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Default Fields</h4>
              </div>
              <div className="p-2 max-h-[320px] overflow-y-auto">
                {fieldCatalog.default.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (selectedDefaultField === item.id) {
                        // If clicking the same field, select it
                        selectFieldValue(item.id);
                        setSelectedDefaultField(null);
                      } else {
                        // Show enriched fields for this default field
                        setSelectedDefaultField(item.id);
                      }
                    }}
                    className={`p-3 mb-1 rounded-xl cursor-pointer border transition-all group ${
                      selectedDefaultField === item.id
                        ? 'bg-zinc-800 border-blue-500/50'
                        : 'hover:bg-zinc-800 border-transparent hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-mono text-zinc-300 flex items-center justify-between">
                      {item.id}
                      {selectedDefaultField === item.id && (
                        <span className="text-blue-400 text-[9px]">→</span>
                      )}
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Enriched Fields (only shown when default field selected) */}
            {selectedDefaultField && (
              <div className="animate-in slide-in-from-right duration-200">
                <div className="p-3 bg-zinc-900/20 border-b border-zinc-800 flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                    Enriched Fields for {selectedDefaultField}
                  </h4>
                  <button
                    onClick={() => setSelectedDefaultField(null)}
                    className="text-[9px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-widest"
                  >
                    ← Back
                  </button>
                </div>
                <div className="p-2 max-h-[320px] overflow-y-auto">
                  {fieldCatalog.enriched.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        selectFieldValue(item.id);
                        setSelectedDefaultField(null);
                      }}
                      className="p-3 mb-1 rounded-xl hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-blue-700/30 transition-all group"
                    >
                      <div className="text-[11px] font-bold font-mono text-blue-400">{item.id}</div>
                      <div className="text-[9px] text-zinc-500 mt-1">{item.desc}</div>
                    </div>
                  ))}
                  
                  {/* Option to select the base field */}
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div
                      onClick={() => {
                        selectFieldValue(selectedDefaultField);
                        setSelectedDefaultField(null);
                      }}
                      className="p-3 rounded-xl hover:bg-blue-600/10 cursor-pointer border border-blue-500/30 hover:border-blue-500/50 transition-all"
                    >
                      <div className="text-[11px] font-bold font-mono text-zinc-300">
                        Use base field: {selectedDefaultField}
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1">Select the original field without enrichment</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">
            Phase-1 Engine • Automatic Fact Discovery Enabled
          </div>
        </div>
      </div>
    );
  } else {
    // Value picker - show datasets only when a static value is selected
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className={`bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 transition-all ${
            selectedDefaultField ? 'w-[720px]' : 'w-[450px]'
          }`}
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Select Value
            </h3>
            <button 
              onClick={() => {
                setSelectedDefaultField(null);
                closeFieldModal();
              }}
              className="text-zinc-500 hover:text-white transition-colors text-lg leading-none"
            >
              ✕
            </button>
          </div>
          
          <div className={`grid ${selectedDefaultField ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {/* Left Side - Static Values */}
            <div className={selectedDefaultField ? 'border-r border-zinc-800' : ''}>
              <div className="p-3 bg-zinc-900/20 border-b border-zinc-800">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Common Values</h4>
              </div>
              <div className="p-2 max-h-[320px] overflow-y-auto">
                {valueCatalog.static.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (selectedDefaultField === item.id) {
                        // If clicking the same value, select it
                        selectFieldValue(item.id);
                        setSelectedDefaultField(null);
                      } else {
                        // Show datasets for this static value
                        setSelectedDefaultField(item.id);
                      }
                    }}
                    className={`p-3 mb-1 rounded-xl cursor-pointer border transition-all group ${
                      selectedDefaultField === item.id
                        ? 'bg-zinc-800 border-emerald-500/50'
                        : 'hover:bg-zinc-800 border-transparent hover:border-zinc-700'
                    }`}
                  >
                    <div className="text-[11px] font-bold font-mono text-zinc-300 flex items-center justify-between">
                      {item.id}
                      {selectedDefaultField === item.id && (
                        <span className="text-emerald-400 text-[9px]">→</span>
                      )}
                    </div>
                    <div className="text-[9px] text-zinc-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Datasets (only shown when static value selected) */}
            {selectedDefaultField && (
              <div className="animate-in slide-in-from-right duration-200">
                <div className="p-3 bg-zinc-900/20 border-b border-zinc-800 flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">
                    Datasets
                  </h4>
                  <button
                    onClick={() => setSelectedDefaultField(null)}
                    className="text-[9px] text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-widest"
                  >
                    ← Back
                  </button>
                </div>
                <div className="p-2 max-h-[320px] overflow-y-auto">
                  {valueCatalog.datasets.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        selectFieldValue(item.id);
                        setSelectedDefaultField(null);
                      }}
                      className="p-3 mb-1 rounded-xl hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-emerald-700/30 transition-all group"
                    >
                      <div className="text-[11px] font-bold font-mono text-emerald-400">{item.id}</div>
                      <div className="text-[9px] text-zinc-500 mt-1">{item.desc}</div>
                      {item.table && (
                        <div className="text-[8px] text-zinc-600 mt-1 font-mono">Table: {item.table}</div>
                      )}
                    </div>
                  ))}
                  
                  {/* Option to select the base value */}
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <div
                      onClick={() => {
                        selectFieldValue(selectedDefaultField);
                        setSelectedDefaultField(null);
                      }}
                      className="p-3 rounded-xl hover:bg-emerald-600/10 cursor-pointer border border-emerald-500/30 hover:border-emerald-500/50 transition-all"
                    >
                      <div className="text-[11px] font-bold font-mono text-zinc-300">
                        Use value: {selectedDefaultField}
                      </div>
                      <div className="text-[9px] text-zinc-500 mt-1">Select this common value directly</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 text-[9px] text-zinc-500 uppercase font-bold tracking-tighter">
            Phase-1 Engine • Automatic Fact Discovery Enabled
          </div>
        </div>
      </div>
    );
  }
};

  // --- Step 1: Definition & Scheduling ---
  const renderStep1About = () => (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 animate-in fade-in duration-300">
  
      {/* LEFT SIDE */}
      <div className="space-y-4">
  
        
        {/* GENERAL INFORMATION */}
<section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-3">
    <FileText size={14} className="text-blue-400" />
    <h3 className="text-xs font-black text-white uppercase tracking-widest">
      General Information
    </h3>
  </div>

  <div className="grid grid-cols-12 gap-3 items-end">
    {/* Rule Name */}
    <div className="col-span-4 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Rule Name *
      </label>
      <input
        type="text"
        value={ruleName}
        onChange={e => setRuleName(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-[#00D4AA]"
      />
    </div>

    {/* Severity */}
    <div className="col-span-2 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Severity
      </label>
      <select
        value={severity}
        onChange={e => setSeverity(e.target.value as Severity)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white outline-none"
      >
        <option value="critical">Critical</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    {/* Description */}
    <div className="col-span-6 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Description
      </label>
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white outline-none"
      />
    </div>
  </div>
</section>

{/* EXECUTION + MITRE */}
<section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
  <div className="flex items-center gap-2 mb-3">
    <Clock size={14} className="text-[#006bb4]" />
    <h3 className="text-xs font-black text-white uppercase tracking-widest">
      Execution & Mapping
    </h3>
  </div>

  <div className="grid grid-cols-12 gap-3 items-end">
    {/* Run Mode */}
    <div className="col-span-3 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Run Mode
      </label>
      <div className="flex gap-2">
        {['realtime', 'scheduled'].map(mode => (
          <button
            key={mode}
            onClick={() => setFrequency(mode as any)}
            className={`px-3 py-1.5 rounded-md border text-[10px] font-black uppercase
              ${frequency === mode
                ? 'bg-[#006bb410] border-[#006bb444] text-white'
                : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>

    {/* Repeat */}
    <div className={`col-span-2 space-y-1 ${frequency === 'realtime' && 'opacity-30 pointer-events-none'}`}>
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Repeat
      </label>
      <input
        type="number"
        value={repeatValue}
        onChange={e => setRepeatValue(+e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-white"
      />
    </div>

    <div className={`col-span-2 space-y-1 ${frequency === 'realtime' && 'opacity-30 pointer-events-none'}`}>
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Unit
      </label>
      <select
        value={repeatUnit}
        onChange={e => setRepeatUnit(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-white"
      >
        <option>Minutes</option>
        <option>Hours</option>
        <option>Days</option>
      </select>
    </div>

    {/* Lookback */}
    <div className="col-span-1 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Lookback
      </label>
      <input
        type="number"
        value={lookback}
        onChange={e => setLookback(+e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-white"
      />
    </div>

    {/* MITRE */}
    <div className="col-span-3 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        MITRE Tactic
      </label>
      <select
        value={tactic}
        onChange={e => setTactic(e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-white"
      >
        <option>Initial Access</option>
        <option>Execution</option>
        <option>Persistence</option>
        <option>Command & Control</option>
      </select>
    </div>

    <div className="col-span-1 space-y-1">
      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
        Tech ID
      </label>
      <input
        type="text"
        value={techniqueId}
        onChange={e => setTechniqueId(e.target.value)}
        placeholder="T1078"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1.5 text-sm text-white"
      />
    </div>
  </div>
</section>
      </div>
  
      {/* RIGHT SIDE */}
      <div className="space-y-4">
  
        {/* RISK ANALYTICS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            Risk Score
          </label>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-zinc-600">Impact</span>
            <span className="text-2xl font-black text-[#006bb4]">{riskScore}</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={riskScore}
            onChange={e => setRiskScore(+e.target.value)}
            className="w-full accent-[#006bb4]"
          />
        </div>
  
        {/* DETECTION STRATEGY */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
          <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            Detection Strategy
          </label>
  
          {[
            { id: 'query', label: 'Event Query', icon: Search },
            { id: 'threshold', label: 'Threshold', icon: TrendingUp },
            { id: 'ml', label: 'ML Anomaly', icon: Brain, disabled: true },
          ].map(s => (
            <button
              key={s.id}
              disabled={s.disabled}
              onClick={() => setEngineType(s.id as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md border text-left
                ${s.disabled
                  ? 'opacity-30 cursor-not-allowed'
                  : engineType === s.id
                    ? 'border-[#00D4AA] bg-[#006bb410]'
                    : 'border-zinc-800 bg-zinc-950'}`}
            >
              <s.icon size={14} />
              <span className="text-[11px] font-black uppercase text-white">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
  

  // --- Step 2: Logic & Aggregation with Modal ---
  // Update the renderStep2Logic function with these additions:

  const renderStep2Logic = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-300">
      {/* Field Picker Modal */}
      <FieldPickerModal />
  
      {/* STAGE 1: Identity */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold">01</div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">Identity</h2>
            <p className="text-[11px] text-zinc-500 font-medium tracking-tight">Standard Phase-1 Rule Metadata</p>
          </div>
        </div>
  
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <input 
              type="text" 
              value={ruleName}
              onChange={e => setRuleName(e.target.value)}
              placeholder="Rule Name..." 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-medium text-white outline-none focus:border-blue-500" 
            />
          </div>
          <div className="col-span-4">
            <select 
              value={severity}
              onChange={e => setSeverity(e.target.value as Severity)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 outline-none"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </section>
  
      {/* STAGE 2: Detection Logic */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-xl space-y-12">
        {/* STAGE 1: Initial Trigger */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Zap size={24} className="text-blue-500" />
              </div>
              <div>
                <h2 className="text-base font-bold text-zinc-100">Stage 01: Initial Trigger</h2>
                <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">Matching Pattern ({logicGroups[0]?.source.toUpperCase() || 'DNS.LOG'})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={logicGroups[0]?.source || 'Network Data'}
                onChange={e => setLogicGroups(logicGroups.map((g, i) => i === 0 ? {...g, source: e.target.value} : g))}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs font-bold text-zinc-400 outline-none"
              >
                <option value="Network Data">dns.log</option>
                <option value="Endpoint Logs">http.log</option>
                <option value="Auth Service">flow.log</option>
              </select>
              <button className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[9px] font-black text-blue-400 uppercase tracking-widest">
                Trigger_Source
              </button>
            </div>
          </div>
  
          <div className="space-y-4">
            {/* Parameters */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
              {logicGroups[0]?.conditions.map((cond) => (
                <div key={cond.id} className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={cond.field} 
                      onChange={e => updateCondition(logicGroups[0].id, cond.id, { field: e.target.value })} 
                      placeholder="id.orig_h"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-3 text-xs font-mono text-zinc-300 outline-none focus:border-blue-500" 
                    />
                    <button
                      onClick={() => openFieldModal(logicGroups[0].id, cond.id, 'field')}
                      className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-blue-600 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <select 
                    value={cond.operator} 
                    onChange={e => updateCondition(logicGroups[0].id, cond.id, { operator: e.target.value })} 
                    className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-[10px] font-bold uppercase text-blue-400 outline-none"
                  >
                    <option value="is">EQUAL</option>
                    <option value="!=">NOT EQUAL</option>
                    <option value="IN">IN</option>
                  </select>
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={cond.value} 
                      onChange={e => updateCondition(logicGroups[0].id, cond.id, { value: e.target.value })} 
                      placeholder="value..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-3 text-xs font-medium text-zinc-300 outline-none focus:border-blue-500" 
                    />
                    <button
                      onClick={() => openFieldModal(logicGroups[0].id, cond.id, 'value')}
                      className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-blue-600 transition-colors text-zinc-400 hover:text-white"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeCondition(logicGroups[0].id, cond.id)} 
                    className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => addCondition(logicGroups[0].id)} 
                className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2"
              >
                <Plus size={14} /> Add Parameter
              </button>
            </div>
  
            {/* Bucket Threshold */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={13} className="text-blue-400" />
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  Time-Bucket Logic
                </span>
                <span className="text-[9px] text-zinc-600 uppercase">
                  Agg: COUNT(*)
                </span>
              </div>
  
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">
                    Occ
                  </span>
                  <span className="text-xs text-zinc-500">&gt;</span>
                  <input
                    type="number"
                    value={thresholdHits}
                    onChange={e => setThresholdHits(parseInt(e.target.value))}
                    className="w-16 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-bold text-white outline-none"
                  />
                </div>
  
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-zinc-600 font-bold uppercase">
                    Window
                  </span>
                  <input
                    type="number"
                    value={thresholdWindow}
                    onChange={e => setThresholdWindow(parseInt(e.target.value))}
                    className="w-14 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-bold text-white outline-none"
                  />
                  <select
                    value={thresholdUnit}
                    onChange={e => setThresholdUnit(e.target.value)}
                    className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-[10px] font-bold text-zinc-400 outline-none"
                  >
                    <option value="MINUTES">min</option>
                    <option value="HOURS">hrs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* JOIN IDENTIFIER & CORRELATION */}
        {logicGroups.length > 1 && (
          <>
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
  <div className="flex items-center gap-4">
    {/* Left Section - Join Identifier */}
    <div className="flex items-center gap-3 flex-1">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
        Join Identifier
      </span>
      
      <div className="flex items-center gap-2 bg-zinc-900/50 p-2 rounded-lg border border-zinc-800">
        <div className="relative">
          <input
            type="text"
            value={thresholdField}
            onChange={e => setThresholdField(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 w-24 pl-2 pr-7 py-1.5 rounded-md text-[10px] font-mono text-blue-400 outline-none"
          />
          <button
            onClick={() => {
              setActiveFieldInput({
                groupId: 'correlation-g1',
                condId: 'join-key',
                fieldType: 'field'
              });
              setSelectedDefaultField(null);
              setShowFieldModal(true);
            }}
            className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-blue-600 transition-colors text-zinc-500 hover:text-white"
          >
            <span className="text-[10px] font-bold">+</span>
          </button>
        </div>

        <span className="text-zinc-700 font-bold text-sm">＝</span>

        <div className="relative">
          <input
            type="text"
            defaultValue="destination.ip"
            className="bg-zinc-950 border border-zinc-800 w-24 pl-2 pr-7 py-1.5 rounded-md text-[10px] font-mono text-purple-400 outline-none"
          />
          <button
            onClick={() => {
              setActiveFieldInput({
                groupId: 'correlation-g2',
                condId: 'join-key',
                fieldType: 'field'
              });
              setSelectedDefaultField(null);
              setShowFieldModal(true);
            }}
            className="absolute right-1 top-1 w-5 h-5 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-600 transition-colors text-zinc-500 hover:text-white"
          >
            <span className="text-[10px] font-bold">+</span>
          </button>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="h-8 w-px bg-zinc-800 flex-shrink-0"></div>

    {/* Middle Section - Global Window */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
        Global Window
      </span>
      <input
        type="text"
        defaultValue="5m"
        className="bg-zinc-950 border border-zinc-800 w-14 py-1.5 rounded-md text-[10px] text-center font-bold outline-none"
      />
    </div>

    {/* Divider */}
    <div className="h-8 w-px bg-zinc-800 flex-shrink-0"></div>

    {/* Right Section - Wait Window */}
    <div className="flex items-center gap-2 flex-shrink-0">
      <Clock size={12} className="text-zinc-400 flex-shrink-0" />
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
        Wait Window
      </span>
      <select
        defaultValue="2m"
        className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1.5 text-[10px] font-bold text-blue-400 outline-none cursor-pointer"
      >
        <option value="30s">30s</option>
        <option value="1m">1m</option>
        <option value="2m">2m</option>
        <option value="5m">5m</option>
        <option value="10m">10m</option>
      </select>
    </div>
  </div>
</div>
  
            {/* STAGE 2: Correlated Anomaly */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Sparkles size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-100">Stage 02: Correlated Anomaly</h2>
                    <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">Matching Pattern ({logicGroups[1]?.source.toUpperCase() || 'HTTP.LOG'})</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={logicGroups[1]?.source || 'Endpoint Logs'}
                    onChange={e => setLogicGroups(logicGroups.map((g, i) => i === 1 ? {...g, source: e.target.value} : g))}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs font-bold text-zinc-400 outline-none"
                  >
                    <option value="Endpoint Logs">http.log</option>
                    <option value="Network Data">dns.log</option>
                    <option value="Auth Service">flow.log</option>
                  </select>
                  <button 
                    onClick={() => removeLogicGroup(logicGroups[1].id)} 
                    className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <button 
                    onClick={() => removeLogicGroup(logicGroups[1].id)}
                    className="text-[10px] font-black text-zinc-600 uppercase tracking-widest cursor-pointer hover:text-red-500 transition-colors"
                  >
                    Remove Correlation
                  </button>
                </div>
              </div>
  
              <div className="space-y-4">
                {/* Parameters */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
                  {logicGroups[1]?.conditions.map((cond) => (
                    <div key={cond.id} className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={cond.field} 
                          onChange={e => updateCondition(logicGroups[1].id, cond.id, { field: e.target.value })} 
                          placeholder="id.orig_h"
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-3 text-xs font-mono text-zinc-300 outline-none focus:border-red-500" 
                        />
                        <button
                          onClick={() => openFieldModal(logicGroups[1].id, cond.id, 'field')}
                          className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-red-600 transition-colors text-zinc-400 hover:text-white"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <select 
                        value={cond.operator} 
                        onChange={e => updateCondition(logicGroups[1].id, cond.id, { operator: e.target.value })} 
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-[10px] font-bold uppercase text-red-400 outline-none"
                      >
                        <option value="is">EQUAL</option>
                        <option value="!=">NOT EQUAL</option>
                        <option value="IN">IN</option>
                      </select>
                      <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={cond.value} 
                          onChange={e => updateCondition(logicGroups[1].id, cond.id, { value: e.target.value })} 
                          placeholder="value..."
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-3 pr-10 py-3 text-xs font-medium text-zinc-300 outline-none focus:border-red-500" 
                        />
                        <button
                          onClick={() => openFieldModal(logicGroups[1].id, cond.id, 'value')}
                          className="absolute right-2 top-2 w-7 h-7 flex items-center justify-center rounded-md bg-zinc-800 hover:bg-red-600 transition-colors text-zinc-400 hover:text-white"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeCondition(logicGroups[1].id, cond.id)} 
                        className="w-9 h-9 flex items-center justify-center text-zinc-700 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => addCondition(logicGroups[1].id)} 
                    className="text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest flex items-center gap-2"
                  >
                    <Plus size={14} /> Add Parameter
                  </button>
                </div>
  
                {/* Anomaly Threshold */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={12} className="text-red-400" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Time-Bucket Logic
                    </span>
                    <span className="text-[9px] text-zinc-600 uppercase">
                      COUNT(*)
                    </span>
                  </div>
  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">
                        Occ
                      </span>
                      <span className="text-xs text-zinc-500">&gt;</span>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-14 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-bold text-white outline-none"
                      />
                    </div>
  
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-zinc-600 font-bold uppercase">
                        Window
                      </span>
                      <input
                        type="number"
                        defaultValue="1"
                        className="w-12 bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-xs font-bold text-white outline-none"
                      />
                      <select
                        defaultValue="MINUTES"
                        className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-[10px] font-bold text-zinc-400 outline-none"
                      >
                        <option value="MINUTES">min</option>
                        <option value="HOURS">hrs</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
  
        {/* ADD GROUP BUTTON */}
        {logicGroups.length === 1 && (
          <div className="border-2 border-dashed border-zinc-800/50 rounded-xl p-8 flex items-center justify-center hover:border-red-500/30 transition-all group cursor-pointer" onClick={addLogicGroup}>
            <span className="text-xs font-bold text-zinc-600 group-hover:text-red-500 transition-colors uppercase tracking-widest">
              ＋ Add Second Group for Correlation
            </span>
          </div>
        )}
      </section>
  
      {/* STAGE 3: Signal Tuning */}
      <section className="space-y-4 pb-20">
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-sm font-bold">03</div>
    <div>
      <h2 className="text-sm font-bold text-zinc-100">Signal Tuning</h2>
      <p className="text-[10px] text-zinc-500 font-medium">Manage alert fatigue and suppression.</p>
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Suppression & Limits</span>
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Mute Window</span>
          <input 
            type="text" 
            defaultValue="1h"
            className="bg-zinc-900 border border-zinc-800 w-14 py-1 rounded text-center text-xs font-bold outline-none" 
          />
        </div>
        <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
          <span className="text-[10px] text-zinc-500 font-bold uppercase">Suppression Limit</span>
          <input 
            type="number" 
            defaultValue="50"
            className="bg-zinc-900 border border-zinc-800 w-14 py-1 rounded text-center text-xs font-bold outline-none" 
          />
        </div>
      </div>
    </div>
    
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block">Deduplication Keys</span>
      <div className="relative">
        <input 
          type="text" 
          placeholder="Select key..."
          readOnly
          className="bg-zinc-950 border border-zinc-800 w-full pl-3 pr-9 py-2 rounded-lg text-xs font-mono text-zinc-500 outline-none cursor-pointer" 
        />
        <button
          onClick={() => {
            setActiveFieldInput({ groupId: 'dedup', condId: 'key', fieldType: 'field' });
            setModalTab('default');
            setShowFieldModal(true);
          }}
          className="absolute right-1.5 top-1.5 w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-blue-600 transition-colors text-zinc-400 hover:text-white"
        >
          <span className="text-[10px] font-bold">+</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <div className="px-2 py-1 bg-zinc-950 rounded text-[10px] font-mono border border-zinc-800 flex items-center gap-1.5">
          <span className="text-blue-400 font-bold">source.ip</span>
          <button className="text-zinc-600 hover:text-red-500 text-xs">✕</button>
        </div>
        <div className="px-2 py-1 bg-zinc-950 rounded text-[10px] font-mono border border-zinc-800 flex items-center gap-1.5">
          <span className="text-blue-400 font-bold">rule_id</span>
          <button className="text-zinc-600 hover:text-red-500 text-xs">✕</button>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );

  // Keep all other render functions (renderStep3Review, renderStepHeader, renderBuilder, renderLibrary, renderAnalytics) as they were...
  
  // [Rest of the code remains the same...]

  const renderStep3Review = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-16 shadow-2xl relative overflow-hidden">
        {/* Background decoration */}
        {/* <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-[#006bb4] pointer-events-none">
          <ShieldCheck size={280} />
        </div> */}
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-6 bg-[#006bb410] border border-[#006bb444] rounded-2xl">
              <Clock size={48} className="text-[#006bb4]" />
            </div>
          </div>
          
          {/* Heading */}
          <div className="space-y-3">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
              Coming Soon
            </h3>
            <p className="text-sm text-zinc-500 font-medium tracking-tight max-w-md mx-auto">
              Review & validation features are currently in development. 
              Your rule configuration will be saved automatically.
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-center gap-2 pt-6">
            <div className="w-2 h-2 rounded-full bg-[#006bb4] animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-[#006bb4] animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 rounded-full bg-[#006bb4] animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          {/* Info cards */}
          <div className="grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto">
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                Rule Name
              </p>
              <p className="text-xs font-black text-white uppercase truncate">
                {ruleName || 'Untitled'}
              </p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                Severity
              </p>
              <p className="text-xs font-black text-blue-400 uppercase">
                {severity}
              </p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                Status
              </p>
              <p className="text-xs font-black text-zinc-500 uppercase">
                Draft
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepHeader = () => (
    <div className="flex items-center justify-center gap-16 mb-10 relative">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-[300px] bg-zinc-800 -z-10" />
       {[
         { step: 1, label: 'About', icon: User },
         { step: 2, label: 'Logic', icon: Zap },
         { step: 3, label: 'Review', icon: ListChecks },
       ].map(s => (
          <div key={s.step} className="flex items-center gap-4 bg-[#0a0a0a] px-4">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${currentStep === s.step ? 'bg-[#00D4AA] border-[#00D4AA] text-white scale-110 shadow-lg' : (currentStep > s.step ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600')}`}>
                {currentStep > s.step ? <Check size={20} /> : <s.icon size={18} />}
             </div>
             <p className={`text-[10px] font-black uppercase tracking-widest ${currentStep === s.step ? 'text-white' : 'text-zinc-600'}`}>{s.label}</p>
          </div>
       ))}
    </div>
  );

  const renderBuilder = () => (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-10">
         <div className="flex items-center gap-4">
            <div className="p-3.5 bg-blue-500/10 rounded-lg text-[#006bb4] border border-[#006bb422]"><Shield size={24}/></div>
            <div>
               <h2 className="text-2xl font-black text-white uppercase tracking-tight">Detection Engine</h2>
               <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">SIEM Engineering & Logic Wizard</p>
            </div>
         </div>
         <div className="flex items-center gap-8"><div className="text-right"><p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Version</p><p className="text-[11px] font-mono font-bold text-zinc-500">v4.2.0-PRD</p></div><button onClick={() => setActiveTab('library')} className="p-2 text-zinc-700 hover:text-white"><X size={24}/></button></div>
      </div>
      {renderStepHeader()}
      <main className="min-h-[500px]">
         {currentStep === 1 && renderStep1About()}
         {currentStep === 2 && renderStep2Logic()}
         {currentStep === 3 && renderStep3Review()}
      </main>
      <div className="fixed bottom-0 left-64 right-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-zinc-800 p-8 flex justify-between items-center z-50">
         <button className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] hover:text-white">Save as Draft</button>
         <div className="flex gap-4">
            {currentStep > 1 && <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-10 py-3.5 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800">Back</button>}
            {currentStep < 3 ? (
               <button onClick={() => setCurrentStep(prev => prev + 1)} className="px-12 py-3.5 bg-[#00D4AA] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#005a96] shadow-2xl flex items-center gap-3">Define Logic <ArrowRight size={18}/></button>
            ) : (
               <button onClick={() => setActiveTab('library')} className="px-12 py-3.5 bg-[#00D4AA] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#005a96] shadow-2xl flex items-center gap-3">Deploy to SOC <Send size={18}/></button>
            )}
         </div>
      </div>
    </div>
  );

  const renderLibrary = () => {
    const filteredRules = MOCK_RULES.filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="animate-in fade-in duration-500 space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-wrap items-center gap-6 shadow-xl">
           <div className="flex-1 min-w-[300px] relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#00D4AA] transition-colors" />
              <input 
                type="text" 
                placeholder="Search rules by name, ID, tactic..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-12 pr-6 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-4">
              <select className="bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 px-4 py-2 rounded-xl outline-none"><option>All Severities</option></select>
              <select className="bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 px-4 py-2 rounded-xl outline-none"><option>System Rules</option><option>Custom Rules</option></select>
           </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
           <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/50 border-b border-zinc-800 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                 <tr>
                    <th className="px-6 py-4 w-12 text-center">State</th>
                    <th className="px-6 py-4">Rule Identity</th>
                    <th className="px-6 py-4">MITRE Mapping</th>
                    <th className="px-6 py-4 text-center">Detections (24h)</th>
                    <th className="px-6 py-4 text-center">FP Rate</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                 {filteredRules.map(rule => (
                   <tr key={rule.id} className="hover:bg-zinc-800/30 transition-all group cursor-default">
                      <td className="px-6 py-5 text-center">
                         <button className={`p-1 rounded-md transition-colors ${rule.enabled ? 'text-[#00D4AA]' : 'text-zinc-700'}`}>
                            {rule.enabled ? <ToggleRight size={24}/> : <ToggleLeft size={24}/>}
                         </button>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <div className={`w-1.5 h-10 rounded-full ${rule.severity === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : rule.severity === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <div>
                               <p className="text-sm font-black text-white group-hover:text-[#00D4AA] transition-colors">{rule.name}</p>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[9px] font-mono text-zinc-600 font-bold">{rule.id}</span>
                                  <span className="text-[8px] font-black uppercase tracking-tighter text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">[{rule.source}]</span>
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">{rule.mitre.tactic}</p>
                            <p className="text-[9px] text-zinc-600 font-bold uppercase">{rule.mitre.technique}</p>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <p className="text-sm font-black text-white">{rule.stats.detections24h}</p>
                         <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Last Triggered: {rule.stats.lastTriggered || 'Never'}</p>
                      </td>
                      <td className="px-6 py-5 text-center">
                         <div className="flex flex-col items-center gap-1.5">
                            <p className={`text-xs font-black ${rule.stats.falsePositiveRate > 10 ? 'text-orange-500' : 'text-emerald-500'}`}>{rule.stats.falsePositiveRate}%</p>
                            <div className="w-16 h-1 bg-zinc-950 rounded-full overflow-hidden">
                               <div className={`h-full ${rule.stats.falsePositiveRate > 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(rule.stats.falsePositiveRate * 3, 100)}%` }} />
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white"><Edit2 size={14}/></button>
                            <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white"><Copy size={14}/></button>
                            <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-500 hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'ACTIVE RULES', value: '232', trend: '+12%', sub: 'Global Coverage', icon: Shield, color: 'text-[#00D4AA]' },
          { label: 'AVG FP RATE', value: '4.2%', trend: '-1.3%', sub: 'Tuning Efficacy', icon: Target, color: 'text-blue-400' },
          { label: 'TOTAL ALERTS', value: '1.2K', trend: '+234', sub: 'Last 24 Hours', icon: Zap, color: 'text-orange-400' },
          { label: 'RELIABILITY', value: '98.5%', trend: '↑ stable', sub: 'System Health', icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg flex flex-col justify-between hover:border-zinc-700 transition-all shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                <stat.icon size={16} className={stat.color} />
             </div>
             <div className="flex items-end justify-between">
                <h3 className="text-xl font-black text-white tracking-tighter">{stat.value}</h3>
                <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}`}>{stat.trend}</span>
             </div>
             <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-8 shadow-xl">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Detection Timeline (Last 30 Days)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_RULE_ANALYTICS.detectionTimeline}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e1e1e" vertical={false} />
                     <XAxis dataKey="date" hide />
                     <YAxis hide />
                     <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                     <Area type="monotone" dataKey="critical" stroke="#ef4444" fill="#ef444411" strokeWidth={2} dot={false} />
                     <Area type="monotone" dataKey="high" stroke="#f97316" fill="#f9731611" strokeWidth={2} dot={false} />
                     <Area type="monotone" dataKey="medium" stroke="#3b82f6" fill="#3b82f611" strokeWidth={1} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">MITRE Tactic Coverage Heatmap</h3>
              <div className="space-y-4">
                 {MOCK_RULE_ANALYTICS.mitreCoverage.map(item => (
                   <div key={item.tactic} className="space-y-1.5 group cursor-pointer">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase">
                         <span className="text-zinc-500 group-hover:text-white transition-colors">{item.tactic}</span>
                         <span className="text-white">{item.ruleCount} Rules ({item.coverage}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                         <div className="h-full bg-[#00D4AA]" style={{ width: `${item.coverage}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center justify-between">Top Noisy Rules <Activity size={14}/></h3>
              <div className="space-y-4">
                 {MOCK_RULE_ANALYTICS.rulesNeedingAttention.highPriority.map(rule => (
                   <div key={rule.ruleId} className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 group hover:border-orange-500/30 transition-all">
                      <div className="flex justify-between items-center"><span className="text-xs font-black text-white uppercase tracking-tight">{rule.name}</span><button className="text-[9px] font-black text-[#00D4AA] uppercase hover:underline">TUNE</button></div>
                      <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2"><AlertCircle size={10}/> {rule.reason}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full text-center text-[9px] font-black text-zinc-600 hover:text-white uppercase tracking-widest">Audit All Rules →</button>
           </div>

           <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 space-y-6 shadow-xl relative overflow-hidden group">
              {/* <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Brain size={100} className="text-[#00D4AA]" /></div> */}
              <h3 className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest flex items-center gap-2"><Brain size={14}/> Engine Insights</h3>
              <div className="space-y-4 relative z-10">
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">Efficacy:</span> Baseline tuning has reduced overall False Positives by <span className="text-emerald-500 font-black">1.3%</span> this month.</p>
                 <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-white font-bold uppercase tracking-tight">Gap detected:</span> We are missing coverage for <span className="text-[#00D4AA] font-black">Persistence (T1053)</span> in the cloud segment.</p>
              </div>
              <button className="w-full py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest">View Engine Audit</button>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1300px] mx-auto pb-48 px-6">
      <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#00D4AA] rounded-full shadow-[0_0_15px_rgba(0,212,170,0.5)]" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
              <span>Intelligence</span>
              <ChevronRight size={10} className="text-zinc-800" />
              <span className="text-[#00D4AA] uppercase font-black">Detection Rules</span>
            </div>
          </div>
        </div>
        
        {/* <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shadow-xl">
           <button onClick={() => { setActiveTab('library'); setCurrentStep(1); }} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'library' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Settings2 size={14} className="inline mr-2" /> Library</button>
           <button onClick={() => setActiveTab('builder')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'builder' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}><Plus size={14} className="inline mr-2" /> Builder</button>
           <button onClick={() => { setActiveTab('analytics'); setCurrentStep(1); }} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'analytics' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}><BarChart2 size={14} className="inline mr-2" /> Analytics</button>
        </div> */}

        {activeTab === 'builder' && (
          <div className="flex gap-2">
             <button className="px-6 py-2.5 bg-zinc-800 border border-zinc-700 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-zinc-700 transition-all flex items-center gap-2 shadow-xl"><Save size={16}/> Save Draft</button>
             <button onClick={() => setCurrentStep(3)} className="px-8 py-2.5 bg-[#00D4AA] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#005a96] transition-all shadow-xl flex items-center gap-2"><Zap size={16} fill="currentColor"/> Deploy Rule</button>
          </div>
        )}
      </div>

      {activeTab === 'library' && renderLibrary()}
      {activeTab === 'builder' && renderBuilder()}
      {activeTab === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default DetectionRulesPage;