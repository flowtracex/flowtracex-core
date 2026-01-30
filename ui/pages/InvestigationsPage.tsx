
import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Plus, ChevronRight, 
  BarChart2, List as ListIcon, Download, CheckCircle2 
} from 'lucide-react';
import InvestigationList from '../components/investigations/InvestigationList';
import InvestigationAnalytics from '../components/investigations/InvestigationAnalytics';
import InvestigationDetailPage from './InvestigationDetailPage';

interface InvestigationsPageProps {
  defaultView?: 'list' | 'analytics';
}

const InvestigationsPage: React.FC<InvestigationsPageProps> = ({ defaultView = 'list' }) => {
  const [view, setView] = useState<'list' | 'analytics'>(defaultView);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  if (selectedCaseId) {
    return <InvestigationDetailPage id={selectedCaseId} onBack={() => setSelectedCaseId(null)} />;
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-[1300px] mx-auto pb-20">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-[#00D4AA] rounded-full shadow-[0_0_10px_rgba(0,212,170,0.4)]" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
              <span>Home</span>
              <ChevronRight size={10} className="text-zinc-800" />
              <span className="text-[#00D4AA]">Investigations</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-1 rounded-xl shadow-xl">
          <button 
            onClick={() => setView('list')} 
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all 
              ${view === 'list' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <ListIcon size={14} /> Case Management
          </button>
          <button 
            onClick={() => setView('analytics')} 
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
              ${view === 'analytics' ? 'bg-[#00D4AA] text-black shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <BarChart2 size={14} /> SOC Analytics
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <InvestigationList onSelectCase={setSelectedCaseId} />
      ) : (
        <InvestigationAnalytics />
      )}
    </div>
  );
};

export default InvestigationsPage;
