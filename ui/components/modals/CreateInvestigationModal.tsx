
import React, { useState } from 'react';
import { X, FolderPlus, Shield, User, Info } from 'lucide-react';
import { Severity } from '../../types';

interface CreateInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; severity: Severity; owner: string }) => void;
  initialData?: {
    title: string;
    severity: Severity;
  };
}

const CreateInvestigationModal: React.FC<CreateInvestigationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData 
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [severity, setSeverity] = useState<Severity>(initialData?.severity || 'medium');
  const [owner, setOwner] = useState('Sarah Chen');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#000000cc] backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111113] border border-[#1e1e20] rounded-lg w-full max-w-xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] p-12">
        <div className="text-center space-y-3 mb-12">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight">Escalate to Investigation</h3>
          <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Create a formal case for team collaboration.</p>
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest pl-1">Case Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-5 py-4 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              placeholder="Case Name..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <select 
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
                className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-5 py-4 text-[11px] font-black uppercase text-white outline-none appearance-none cursor-pointer hover:border-zinc-700 transition-all"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="space-y-3">
              <select 
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-5 py-4 text-[11px] font-black uppercase text-white outline-none appearance-none cursor-pointer hover:border-zinc-700 transition-all"
              >
                <option>Sarah Chen</option>
                <option>Mike Johnson</option>
                <option>Lee Parks</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-12">
          <button 
            onClick={onClose}
            className="py-4 bg-[#1e1e20] border border-[#333] text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit({ title, severity, owner })}
            className="py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 shadow-xl shadow-blue-600/10 transition-all"
          >
            Create Case
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInvestigationModal;
