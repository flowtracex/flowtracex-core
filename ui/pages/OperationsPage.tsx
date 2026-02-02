import React from 'react';
import { Monitor, Wifi, Plug, Zap, Globe2, Activity, Shield, Lock, Sparkles, Terminal, Database, ArrowRight } from 'lucide-react';

interface Props {
  currentView: string;
}

const OperationsPage: React.FC<Props> = ({ currentView }) => {
  const getModuleTitle = () => {
    switch (currentView) {
      case 'operations-data-sources':
        return 'Data sources';
      case 'operations-integrations':
        return 'Integrations';
      case 'operations-threat-intel':
        return 'Threat intelligence';
      case 'operations-automation':
        return 'Automation';
      default:
        return 'Operations';
    }
  };

  const getModuleIcon = () => {
    switch (currentView) {
      case 'operations-data-sources':
        return Wifi;
      case 'operations-integrations':
        return Plug;
      case 'operations-threat-intel':
        return Globe2;
      case 'operations-automation':
        return Zap;
      default:
        return Activity;
    }
  };

  const Icon = getModuleIcon();

  return (
    <div className="min-h-screen  flex items-center justify-center p-3">
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <Icon className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-tight">
            {getModuleTitle()}
          </h1>
          
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
            <span className="text-sm text-amber-400">in development</span>
          </div>
        </div>

        {/* Description Card */}
        <div className="mb-12">
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
            <p className="text-lg text-slate-300 leading-relaxed text-center">
               This module is currently being optimized for enterprise scale. 
  It will feature real-time monitoring, automated orchestration, 
  and high-availability infrastructure.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'encrypted', icon: Lock, color: 'emerald' },
            { label: 'cloud sync', icon: Database, color: 'blue' },
            { label: 'live monitoring', icon: Activity, color: 'purple' },
            { label: 'auto-scale', icon: Shield, color: 'cyan' }
          ].map((feat, i) => (
            <div
              key={i}
              className="group p-6 rounded-xl bg-slate-900/30 border border-slate-800 hover:border-slate-700 transition-all duration-300"
            >
              <feat.icon className={`w-6 h-6 text-${feat.color}-400 mb-3`} />
              <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                {feat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        {/* <div className="flex items-center justify-center gap-3 text-slate-500">
          <Terminal className="w-4 h-4" />
          <span className="text-sm">expected delivery: q4 2024</span>
        </div> */}
      </div>
    </div>
  );
};

export default OperationsPage;