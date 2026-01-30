import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Play, ChevronRight, Target, Layers, Zap, Shield, 
  ArrowRight, Download, Activity, Calendar, Plus, X, 
  Compass, Clock, Filter, Database, Globe, Monitor, 
  MoreVertical, ArrowLeft, Info, Trash2, ChevronDown, 
  Lock, CheckCircle2, AlertTriangle, Fingerprint, TrendingUp, 
  ExternalLink, Save, HelpCircle, FileText, RefreshCcw, 
  ArrowUpRight, Maximize2, Send, Sparkles, History as HistoryIcon,
  Smartphone, User, ShieldAlert, Brain,
  Terminal, Copy, ShieldCheck, Workflow, Tag, Minus, Link, Eye, Edit
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// --- Interfaces ---

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

interface Hunt {
  id: string;
  name: string;
  hypothesis: string;
  conditions: Condition[];
  dataSources: string[];
  timeRange: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  duration: number;
  dataProcessed: number;
  matchesFound: number;
  category: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  topFinding: string;
  stages: number[];
  author: string;
}

interface HuntResult {
  matchId: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  suspiciousness: number;
  category: string;
  sourceIP: string;
  destIP: string;
  sourceHostname: string;
  destHostname: string;
  destCountry: string;
  destFlag: string;
  matchReasons: string[];
  details: {
    duration: string;
    connections: number;
    dataTransferred: string;
    firstSeen: string;
    lastSeen: string;
  };
  assetContext: {
    hostname: string;
    type: string;
    owner: string;
    riskScore: number;
  };
  threatIntel: {
    reputation: string;
    category: string;
    malware: string;
    firstReported: string;
  };
  relatedDetections: Array<{
    id: string;
    title: string;
  }>;
  timeline: Array<{ time: string; count: number }>;
}

// --- Constants & Mock Data ---

const LOG_SOURCES = [
  { id: 'flow', label: 'Network Flows', count: '12.3M', active: true, configured: true },
  { id: 'dns', label: 'DNS Logs', count: '2.4M', active: true, configured: true },
  { id: 'http', label: 'HTTP Logs', count: '8.1M', active: true, configured: true },
  { id: 'tls', label: 'TLS Metadata', count: '5.6M', active: true, configured: true },
  { id: 'syslog', label: 'Syslog', count: 'N/A', active: false, configured: false },
  { id: 'windows', label: 'Windows Events', count: 'N/A', active: false, configured: false },
];

const MOCK_HUNTS: Hunt[] = [
  {
    id: 'RCP-001',
    name: 'C2 Beaconing Detection',
    hypothesis: 'Detect periodic outbound HTTPS traffic patterns matching known C2 profiles.',
    conditions: [{ id: '1', field: 'dest_port', operator: '==', value: '443' }],
    dataSources: ['Zeek', 'Flow Logs'],
    timeRange: 'Last 24h',
    status: 'completed',
    createdAt: '2024-01-26T14:30:00Z',
    duration: 2.4,
    dataProcessed: 847,
    matchesFound: 7,
    category: 'NETWORK',
    confidence: 'HIGH',
    topFinding: '10.0.5.42 → 185.234.72.18 (92% suspicious)',
    stages: [1, 2],
    author: 'Analyst_J_Miller'
  },
  {
    id: 'RCP-002',
    name: 'Large Data Transfers',
    hypothesis: 'Identify potential exfiltration via high-volume outbound sessions.',
    conditions: [{ id: '1', field: 'bytes_out', operator: '>', value: '1000000000' }],
    dataSources: ['Flow Logs'],
    timeRange: 'Last 7d',
    status: 'completed',
    createdAt: '2024-01-14T09:12:00Z',
    duration: 8.7,
    dataProcessed: 2100,
    matchesFound: 1,
    category: 'NETWORK',
    confidence: 'MEDIUM',
    topFinding: '10.0.2.88 → s3-external-1.amazonaws.com',
    stages: [1],
    author: 'Analyst_K_Smith'
  }
];

const MOCK_MATCHES: HuntResult[] = [
  {
    matchId: 1,
    confidence: 'HIGH',
    suspiciousness: 92,
    category: 'C2 Communication',
    sourceIP: '10.0.5.42',
    destIP: '185.234.72.18',
    sourceHostname: 'WS-ENG-042',
    destHostname: 'Unknown (Russia)',
    destCountry: 'Russia',
    destFlag: '🇷🇺',
    matchReasons: [
      'Periodic beaconing (60s interval)',
      'Small consistent payload sizes',
      'Communication during non-business hours',
      'Destination IP on threat feed (ThreatFox)'
    ],
    details: {
      duration: '4h 32m',
      connections: 272,
      dataTransferred: '2.4 MB',
      firstSeen: 'Jan 15, 08:02 PM',
      lastSeen: 'Jan 15, 12:34 AM'
    },
    assetContext: {
      hostname: 'WS-ENG-042',
      type: 'Engineering workstation',
      owner: 'John Smith',
      riskScore: 92
    },
    threatIntel: {
      reputation: 'Malicious (ThreatFox, AbuseIPDB)',
      category: 'C2 Infrastructure',
      malware: 'Cobalt Strike',
      firstReported: '32 days ago'
    },
    relatedDetections: [
      { id: 'ALT-001', title: 'C2 Beaconing (same asset)' },
      { id: 'ALT-005', title: 'DNS Tunneling (same asset)' }
    ],
    timeline: Array.from({ length: 12 }, (_, i) => ({ time: `${i * 2}h`, count: Math.floor(Math.random() * 50) }))
  },
  {
    matchId: 2,
    confidence: 'MEDIUM',
    suspiciousness: 78,
    category: 'Suspicious Auth',
    sourceIP: '10.0.3.15',
    destIP: '10.0.1.10',
    sourceHostname: 'SRV-DC-01',
    destHostname: 'DB-PROD-SQL',
    destCountry: 'Internal',
    destFlag: '🏢',
    matchReasons: [
      'Unusual authentication volume',
      'Non-standard administrative hours',
      'Asset critical importance'
    ],
    details: {
      duration: '1h 12m',
      connections: 45,
      dataTransferred: '12 KB',
      firstSeen: 'Jan 15, 10:15 AM',
      lastSeen: 'Jan 15, 11:27 AM'
    },
    assetContext: {
      hostname: 'SRV-DC-01',
      type: 'Domain Controller',
      owner: 'Admin Team',
      riskScore: 78
    },
    threatIntel: {
      reputation: 'Internal Asset',
      category: 'Privileged System',
      malware: 'None detected',
      firstReported: 'N/A'
    },
    relatedDetections: [],
    timeline: Array.from({ length: 12 }, (_, i) => ({ time: `${i * 2}h`, count: Math.floor(Math.random() * 20) }))
  }
];

