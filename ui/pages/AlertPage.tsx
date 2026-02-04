import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Clock, ChevronRight, Activity, 
  Target, Zap, ShieldAlert,
  Calendar, Globe, Monitor, 
  RotateCcw, BarChart2, List,
  Filter as FilterIcon, ChevronDown, 
  X, ShieldCheck, Cpu, MoreVertical
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import { MOCK_ALERTS } from '../constants/mockData/detections';
import AlertDetailPage from './AlertDetailPage'; 
import AlertCard from '../components/detections/AlertCard';
import { Severity } from '../types';

const TIMELINE_DATA = [
  { time: '0:00', v: 8 }, { time: '2:00', v: 5 }, { time: '4:00', v: 3 }, { time: '6:00', v: 12 },
  { time: '8:00', v: 7 }, { time: '10:00', v: 18 }, { time: '12:00', v: 15 }, { time: '14:00', v: 28 },
  { time: '16:00', v: 12 }, { time: '18:00', v: 8 }, { time: '20:00', v: 14 }, { time: '22:00', v: 7 },
  { time: '23:59', v: 12 }
];

const DetectionsPage: React.FC<{ defaultView?: 'feed' | 'stats' }> = ({ defaultView = 'feed' }) => {
  const [view, setView] = useState<'feed' | 'stats'>(defaultView);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [severities, setSeverities] = useState<Severity[]>(['critical', 'high', 'medium']);
  const [selectedAssetGroup, setSelectedAssetGroup] = useState('all');
  const [selectedMitreTactic, setSelectedMitreTactic] = useState('all');
  const [selectedLogSource, setSelectedLogSource] = useState('all');
  const [selectedDirectionality, setSelectedDirectionality] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  useEffect(() => { setView(defaultView); }, [defaultView]);

  

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
        setOpenActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const filters: string[] = [];
    if (severities.length > 0 && severities.length < 3) {
      severities.forEach(sev => {
        filters.push(`Severity: ${sev.charAt(0).toUpperCase() + sev.slice(1)}`);
      });
    }
    if (selectedMitreTactic !== 'all') {
      filters.push(`Tactic: ${selectedMitreTactic}`);
    }
    if (selectedLogSource !== 'all') {
      filters.push(`Log Source: ${selectedLogSource}`);
    }
    if (selectedAssetGroup !== 'all') {
      filters.push(`Asset Group: ${selectedAssetGroup}`);
    }
    if (selectedDirectionality !== 'all') {
      filters.push(`Directionality: ${selectedDirectionality}`);
    }
    setActiveFilters(filters);
  }, [severities, selectedMitreTactic, selectedLogSource, selectedAssetGroup, selectedDirectionality]);

  const filteredAlerts = useMemo(() => {
    return MOCK_ALERTS.filter(a => {
      const matchesSearch = !searchTerm || 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.sourceIp.includes(searchTerm) ||
        (a.assetContext?.hostname || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severities.includes(a.severity);
      return matchesSearch && matchesSeverity;
    });
  }, [searchTerm, severities]);

  const toggleSeverity = (s: Severity) => {
    setSeverities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === filteredAlerts.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAlerts.map(a => a.id));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSeverities(['critical', 'high', 'medium']);
    setSelectedAssetGroup('all');
    setSelectedMitreTactic('all');
    setSelectedLogSource('all');
    setSelectedDirectionality('all');
    setSelectedTimeRange('1h');
    setActiveFilters([]);
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith('Severity:')) {
      const sev = filter.split(': ')[1].toLowerCase() as Severity;
      toggleSeverity(sev);
    } else if (filter.startsWith('Tactic:')) {
      setSelectedMitreTactic('all');
    } else if (filter.startsWith('Log Source:')) {
      setSelectedLogSource('all');
    } else if (filter.startsWith('Asset Group:')) {
      setSelectedAssetGroup('all');
    } else if (filter.startsWith('Directionality:')) {
      setSelectedDirectionality('all');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-zinc-500';
    }
  };

  const getSeverityBg = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const renderFilterHeader = () => (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
  <Search 
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 z-10 pointer-events-none"
  />

  <input 
    type="text"
    placeholder="IP, Host, or Rule Name..."
    className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-lg pl-12 pr-6 py-3 text-sm text-zinc-200 outline-none focus:border-[#00D4AA] transition-all placeholder:text-zinc-500"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

      {/* Filter Dropdowns Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button 
          onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
          className="flex items-center gap-2 bg-[#00D4AA]  text-black px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          <FilterIcon size={14} />
          Advanced Filter
        </button>

        {/* Severity Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'severity' ? null : 'severity')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <ShieldAlert size={14} className="text-red-500" />
            Severity: {severities.length === 3 ? 'All' : severities.length === 0 ? 'None' : severities.join(', ')}
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'severity' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'severity' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
              {(['critical', 'high', 'medium'] as Severity[]).map(sev => (
                <label key={sev} className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-900 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    checked={severities.includes(sev)}
                    onChange={() => toggleSeverity(sev)}
                    className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                  />
                  <span className="text-sm text-zinc-300 capitalize">{sev}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Asset Group Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'asset' ? null : 'asset')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Monitor size={14} className="text-blue-500" />
            Asset Group
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'asset' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'asset' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
              {['all', 'User VLAN', 'Server VLAN', 'DMZ', 'Management'].map(group => (
                <button 
                  key={group}
                  onClick={() => {
                    setSelectedAssetGroup(group.toLowerCase().replace(' ', '-'));
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {group}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MITRE Tactic Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'mitre' ? null : 'mitre')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Target size={14} className="text-purple-500" />
            MITRE Tactic
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'mitre' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'mitre' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[220px] z-50 py-2">
              {['all', 'Command & Control', 'Lateral Movement', 'Exfiltration', 'Defense Evasion', 'Credential Access'].map(tactic => (
                <button 
                  key={tactic}
                  onClick={() => {
                    setSelectedMitreTactic(tactic.toLowerCase());
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {tactic}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Log Source Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'log' ? null : 'log')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Activity size={14} className="text-green-500" />
            Log Source
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'log' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'log' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
              {['all', 'Zeek', 'Suricata', 'Sysmon', 'Windows Events', 'Linux Auditd'].map(source => (
                <button 
                  key={source}
                  onClick={() => {
                    setSelectedLogSource(source.toLowerCase());
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {source}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Directionality Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'direction' ? null : 'direction')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Globe size={14} className="text-cyan-500" />
            Directionality
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'direction' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'direction' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[200px] z-50 py-2">
              {['all', 'North-South', 'East-West', 'Internal', 'External'].map(dir => (
                <button 
                  key={dir}
                  onClick={() => {
                    setSelectedDirectionality(dir.toLowerCase());
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {dir}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Dropdown */}
        <div className="relative dropdown-container">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'time' ? null : 'time')}
            className="flex items-center gap-2 bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all"
          >
            <Clock size={14} className="text-orange-500" />
            Last {selectedTimeRange === '1h' ? '1 Hour' : selectedTimeRange === '24h' ? '24 Hours' : selectedTimeRange === '7d' ? '7 Days' : '30 Days'}
            <ChevronDown size={14} className={`transition-transform ${openDropdown === 'time' ? 'rotate-180' : ''}`} />
          </button>
          {openDropdown === 'time' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
              {[
                { value: '1h', label: 'Last 1 Hour' },
                { value: '24h', label: 'Last 24 Hours' },
                { value: '7d', label: 'Last 7 Days' },
                { value: '30d', label: 'Last 30 Days' }
              ].map(time => (
                <button 
                  key={time.value}
                  onClick={() => {
                    setSelectedTimeRange(time.value);
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {time.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-zinc-500 font-medium">FILTERS APPLIED:</span>
          {activeFilters.map((filter, idx) => (
            <span 
              key={idx}
              className="flex items-center gap-1.5 bg-[#00D4AA]/20 border border-blue-600/30 text-blue-400 px-3 py-1 rounded-md font-medium"
            >
              {filter}
              <button 
                onClick={() => removeFilter(filter)}
                className="hover:text-blue-300 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <button 
            onClick={clearAllFilters}
            className="text-zinc-500 hover:text-zinc-300 underline font-medium transition-colors"
          >
            CLEAR ALL
          </button>
        </div>
      )}
    </div>
  );

  const renderDetectionTable = () => (
    <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg overflow-hidden">
      <table className="w-full">
  <thead className="bg-zinc-900/50 border-b border-zinc-800">
    <tr className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
      <th className="px-4 py-3 text-left w-8">
        <input 
          type="checkbox" 
          className="h-4 w-4 border-2 border-zinc-700 bg-zinc-900 checked:bg-[#00D4AA] checked:border-[#00D4AA] appearance-none rounded flex items-center justify-center checked:after:content-['✓'] checked:after:text-black checked:after:text-xs"
          checked={selectedRows.length === filteredAlerts.length && filteredAlerts.length > 0}
          onChange={toggleAllRows}
        />
      </th>
      <th className="px-4 py-3 text-left w-12">LEVEL</th>
      <th className="px-4 py-3 text-left min-w-[200px]">USECASE NAME / MITRE ID</th>
      <th className="px-4 py-3 text-left min-w-[180px]">SOURCE → DESTINATION</th>
      <th className="px-4 py-3 text-left min-w-[200px]">TELEMETRY & TRAFFIC</th>
      <th className="px-4 py-3 text-left min-w-[140px]">SEVERITY ANALYSIS</th>
      <th className="px-4 py-3 text-left min-w-[120px]">TRIGGERED</th>
      <th className="px-4 py-3 text-left w-16">ACTIONS</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-zinc-800/50">
    {filteredAlerts.length > 0 ? (
      filteredAlerts.slice(0, 10).map((alert) => (
        <tr 
          key={alert.id} 
          className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
          onClick={() => setSelectedAlertId(alert.id)}
        >
          <td className="px-4 py-4">
            <input 
  type="checkbox" 
  className="h-4 w-4 border-2 border-zinc-700 bg-zinc-900 checked:bg-[#00D4AA] checked:border-[#00D4AA] appearance-none rounded flex items-center justify-center checked:after:content-['✓'] checked:after:text-black checked:after:text-xs"
  checked={selectedRows.includes(alert.id)}
  onChange={() => toggleRowSelection(alert.id)}
  onClick={(e) => e.stopPropagation()}
/>
          </td>
          <td className="px-4 py-4">
            <div className={`w-2 h-2 rounded-full ${
              alert.severity === 'critical' ? 'bg-red-500' :
              alert.severity === 'high' ? 'bg-orange-500' :
              'bg-yellow-500'
            }`} />
          </td>
          <td className="px-4 py-4">
            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">{alert.name}</div>
              <div className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">{alert.mitreId || 'T1071.001'} · {alert.mitreStage || 'C&C'} · 2024-{alert.timestamp?.split('-')[1] || '06'}-{alert.timestamp?.split('-')[2]?.split(' ')[0] || '15'}</div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-white">{alert.sourceIp}</span>
                <ChevronRight size={12} className="text-zinc-600 flex-shrink-0" />
                <span className="text-xs font-mono text-white">{alert.destIp || '45.12.88.2'}</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-medium truncate">{alert.assetContext?.segment || 'MGMT-CHQ-K02'} ({alert.protocol || 'ZEEK DHCP'})</div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 rounded text-[10px] font-bold whitespace-nowrap">
                ZEEK-CONN
              </span>
              <span className="px-2 py-0.5 bg-cyan-600/20 border border-cyan-600/30 text-cyan-400 rounded text-[10px] font-bold whitespace-nowrap">
                ZEEK-SSL
              </span>
              <span className="px-2 py-0.5 bg-green-600/20 border border-green-600/30 text-green-400 rounded text-[10px] font-bold whitespace-nowrap">
                NORTH-SOUTH
              </span>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className={`inline-flex px-3 py-1 rounded border ${getSeverityBg(alert.severity)}`}>
              <span className={`text-xs font-bold uppercase whitespace-nowrap ${getSeverityColor(alert.severity)}`}>
                {alert.severity} ({alert.score || 88})
              </span>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] whitespace-nowrap">
                <Clock size={12} className="flex-shrink-0" />
                <span>2 mins ago</span>
              </div>
              <div className="text-[10px] text-zinc-600 font-mono whitespace-nowrap">
                JAN 22, 16:22
              </div>
            </div>
          </td>
          <td className="px-4 py-4">
            <div className="relative dropdown-container">
              <button 
                className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenActionMenu(openActionMenu === alert.id ? null : alert.id);
                }}
              >
                <MoreVertical size={16} className="text-zinc-500" />
              </button>
              {openActionMenu === alert.id && (
                <div className="absolute right-0 top-full mt-1 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAlertId(alert.id);
                      setOpenActionMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-2"
                  >
                    <Search size={14} />
                    View Details
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Acknowledge alert:', alert.id);
                      setOpenActionMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck size={14} />
                    Acknowledge
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Escalate alert:', alert.id);
                      setOpenActionMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-2"
                  >
                    <Zap size={14} />
                    Escalate
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Create case:', alert.id);
                      setOpenActionMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors flex items-center gap-2"
                  >
                    <Target size={14} />
                    Create Case
                  </button>
                  <div className="border-t border-zinc-800 my-2"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Mark false positive:', alert.id);
                      setOpenActionMenu(null);
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-red-400 transition-colors flex items-center gap-2"
                  >
                    <X size={14} />
                    Mark False Positive
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={8} className="px-4 py-16 text-center">
          <div className="flex flex-col items-center justify-center opacity-30">
            <X size={32} className="text-zinc-600 mb-2" />
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider">
              No matching detections
            </h3>
          </div>
        </td>
      </tr>
    )}
  </tbody>
</table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 bg-zinc-900/30">
        <div className="text-xs text-zinc-500">
          Detections: <span className="font-bold text-white">1,284</span>
          <span className="mx-2">·</span>
          Filtered: <span className="font-bold text-white">{filteredAlerts.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">
            Prev
          </button>
          <button className="px-3 py-1.5 bg-[#00D4AA] text-white text-xs font-semibold rounded">
            1
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">
            3
          </button>
          <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="animate-in fade-in duration-500 space-y-6">
      {/* Top row metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL DETECTIONS (24H)', value: '247', sub: '↑ 12% from previous', color: 'text-white', trend: 'text-[#10b981]' },
          { label: 'MTTR (MEAN RESPONSE)', value: '2.4h', sub: 'Target: < 3.0h', color: 'text-[#00D4AA]', trend: 'text-[#3b82f6]' },
          { label: 'DETECTION PRECISION', value: '94.2%', sub: 'False Positives: 5.8%', color: 'text-[#10b981]', trend: 'text-zinc-500' },
          { label: 'SENSOR EFFICIENCY', value: '99.8%', sub: 'Packet Loss: 0.002%', color: 'text-white', trend: 'text-zinc-500' },
        ].map((m, i) => (
          <div key={i} className="bg-[#161618] border border-[#1e1e20] p-6 rounded-xl shadow-sm space-y-3">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{m.label}</p>
            <h3 className={`text-xl font-black ${m.color} tracking-tighter`}>{m.value}</h3>
            <p className={`text-[10px] font-bold uppercase tracking-tight ${m.trend}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">DETECTION TIMELINE (LAST 24H / 15M WINDOWS)</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMELINE_DATA}>
                <defs>
                  <linearGradient id="colorThreat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 10}} />
                <Tooltip contentStyle={{backgroundColor: '#0c0c0e', border: '1px solid #333', borderRadius: '12px', fontSize: '10px'}} />
                <Area type="monotone" dataKey="v" stroke="#e11d48" fill="url(#colorThreat)" strokeWidth={2} dot={{ r: 4, fill: '#e11d48', strokeWidth: 2, stroke: '#161618' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar: Protocol Threats */}
        <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-8 shadow-sm">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">PROTOCOL-BASED THREATS (ZEEK LOGS)</h3>
          <div className="space-y-8">
            {[
              { label: 'HTTP C2 (conn.log)', pct: 45, color: 'bg-blue-500' },
              { label: 'DNS Tunneling (dns.log)', pct: 25, color: 'bg-blue-500' },
              { label: 'SMB Lateral (smb.log)', pct: 15, color: 'bg-blue-500' },
              { label: 'RDP Brute (notice.log)', pct: 10, color: 'bg-blue-500' },
            ].map(p => (
              <div key={p.label} className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                  <span className="text-zinc-400">{p.label}</span>
                  <span className="text-blue-400">{p.pct}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
                  <div className={`h-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Section */}
        <div className="lg:col-span-4 bg-[#161618] border border-[#1e1e20] rounded-xl p-8 space-y-6">
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ATTACK TIMELINE HEATMAP (7 DAYS)</h3>
          <div className="grid grid-cols-24 gap-1">
            {Array.from({ length: 7 * 24 }).map((_, i) => {
              const isActive = Math.random() > 0.8;
              return (
                <div key={i} className={`aspect-square rounded-[1px] ${isActive ? (Math.random() > 0.5 ? 'bg-blue-500' : 'bg-[#00D4AA]/40') : 'bg-zinc-800/40'}`} />
              );
            })}
          </div>
          <div className="flex justify-between text-[8px] font-black text-zinc-600 uppercase">
            <span>00:00</span><span>12:00</span><span>23:59</span>
          </div>
        </div>

        {/* Targeted Assets Section */}
        <div className="lg:col-span-8 bg-[#161618] border border-[#1e1e20] rounded-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-[#1e1e20]">
             <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">MOST TARGETED INTERNAL ASSETS</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-zinc-950/20 text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-[#1e1e20]">
              <tr>
                <th className="px-8 py-3">INTERNAL HOST</th>
                <th className="px-8 py-3">LATEST ALERT</th>
                <th className="px-8 py-3">ALERT VOLUME</th>
                <th className="px-8 py-3 text-right">RISK SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {[
                { host: '10.0.5.42', tag: '(CEO-MBP)', alert: 'C2 Beaconing', volume: '15 Hits', score: '92/100', color: 'text-red-500' },
                { host: '10.0.1.10', tag: '(DC-PROD-01)', alert: 'Suspicious SMB', volume: '12 Hits', score: '78/100', color: 'text-orange-500' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <span className="text-[11px] font-mono font-bold text-white tracking-tight">{row.host}</span>
                    <span className="text-[9px] text-zinc-600 font-bold ml-2">{row.tag}</span>
                  </td>
                  <td className="px-8 py-5 text-[10px] font-bold text-zinc-300 uppercase tracking-tight">{row.alert}</td>
                  <td className="px-8 py-5 text-[10px] font-bold text-white uppercase tracking-tight">{row.volume}</td>
                  <td className={`px-8 py-5 text-right text-[11px] font-black ${row.color}`}>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (selectedAlertId) {
    return <AlertDetailPage id={selectedAlertId} onBack={() => setSelectedAlertId(null)} />;
  }

  return (
    <div className="max-w-[1300px] mx-auto pb-48 px-4">
      {/* Header section - UNCHANGED */}
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">
          {view === 'feed' ? 'Detection Feed' : 'Detection Feed'}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-[#161618] border border-[#1e1e20] p-1 rounded-xl">
             <button onClick={() => setView('feed')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'feed' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Feed View</button>
             <button onClick={() => setView('stats')} className={`px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === 'stats' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Analytics</button>
          </div>
        </div>
      </div>

      {view === 'feed' ? (
        <div className="animate-in fade-in duration-500">
          {renderFilterHeader()}
          {renderDetectionTable()}
        </div>
      ) : renderStats()}
    </div>
  );
};

export default DetectionsPage;