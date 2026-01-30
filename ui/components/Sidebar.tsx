
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Radar, 
  Network, 
  Monitor, 
  ScrollText, 
  BarChart3, 
  ChevronDown,
  FolderOpen,
  Wifi,
  Plug,
  Zap,
  Bell,
  Shield,
  Database,
  Key,
  FileText,
  Tag,
  List,
  BarChart2,
  PlusCircle,
  History,
  Search,
  PieChart,
  Settings2,
  TrendingUp,
  Workflow,
  HeartPulse,
  FlameKindling,
  Globe2,
  Settings,
  // Comment: Fixed missing 'User' icon import
  User
} from 'lucide-react';

export type PageId = 
  | 'dashboard' 
  | 'detections' | 'detections-feed' | 'detections-analytics' 
  | 'investigations' | 'investigations-list' | 'investigations-analytics'
  | 'threat-hunting' | 'threat-hunting-builder' | 'threat-hunting-history' 
  | 'network-view' 
  | 'assets' | 'assets-inventory' | 'assets-analytics' 
  | 'logs' | 'logs-analytics' | 'logs-search' 
  | 'rules' | 'rules-library' | 'rules-builder' | 'rules-analytics'
  | 'reports' 
  | 'operations' | 'operations-data-sources' | 'operations-integrations' | 'operations-threat-intel' | 'operations-automation'
  | 'settings'
  | 'settings-profile'
  | 'settings-health'
  | 'settings-notifications'
  | 'settings-detection'
  | 'settings-storage'
  | 'settings-api-keys'
  | 'settings-audit'
  | 'settings-system';

