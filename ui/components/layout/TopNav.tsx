import React, { useState } from 'react';
import { Bell, Search, Printer, Calendar, ChevronDown, Moon, Sun, Filter, X } from 'lucide-react';

interface TopNavProps {
  pageTitle?: string;
}

const TopNav: React.FC<TopNavProps> = ({ pageTitle }) => {
  const [isDark, setIsDark] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="border-b border-[#1e1e20] bg-[#0c0c0e]/80 backdrop-blur-md sticky top-0 z-40 ml-64 flex flex-col no-print">
      <div className="h-16 flex items-center justify-between px-8">
        <div className="flex items-center gap-6 flex-1">
          {pageTitle && (
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mr-8 border-r border-[#1e1e20] pr-8 h-8">
              <span className="text-[#00D4AA]">{pageTitle}</span>
            </div>
          )}
          
          
        </div>

        <div className="flex items-center gap-4">
          {/* <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#1e1e20] border border-[#333] px-4 py-2 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all shadow-sm"
            title="Export Dashboard to PDF"
          >
            <Printer size={16} />
            Export
          </button> */}
          <div className="relative group flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00D4AA]" />
              <input
                type="text"
                placeholder="Global Search (IP, Host, Alert)... /"
                className="bg-[#1e1e20] text-sm border-none rounded-lg pl-10 pr-4 py-2 w-80 focus:ring-1 focus:ring-[#00D4AA] outline-none transition-all placeholder:text-gray-600 font-medium"
              />
            </div>
            <button className="p-2 bg-[#1e1e20] border border-[#333] rounded-lg text-gray-500 hover:text-white transition-all" title="Advanced Filters">
              <Filter size={16} />
            </button>
          </div>

          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 bg-[#1e1e20] border border-[#333] rounded-lg text-gray-500 hover:text-white transition-all"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#e11d48] rounded-full border-2 border-[#0c0c0e]" />
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-[#1e1e20]">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">Administrator </p>
              <p className="text-[9px] text-[#00D4AA] font-black uppercase tracking-widest">Global Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#1e1e20] border border-[#333] flex items-center justify-center text-[#00D4AA] font-black text-xs shadow-lg">
              A
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;