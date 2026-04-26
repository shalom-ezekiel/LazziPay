
import React, { useState } from 'react';
import { PlanType } from '../types';
import { DEMO_PARTNERS } from '../config/partnerConfig';
import { INDUSTRY_REGISTRY } from '../config/industryConfig';
import { 
  CheckCircle2, ArrowRight, Zap, Cpu, 
  Shield, MessageSquare, Activity,
  Mic, Code, Clock, Globe,
  Building2, PiggyBank, MousePointerClick
} from 'lucide-react';

interface LandingProps {
  onPlanSelected: (plan: PlanType) => void;
}

const LazziLogo = () => (
  <div className="w-9 h-9 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 relative overflow-hidden group hover:rotate-6 transition-transform">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-4 h-5 border-l-[4px] border-b-[4px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg shadow-sm"></div>
    </div>
  </div>
);

const DashboardPreview = () => (
  <div className="mt-12 w-full max-w-5xl mx-auto perspective-1000 px-4">
    <div className="bg-white rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200 overflow-hidden transform hover:-rotate-x-1 transition-transform duration-700">
      <div className="flex overflow-hidden bg-slate-50">
        <img src="/images/Dashboard.png" alt="Lazzi Dashboard Preview" className="w-full h-auto object-cover block" />
      </div>
    </div>
  </div>
);

const financeDemoData: Record<string, { icon: React.ReactNode; color: string; label: string; phrases: string[] }> = {
  banking: { icon: <Building2 size={24} />, color: '#2D73E0', label: 'Banking', phrases: ["What's my balance?", "Transfer ₦10,000 to Solomon", "Block my ATM card"] },
  savings: { icon: <PiggyBank size={24} />, color: '#22C55E', label: 'Savings', phrases: ["How much have I saved?", "Deposit ₦50,000", "What's my interest rate?"] },
  payments: { icon: <Zap size={24} />, color: '#8B5CF6', label: 'Payments', phrases: ["Pay my electricity bill", "Send money to Tosin", "Pay ₦5,000 for data"] },
};

const Landing: React.FC<LandingProps> = ({ onPlanSelected }) => {
  const [activeUseCase, setActiveUseCase] = useState<string>('banking');

  const integrations = [
    "Arcline", "Vantage", "NovaPay", "Trivot", "Savora", "Streamline", 
    "ClearPath CX", "Volt Grid", 
    "Apex Gov", "TrustNet", "FleetRun", "Voyager", 
    "Sentinel Insurance", "CoreShield"
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 flex flex-col items-center">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-blue-400/10 animate-blob pointer-events-none blur-[100px]"></div>
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-400/10 animate-blob pointer-events-none blur-[100px]" style={{ animationDelay: '-5s' }}></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 w-full">
          <div className="flex justify-center mb-6 opacity-0 animate-text-reveal stagger-1">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md text-blue-700 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm">
              Voice Intent Layer for Finance
            </span>
          </div>
          
          <div className="overflow-hidden mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter opacity-0 animate-text-reveal stagger-2">
              The Voice Intent Layer <br />
              <span className="text-blue-600">for Fintechs</span>
            </h1>
          </div>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-text-reveal stagger-3 font-medium">
            Lazzi integrates easily into your product and lets users complete financial tasks by speaking — reducing friction and improving user experience.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 opacity-0 animate-text-reveal stagger-4">
            <button 
              onClick={() => onPlanSelected(PlanType.CORE)}
              className="group w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-400/20 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95"
            >
              Start for Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
              Book a Demo
            </button>
          </div>

          <div className="opacity-0 animate-text-reveal stagger-4">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-12 border-y border-slate-100 bg-slate-50/50 reveal-on-scroll">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">Trusted by leading finance companies</p>
          <div className="flex overflow-hidden relative group">
            <div className="flex gap-16 animate-marquee whitespace-nowrap py-4 items-center">
              {['Arcline Bank', 'NovaPay', 'Streamline', 'Vantage', 'CoreNet', 'Apex Bank', 'Volt Grid', 'Trivot'].map((name, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300 font-black text-xl transition-all duration-700 cursor-default hover:text-blue-600">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200"></div>
                  {name}
                </div>
              ))}
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Use Cases Showcase */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 reveal-on-scroll">
            <div className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-[9px] font-black mb-4 uppercase tracking-widest border border-purple-100">
              Voice-Powered Finance
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Speak It. Lazzi Does It.</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base font-medium">Users say what they want in natural language. Lazzi classifies the intent and prepares the action — faster transactions, fewer clicks, easier navigation.</p>
          </div>

          {/* Use Case Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {Object.entries(financeDemoData).map(([id, data]) => (
              <button
                key={id}
                onClick={() => setActiveUseCase(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${
                  activeUseCase === id
                    ? 'text-white border-transparent shadow-lg -translate-y-0.5'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                }`}
                style={activeUseCase === id ? { backgroundColor: data.color } : {}}
              >
                {data.icon}
                {data.label}
              </button>
            ))}
          </div>

          {/* Demo Card */}
          <div className="grid lg:grid-cols-2 gap-8 items-center reveal-on-scroll">
            <div className="bg-slate-950 rounded-[2.5rem] p-10 shadow-2xl relative group border border-white/5 min-h-[350px]">
              <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-6">
                🎙️ {financeDemoData[activeUseCase]?.label} — Voice Examples
              </p>
              <div className="space-y-4">
                {financeDemoData[activeUseCase]?.phrases.map((phrase, i) => (
                  <div key={`${activeUseCase}-${i}`} className="flex items-start gap-3" style={{ animation: `lazzi-fade-in 0.3s ease-out ${i * 100}ms both` }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${financeDemoData[activeUseCase].color}33` }}>
                      <Mic size={14} style={{ color: financeDemoData[activeUseCase].color }} />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex-1">
                      <p className="text-white text-sm font-bold italic">"{phrase}"</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-green-500/20">
                <p className="text-green-400 text-[9px] font-black uppercase tracking-widest mb-1">✓ Intent Classified</p>
                <p className="text-white/80 text-sm font-medium">Lazzi understands all of these — regardless of how users phrase it.</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Fewer Clicks. Faster Actions.</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Instead of navigating menus and filling forms, users just speak. Lazzi handles intent classification, confirmation, and hands off sensitive actions to your app for verification.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Faster Transactions', desc: 'Voice is 3x faster than typing and tapping', icon: <Zap size={16} /> },
                  { label: 'Fewer Clicks', desc: 'Skip navigation — go straight to the action', icon: <MousePointerClick size={16} /> },
                  { label: 'Easier Navigation', desc: 'Users don\'t need to learn your UI', icon: <Globe size={16} /> },
                  { label: 'Secure by Default', desc: 'Sensitive actions always require your app\'s verification', icon: <Shield size={16} /> },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-white hover:shadow-sm transition-all">
                    <div className="text-blue-600">{item.icon}</div>
                    <div>
                      <span className="text-sm font-bold text-slate-800">{item.label}</span>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 30-Minute Integration */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-on-scroll">
              <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-[9px] font-black mb-4 uppercase tracking-widest border border-green-100">
                Developer Experience
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
                Integrate Lazzi Into Your <br /><span className="text-blue-600">Application Seamlessly</span>
              </h2>
              <p className="text-base text-slate-600 mb-8 leading-relaxed font-medium">
                Lazzi integrates into your app as a voice intent layer, allowing users to complete actions using natural speech — fully customizable to your brand and workflows.
              </p>
              <ul className="space-y-6">
                <SafeStep number="01" title="Install the SDK" description="Add Lazzi to your application using our client SDK." />
                <SafeStep number="02" title="Configure Your Brand" description="Define your assistant's identity, branding, and supported use cases (e.g. savings, account queries, financial actions)." />
                <SafeStep number="03" title="Handle Secure Actions" description="For sensitive operations, Lazzi triggers a callback to your app so you can enforce authentication — PIN or biometrics." />
              </ul>
            </div>
            <div className="reveal-on-scroll stagger-2">
              <div className="bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 border-b border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Integration Code</span>
                </div>
                <pre className="p-6 text-xs text-blue-400 font-mono overflow-x-auto leading-relaxed">
{`<script src="https://cdn.lazzi.ai/sdk/v1/lazzi.js">
</script>
<script>
  Lazzi.init({
    apiKey: "lz_live_xxxxx",
    assistantName: "Your AI",
    industry: "banking",
    brandColors: { primary: "#6C63FF" },
    onSensitiveAction: (action) => {
      // Verify biometrics, then:
      action.confirm();
    }
  });
</script>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your Brand. Your Voice.</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base font-medium">Every partner gets a fully branded voice assistant that fits seamlessly into their app experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 reveal-on-scroll">
            {[
              { emoji: '💳', title: 'Banking & Fintech', msg: 'Hi, how can I help you with your account today?', accent: '#2D73E0' },
              { emoji: '⚡', title: 'Utilities & Services', msg: 'I can help you check bills, usage, and service updates.', accent: '#F59E0B' },
              { emoji: '💰', title: 'Savings & Investments', msg: "Let's check your savings progress and goals.", accent: '#22C55E' },
            ].map((item, i) => (
              <div key={i} className="group relative p-8 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full" style={{ backgroundColor: item.accent }} />
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed italic">"{item.msg}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Lazzi — Feature Cards */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Why Lazzi?</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-base font-medium">Built for scale, speed, and trust.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Card 1 — Secure handoff, always */}
            <div className="reveal-on-scroll bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-700 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-8 pb-6 relative min-h-[220px] flex items-center justify-center">
                {/* SOC 2 badge */}
                <div className="absolute bottom-4 left-6 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 size={12} className="text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">SOC 2</span>
                </div>
                {/* OAuth badge */}
                <div className="absolute top-6 right-6 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
                  <CheckCircle2 size={12} className="text-blue-600" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">OAuth</span>
                </div>
                {/* Flow diagram: Lazzi → E2E → Your app */}
                <div className="flex items-center gap-5">
                  {/* Lazzi node */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center">
                      <Mic size={22} className="text-blue-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">Lazzi</span>
                  </div>
                  {/* Arrow + E2E lock */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-[2px] bg-slate-300 rounded-full" />
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                      <Shield size={16} className="text-white" />
                    </div>
                    <div className="flex flex-col items-center -mt-1">
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">E2E</span>
                    </div>
                    <div className="w-8 h-[2px] bg-slate-300 rounded-full" />
                  </div>
                  {/* Your app node */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center">
                      <CheckCircle2 size={22} className="text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">Your app</span>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Secure handoff, always</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Sensitive actions stay in your app. Lazzi never touches passwords, payments or PII.</p>
              </div>
            </div>

            {/* Card 2 — Intent AI, not keywords */}
            <div className="reveal-on-scroll bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-700 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-blue-50/60 to-purple-50/40 p-8 pb-6 min-h-[220px] flex flex-col justify-center gap-4">
                {/* User speech bubble */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 max-w-[340px]">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">User said</p>
                  <p className="text-sm text-slate-700 font-medium italic">"uh, can you maybe move my 3pm thing to like tomorrow?"</p>
                </div>
                {/* Intent detected */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-green-100 max-w-[340px]">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Zap size={14} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Intent detected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[11px] font-bold border border-blue-100">reschedule</span>
                    <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-[11px] font-bold border border-amber-100">event:3pm</span>
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-[11px] font-bold border border-purple-100">date:+1d</span>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Intent AI, not keywords</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Lazzi understands messy, real-world speech — fillers, slang, half-thoughts — and turns it into action.</p>
              </div>
            </div>

            {/* Card 3 — White-Label, fully yours */}
            <div className="reveal-on-scroll bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-700 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 pb-6 min-h-[220px] flex flex-col justify-center gap-3">
                {/* Branded assistant cards */}
                {[
                  { name: 'Acme Voice', initial: 'A', color: '#2D73E0' },
                  { name: 'Nimbus AI', initial: 'N', color: '#8B5CF6' },
                  { name: 'Stellar.io', initial: 'S', color: '#22C55E' },
                ].map((brand, i) => (
                  <div key={i} className="bg-white rounded-xl px-5 py-3 shadow-sm border border-slate-100 flex items-center gap-3 max-w-[280px] hover:shadow-md transition-shadow" style={{ marginLeft: `${i * 24}px` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0" style={{ backgroundColor: brand.color }}>
                      {brand.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 leading-tight">{brand.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">Powered by you</p>
                    </div>
                    <Mic size={16} className="text-blue-400 shrink-0" />
                  </div>
                ))}
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">White-Label, fully yours</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Ship a voice assistant that wears your brand — your name, your colors, your voice. We stay invisible.</p>
              </div>
            </div>

            {/* Card 4 — Fewer clicks, more flow */}
            <div className="reveal-on-scroll bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-700 group hover:-translate-y-1">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 p-8 pb-6 min-h-[220px] flex items-center justify-center">
                <div className="flex items-center gap-6 w-full max-w-[420px]">
                  {/* Before */}
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Before</p>
                    <div className="space-y-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-slate-200 flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                          </div>
                          <div className="h-2.5 rounded-full bg-slate-200 flex-1" style={{ width: `${65 + i * 5}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Arrow */}
                  <div className="shrink-0">
                    <ArrowRight size={20} className="text-slate-300" />
                  </div>
                  {/* After */}
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center">After</p>
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-white rounded-2xl px-5 py-4 shadow-lg border border-slate-100 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                          <Mic size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 whitespace-nowrap">"Book me a flight"</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-green-500" />
                        <span className="text-xs font-bold text-green-600">1 step</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 pt-6">
                <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Fewer clicks, more flow</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">Voice replaces forms, menus and dropdowns. Your users speak — Lazzi handles the rest.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-28 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #EEF4FF 0%, #DBEAFE 50%, #EEF4FF 100%)' }}>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm reveal-on-scroll">
            <Code size={14} /> Integrations
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight reveal-on-scroll">Works With Your Stack</h2>
          <p className="text-slate-600 max-w-lg mx-auto text-base font-medium mb-6 reveal-on-scroll">
            Integrate Lazzi with your existing platform and tools to bring voice-powered actions to every user touchpoint.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 mb-16 reveal-on-scroll active:scale-95">
            Explore Docs
          </button>

          {/* Integration Icons with scrolling + fixed center */}
          <div className="relative flex items-center justify-center h-24 reveal-on-scroll">
            {/* Scrolling icons layer */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="flex items-center h-full animate-integrations-scroll">
                {[...['Streamline', 'Vantage', 'Arcline', 'Linkage', 'Firebase', 'CoreNet', 'Apex', 'NovaPay', 'Trivot', 'FleetRun', 'Savora', 'ClearPath'], ...['Streamline', 'Vantage', 'Arcline', 'Linkage', 'Firebase', 'CoreNet', 'Apex', 'NovaPay', 'Trivot', 'FleetRun', 'Savora', 'ClearPath']].map((name, i) => (
                  <div key={i} className="w-14 h-14 bg-white rounded-2xl border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-400 text-[10px] font-bold shrink-0 mx-3 hover:shadow-lg transition-shadow cursor-default">
                    {name.slice(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #DBEAFE, transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #DBEAFE, transparent)' }} />

            {/* Fixed Lazzi logo in center */}
            <div className="relative z-20 w-20 h-20 bg-gradient-to-br from-[#2D73E0] to-[#8D25D1] rounded-[1.2rem] flex flex-col items-center justify-center shadow-2xl shadow-blue-400/30 ring-4 ring-white shrink-0">
              <div className="relative transform -translate-y-0.5 translate-x-0.5">
                <div className="w-5 h-6 border-l-[4px] border-b-[4px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg"></div>
              </div>
              <span className="text-white text-[8px] font-black mt-0.5 tracking-wider">Lazzi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-slate-50" id="pricing">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-on-scroll">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Lazzi Plans</h2>
            <p className="text-slate-600 text-base font-medium">Choose the right path for your journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PriceCard title="Core / Free" price="0" description="Ideal for testing & prototyping." features={["Voice intent classification", "Banking & savings intents", "Basic dashboard", "1,000 API calls/month"]} cta="Start Free" onCta={() => onPlanSelected(PlanType.CORE)} />
            <PriceCard title="Pay-As-You-Go" price="Custom" description="For growing fintechs." features={["All Core features", "Unlimited API calls", "White-label branding", "Priority support", "Custom intents"]} cta="Get Started" onCta={() => onPlanSelected(PlanType.PAYG)} highlighted />
            <PriceCard title="Enterprise" price="Contact" description="For banks & large fintechs." features={["Dedicated infrastructure", "Advanced analytics", "Custom AI training", "SLA & compliance", "On-premise option"]} cta="Request Demo" onCta={() => onPlanSelected(PlanType.ENTERPRISE)} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-32 pt-10 px-6 text-center reveal-on-scroll">
        <div className="max-w-4xl mx-auto p-12 md:p-20 rounded-[3rem] bg-slate-950 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white relative z-10 leading-none">Ready to give your <br />app a voice?</h2>
          <p className="text-slate-400 mb-10 text-lg leading-relaxed max-w-xl mx-auto relative z-10 font-medium">
            Integrate Lazzi's voice intent layer today. Faster transactions, fewer clicks, happier users.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={() => onPlanSelected(PlanType.CORE)} className="bg-blue-600 text-white px-10 py-4 rounded-xl font-black text-base hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95">Try for Free</button>
            <button className="bg-white/10 border border-white/10 text-white px-10 py-4 rounded-xl font-black text-base hover:bg-white/20 transition hover:-translate-y-1 active:scale-95 backdrop-blur-md">Book a Demo</button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes lazzi-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes integrations-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 30s linear infinite; }
        .animate-marquee-slow { display: flex; animation: marquee 50s linear infinite; }
        .animate-integrations-scroll { display: flex; animation: integrations-scroll 20s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

const SafeStep: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="flex gap-6 items-start group">
    <span className="text-blue-600 font-black text-4xl opacity-10 group-hover:opacity-100 transition-all duration-700 select-none">{number}</span>
    <div className="transform group-hover:translate-x-2 transition-all duration-500">
      <h4 className="font-black text-slate-900 mb-1 text-xl tracking-tight">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
    </div>
  </div>
);

const PriceCard: React.FC<{ title: string; price: string; description: string; features: string[]; cta: string; highlighted?: boolean; onCta?: () => void }> = ({ title, price, description, features, cta, highlighted, onCta }) => (
  <div className={`reveal-on-scroll p-10 rounded-[2.5rem] flex flex-col h-full border transition-all duration-700 hover:shadow-xl hover:-translate-y-2 ${highlighted ? 'border-blue-600 ring-4 ring-blue-50 bg-white scale-[1.03] z-10' : 'border-slate-100 bg-slate-50/50'}`}>
    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-500 text-sm mb-8 font-medium">{description}</p>
    <div className="mb-10">
      <span className="text-5xl font-black text-slate-900 tracking-tighter">{price === 'Custom' || price === 'Contact' ? price : `$${price}`}</span>
      {price !== 'Custom' && price !== 'Contact' && <span className="text-slate-400 ml-2 font-black text-lg">/mo</span>}
    </div>
    <ul className="space-y-4 mb-12 flex-grow">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-bold">
          <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" /> {f}
        </li>
      ))}
    </ul>
    <button onClick={onCta} className={`w-full py-4 rounded-xl font-black text-base transition-all duration-300 active:scale-95 ${highlighted ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-400/20' : 'bg-white border-2 border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300'}`}>
      {cta}
    </button>
  </div>
);

export default Landing;
