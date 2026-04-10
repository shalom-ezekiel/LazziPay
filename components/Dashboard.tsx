import React, { useMemo, useState } from 'react';
import { PlanType } from '../types';
import { 
  Home, Eye, MessageSquare, Users, AlertTriangle, PlayCircle, 
  Ticket, Heart, Radio, Activity, Search, Bell, ExternalLink, 
  ChevronDown, UserCircle, LayoutDashboard, Zap, ShieldAlert, LogOut,
  Mic, MousePointer2, AlertCircle, ServerCrash, CheckCircle2
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

  const isEnterprise = plan === PlanType.ENTERPRISE;
  const isPAYG = plan === PlanType.PAYG;
  const isCore = plan === PlanType.CORE;

  const metrics = useMemo(() => {
    if (isCore) {
      return {
        allSessions: 92,
        activeSessions: 40,
        closedSessions: 52,
        activeCustomers: 107,
        voiceMismatch: 0,
        apiErrors: 0,
        totalPageViews: "8,651",
        usersAtRisk: 0
      };
    }
    if (isPAYG) {
       return {
        allSessions: 1420,
        activeSessions: 84,
        closedSessions: 1336,
        activeCustomers: 892,
        voiceMismatch: 4,
        apiErrors: 12,
        totalPageViews: "142.9K",
        usersAtRisk: 2
      };
    }
    return {
      allSessions: "84,201",
      activeSessions: 1420,
      closedSessions: "82,781",
      activeCustomers: "14.2K",
      voiceMismatch: 12,
      apiErrors: 42,
      totalPageViews: "2.4M",
      usersAtRisk: 14
    };
  }, [plan]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 mb-2">
           <LazziLogo />
           <div>
             <span className="font-black text-slate-800 text-xl tracking-tighter">LazziPay</span>
             <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest leading-none">Accessibility</p>
           </div>
        </div>

        <nav className="flex-1 px-4 overflow-y-auto space-y-4">
          <MenuSection title="HOME">
            <MenuItem icon={<Home size={18} />} label="Overview" active={activeMenu === 'Overview'} onClick={() => setActiveMenu('Overview')} />
            <MenuItem icon={<Eye size={18} />} label="Visitors Feed" active={activeMenu === 'Visitors Feed'} onClick={() => setActiveMenu('Visitors Feed')} />
          </MenuSection>

          <MenuSection title="CUSTOMER SUCCESS">
            <MenuItem icon={<MessageSquare size={18} />} label="Conversations" active={activeMenu === 'Conversations'} onClick={() => setActiveMenu('Conversations')} />
            <MenuItem icon={<Users size={18} />} label="Customers" active={activeMenu === 'Customers'} onClick={() => setActiveMenu('Customers')} />
            <MenuItem icon={<AlertTriangle size={18} />} label="Issue & Alerts" active={activeMenu === 'Issue & Alerts'} onClick={() => setActiveMenu('Issue & Alerts')} />
            <MenuItem icon={<PlayCircle size={18} />} label="Session Replays" active={activeMenu === 'Session Replays'} onClick={() => setActiveMenu('Session Replays')} />
            <MenuItem icon={<Ticket size={18} />} label="Ticketing" active={activeMenu === 'Ticketing'} onClick={() => setActiveMenu('Ticketing')} />
            <MenuItem icon={<Heart size={18} />} label="Customer Friction" active={activeMenu === 'Customer Friction'} onClick={() => setActiveMenu('Customer Friction')} />
          </MenuSection>

          <MenuSection title="CUSTOMER ENGAGEMENT">
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
              <button
                onClick={onLogout}
                className="w-full mt-2 text-slate-500 py-2 rounded-xl text-[10px] font-bold hover:bg-white hover:text-slate-700 transition flex items-center justify-center gap-1.5 active:scale-95 transform"
              >
                <LogOut size={12} /> Sign out
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">Home</h2>
            <p className="text-xs text-slate-400 font-medium">Welcome to lazzi pay</p>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 active:scale-95 transform">
              <ExternalLink size={16} /> View Guide
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shadow-inner group cursor-pointer overflow-hidden">
                 <UserCircle size={24} className="group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-center gap-1 cursor-pointer group">
                <p className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">LazziPay</p>
                <ChevronDown size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">Overview</h3>

            {/* Top Row: General Session Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <CuoralCard label="All Sessions" value={metrics.allSessions} icon={<Activity size={14} />} color="bg-slate-300" />
              <CuoralCard label="Active Session" value={metrics.activeSessions} icon={<PlayCircle size={14} />} color="bg-emerald-500" />
              <CuoralCard label="Closed Session" value={metrics.closedSessions} icon={<CheckCircle2 size={14} />} color="bg-slate-900" />
              <CuoralCard label="Active Customers" value={metrics.activeCustomers} icon={<Users size={14} />} color="bg-blue-500" />
            </div>

            {/* Second Row: Issues & Usage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <CuoralCard 
                label="Voice Intent Mismatch" 
                value={metrics.voiceMismatch} 
                icon={<Mic size={14} />} 
                bgClass="bg-rose-50/30"
                valueClass={metrics.voiceMismatch > 0 ? "text-rose-600" : "text-slate-900"}
                color="bg-rose-500"
              />
              <CuoralCard 
                label="API Issues Detected" 
                value={metrics.apiErrors} 
                icon={<ServerCrash size={14} />} 
                bgClass="bg-rose-50/30"
                valueClass={metrics.apiErrors > 0 ? "text-rose-600" : "text-slate-900"}
                color="bg-rose-500"
              />
              <CuoralCard 
                label="Total API Calls" 
                value={metrics.totalPageViews} 
                icon={<MousePointer2 size={14} />} 
                bgClass="bg-blue-50/30"
                valueClass="text-blue-600"
                color="bg-blue-200"
              />
              <CuoralCard 
                label="Customers at Risk (last 24h)" 
                value={metrics.usersAtRisk} 
                icon={<ShieldAlert size={14} />} 
                bgClass="bg-rose-50/30"
                valueClass={metrics.usersAtRisk > 0 ? "text-rose-600" : "text-slate-900"}
                color="bg-rose-500"
              />
            </div>

            {/* Intelligence Section */}
            <div className="grid lg:grid-cols-2 gap-8">
               <div className="bg-blue-50/20 border border-blue-100 rounded-[2.5rem] p-10 min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-500 group">
                  <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Pages Most Likely to Frustrate Users (Last 24h)</h4>
                  <p className="text-slate-400 text-sm italic">No intent mismatches detected on high-value transfer pages in the last 24 hours.</p>
               </div>
               <div className="bg-blue-50/20 border border-blue-100 rounded-[2.5rem] p-10 min-h-[220px] flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-500 group">
                  <h4 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">At-Risk Customers (Error Volume - Last 24h)</h4>
                  <p className="text-slate-400 text-sm italic">No customers with critical voice friction to display – please enable deep intelligence.</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="pt-6 pb-2">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 px-4">{title}</p>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const MenuItem = ({ icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all duration-300 transform active:scale-95 ${
      active 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}>{icon}</span>
    {label}
  </button>
);

const CuoralCard = ({ label, value, icon, color = 'bg-slate-200', bgClass = 'bg-white', valueClass = 'text-slate-900' }: any) => (
  <div className={`${bgClass} border border-slate-100 rounded-2xl p-8 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}>
    {/* Colored indicator bar on left */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${color} transition-all duration-500 group-hover:w-2`}></div>
    
    <div className="flex items-center gap-3 mb-6">
       <div className={`p-2 rounded-xl bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-white group-hover:text-blue-600 transition-all duration-500`}>
          {icon}
       </div>
       <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide group-hover:text-slate-900 transition-colors">{label}</span>
    </div>
    
    <p className={`text-4xl font-black tracking-tighter transition-all duration-500 ${valueClass} group-hover:scale-110 origin-left`}>{value}</p>
  </div>
);

export default Dashboard;
