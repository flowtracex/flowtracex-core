
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, ShieldCheck, ShieldAlert, Monitor, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  sparklineData?: { val: number }[];
  threshold?: number;
  extraData?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, type, sparklineData, threshold, extraData }) => {
  const isTrendUp = trend?.startsWith('+');
  const numericValue = typeof value === 'number' ? value : parseFloat(value.toString());
  const isOverThreshold = threshold !== undefined && numericValue > threshold;

  const icons = {
    critical: ShieldAlert,
    warning: ShieldCheck,
    info: Monitor,
    success: Activity
  };

  const Icon = icons[type];

  const colorClasses = {
    critical: 'text-[#e11d48]',
    warning: 'text-[#f59e0b]',
    info: 'text-[#3b82f6]',
    success: 'text-[#10b981]'
  };

  const bgClasses = {
    critical: 'bg-[#e11d4815]',
    warning: 'bg-[#f59e0b15]',
    info: 'bg-[#3b82f615]',
    success: 'bg-[#10b98115]'
  };

  return (
    <div className={`bg-[#161618] border rounded-xl p-5 hover:border-[#333] transition-all flex flex-col justify-between relative overflow-hidden group
      ${isOverThreshold ? 'border-[#e11d4844] shadow-[0_0_20px_rgba(225,29,72,0.1)]' : 'border-[#1e1e20]'}`}>
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{title}</h3>
          <p className={`text-xl font-black mt-1 tracking-tighter ${isOverThreshold ? 'text-[#e11d48]' : 'text-white'}`}>{value}</p>
          {extraData && <p className="text-[9px] font-bold text-gray-500 uppercase mt-1">{extraData}</p>}
        </div>
        <div className={`p-2 rounded-lg ${bgClasses[type]} ${colorClasses[type]}`}>
          <Icon size={20} />
        </div>
      </div>
      
      <div className="relative z-10 flex items-end justify-between mt-2">
        <div className="flex-1">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter mb-1.5">{subtitle}</p>
          {trend && (
            <div className="flex items-center gap-1.5">
              {isTrendUp ? (
                <TrendingUp size={12} className="text-[#10b981]" />
              ) : (
                <TrendingDown size={12} className="text-[#e11d48]" />
              )}
              <span className={`text-[10px] font-black ${isTrendUp ? 'text-[#10b981]' : 'text-[#e11d48]'}`}>
                {trend}
              </span>
              <span className="text-[8px] text-gray-700 font-black uppercase tracking-tighter">vs period</span>
            </div>
          )}
        </div>

        {sparklineData && (
          <div className="w-16 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke={isOverThreshold ? '#e11d48' : (isTrendUp && type === 'critical' ? '#e11d48' : '#00D4AA')} 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[7px] text-gray-800 font-black uppercase">Updated: Just Now</span>
      </div>
    </div>
  );
};

export default MetricCard;
