
import React from 'react';
import { 
  BarChart3, 
  Lock, 
  Zap, 
  FileText, 
  Download, 
  Share2, 
  LayoutDashboard, 
  PieChart, 
  Calendar,
  Sparkles
} from 'lucide-react';

const ReportsPage: React.FC = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center animate-in fade-in duration-700">
      <div className="relative mb-12">
        <div className="absolute -inset-10 bg-[#00D4AA] opacity-5 blur-[80px] rounded-full animate-pulse" />
        <div className="bg-[#161618] border border-[#1e1e20] p-10 rounded-[40px] shadow-2xl relative z-10">
          <LayoutDashboard size={64} className="text-[#00D4AA]" />
        </div>
        <div className="absolute -top-2 -right-2 bg-[#00D4AA] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg rotate-12">
          New Engine
        </div>
      </div>

      <div className="text-center max-w-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">
            Report & Dashboard Engine
          </h2>
          <p className="text-[#00D4AA] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
            <Sparkles size={14} /> Coming Soon <Sparkles size={14} />
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed font-medium">
          We are building a world-class analytics suite for ClearFlow X. 
          The upcoming engine will allow you to construct bespoke dashboards and generate regulatory-grade security compliance reports in seconds.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
          {[
            { label: 'Custom Widgets', icon: PieChart },
            { label: 'PDF Exports', icon: Download },
            { label: 'Live Sharing', icon: Share2 },
            { label: 'Scheduling', icon: Calendar }
          ].map((feat, i) => (
            <div key={i} className="bg-[#161618] border border-[#1e1e20] p-4 rounded-lg flex flex-col items-center gap-3 group hover:border-[#00D4AA33] transition-all">
              <feat.icon size={20} className="text-gray-600 group-hover:text-[#00D4AA] transition-colors" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">{feat.label}</span>
            </div>
          ))}
        </div>

        <div className="pt-10 flex flex-col items-center gap-4">
           <button className="bg-[#1e1e20] border border-[#333] px-10 py-3 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 hover:text-white transition-all">
             <Lock size={14} /> Notify Me on Launch
           </button>
           <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">
             Expected delivery: Q3 2024 • Build NDR-X-847
           </p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