const ThreatHuntingPage: React.FC<{ defaultView?: 'builder' | 'history' | 'detail' | 'results' | 'findings' }> = ({ defaultView = 'history' }) => {
  const [view, setView] = useState<'builder' | 'history' | 'detail' | 'results' | 'findings'>(defaultView);
  const [selectedHunt, setSelectedHunt] = useState<Hunt | null>(null);
  
  // Builder State
  const [huntName, setHuntName] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [timeRange, setTimeRange] = useState('Last 24 hours');
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');
  const [selectedSources, setSelectedSources] = useState<string[]>(['flow', 'dns', 'http', 'tls']);
  
  // Logic Groups State
  const [logicGroups, setLogicGroups] = useState<LogicGroup[]>([
    { id: 'lb1', source: 'dns.log', conditions: [
      { id: 'c1', field: 'id.orig_h', operator: 'EQUAL', value: '' }
    ]}
  ]);

  // Threshold State
  const [thresholdHits, setThresholdHits] = useState(5);
  const [thresholdWindow, setThresholdWindow] = useState(5);
  const [thresholdUnit, setThresholdUnit] = useState('MINUTES');
  const [thresholdField, setThresholdField] = useState('source.ip');

  // Modal State
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [activeFieldInput, setActiveFieldInput] = useState<{groupId: string, condId: string, fieldType: 'field' | 'value'} | null>(null);
  const [selectedDefaultField, setSelectedDefaultField] = useState<string | null>(null);

  // Field Catalog
  const fieldCatalog = {
    default: [
      { id: 'source.ip', desc: 'Raw Source IP Address' },
      { id: 'destination.ip', desc: 'Raw Destination IP Address' },
      { id: 'destination.port', desc: 'Destination Port (Integer)' },
      { id: 'service', desc: 'Detected Protocol' },
      { id: 'query', desc: 'DNS Query String' },
      { id: 'user.id', desc: 'User Identifier' },
      { id: 'host.name', desc: 'Host Name' },
      { id: 'bytes_in', desc: 'Bytes Received' },
      { id: 'bytes_out', desc: 'Bytes Sent' },
      { id: 'id.orig_h', desc: 'Zeek Source IP' },
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
    setView(defaultView);
  }, [defaultView]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter' && view === 'builder') {
        setView('results');
      }
      if (e.key === 'Escape') {
        if (showFieldModal) {
          closeFieldModal();
        } else if (view === 'results') {
          setView('findings');
        } else if (view === 'findings') {
          setView('detail');
        } else if (view === 'detail') {
          setView('history');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, showFieldModal]);

  const toggleSource = (id: string) => {
    setSelectedSources(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const addLogicGroup = () => {
    const newId = `lb${logicGroups.length + 1}`;
    setLogicGroups([...logicGroups, { id: newId, source: 'http.log', conditions: [{ id: Math.random().toString(), field: 'id.orig_h', operator: 'EQUAL', value: '' }] }]);
  };

  const removeLogicGroup = (id: string) => setLogicGroups(logicGroups.filter(g => g.id !== id));
  
  const addCondition = (groupId: string) => {
    setLogicGroups(logicGroups.map(g => g.id === groupId ? { ...g, conditions: [...g.conditions, { id: Math.random().toString(), field: '', operator: 'EQUAL', value: '' }] } : g));
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
    setSelectedDefaultField(null);
    setShowFieldModal(true);
  };

  const closeFieldModal = () => {
    setShowFieldModal(false);
    setActiveFieldInput(null);
    setSelectedDefaultField(null);
  };

  const selectFieldValue = (value: string) => {
    if (activeFieldInput) {
      const { groupId, condId, fieldType } = activeFieldInput;
      
      if (groupId === 'correlation-g1' && condId === 'join-key') {
        setThresholdField(value);
      } else if (groupId === 'correlation-g2' && condId === 'join-key') {
        console.log('Group B join key:', value);
      } else {
        updateCondition(groupId, condId, fieldType === 'field' ? { field: value } : { value });
      }
    }
    closeFieldModal();
  };

  // NEW FUNCTIONS FOR HUNT ACTIONS
  const handleRunHunt = (hunt: Hunt) => {
    setSelectedHunt(hunt);
    setView('results');
  };

  const handleViewHunt = (hunt: Hunt) => {
    setSelectedHunt(hunt);
    setView('detail');
  };

  // Field Picker Modal Component
  const FieldPickerModal = () => {
    if (!showFieldModal) return null;

    const isFieldPicker = activeFieldInput?.fieldType === 'field';
    
    if (isFieldPicker) {
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
                          selectFieldValue(item.id);
                          setSelectedDefaultField(null);
                        } else {
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

              {selectedDefaultField && (
                <div className="animate-in slide-in-from-right duration-200">
                  <div className="p-3 bg-zinc-900/20 border-b border-zinc-800 flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-500">
                      Enriched Fields
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
                          selectFieldValue(item.id);
                          setSelectedDefaultField(null);
                        } else {
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

  const Breadcrumbs = ({ current }: { current: string }) => (
    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium mb-8">
      <span className="cursor-pointer hover:text-emerald-400 transition-colors" onClick={() => setView('history')}>
        RECIPES
      </span>
      {current !== 'RECIPES' && (
        <>
          <span>/</span>
          <span className="text-emerald-400 uppercase">{current}</span>
        </>
      )}
    </div>
  );

  const ContextHelp = ({ text }: { text: string }) => (
    <div className="group relative inline-block">
      <HelpCircle size={12} className="text-zinc-600 cursor-help" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-zinc-800 border border-zinc-700 rounded-xl text-[10px] text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
        {text}
      </div>
    </div>
  );

  // --- Render Functions ---

  const renderHuntBuilder = () => {
    return (
      <div className="animate-in fade-in duration-500 space-y-8">
        <Breadcrumbs current="Hunt Builder" />

        {/* Field Picker Modal */}
        <FieldPickerModal />

        {/* DATA SOURCES SECTION */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 shadow-xl space-y-3">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Database size={14} className="text-[#00D4AA]" />
            Data Source Overview
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Telemetry from endpoint, DNS, and network logs is analyzed to detect abnormal
            communication and potential data exfiltration activity.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold uppercase tracking-widest">
            <ShieldCheck size={12} />
            Coverage: 28.4M events
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* IDENTITY & DETECTION LOGIC SECTION */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl space-y-12">
              {/* STAGE 1: Initial Trigger */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Zap size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-zinc-100">Stage 01: Initial Trigger</h2>
                      <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">Matching Pattern (DNS.LOG)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select 
                      value={logicGroups[0]?.source || 'dns.log'}
                      onChange={e => setLogicGroups(logicGroups.map((g, i) => i === 0 ? {...g, source: e.target.value} : g))}
                      className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs font-bold text-zinc-400 outline-none"
                    >
                      <option value="dns.log">dns.log</option>
                      <option value="http.log">http.log</option>
                      <option value="flow.log">flow.log</option>
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
                          <option value="EQUAL">EQUAL</option>
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
    <div className="h-16 w-px bg-zinc-800 flex-shrink-0"></div>

    {/* Right Section - Global Window & Wait Window Stacked */}
    <div className="flex flex-col gap-2 flex-shrink-0">
      {/* Global Window */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
          Global Window
        </span>
        <input
          type="text"
          defaultValue="5m"
          className="bg-zinc-950 border border-zinc-800 w-14 py-1 rounded-md text-[10px] text-center font-bold outline-none"
        />
      </div>

      {/* Wait Window */}
      <div className="flex items-center gap-2">
        {/* <Clock size={12} className="text-zinc-400 flex-shrink-0" /> */}
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest whitespace-nowrap">
          Wait Window
        </span>
        <select
          defaultValue="2m"
          className="bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-[10px] font-bold text-blue-400 outline-none cursor-pointer"
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
                          <p className="text-[10px] text-zinc-500 font-medium tracking-tight uppercase">Matching Pattern (HTTP.LOG)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select 
                          value={logicGroups[1]?.source || 'http.log'}
                          onChange={e => setLogicGroups(logicGroups.map((g, i) => i === 1 ? {...g, source: e.target.value} : g))}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-xs font-bold text-zinc-400 outline-none"
                        >
                          <option value="http.log">http.log</option>
                          <option value="dns.log">dns.log</option>
                          <option value="flow.log">flow.log</option>
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
                              <option value="EQUAL">EQUAL</option>
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
          </div>

          <div className="space-y-8">
            {/* HUNT IDENTITY SECTION */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 shadow-xl space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Hunt Identity</h3>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-1">Hunt Name</label>
                  <input type="text" value={huntName} onChange={(e) => setHuntName(e.target.value)} placeholder="e.g. C2 Beaconing Sweep" className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-1">Time Horizon</label>
                  <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-3 text-xs text-white outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#00D4AA]">
                    <option>Last 1 hour</option>
                    <option>Last 6 hours</option>
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-1">Hypothesis</label>
                  <textarea value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="Describe what you are looking for..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-5 py-4 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] min-h-[120px] resize-none" />
                </div>
              </div>
              <button 
                onClick={() => setView('results')}
                className="w-full bg-[#00D4AA] text-black py-5 rounded-lg text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-400 shadow-2xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-3"
              >
                <Play size={18} fill="currentColor" /> Execute Hunt
              </button>
              <div className="flex justify-center items-center gap-3 text-[9px] text-zinc-600 font-bold uppercase">
                <span>Ctrl + Enter to run</span>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <span>Ctrl + S to save</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const renderHuntHistory = () => (
    <div className="animate-in fade-in duration-500 space-y-8">
      <Breadcrumbs current="RECIPES" />

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-2">Investigation Recipes</h1>
          <p className="text-sm text-zinc-500">Reusable threat-hunting templates managed by the SOC team.</p>
        </div>
        <button 
          onClick={() => setView('builder')}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Build New Hunt
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input 
            type="text"
            placeholder="Search hunts by name or keyword..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white outline-none focus:border-zinc-700"
          />
        </div>
        <select className="bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 px-4 py-3 rounded-lg outline-none cursor-pointer">
          <option>All Categories</option>
          <option>Network</option>
          <option>Endpoint</option>
        </select>
        <select className="bg-zinc-900 border border-zinc-800 text-sm text-zinc-400 px-4 py-3 rounded-lg outline-none cursor-pointer">
          <option>All Sources</option>
          <option>Zeek</option>
          <option>Suricata</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-t-lg">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
          <div className="col-span-3">Hunt Name</div>
          <div className="col-span-1">Stages</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Author</div>
          <div className="col-span-2">Last Run</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Recipe Rows */}
        {MOCK_HUNTS.map(hunt => (
          <div key={hunt.id} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
            <div className="col-span-3">
              <h3 className="text-base font-bold text-white mb-1">{hunt.name}</h3>
            </div>
            <div className="col-span-1 flex items-center gap-2">
              {hunt.stages.map(stage => (
                <span key={stage} className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  {stage}
                </span>
              ))}
            </div>
            <div className="col-span-2 flex items-center">
              <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold uppercase rounded">
                {hunt.category}
              </span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-sm text-zinc-400">{hunt.author}</span>
            </div>
            <div className="col-span-2 flex items-center">
              <span className="text-xs text-zinc-500 font-mono whitespace-nowrap">
                {new Date(hunt.createdAt).toLocaleString('en-US', { 
                  year: 'numeric',
                  month: '2-digit', 
                  day: '2-digit', 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                }).replace(',', '')}
              </span>
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2">
              <button 
                onClick={() => handleRunHunt(hunt)}
                className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded hover:bg-emerald-500/20 transition-colors"
              >
                RUN
              </button>
              <button 
                onClick={() => handleViewHunt(hunt)}
                className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold uppercase rounded hover:bg-zinc-700 transition-colors"
              >
                VIEW
              </button>
              <button className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold uppercase rounded hover:bg-zinc-700 transition-colors">
                EDIT
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs text-zinc-600 uppercase tracking-wider mt-4">
        SHOWING {MOCK_HUNTS.length} INVESTIGATION RECIPES
      </div>
    </div>
  );

  const renderHuntDetail = () => {
    if (!selectedHunt) return null;

    return (
      <div className="animate-in fade-in duration-500 space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('history')} 
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={20}/>
          </button>
          <div>
            <Breadcrumbs current={selectedHunt.name} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white mb-2">{selectedHunt.name}</h1>
              <p className="text-sm text-zinc-400">Recipe ID: {selectedHunt.id}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleRunHunt(selectedHunt)}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              >
                <Play size={18} />
                Execute Now 
              </button>
              <button className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-6 py-3 rounded-lg text-sm font-bold hover:bg-zinc-700 transition-all">
                Edit Recipe
              </button>
            </div>
          </div>

          {/* CORRELATION FLOW SECTION - UPDATED TO MATCH SCREENSHOT */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 mb-8">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-8">Correlation Flow</h3>
            
            <div className="grid grid-cols-2 gap-24 relative">
              {/* Stage 1 - DNS.LOG */}
              <div className="bg-black border border-zinc-800 rounded-xl p-5 relative">
                <div className="absolute -top-3 left-4 px-3 py-1 bg-black border border-zinc-800 rounded-md">
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">Stage 01</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-400 font-black text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-tight">DNS.LOG</h4>
                  </div>
                </div>

                <div className="space-y-0">
                  <div className="py-3 border-b border-zinc-800/50">
                    <div className="mb-2">
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Condition:</span>
                    </div>
                    <div className="font-mono text-xs text-zinc-300">
                      <span className="text-emerald-400">query</span>
                      <span className="text-zinc-500 mx-2">MATCHES</span>
                      <span className="text-pink-400">"*.top"</span>
                    </div>
                  </div>

                  <div className="py-3">
                    <div className="mb-2">
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Threshold:</span>
                    </div>
                    <div className="text-xs text-white font-mono">
                      <span className="font-bold">50</span> 
                      <span className="text-zinc-500 mx-1">events in</span>
                      <span className="font-bold">5m</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Correlation Key - Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black border border-emerald-500/50 rounded-lg px-5 py-2.5 shadow-2xl">
                <div className="text-center">
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                    Within 5m
                  </div>
                </div>
              </div>

              {/* Stage 2 - HTTP.LOG */}
              {selectedHunt.stages.length > 1 && (
                <div className="bg-black border border-zinc-800 rounded-xl p-5 relative">
                  <div className="absolute -top-3 left-4 px-3 py-1 bg-black border border-zinc-800 rounded-md">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider">Stage 02</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <span className="text-emerald-400 font-black text-sm">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight">HTTP.LOG</h4>
                    </div>
                  </div>

                  <div className="space-y-0">
                    <div className="py-3 border-b border-zinc-800/50">
                      <div className="mb-2">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Condition:</span>
                      </div>
                      <div className="font-mono text-xs text-zinc-300">
                        <span className="text-emerald-400">method</span>
                        <span className="text-zinc-500 mx-2">EQUAL</span>
                        <span className="text-pink-400">"POST"</span>
                      </div>
                    </div>

                    <div className="py-3">
                      <div className="mb-2">
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider">Threshold:</span>
                      </div>
                      <div className="text-xs text-white font-mono">
                        <span className="font-bold">10</span> 
                        <span className="text-zinc-500 mx-1">events in</span>
                        <span className="font-bold">10m</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Correlation Key at bottom */}
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">
                    Correlation Key
                  </div>
                  <div className="text-sm font-mono text-emerald-400 font-bold">
                    ID.ORIG_H
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* EXECUTION HISTORY */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Execution History</h3>
            
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-zinc-600 uppercase">
                <div className="col-span-3">Run Time</div>
                <div className="col-span-3">Horizon</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Matches</div>
                <div className="col-span-2 text-right">Action</div>
              </div>
              
              <div className="grid grid-cols-12 gap-4 px-4 py-4 bg-zinc-900 rounded-lg items-center hover:bg-zinc-800/50 transition-colors">
                <div className="col-span-3 text-sm font-mono text-zinc-400">
                  {new Date(selectedHunt.createdAt).toLocaleString('en-US', { 
                    month: '2-digit', 
                    day: '2-digit',
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </div>
                <div className="col-span-3 text-sm text-zinc-400">{selectedHunt.timeRange}</div>
                <div className="col-span-2">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase rounded flex items-center gap-2 w-fit">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    {selectedHunt.status}
                  </span>
                </div>
                <div className="col-span-2 text-lg font-black text-emerald-400">{selectedHunt.matchesFound}</div>
                <div className="col-span-2 text-right">
                  <button 
                    onClick={() => setView('findings')}
                    className="text-emerald-400 text-xs font-bold uppercase hover:text-emerald-300 transition-colors flex items-center gap-2 ml-auto"
                  >
                    View Results <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderExecutionFindings = () => {
    if (!selectedHunt) return null;

    return (
      <div className="animate-in fade-in duration-500 space-y-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('detail')} 
            className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-all"
          >
            <ArrowLeft size={20}/>
          </button>
          <div>
            <Breadcrumbs current="Execution Findings" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white mb-2">Execution Findings</h1>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <span className="font-bold">{selectedHunt.matchesFound} CORRELATION MATCHES</span>
            <span>•</span>
            <span>SCANNED {selectedHunt.dataProcessed} GB</span>
            <span>•</span>
            <span>TIME: {selectedHunt.duration}s</span>
          </div>
        </div>

        {/* Correlation Key Set Cards */}
        <div className="space-y-4">
          {/* First Entity - 10.0.8.115 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-8">
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Correlation Key Set</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Entity Cluster
                      </span>
                      <span className="text-2xl font-black font-mono text-white tracking-tight">10.0.8.115</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2 font-mono">UID: 9F3C2A77...</p>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Matched Stages</p>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-black flex items-center justify-center">
                        01
                      </span>
                      <span className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-black flex items-center justify-center">
                        02
                      </span>
                    </div>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Time Window</p>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-zinc-400">
                        <span className="text-emerald-400 font-black">08:02</span> → <span className="text-red-400 font-black">08:34</span>
                      </p>
                      <p className="text-[10px] text-zinc-600 uppercase font-black">Duration: 32 min</p>
                    </div>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Result Strength</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-red-500">HIGH</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('results')}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all"
              >
                View Story
              </button>
            </div>
          </div>

          {/* Second Entity - 10.0.12.88 */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-8">
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Correlation Key Set</p>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        Entity Cluster
                      </span>
                      <span className="text-2xl font-black font-mono text-white tracking-tight">10.0.12.88</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2 font-mono">UID: 7A4B9E12...</p>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Matched Stages</p>
                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-black flex items-center justify-center">
                        01
                      </span>
                      <span className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-black flex items-center justify-center">
                        02
                      </span>
                    </div>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Time Window</p>
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-zinc-400">
                        <span className="text-emerald-400 font-black">09:15</span> → <span className="text-red-400 font-black">09:42</span>
                      </p>
                      <p className="text-[10px] text-zinc-600 uppercase font-black">Duration: 27 min</p>
                    </div>
                  </div>

                  <div className="h-16 w-px bg-zinc-800" />

                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Result Strength</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-yellow-500">MEDIUM</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('results')}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-xl text-sm font-black uppercase tracking-wider transition-all"
              >
                View Story
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHuntResults = () => {
    if (!selectedHunt) return null;

    return (
      <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
        {/* Results view content goes here */}
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-[1300px] mx-auto px-6">
        {view === 'builder' && renderHuntBuilder()}
        {view === 'history' && renderHuntHistory()}
        {view === 'detail' && renderHuntDetail()}
        {view === 'findings' && renderExecutionFindings()}
        {view === 'results' && renderHuntResults()}
      </div>
    </div>
  );
};

export default ThreatHuntingPage;