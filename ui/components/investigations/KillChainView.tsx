
import React from 'react';

const stages = [
  { name: 'Reconnaissance', tech: ['T1595 Active Scanning', 'T1592 Gather Host Info'] },
  { name: 'Initial Access', tech: ['T1566 Phishing', 'T1190 Exploit Public App'] },
  { name: 'Execution', tech: ['T1059 Command Scripting', 'T1204 User Execution'] },
  { name: 'Persistence', tech: ['T1053 Scheduled Task', 'T1547 Boot Autostart'] },
  { name: 'Defense Evasion', tech: ['T1055 Process Injection', 'T1070 Indicator Removal'] },
  { name: 'Command & Control', tech: ['T1071 Application Layer', 'T1573 Encrypted Channel'], active: true },
  { name: 'Exfiltration', tech: ['T1041 Exfil Over C2', 'T1567 Exfil to Cloud'] }
];

const KillChainView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Kill Chain Progression</h3>
        <button className="text-[#10b981] text-xs font-bold border border-[#10b98144] px-3 py-1 rounded bg-[#10b98110]">View Details</button>
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {stages.map((stage, i) => (
          <div key={i} className="space-y-3">
            <div className={`text-[9px] font-bold uppercase tracking-tighter text-center py-1 rounded border ${stage.active ? 'bg-[#e11d4820] border-[#e11d48] text-[#e11d48]' : 'bg-[#1e1e20] border-[#333] text-gray-500'}`}>
              {stage.name}
            </div>
            <div className="space-y-2">
              {stage.tech.map((t, j) => (
                <div key={j} className={`p-2 rounded border text-[9px] leading-tight ${stage.active ? 'bg-[#e11d4810] border-[#e11d4844] text-white' : 'bg-[#161618] border-[#1e1e20] text-gray-500'}`}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-1 mt-8 justify-center">
         {stages.map((_, i) => (
           <React.Fragment key={i}>
             <div className={`w-3 h-3 rounded-full border-2 ${i <= 5 ? 'bg-[#e11d48] border-[#e11d48]' : 'bg-transparent border-[#333]'}`} />
             {i < stages.length - 1 && <div className={`h-0.5 flex-1 max-w-[40px] ${i < 5 ? 'bg-[#e11d48]' : 'bg-[#333]'}`} />}
           </React.Fragment>
         ))}
      </div>
    </div>
  );
};

export default KillChainView;