interface SidebarProps {
  activePage: PageId;
  onPageChange: (id: PageId) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onPageChange }) => {
  const [detectionsExpanded, setDetectionsExpanded] = useState(false);
  const [investigationsExpanded, setInvestigationsExpanded] = useState(true);
  const [threatHuntingExpanded, setThreatHuntingExpanded] = useState(false);
  const [assetsExpanded, setAssetsExpanded] = useState(false);
  const [logsExpanded, setLogsExpanded] = useState(false);
  const [rulesExpanded, setRulesExpanded] = useState(false);
  const [operationsExpanded, setOperationsExpanded] = useState(false);
  const [settingsExpanded, setSettingsExpanded] = useState(false);

  const isSettingsActive = activePage.startsWith('settings');
  const isOperationsActive = activePage.startsWith('operations');

  const navGroups = [
    {
      id: 'detections',
      label: 'Detections ',
      icon: ShieldAlert,
      expanded: detectionsExpanded,
      setExpanded: setDetectionsExpanded,
      subItems: [
        { id: 'detections-feed', label: 'Detection Feed', icon: List },
        { id: 'detections-analytics', label: 'Analytics', icon: BarChart2 }
      ]
    },
    {
      id: 'investigations',
      label: 'Investigations',
      icon: FolderOpen,
      expanded: investigationsExpanded,
      setExpanded: setInvestigationsExpanded,
      subItems: [
        { id: 'investigations-list', label: 'Case Management', icon: List },
        { id: 'investigations-analytics', label: 'SOC Analytics', icon: BarChart2 }
      ]
    },
    {
      id: 'threat-hunting',
      label: 'Threat Hunting',
      icon: Radar,
      expanded: threatHuntingExpanded,
      setExpanded: setThreatHuntingExpanded,
      subItems: [
        { id: 'threat-hunting-builder', label: 'Hunt Builder', icon: PlusCircle },
        { id: 'threat-hunting-history', label: 'Hunt History', icon: History }
      ]
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: Monitor,
      expanded: assetsExpanded,
      setExpanded: setAssetsExpanded,
      subItems: [
        { id: 'assets-inventory', label: 'Inventory', icon: Database },
        { id: 'assets-analytics', label: 'Analytics', icon: PieChart }
      ]
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: ScrollText,
      expanded: logsExpanded,
      setExpanded: setLogsExpanded,
      subItems: [
        { id: 'logs-search', label: 'Search', icon: Search },
        { id: 'logs-analytics', label: 'Analytics', icon: BarChart2 }
      ]
    },
    {
      id: 'rules',
      label: 'Rules',
      icon: FlameKindling,
      expanded: rulesExpanded,
      setExpanded: setRulesExpanded,
      subItems: [
        { id: 'rules-library', label: 'Rule Library', icon: Settings2 },
        { id: 'rules-builder', label: 'Rule Builder', icon: PlusCircle },
        { id: 'rules-analytics', label: 'Rule Analytics', icon: TrendingUp }
      ]
    }
  ];

  const operationsSubItems = [
    { id: 'operations-data-sources', label: 'Data Sources', icon: Wifi },
    { id: 'operations-integrations', label: 'Integrations', icon: Plug },
    { id: 'operations-threat-intel', label: 'Threat Intel Feeds', icon: Globe2 },
    { id: 'operations-automation', label: 'Playbooks & SOAR', icon: Zap },
  ];

  const settingsSubItems = [
    { id: 'settings-profile', label: 'User Profile', icon: User },
    { id: 'settings-health', label: 'Platform Health', icon: HeartPulse },
    { id: 'settings-notifications', label: 'Notifications', icon: Bell },
    { id: 'settings-detection', label: 'Detection Config', icon: Shield },
    { id: 'settings-storage', label: 'Storage & Retention', icon: Database },
    { id: 'settings-api-keys', label: 'API Keys', icon: Key },
    { id: 'settings-audit', label: 'Audit Logs', icon: FileText },
    { id: 'settings-system', label: 'License & System', icon: Tag },
  ];

  return (
    <aside className="w-64 flex flex-col h-screen bg-[#111113] border-r border-[#222] fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-[#00D4AA] rounded-lg flex items-center justify-center text-black font-black text-xl">C</div>
        <div>
          <h1 className="text-sm font-black text-white leading-none">NDR</h1>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-[0.2em]">ClearFlow X</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
        <button
          onClick={() => onPageChange('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
            ${activePage === 'dashboard' ? 'bg-[#00D4AA10] text-[#00D4AA]' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <LayoutDashboard size={18} />
          <span className="font-bold">Dashboard</span>
        </button>

        {navGroups.map((group) => {
          const Icon = group.icon;
          const isActive = activePage.startsWith(group.id);
          
          return (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => group.setExpanded(!group.expanded)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
                  ${isActive ? 'text-[#00D4AA]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span className="font-bold">{group.label}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform ${group.expanded ? '' : '-rotate-90'}`} />
              </button>
              {group.expanded && (
                <div className="ml-3 pl-4 border-l border-[#222] space-y-1">
                  {group.subItems.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onPageChange(sub.id as PageId)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] transition-all
                        ${activePage === sub.id 
                          ? 'bg-[#00D4AA10] text-[#00D4AA]' 
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
                    >
                      <sub.icon size={14} />
                      <span className="font-bold">{sub.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={() => onPageChange('network-view')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
            ${activePage === 'network-view' ? 'bg-[#00D4AA10] text-[#00D4AA]' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <Network size={18} />
          <span className="font-bold">Network View</span>
        </button>

        <button
          onClick={() => onPageChange('reports')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
            ${activePage === 'reports' ? 'bg-[#00D4AA10] text-[#00D4AA]' : 'text-gray-400 hover:bg-white/5'}`}
        >
          <BarChart3 size={18} />
          <span className="font-bold">Reports</span>
        </button>

        {/* OPERATIONS GROUP */}
        <div className="pt-2">
          <button
            onClick={() => setOperationsExpanded(!operationsExpanded)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
              ${isOperationsActive ? 'text-[#00D4AA]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Workflow size={18} />
              <span className="font-bold">Operations</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${operationsExpanded ? '' : '-rotate-90'}`} />
          </button>
          
          {operationsExpanded && (
            <div className="mt-1 ml-3 pl-4 border-l border-[#222] space-y-1">
              {operationsSubItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id as PageId)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] transition-all
                    ${activePage === item.id 
                      ? 'bg-[#00D4AA10] text-[#00D4AA]' 
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
                >
                  <item.icon size={14} />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SETTINGS GROUP */}
        <div className="pt-2">
          <button
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all
              ${isSettingsActive ? 'text-[#00D4AA]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} />
              <span className="font-bold">Settings</span>
            </div>
            <ChevronDown size={14} className={`transition-transform ${settingsExpanded ? '' : '-rotate-90'}`} />
          </button>
          
          {settingsExpanded && (
            <div className="mt-1 ml-3 pl-4 border-l border-[#222] space-y-1">
              {settingsSubItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id as PageId)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] transition-all
                    ${activePage === item.id 
                      ? 'bg-[#00D4AA10] text-[#00D4AA]' 
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'}`}
                >
                  <item.icon size={14} />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-[#222]">
        <div className="flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA] animate-pulse" />
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">v2.4.1 Connected</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
