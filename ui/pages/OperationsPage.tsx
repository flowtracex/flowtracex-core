
import React from 'react';
import { 
  Monitor, Wifi, Plug, Zap, Globe2, Activity, Shield, 
  Lock, Sparkles, Terminal, Database, ArrowRight
} from 'lucide-react';

interface Props {
  currentView: string;
}

const OperationsPage: React.FC<Props> = ({ currentView }) => {
  const getModuleTitle = () => {
    switch (currentView) {
      case 'operations-data-sources': return 'Data Source Ingestion';
      case 'operations-integrations': return 'Global Integrations';
      case 'operations-threat-intel': return 'Threat Intelligence Feeds';
      case 'operations-automation': return 'Playbooks & SOAR';
      default: return 'Operations Engine';
    }
  };

  const getModuleIcon = () => {
    switch (currentView) {
      case 'operations-data-sources': return Wifi;
      case 'operations-integrations': return Plug;
      case 'operations-threat-intel': return Globe2;
      case 'operations-automation': return Zap;
      default: return Activity;
    }
  };

  const Icon = getModuleIcon();

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative mb-12">
        <div className="absolute -inset-10 bg-[#00D4AA] opacity-5 blur-[80px] rounded-full animate-pulse" />
        <div className="bg-[#161618] border border-[#1e1e20] p-10 rounded-[40px] shadow-2xl relative z-10 group hover:border-[#00D4AA33] transition-all">
          <Icon size={64} className="text-[#00D4AA] group-hover:scale-110 transition-transform" />
        </div>
        <div className="absolute -top-2 -right-2 bg-[#00D4AA] text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg rotate-12">
          PHASE 2
        </div>
      </div>

      <div className="text-center max-w-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">
            {getModuleTitle()}
          </h2>
          <p className="text-[#00D4AA] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
            <Sparkles size={14} /> updatesoon <Sparkles size={14} />
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed font-medium uppercase tracking-tight">
          The {getModuleTitle()} workspace is currently being optimized for global enterprise scale. 
          This high-availability module will feature real-time status monitoring and automated failover orchestration.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10">
          {[
            { label: 'E2E Encryption', icon: Lock },
            { label: 'Cloud Sync', icon: Database },
            { label: 'Live Telemetry', icon: Activity },
            { label: 'Auto Scale', icon: Shield }
          ].map((feat, i) => (
            <div key={i} className="bg-[#161618] border border-[#1e1e20] p-4 rounded-lg flex flex-col items-center gap-3 group hover:bg-[#00D4AA05] transition-all">
              <feat.icon size={20} className="text-gray-600 group-hover:text-[#00D4AA] transition-colors" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{feat.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-12 flex flex-col items-center gap-4">
           <button className="bg-[#1e1e20] border border-[#333] px-10 py-3.5 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 hover:text-white transition-all group shadow-xl">
             <Terminal size={14} className="group-hover:text-[#00D4AA]" /> Join Deployment Waitlist
           </button>
           <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
             Expected delivery: Q4 2024 • Build core-x-9842
           </p>
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;
