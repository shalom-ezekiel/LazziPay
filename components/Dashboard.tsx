
import React, { useMemo, useState } from 'react';
import { PlanType, IndustryType } from '../types';
import { usePartner } from '../contexts/PartnerContext';
import { ALL_INDUSTRIES, INDUSTRY_REGISTRY } from '../config/industryConfig';
import { DEMO_PARTNERS } from '../config/partnerConfig';
import { 
  Home, Eye, MessageSquare, Users, AlertTriangle, PlayCircle, 
  Ticket, Heart, Radio, Activity, ExternalLink, 
  ChevronDown, UserCircle, Zap, ShieldAlert, LogOut,
  Mic, MousePointer2, ServerCrash, CheckCircle2,
  Code, Palette, Settings, Copy, Check, Globe, Key
} from 'lucide-react';

interface DashboardProps {
  plan: PlanType;
  onLogout: () => void;
}

const LazziLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 relative overflow-hidden group">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[5px] border-b-[5px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg shadow-sm"></div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ plan, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('Overview');
  const [copied, setCopied] = useState(false);
  const { config, updateConfig, switchIndustry } = usePartner();

  const isEnterprise = plan === PlanType.ENTERPRISE;
  const isPAYG = plan === PlanType.PAYG;

  const metrics = useMemo(() => {
    if (plan === PlanType.CORE) return { allSessions: 92, activeSessions: 40, closedSessions: 52, activeCustomers: 107, voiceMismatch: 0, apiErrors: 0, totalPageViews: "8,651", usersAtRisk: 0 };
    if (isPAYG) return { allSessions: 1420, activeSessions: 84, closedSessions: 1336, activeCustomers: 892, voiceMismatch: 4, apiErrors: 12, totalPageViews: "142.9K", usersAtRisk: 2 };
    return { allSessions: "84,201", activeSessions: 1420, closedSessions: "82,781", activeCustomers: "14.2K", voiceMismatch: 12, apiErrors: 42, totalPageViews: "2.4M", usersAtRisk: 14 };
  }, [plan]);

  const sdkSnippet = `<script src="https://cdn.lazzi.ai/sdk/v1/lazzi.js"></script>
<script>
  Lazzi.init({
    apiKey: "lz_live_${config.partnerId.slice(0, 8)}...",
    assistantName: "${config.assistantName}",
    industry: "${config.industry}",
    brandColors: {
      primary: "${config.brandColors.primary}",
      secondary: "${config.brandColors.secondary}"
    },
    onSensitiveAction: function(action) {
      // Handle biometric verification here
      // Then call action.confirm() or action.cancel()
    }
  });
</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(sdkSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'SDK Setup':
        return (
          <div className="max-w-4xl">
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">SDK Integration</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Add Lazzi to your app in under 30 minutes. Copy the snippet below.</p>
            
            <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-2xl mb-8 relative group">
              <div className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">HTML / JavaScript</span>
                </div>
                <button onClick={copySnippet} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-slate-800">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="p-6 text-sm text-blue-400 font-mono overflow-x-auto leading-relaxed"><code>{sdkSnippet}</code></pre>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Code size={20} />, title: 'Step 1', desc: 'Paste the snippet in your HTML' },
                { icon: <Palette size={20} />, title: 'Step 2', desc: 'Customize branding & industry' },
                { icon: <Zap size={20} />, title: 'Step 3', desc: 'Handle sensitive action callbacks' },
              ].map((step, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                  <div className="text-blue-600 mb-3">{step.icon}</div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{step.title}</h4>
                  <p className="text-slate-500 text-xs">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
              <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2"><Key size={16} /> Your API Key</h4>
              <div className="flex items-center gap-3">
                <code className="flex-1 bg-white px-4 py-2.5 rounded-xl text-sm font-mono text-slate-600 border border-blue-200">lz_live_{config.partnerId.slice(0, 12)}•••••••••</code>
                <button className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-700 transition">Regenerate</button>
              </div>
            </div>
          </div>
        );

      case 'Brand Config':
        return (
          <div className="max-w-3xl">
            <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Brand Configuration</h3>
            <p className="text-slate-500 text-sm mb-8 font-medium">Customize how Lazzi appears in your app.</p>

            <div className="space-y-6">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Assistant Name</label>
                <input
                  type="text"
                  value={config.assistantName}
                  onChange={e => updateConfig({ assistantName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition"
                  placeholder="e.g. Acme AI, Trivot..."
                />
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Industry</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ALL_INDUSTRIES.map(industry => {
                    const ic = INDUSTRY_REGISTRY[industry];
                    return (
                      <button
                        key={industry}
                        onClick={() => switchIndustry(industry)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          config.industry === industry
                            ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <span className="text-xl mb-1 block">{ic.icon}</span>
                        <p className="text-xs font-bold text-slate-800">{ic.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Brand Colors</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block">Primary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.brandColors.primary}
                        onChange={e => updateConfig({ brandColors: { ...config.brandColors, primary: e.target.value } })}
                        className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500">{config.brandColors.primary}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 mb-1 block">Secondary</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.brandColors.secondary}
                        onChange={e => updateConfig({ brandColors: { ...config.brandColors, secondary: e.target.value } })}
                        className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                      />
                      <span className="text-xs font-mono text-slate-500">{config.brandColors.secondary}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border border-slate-200 rounded-2xl">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Welcome Message</label>
                <textarea
                  value={config.welcomeMessage}
                  onChange={e => updateConfig({ welcomeMessage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition resize-none h-20"
                />
              </div>

              {/* Live Preview */}
              <div className="p-6 rounded-2xl border border-slate-200" style={{ backgroundColor: config.brandColors.background }}>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Live Preview</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${config.brandColors.primary}, ${config.brandColors.secondary})` }}>
                    <MessageSquare size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{config.assistantName}</p>
                    <p className="text-white/40 text-[10px]">{INDUSTRY_REGISTRY[config.industry]?.icon} {INDUSTRY_REGISTRY[config.industry]?.name}</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl text-white/80 text-sm" style={{ backgroundColor: `${config.brandColors.primary}22` }}>
                  {config.welcomeMessage}
                </div>
              </div>
            </div>
          </div>
        );

      default: // Overview
        return (
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <CuoralCard label="All Sessions" value={metrics.allSessions} icon={<Activity size={14} />} color="bg-slate-300" />
              <CuoralCard label="Active Session" value={metrics.activeSessions} icon={<PlayCircle size={14} />} color="bg-emerald-500" />
              <CuoralCard label="Closed Session" value={metrics.closedSessions} icon={<CheckCircle2 size={14} />} color="bg-slate-900" />
              <CuoralCard label="Active Customers" value={metrics.activeCustomers} icon={<Users size={14} />} color="bg-blue-500" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <CuoralCard label="Voice Intent Mismatch" value={metrics.voiceMismatch} icon={<Mic size={14} />} bgClass="bg-rose-50/30" valueClass={Number(metrics.voiceMismatch) > 0 ? "text-rose-600" : "text-slate-900"} color="bg-rose-500" />
              <CuoralCard label="API Issues Detected" value={metrics.apiErrors} icon={<ServerCrash size={14} />} bgClass="bg-rose-50/30" valueClass={Number(metrics.apiErrors) > 0 ? "text-rose-600" : "text-slate-900"} color="bg-rose-500" />
              <CuoralCard label="Total API Calls" value={metrics.totalPageViews} icon={<MousePointer2 size={14} />} bgClass="bg-blue-50/30" valueClass="text-blue-600" color="bg-blue-200" />
              <CuoralCard label="Customers at Risk (24h)" value={metrics.usersAtRisk} icon={<ShieldAlert size={14} />} bgClass="bg-rose-50/30" valueClass={Number(metrics.usersAtRisk) > 0 ? "text-rose-600" : "text-slate-900"} color="bg-rose-500" />
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-blue-50/20 border border-blue-100 rounded-[2.5rem] p-10 min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-500 group">
                <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Pages Most Likely to Frustrate Users (Last 24h)</h4>
                <p className="text-slate-400 text-sm italic">No intent mismatches detected on high-value pages in the last 24 hours.</p>
              </div>
              <div className="bg-blue-50/20 border border-blue-100 rounded-[2.5rem] p-10 min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-500 group">
                <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">At-Risk Customers (Error Volume - Last 24h)</h4>
                <p className="text-slate-400 text-sm italic">No customers with critical voice friction to display.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 mb-2">
          <LazziLogo />
          <div>
            <span className="font-black text-slate-800 text-xl tracking-tighter">LazziPay</span>
            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Platform</p>
          </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-4">
          <MenuSection title="HOME">
            <MenuItem icon={<Home size={18} />} label="Overview" active={activeMenu === 'Overview'} onClick={() => setActiveMenu('Overview')} />
            <MenuItem icon={<Eye size={18} />} label="Visitors Feed" active={activeMenu === 'Visitors Feed'} onClick={() => setActiveMenu('Visitors Feed')} />
          </MenuSection>
          <MenuSection title="SDK & INTEGRATION">
            <MenuItem icon={<Code size={18} />} label="SDK Setup" active={activeMenu === 'SDK Setup'} onClick={() => setActiveMenu('SDK Setup')} />
            <MenuItem icon={<Palette size={18} />} label="Brand Config" active={activeMenu === 'Brand Config'} onClick={() => setActiveMenu('Brand Config')} />
            <MenuItem icon={<Globe size={18} />} label="Industry" active={activeMenu === 'Industry'} onClick={() => setActiveMenu('Brand Config')} />
          </MenuSection>
          <MenuSection title="CUSTOMER SUCCESS">
            <MenuItem icon={<MessageSquare size={18} />} label="Conversations" active={activeMenu === 'Conversations'} onClick={() => setActiveMenu('Conversations')} />
            <MenuItem icon={<Users size={18} />} label="Customers" active={activeMenu === 'Customers'} onClick={() => setActiveMenu('Customers')} />
            <MenuItem icon={<AlertTriangle size={18} />} label="Issue & Alerts" active={activeMenu === 'Issue & Alerts'} onClick={() => setActiveMenu('Issue & Alerts')} />
            <MenuItem icon={<PlayCircle size={18} />} label="Session Replays" active={activeMenu === 'Session Replays'} onClick={() => setActiveMenu('Session Replays')} />
            <MenuItem icon={<Ticket size={18} />} label="Ticketing" active={activeMenu === 'Ticketing'} onClick={() => setActiveMenu('Ticketing')} />
            <MenuItem icon={<Heart size={18} />} label="Customer Friction" active={activeMenu === 'Customer Friction'} onClick={() => setActiveMenu('Customer Friction')} />
          </MenuSection>
          <MenuSection title="ENGAGEMENT">
            <MenuItem icon={<Radio size={18} />} label="Broadcast" active={activeMenu === 'Broadcast'} onClick={() => setActiveMenu('Broadcast')} />
          </MenuSection>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Plan: {plan}</p>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <p className="text-xs font-bold text-slate-800 mb-3">Admin Console</p>
            <button className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-xl text-[10px] font-bold hover:bg-slate-100 transition shadow-sm active:scale-95 transform">Manage Billing</button>
            <button onClick={onLogout} className="w-full mt-2 text-slate-500 py-2 rounded-xl text-[10px] font-bold hover:bg-white hover:text-slate-700 transition flex items-center justify-center gap-1.5 active:scale-95 transform">
              <LogOut size={12} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">{activeMenu}</h2>
            <p className="text-xs text-slate-400 font-medium">Welcome to Lazzi Platform</p>
          </div>
          <div className="flex items-center gap-6">
            <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 active:scale-95 transform">
              <ExternalLink size={16} /> View Guide
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                <UserCircle size={24} />
              </div>
              <div className="flex items-center gap-1 cursor-pointer group">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{config.assistantName}</p>
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="pt-6 pb-2">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 px-4">{title}</p>
    <div className="space-y-1">{children}</div>
  </div>
);

const MenuItem = ({ icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 transform active:scale-95 ${
      active ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    {label}
  </button>
);

const CuoralCard = ({ label, value, icon, color = 'bg-slate-200', bgClass = 'bg-white', valueClass = 'text-slate-900' }: any) => (
  <div className={`${bgClass} border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}>
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${color} transition-all duration-500 group-hover:w-2`}></div>
    <div className="flex items-center gap-3 mb-6">
      <div className="p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-white group-hover:text-blue-600 transition-all duration-500">{icon}</div>
      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
    <p className={`text-4xl font-black tracking-tighter transition-all duration-500 ${valueClass} group-hover:scale-110 origin-left`}>{value}</p>
  </div>
);

export default Dashboard;
