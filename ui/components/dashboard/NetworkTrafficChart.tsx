import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrafficPoint } from '../../types';
import { Calendar } from 'lucide-react';

interface Props {
  data: TrafficPoint[];
}

const NetworkTrafficChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-semibold">Network Traffic</h3>
          <p className="text-xs text-gray-500 mt-0.5">Traffic volume and alert correlation</p>
        </div>
        <button className="bg-[#1e1e20] text-xs px-3 py-1.5 rounded-lg border border-[#333] flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <Calendar size={14} />
          <span>Last 24h</span>
        </button>
      </div>

      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1e20" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 10 }} 
              interval={4}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 10 }} 
              domain={[0, 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1c', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Area 
              type="monotone" 
              dataKey="trafficMBps" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorTraffic)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkTrafficChart;