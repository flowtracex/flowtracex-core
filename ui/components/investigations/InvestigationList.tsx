import React, { useState, useEffect } from 'react';
import { 
  Search, Calendar, ChevronDown, Plus, List, BarChart2, 
  User, MoreHorizontal, ExternalLink, Shield, AlertCircle
} from 'lucide-react';
import { MOCK_INVESTIGATIONS } from '../../constants/mockData/investigations';
import { Severity } from '../../types';

interface Props {
  onSelectCase: (id: string) => void;
}

const InvestigationList: React.FC<Props> = ({ onSelectCase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLogSource, setSelectedLogSource] = useState('conn');
  const [selectedMitreTactic, setSelectedMitreTactic] = useState('lateral-movement');
  const [selectedAssetGroup, setSelectedAssetGroup] = useState('all');
  const [selectedHorizon, setSelectedHorizon] = useState('custom');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    if (selectedRows.length === MOCK_INVESTIGATIONS.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(MOCK_INVESTIGATIONS.map(inv => inv.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'new':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
      default:
        return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto px-4 pb-32">
      
      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search Field */}
        <div className="flex-1 min-w-[300px] relative group mt-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-zinc-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Cases: IPs, Hostnames, or Zeek UIDs..." 
            className="w-full bg-zinc-900/60 border border-zinc-800 rounded-lg pl-12 pr-4 py-2.5 text-sm text-white outline-none focus:border-zinc-700 transition-all placeholder:text-zinc-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Log Source Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider px-1">Log Source</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'log' ? null : 'log')}
              className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 min-w-[140px]"
            >
              <span className="capitalize">{selectedLogSource}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'log' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'log' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
              {['Conn', 'DNS', 'SSL', 'HTTP', 'Files', 'DHCP'].map(source => (
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

        {/* MITRE Tactic Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider px-1">MITRE Tactic</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'mitre' ? null : 'mitre')}
              className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 min-w-[180px]"
            >
              <span className="capitalize">{selectedMitreTactic.replace('-', ' ')}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'mitre' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'mitre' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[220px] z-50 py-2">
              {[
                'Lateral Movement',
                'Command & Control', 
                'Exfiltration',
                'Defense Evasion',
                'Credential Access',
                'Initial Access'
              ].map(tactic => (
                <button 
                  key={tactic}
                  onClick={() => {
                    setSelectedMitreTactic(tactic.toLowerCase().replace(' ', '-').replace('&', 'and'));
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

        {/* Asset Group Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider px-1">Asset Group</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'asset' ? null : 'asset')}
              className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 min-w-[160px]"
            >
              <span className="capitalize">{selectedAssetGroup === 'all' ? 'All Segments' : selectedAssetGroup}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'asset' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'asset' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
              {['All Segments', 'Engineering', 'Production', 'Management', 'Guest WiFi', 'DMZ'].map(group => (
                <button 
                  key={group}
                  onClick={() => {
                    setSelectedAssetGroup(group.toLowerCase());
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

        {/* Horizon Dropdown */}
        <div className="relative dropdown-container">
          <div className="flex flex-col gap-1">
            <label className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider px-1">Horizon</label>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'horizon' ? null : 'horizon')}
              className="bg-[#0a0a0b] border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 min-w-[160px]"
            >
              <span className="capitalize">{selectedHorizon.replace('-', ' ')}</span>
              <ChevronDown size={14} className={`ml-auto transition-transform ${openDropdown === 'horizon' ? 'rotate-180' : ''}`} />
            </button>
          </div>
          {openDropdown === 'horizon' && (
            <div className="absolute top-full left-0 mt-2 bg-[#0a0a0b] border border-zinc-800 rounded-lg shadow-2xl min-w-[180px] z-50 py-2">
              {['Last 1 Hour', 'Last 24 Hours', 'Last 7 Days', 'Last 30 Days', 'Custom Range'].map(range => (
                <button 
                  key={range}
                  onClick={() => {
                    setSelectedHorizon(range.toLowerCase().replace(/ /g, '-'));
                    setOpenDropdown(null);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-sm text-zinc-300 transition-colors"
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Investigation Table */}
      <div className="bg-[#0a0a0b] border border-zinc-800/50 rounded-lg overflow-hidden">
      <table className="w-full">
  <thead className="bg-[#0d0d0f] border-b border-zinc-800">
    <tr className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
      <th className="px-3 py-2 text-left w-8">
        <input 
          type="checkbox" 
          className="h-4 w-4 border-2 border-zinc-700 bg-zinc-900 checked:bg-[#00D4AA] checked:border-[#00D4AA] appearance-none rounded flex items-center justify-center checked:after:content-['✓'] checked:after:text-black checked:after:text-xs"
          checked={selectedRows.length === MOCK_INVESTIGATIONS.length && MOCK_INVESTIGATIONS.length > 0}
          onChange={toggleAllRows}
        />
      </th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Investigation Case</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Status</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Priority</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Asset / Segment</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Assignee</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Log Source</th>
      <th className="px-3 py-2 text-left whitespace-nowrap">Actions</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-zinc-800/50">
    {MOCK_INVESTIGATIONS.map((inv, idx) => (
      <tr 
        key={inv.id} 
        className="hover:bg-zinc-900/30 transition-colors group"
      >
        <td className="px-3 py-3">
          <input 
            type="checkbox" 
            className="h-4 w-4 border-2 border-zinc-700 bg-zinc-900 checked:bg-[#00D4AA] checked:border-[#00D4AA] appearance-none rounded flex items-center justify-center checked:after:content-['✓'] checked:after:text-black checked:after:text-xs"
            checked={selectedRows.includes(inv.id)}
            onChange={() => toggleRowSelection(inv.id)}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="px-3 py-3">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors cursor-pointer whitespace-nowrap">
              {inv.name}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono space-x-2 whitespace-nowrap">
              <span>CASE-{inv.id.slice(0, 8)}</span>
              <span>·</span>
              <span>{inv.mitreStage || 'Command & Control'}</span>
            </div>
          </div>
        </td>
        <td className="px-3 py-3">
          <span className={`inline-flex px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getStatusColor(inv.status || 'active')}`}>
            {inv.status || 'Active'}
          </span>
        </td>
        <td className="px-3 py-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getPriorityColor(inv.severity)}`}>
            {inv.severity === 'critical' && <AlertCircle size={12} />}
            {inv.severity}
          </span>
        </td>
        <td className="px-3 py-3">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-white whitespace-nowrap">
              {inv.segment || 'Engineering'}
            </div>
            <div className="text-[10px] text-zinc-500 whitespace-nowrap">
              {inv.assetContext?.vlan || 'eng-station-pc'}
            </div>
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center flex-shrink-0">
              <User size={11} className="text-blue-400" />
            </div>
            <span className="text-xs text-zinc-300 font-medium whitespace-nowrap">
              {inv.assignedTo?.name || (idx === 0 ? 'Sarah Chen' : idx === 1 ? 'Unassigned' : 'Marcus Thorne')}
            </span>
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex gap-1 flex-wrap">
            <span className="px-1.5 py-0.5 bg-cyan-600/20 border border-cyan-600/30 text-emerald-400 rounded text-[9px] font-bold uppercase whitespace-nowrap">
              {idx === 0 ? 'Conn' : idx === 1 ? 'DNS' : idx === 2 ? 'Conn' : idx === 3 ? 'Files' : 'DHCP'}
            </span>
            {idx === 0 && (
              <span className="px-1.5 py-0.5 bg-cyan-600/20 border border-cyan-600/30 text-emerald-400 rounded text-[9px] font-bold uppercase whitespace-nowrap">
                SSL
              </span>
            )}
            {idx === 2 && (
              <span className="px-1.5 py-0.5 bg-cyan-600/20 border border-cyan-600/30 text-emerald-400 rounded text-[9px] font-bold uppercase whitespace-nowrap">
                DCE-RPC
              </span>
            )}
          </div>
        </td>
        <td className="px-3 py-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <button 
              onClick={() => onSelectCase(inv.id)}
              className="bg-[#00D4AA] text-black px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1"
            >
              Open Workspace
              <ExternalLink size={11} />
            </button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
              <MoreHorizontal size={14} className="text-zinc-500" />
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-[#0d0d0f] flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            Showing <span className="font-bold text-white">1-5</span> of <span className="font-bold text-white">12</span> active investigations
            {selectedRows.length > 0 && (
              <>
                <span className="mx-2">·</span>
                <span className="text-blue-400 font-bold">{selectedRows.length} selected</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs text-zinc-500 hover:text-white transition-colors">
              Next refresh in 45s
            </button>
            <span className="mx-2 text-zinc-700">|</span>
            <button className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationList;