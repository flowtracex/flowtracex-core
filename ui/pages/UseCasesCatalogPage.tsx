import React, { useState } from 'react';
import { 
  Shield, FileSearch, Layers, AlertTriangle, Filter, Search, ChevronRight
} from 'lucide-react';

interface UseCase {
  id: string;
  name: string;
  description: string;
  category: 'MALWARE' | 'EXFILTRATION' | 'LATERAL_MOVEMENT' | 'RECONNAISSANCE';
  stages: number;
  signals: number;
  icon: string;
}

const MOCK_USE_CASES: UseCase[] = [
  {
    id: 'UC-001',
    name: 'Ransomware Detection',
    description: 'Detects crypto-locking activity using multi-stage behavioral signals.',
    category: 'MALWARE',
    stages: 3,
    signals: 5,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="#00D4AA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
  },
  {
    id: 'UC-002',
    name: 'Data Exfiltration',
    description: 'Identifies unauthorized large-scale data transfers to uncommon...',
    category: 'EXFILTRATION',
    stages: 2,
    signals: 5,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`
  },
  {
    id: 'UC-003',
    name: 'Lateral Movement',
    description: 'Detects unusual authentication and remote access patterns.',
    category: 'LATERAL_MOVEMENT',
    stages: 2,
    signals: 4,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8L22 12L18 16"/><path d="M2 12H22"/><path d="M6 8L2 12L6 16"/></svg>`
  },
  {
    id: 'UC-004',
    name: 'Network Reconnaissance',
    description: 'Identifies port scanning and network mapping activities.',
    category: 'RECONNAISSANCE',
    stages: 1,
    signals: 3,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
  }
];

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories', color: 'zinc' },
  { id: 'MALWARE', label: 'Malware', color: 'red' },
  { id: 'EXFILTRATION', label: 'Exfiltration', color: 'blue' },
  { id: 'LATERAL_MOVEMENT', label: 'Lateral Movement', color: 'orange' },
  { id: 'RECONNAISSANCE', label: 'Reconnaissance', color: 'yellow' }
];

interface Props {
  onSelectUseCase: (useCaseId: string) => void;
}

const UseCasesCatalogPage: React.FC<Props> = ({ onSelectUseCase }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUseCases = MOCK_USE_CASES.filter(useCase => {
    const matchesCategory = selectedCategory === 'ALL' || useCase.category === selectedCategory;
    const matchesSearch = useCase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         useCase.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleUseCaseClick = (useCaseId: string) => {
    onSelectUseCase(useCaseId);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-[1300px] mx-auto space-y-6 pb-32 px-4">
      
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-xl font-bold text-white uppercase tracking-tight">Detection Catalog</h1>
        <p className="text-sm text-zinc-400">Review architectural logic and multi-stage behavioral detection modules.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search use cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-lg pl-12 pr-6 py-3 text-sm text-zinc-200 outline-none focus:border-[#00D4AA] transition-all placeholder:text-zinc-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3">
          <Filter size={14} className="text-zinc-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0a0a0b] border border-[#1e1e20] text-xs font-bold text-zinc-400 uppercase tracking-wide px-6 py-3 rounded-lg outline-none cursor-pointer hover:border-zinc-700 transition-all"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
        Showing {filteredUseCases.length} use case{filteredUseCases.length !== 1 ? 's' : ''}
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUseCases.map(useCase => {
          const category = CATEGORIES.find(c => c.id === useCase.category);
          
          return (
            <div
              key={useCase.id}
              onClick={() => handleUseCaseClick(useCase.id)}
              className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 hover:border-[#00D4AA] transition-all cursor-pointer group relative overflow-hidden shadow-sm space-y-4"
            >
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <div className={`inline-flex px-3 py-1 rounded border ${
                  useCase.category === 'MALWARE' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  useCase.category === 'EXFILTRATION' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  useCase.category === 'LATERAL_MOVEMENT' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {category?.label}
                  </span>
                </div>
              </div>

              {/* Icon */}
              <div 
                className="text-[#00D4AA]" 
                dangerouslySetInnerHTML={{ __html: useCase.icon }}
              />

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00D4AA] transition-colors">
                  {useCase.name}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                  {useCase.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4 border-t border-[#1e1e20]">
                <div className="flex items-center gap-2">
                  <Layers size={12} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                    {useCase.stages} Stages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={12} className="text-zinc-500" />
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                    {useCase.signals} Signals
                  </span>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all">
                <ChevronRight size={18} className="text-[#00D4AA]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredUseCases.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 opacity-30">
          <Shield size={48} className="text-zinc-600 mb-4" />
          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">
            No use cases found
          </h3>
          <p className="text-xs text-zinc-600">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
};

export default UseCasesCatalogPage;