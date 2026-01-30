
import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Settings, 
  Monitor, 
  Trash2, 
  CheckCircle2, 
  Zap, 
  Globe, 
  ShieldAlert, 
  Shield,
  Database, 
  FileText, 
  Search, 
  ArrowRight,
  Info,
  Activity,
  Lock,
  Cpu,
  RefreshCcw,
  Check,
  Bell,
  Mail,
  MessageSquare,
  Key,
  User,
  Clock,
  ExternalLink,
  Sliders,
  History,
  Tag,
  AlertTriangle,
  Download,
  Smartphone,
  ShieldCheck,
  Laptop,
  MapPin,
  Filter,
  X,
  XCircle,
  AlertCircle,
  Copy,
  ChevronDown,
  Slack,
  MessageCircle,
  Link,
  Save,
  BarChart2,
  HardDrive,
  Sparkles
} from 'lucide-react';

interface Props {
  currentView: string;
}

const SettingsPage: React.FC<Props> = ({ currentView }) => {
  const [expandedAuditRow, setExpandedAuditRow] = useState<number | null>(null);

  const Breadcrumb = (label: string, action?: React.ReactNode) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
        <span>Home</span>
        <ChevronRight size={10} />
        <span>Settings</span>
        <ChevronRight size={10} />
        <span className="text-[#00D4AA]">{label}</span>
      </div>
      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );

  const Card = ({ title, children, headerAction }: { title: string; children?: React.ReactNode; headerAction?: React.ReactNode }) => (
    <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-6 mb-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</h3>
        {headerAction}
      </div>
      {children}
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-5xl animate-in fade-in duration-300">
      {Breadcrumb('User Profile', 
        <button className="bg-[#00D4AA] text-black px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all">Save Changes</button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Profile Information">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#00D4AA] flex items-center justify-center text-black font-black text-xl shadow-lg shadow-[#00D4AA22]">A</div>
              <div className="space-y-2">
                <button className="px-4 py-1.5 bg-[#1e1e20] border border-[#333] text-[10px] font-black uppercase text-white rounded-lg hover:bg-[#2a2a2c] transition-all">Upload New</button>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">JPG, PNG or GIF. Max size 2MB</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Full Name</label>
                <input type="text" defaultValue="Administrator" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Email Address</label>
                <input type="text" readOnly value="admin@clearflow.security" className="w-full bg-[#161618] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-gray-500 outline-none cursor-not-allowed font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Username</label>
                  <input type="text" defaultValue="admin_core" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Role</label>
                  <div className="h-[41px] flex items-center px-4 rounded-xl bg-[#00D4AA10] border border-[#00D4AA22]">
                    <span className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest">System Admin</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Department</label>
                <input type="text" defaultValue="Security Operations (SOC)" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] transition-all" />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Security">
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-white uppercase tracking-tight flex items-center gap-2"><Key size={14} className="text-[#00D4AA]"/> Change Password</h4>
              <div className="space-y-3">
                <input type="password" placeholder="Current Password" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" />
                <input type="password" placeholder="New Password" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" />
                <div className="h-1 w-full bg-[#0c0c0e] rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 w-[60%]" />
                </div>
                <input type="password" placeholder="Confirm New Password" className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" />
              </div>
              <button className="bg-[#1e1e20] border border-[#333] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2a2a2c]">Update Password</button>
            </div>

            <div className="pt-6 border-t border-[#1e1e20] space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-tight flex items-center gap-2"><Smartphone size={14} className="text-[#00D4AA]"/> Two-Factor Authentication</h4>
                <span className="text-[9px] font-black text-[#10b981] bg-[#10b98110] px-2 py-0.5 rounded border border-[#10b98133] uppercase">Enabled</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-tighter">Your account is secured with a hardware token and authenticator app.</p>
              <button className="w-full py-2.5 border border-[#e11d4844] text-[#e11d48] text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#e11d4810]">Disable 2FA</button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Preferences">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Timezone</label>
              <select className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] appearance-none cursor-pointer">
                <option>UTC (Coordinated Universal Time)</option>
                <option>EST (Eastern Standard Time)</option>
                <option>PST (Pacific Standard Time)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Date Format</label>
              <div className="flex gap-2">
                {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => (
                  <button key={f} className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${f === 'YYYY-MM-DD' ? 'bg-[#00D4AA] border-[#00D4AA] text-black' : 'bg-[#0c0c0e] border-[#1e1e20] text-gray-500'}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Time Format</label>
              <div className="flex gap-2">
                {['12h', '24h'].map(f => (
                  <button key={f} className={`flex-1 py-2 rounded-lg text-[9px] font-black border transition-all ${f === '24h' ? 'bg-[#00D4AA] border-[#00D4AA] text-black' : 'bg-[#0c0c0e] border-[#1e1e20] text-gray-500'}`}>{f}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Default Dashboard</label>
              <select className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] appearance-none cursor-pointer">
                <option>Executive Overview</option>
                <option>Security Analyst</option>
                <option>Network Performance</option>
              </select>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Language</label>
              <select className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA] appearance-none cursor-pointer">
                <option>English (US)</option>
                <option>German (Coming Soon)</option>
                <option>Japanese (Coming Soon)</option>
              </select>
            </div>
            <div className="pt-6">
              <button className="w-full bg-[#1e1e20] border border-[#333] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2a2a2c] transition-all">Save Preferences</button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Active Sessions">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#0c0c0e]/50 border-b border-[#1e1e20]">
              <tr>
                <th className="px-6 py-4">Device</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              <tr className="bg-[#00D4AA05]">
                <td className="px-6 py-4"><div className="flex items-center gap-3"><Laptop size={14} className="text-[#00D4AA]"/><span className="text-white font-bold">MacBook Pro - Chrome</span><span className="text-[8px] bg-[#00D4AA20] text-[#00D4AA] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Current</span></div></td>
                <td className="px-6 py-4 text-gray-400">San Francisco, US (192.168.1.100)</td>
                <td className="px-6 py-4 text-[#10b981] font-bold">Just now</td>
                <td className="px-6 py-4 text-right text-gray-600">-</td>
              </tr>
              <tr>
                <td className="px-6 py-4"><div className="flex items-center gap-3"><Laptop size={14} className="text-gray-600"/><span>MacBook Pro - Safari</span></div></td>
                <td className="px-6 py-4 text-gray-500">London, UK (84.152.12.8)</td>
                <td className="px-6 py-4 text-gray-600">2 days ago</td>
                <td className="px-6 py-4 text-right"><button className="text-[9px] font-black text-[#e11d48] uppercase tracking-widest hover:underline">Revoke</button></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">Revoke All Other Sessions <X size={14}/></button>
        </div>
      </Card>
    </div>
  );

  const renderNotifications = () => (
    <div className="max-w-5xl animate-in fade-in duration-300">
      {Breadcrumb('Notifications')}
      
      <Card title="Important Notification Triggers">
        <div className="space-y-4">
          {[
            { label: 'Critical Security Alert', desc: 'Notify immediately when a critical severity alert is triggered', active: true },
            { label: 'System Health & Pipeline', desc: 'Alert on sensor disconnects or high ingestion lag', active: true },
            { label: 'New High-Risk Entity', desc: 'Notify when a new asset with high risk score is discovered', active: false },
            { label: 'Platform Update Available', desc: 'Notify when a new core version is ready for deployment', active: true },
          ].map((trigger, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-[#0c0c0e] rounded-xl border border-[#1e1e20] group hover:border-[#333] transition-all">
              <div>
                <p className="text-[11px] font-bold text-white uppercase tracking-tight">{trigger.label}</p>
                <p className="text-[9px] text-gray-500 font-bold tracking-tight mt-0.5">{trigger.desc}</p>
              </div>
              <button className={`h-4 w-7 rounded-full transition-colors ${trigger.active ? 'bg-[#00D4AA]' : 'bg-[#333]'}`}>
                <div className={`h-2.5 w-2.5 bg-white rounded-full transition-transform ${trigger.active ? 'translate-x-3.5' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-6 mt-12">Notification Channels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Channel - ENABLED */}
        <div className="bg-[#161618] border border-[#1e1e20] p-8 rounded-lg flex flex-col justify-between hover:border-[#00D4AA44] transition-all group shadow-sm">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00D4AA10] rounded-xl border border-[#00D4AA22] text-[#00D4AA]">
                <Mail size={24}/>
              </div>
              <div>
                <h4 className="text-base font-bold text-white uppercase tracking-tight">Email Alerts</h4>
                <span className="text-[9px] font-black uppercase tracking-widest text-[#10b981]">Active & Operational</span>
              </div>
            </div>
            <div className="space-y-2 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
              <p className="flex justify-between border-b border-[#1e1e20] pb-2"><span>SMTP Host</span><span className="text-white">smtp.clearflow.security</span></p>
              <p className="flex justify-between border-b border-[#1e1e20] pb-2"><span>Sender</span><span className="text-white">alerts@ndr-system.local</span></p>
              <p className="flex justify-between border-b border-[#1e1e20] pb-2"><span>Recipient</span><span className="text-white text-right">soc-team@company.com</span></p>
            </div>
          </div>
          <div className="flex gap-2 pt-8">
            <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-[9px] font-black text-gray-400 rounded-xl hover:text-white uppercase tracking-widest transition-all">Test Email</button>
            <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-[9px] font-black text-gray-400 rounded-xl hover:text-white uppercase tracking-widest transition-all">Configure</button>
            <button className="flex-1 py-2.5 bg-[#e11d4810] border border-[#e11d4833] text-[9px] font-black text-[#e11d48] rounded-xl hover:bg-[#e11d4820] uppercase tracking-widest transition-all">Disable</button>
          </div>
        </div>

        {/* Other Channels - DISABLED */}
        {[
          { name: 'Slack Integration', icon: Slack },
          { name: 'PagerDuty', icon: Smartphone },
          { name: 'MS Teams', icon: MessageCircle },
          { name: 'Custom Webhook', icon: Link },
        ].map((chan, i) => (
          <div key={i} className="bg-[#161618] border border-[#1e1e20] p-8 rounded-lg flex items-center justify-between opacity-30 grayscale cursor-not-allowed">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#0c0c0e] rounded-xl border border-[#1e1e20] text-gray-600">
                <chan.icon size={24}/>
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-500 uppercase tracking-tight">{chan.name}</h4>
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600">Inactive</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#1e1e20] border border-[#333] text-[9px] font-black text-gray-700 rounded-lg uppercase tracking-widest pointer-events-none">Enable</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetection = () => (
    <div className="max-w-5xl animate-in fade-in duration-300">
      {Breadcrumb('Detection Config',
        <button className="bg-[#00D4AA] text-black px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all">Save Config</button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Detection Engine Settings">
          <div className="space-y-6">
            <div className="space-y-4">
              {[
                { label: 'Real-time detection enabled', checked: true },
                { label: 'Behavioral analysis enabled', checked: true },
                { label: 'ML-based anomaly detection', checked: true },
                { label: 'Threat intel enrichment (Requires Key)', checked: false },
              ].map((item, i) => (
                <label key={i} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-[11px] font-bold text-gray-400 group-hover:text-gray-200 transition-colors uppercase tracking-tight">{item.label}</span>
                  <div className={`w-10 h-5 rounded-full transition-colors relative flex items-center px-1 ${item.checked ? 'bg-[#00D4AA]' : 'bg-[#333]'}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-transform ${item.checked ? 'translate-x-4.5' : 'translate-x-0'}`} />
                  </div>
                </label>
              ))}
            </div>

            <div className="pt-6 border-t border-[#1e1e20] space-y-4">
              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Detection Mode</label>
              <div className="space-y-3">
                {[
                  { id: 'bal', label: 'Balanced (Recommended)', sub: 'Default optimization for most networks' },
                  { id: 'agg', label: 'Aggressive', sub: 'More alerts, fewer false negatives' },
                  { id: 'con', label: 'Conservative', sub: 'Fewer alerts, more false negatives' },
                ].map(mode => (
                  <label key={mode.id} className="flex items-start gap-4 p-3 bg-[#0c0c0e] rounded-xl border border-[#1e1e20] cursor-pointer hover:border-[#333] transition-all">
                    <input type="radio" name="det-mode" defaultChecked={mode.id === 'bal'} className="mt-1 accent-[#00D4AA]" />
                    <div>
                      <p className="text-[11px] font-bold text-white uppercase">{mode.label}</p>
                      <p className="text-[9px] text-gray-500 font-bold tracking-tighter">{mode.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#1e1e20] space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Confidence Threshold</label>
                <span className="text-xs font-black text-[#00D4AA]">70%</span>
              </div>
              <input type="range" className="w-full accent-[#00D4AA] h-1 bg-[#0c0c0e] rounded-full appearance-none" min="0" max="100" defaultValue="70" />
              <p className="text-[9px] text-gray-600 italic">Alerts below this score will be suppressed from the main feed.</p>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Baseline Configuration">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Learning Period</label>
                  <select className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2 text-[11px] text-white outline-none">
                    <option>7 Days</option>
                    <option>14 Days</option>
                    <option>30 Days</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest pl-1">Update Frequency</label>
                  <select className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl px-4 py-2 text-[11px] text-white outline-none">
                    <option>Every 4 hours</option>
                    <option>Every 12 hours</option>
                    <option>Daily</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-[#0c0c0e] rounded-xl border border-[#1e1e20] flex items-center justify-between">
                <div><p className="text-[9px] text-gray-600 uppercase font-black tracking-widest">Global Coverage</p><p className="text-sm font-black text-white">2.3M IPs | 850K Domains</p></div>
                <CheckCircle2 className="text-[#10b981]" size={20} />
              </div>
              <div className="space-y-3">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="accent-[#00D4AA]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Auto-update baselines</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="accent-[#00D4AA]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Alert on baseline deviations</span>
                 </label>
              </div>
              <button className="bg-[#1e1e20] border border-[#333] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2a2a2c] w-full">Save Baseline Settings</button>
            </div>
          </Card>

          <Card title="ML Model Settings">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-white uppercase tracking-tight">Model Version: v2.4.1 (Latest)</p>
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Last Trained: 2 days ago</p>
                </div>
                <div className="p-2 bg-[#00D4AA10] rounded-lg text-[#00D4AA]"><Cpu size={18} /></div>
              </div>
              <div className="space-y-3">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="accent-[#00D4AA]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Auto-retrain models</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" defaultChecked className="accent-[#00D4AA]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Include feedback loop (analyst verdicts)</span>
                 </label>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-[#1e1e20] border border-[#333] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2a2a2c]">Trigger Training</button>
                <button className="flex-1 py-3 bg-[#1e1e20] border border-[#333] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2a2a2c]">View Performance</button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card title="Threat Intelligence">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">External Feeds</label>
            <div className="space-y-4">
              {[
                { name: 'AlienVault OTX', checked: true },
                { name: 'Abuse.ch', checked: true },
                { name: 'VirusTotal (Requires API Key)', checked: false },
                { name: 'Custom Feed URL', checked: false },
              ].map((feed, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked={feed.checked} className="accent-[#00D4AA]" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase group-hover:text-gray-200">{feed.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-5 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-600 uppercase">UPDATE FREQUENCY</span><span className="text-xs font-black text-white">Every 6 Hours</span></div>
              <div className="flex justify-between items-center"><span className="text-[10px] font-black text-gray-600 uppercase">LAST UPDATE</span><span className="text-xs font-black text-[#10b981]">45M AGO ✓</span></div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-3 bg-[#1e1e20] border border-[#333] text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#2a2a2c]">Configure Feeds</button>
              <button className="flex-1 py-3 bg-[#00D4AA] text-black text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-[#059669] shadow-lg shadow-[#00D4AA11]">Force Update</button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderStorage = () => (
    <div className="max-w-6xl animate-in fade-in duration-300">
      {Breadcrumb('Storage & Retention', 
        <button className="bg-[#00D4AA] text-black px-6 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all flex items-center gap-2">
          <Save size={14}/> Save Lifecycle
        </button>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Hot Storage (Recent Data)">
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <p className="text-xl font-black text-white tracking-tighter">2.3 <span className="text-sm text-gray-600">TB</span></p>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">23% Utilization</p>
            </div>
            <div className="h-2 w-full bg-[#0c0c0e] rounded-full overflow-hidden">
               <div className="h-full bg-[#00D4AA] shadow-[0_0_10px_rgba(0,212,170,0.4)]" style={{ width: '23%' }} />
            </div>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Path</p><p className="text-xs font-bold text-gray-400 font-mono">/data/hot</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Growth Rate</p><p className="text-xs font-bold text-white">85 GB/day</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Days Until Full</p><p className="text-xs font-bold text-[#10b981]">~90 Days</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Retention</p><p className="text-xs font-bold text-white">45 Days</p></div>
            </div>
            <div className="pt-4 flex gap-2">
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white">Configure</button>
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white">View Details</button>
            </div>
          </div>
        </Card>

        <Card title="Cold Storage (Historical Archive)">
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <p className="text-xl font-black text-white tracking-tighter">18.5 <span className="text-sm text-gray-600">TB</span></p>
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">S3-compatible (MinIO)</p>
            </div>
            <div className="h-2 w-full bg-[#0c0c0e] rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 opacity-60" style={{ width: '65%' }} />
            </div>
            <div className="grid grid-cols-2 gap-y-4 pt-2">
               <div><p className="text-[9px] font-black text-gray-400 font-mono">ndr-archive</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Compression</p><p className="text-xs font-bold text-[#10b981]">Parquet (8:1)</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Retention</p><p className="text-xs font-bold text-white">365 Days</p></div>
               <div><p className="text-[9px] font-black text-gray-700 uppercase mb-0.5">Retrieval Time</p><p className="text-xs font-bold text-white">2.3s p50</p></div>
            </div>
            <div className="pt-4 flex gap-2">
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white">Configure</button>
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-gray-400 text-[10px] font-black rounded-xl uppercase tracking-widest hover:text-white">Test Connection</button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Retention Policies by Log Type" headerAction={<button className="text-[10px] font-black text-[#00D4AA] uppercase tracking-widest hover:underline">+ Add Custom Policy</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#0c0c0e]/50 border-b border-[#1e1e20]">
              <tr>
                <th className="px-6 py-4 font-black">Log Type</th>
                <th className="px-6 py-4 font-black">Hot (Days)</th>
                <th className="px-6 py-4 font-black">Cold (Days)</th>
                <th className="px-6 py-4 font-black">Total Size</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
              {[
                { type: 'zeek-conn', hot: 45, cold: 365, size: '1.4 TB' },
                { type: 'zeek-dns', hot: 45, cold: 365, size: '1.2 TB' },
                { type: 'zeek-http', hot: 30, cold: 180, size: '810 GB' },
                { type: 'zeek-ssl', hot: 45, cold: 365, size: '650 GB' },
                { type: 'alerts', hot: 90, cold: 730, size: '45 GB' },
                { type: 'flows', hot: 30, cold: 180, size: '2.8 TB' },
              ].map(row => (
                <tr key={row.type} className="hover:bg-[#1e1e20] transition-colors">
                  <td className="px-6 py-4 text-white font-bold uppercase">{row.type}</td>
                  <td className="px-6 py-4 text-gray-400">{row.hot}</td>
                  <td className="px-6 py-4 text-gray-500">{row.cold}</td>
                  <td className="px-6 py-4 text-gray-400 font-bold">{row.size}</td>
                  <td className="px-6 py-4 text-right"><button className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-widest">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderApiKeys = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 py-20">
      {Breadcrumb('API Keys')}
      
      <div className="flex flex-col items-center justify-center text-center space-y-8 bg-[#161618] border border-[#1e1e20] rounded-[40px] p-20 shadow-2xl relative overflow-hidden group">
        <div className="absolute -inset-10 bg-[#00D4AA] opacity-5 blur-[80px] rounded-full group-hover:opacity-10 transition-opacity" />
        
        <div className="w-20 h-20 rounded-lg bg-[#0c0c0e] border border-[#1e1e20] flex items-center justify-center text-[#00D4AA] relative z-10">
          <Key size={32} />
        </div>
        
        <div className="space-y-4 relative z-10">
          <h3 className="text-xl font-black text-white tracking-tighter uppercase">API Integration Engine</h3>
          <p className="text-[#00D4AA] text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-2">
            <Sparkles size={14} /> updatesoon <Sparkles size={14} />
          </p>
          <p className="text-gray-500 text-sm font-medium max-w-md mx-auto leading-relaxed">
            The core authentication and API key management module is currently being optimized for high-performance scale. 
            This module will provide fine-grained programmatic access to the NDR telemetry stream.
          </p>
        </div>

        <div className="pt-8 relative z-10">
          <button className="bg-[#1e1e20] border border-[#333] px-10 py-3 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3 hover:text-white transition-all">
            <Lock size={14} /> Module Locked
          </button>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="max-w-full animate-in fade-in duration-300">
      {Breadcrumb('Audit Logs', 
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-[#1e1e20] border border-[#333] px-4 py-1.5 rounded-lg text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest"><Download size={14}/> Export</button>
          <button className="p-1.5 bg-[#1e1e20] border border-[#333] rounded-lg text-gray-500 hover:text-white transition-all"><RefreshCcw size={16}/></button>
        </div>
      )}
      
      <div className="bg-[#161618] border border-[#1e1e20] rounded-lg p-6 mb-8 shadow-xl">
        <div className="flex flex-wrap gap-4 items-center">
           <div className="relative group flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00D4AA]" />
              <input type="text" placeholder="Search by user, action, resource..." className="w-full bg-[#0c0c0e] border border-[#1e1e20] rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-[#00D4AA]" />
           </div>
           <select className="bg-[#1e1e20] border border-[#333] rounded-xl px-4 py-2 text-[10px] font-black text-gray-400 outline-none uppercase tracking-widest">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
           </select>
           <select className="bg-[#1e1e20] border border-[#333] rounded-xl px-4 py-2 text-[10px] font-black text-gray-400 outline-none uppercase tracking-widest">
              <option>All Users</option>
              <option>Administrator</option>
              <option>Analyst-SC</option>
           </select>
           <button className="bg-[#00D4AA] text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#059669] transition-all">Apply Filters</button>
        </div>
      </div>

      <div className="bg-[#161618] border border-[#1e1e20] rounded-lg overflow-hidden shadow-2xl">
         <table className="w-full text-left text-[11px] font-mono border-collapse">
            <thead className="text-[9px] text-gray-600 uppercase tracking-widest bg-[#1c1c1e]/50 border-b border-[#1e1e20]">
               <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4 text-center">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e20]">
               {[
                  { time: '2024-01-10 14:23:12', user: 'admin', action: 'Config Changed', resource: 'Zeek Sensor', status: 'success' },
                  { time: '2024-01-10 14:20:45', user: 'alice', action: 'Detection Edit', resource: 'Rule-1234', status: 'success' },
                  { time: '2024-01-10 14:15:22', user: 'bob', action: 'Login', resource: '-', status: 'success' },
                  { time: '2024-01-10 14:10:01', user: 'admin', action: 'Integration Add', resource: 'Palo Alto FW', status: 'success' },
               ].map((log, i) => (
                  <React.Fragment key={i}>
                    <tr 
                      onClick={() => setExpandedAuditRow(expandedAuditRow === i ? null : i)}
                      className="hover:bg-[#1e1e20] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 text-gray-500">{log.time}</td>
                      <td className="px-6 py-4 text-[#00D4AA] font-bold">{log.user}</td>
                      <td className="px-6 py-4 text-gray-300 uppercase tracking-tight font-black text-[10px]">{log.action}</td>
                      <td className="px-6 py-4 text-gray-500">{log.resource}</td>
                      <td className="px-6 py-4 text-center">
                        {log.status === 'success' ? <CheckCircle2 size={16} className="text-[#10b981] mx-auto"/> : <XCircle size={16} className="text-[#e11d48] mx-auto"/>}
                      </td>
                    </tr>
                    {expandedAuditRow === i && (
                       <tr className="bg-[#0c0c0e]">
                          <td colSpan={5} className="px-10 py-8 border-l-2 border-[#00D4AA]">
                             <div className="grid grid-cols-2 gap-12 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-4">
                                   <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Metadata</p>
                                   <div className="space-y-2 text-[10px]">
                                      <p className="flex justify-between border-b border-[#1e1e20] pb-2"><span className="text-gray-500">IP Address</span><span className="text-white">192.168.1.100</span></p>
                                      <p className="flex justify-between border-b border-[#1e1e20] pb-2"><span className="text-gray-500">User Agent</span><span className="text-white">Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...</span></p>
                                   </div>
                                </div>
                             </div>
                          </td>
                       </tr>
                    )}
                  </React.Fragment>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );

  const renderSystem = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      {Breadcrumb('License & System')}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="License Information">
          <div className="space-y-8 py-2">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">ClearFlow X NDR Platform</h4>
              <p className="text-[10px] text-[#00D4AA] font-black uppercase tracking-widest mt-1">Elastic License 2.0</p>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Permitted Uses:</p>
              <div className="space-y-2">
                {[
                  'Personal and internal organizational use',
                  'Modify and study source code',
                  'Educational and research purposes',
                  'Security testing and analysis'
                ].map(use => (
                  <div key={use} className="flex items-center gap-3">
                    <CheckCircle2 size={14} className="text-[#10b981] flex-shrink-0" />
                    <span className="text-xs text-gray-400 font-medium">{use}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Prohibited Uses:</p>
              <div className="space-y-2">
                {[
                  'Providing as managed/SaaS service',
                  'Commercial hosting or monitoring services',
                  'Removing or altering license terms',
                  'Using to compete directly with product'
                ].map(use => (
                  <div key={use} className="flex items-center gap-3">
                    <XCircle size={14} className="text-[#e11d48]/60 flex-shrink-0" />
                    <span className="text-xs text-gray-500 font-medium">{use}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-[#1e1e20]">
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-xl hover:text-white transition-all">View Full Text</button>
              <button className="flex-1 py-2.5 bg-[#1e1e20] border border-[#333] text-[9px] font-black text-gray-400 uppercase tracking-widest rounded-xl hover:text-white transition-all">Documentation</button>
            </div>
          </div>
        </Card>

        <Card title="System Information">
          <div className="space-y-8 py-2">
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">ClearFlow X Core</h4>
              <div className="flex gap-4 mt-2">
                <div><p className="text-[8px] font-black text-gray-700 uppercase">Version</p><p className="text-xs font-mono text-[#00D4AA] font-black">v2.4.1</p></div>
                <div><p className="text-[8px] font-black text-gray-700 uppercase">Build</p><p className="text-xs font-mono text-gray-400 font-bold">847</p></div>
                <div><p className="text-[8px] font-black text-gray-700 uppercase">Released</p><p className="text-xs text-gray-400 font-bold">2024-01-10</p></div>
              </div>
            </div>

            <div className="p-5 bg-[#0c0c0e] rounded-lg border border-[#1e1e20] flex items-center justify-between">
              <div><p className="text-[9px] font-black text-gray-600 uppercase mb-0.5 tracking-widest">Platform Uptime</p><p className="text-sm font-black text-white">45 days 3 hours 12m</p></div>
              <div className="w-8 h-8 rounded-lg bg-[#10b98110] text-[#10b981] flex items-center justify-center border border-[#10b98122]"><Activity size={16}/></div>
            </div>

            <div className="space-y-4">
              <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Stack Components:</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Zeek Engine', ver: 'v6.0.3' },
                  { name: 'Kafka Streaming', ver: 'v3.4.0' },
                  { name: 'Flink Processing', ver: 'v1.18.0' },
                  { name: 'PostgreSQL', ver: 'v15.5' },
                ].map(comp => (
                  <div key={comp.name} className="flex justify-between items-center p-3 bg-[#0c0c0e] rounded-xl border border-[#1e1e20]">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">• {comp.name}</span>
                    <span className="text-[9px] font-mono text-gray-600 font-black">{comp.ver}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-[#1e1e20] border border-[#333] text-[10px] font-black text-white rounded-xl uppercase tracking-widest hover:bg-[#2a2a2c] flex items-center justify-center gap-3 transition-all">
              <RefreshCcw size={16}/> Check for Updates
            </button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'settings-profile': return renderProfile();
      case 'settings-notifications': return renderNotifications();
      case 'settings-detection': return renderDetection();
      case 'settings-storage': return renderStorage();
      case 'settings-api-keys': return renderApiKeys();
      case 'settings-audit': return renderAudit();
      case 'settings-system': return renderSystem();
      default: return (
        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 opacity-30">
          <div className="p-8 bg-[#161618] rounded-[40px] border border-[#1e1e20]"><Settings size={48} className="text-gray-600" /></div>
          <div>
              <h3 className="text-xl font-black text-gray-500 uppercase tracking-[0.2em]">{currentView.replace('settings-', '').replace('-', ' ')}</h3>
              <p className="text-xs text-gray-600 mt-2 uppercase font-black tracking-widest">Settings module active. Administrative privileges confirmed.</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-32 px-4 md:px-0">
      {renderContent()}
    </div>
  );
};

export default SettingsPage;
