
import React, { useState } from 'react';
/*  AlertCircle and HelpCircle imports */
import { Search, ChevronRight, Copy, Check, Code, User, CreditCard, Activity, Play, Key, BookOpen, ExternalLink, ShieldCheck, MapPin, Globe, AlertCircle, HelpCircle } from 'lucide-react';

const DeveloperDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState('quick-start');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const navItems = [
    { id: 'quick-start', title: 'Quick Start', icon: <Play size={18} /> },
    { id: 'api-keys', title: 'API Keys', icon: <Key size={18} /> },
    { id: 'users-contacts', title: 'Users / Contacts', icon: <User size={18} /> },
    { id: 'transactions', title: 'Transactions', icon: <CreditCard size={18} /> },
    { id: 'voice-command', title: 'Voice Command', icon: <Code size={18} /> },
    { id: 'analytics', title: 'Analytics', icon: <Activity size={18} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'quick-start':
        return (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">QUICK START 👋</h1>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome to the LazziPay API Docs</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Welcome to the official LazziPay Developer Documentation! Here you’ll find everything you need to integrate LazziPay into your apps to enable safe, voice-first money transfers with AI-assisted confirmations.
            </p>
            
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 mb-10 shadow-sm">
              <h3 className="font-bold text-blue-900 mb-6 text-lg">LazziPay helps developers:</h3>
              <ul className="space-y-4">
                {[
                  'Ensure transfers are accurate and verified',
                  'Automate voice-command handling in apps',
                  'Track transactions and feedback for analytics',
                  'Integrate with existing internal tools or dashboards'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-slate-700">
                    <div className="mt-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Play className="text-blue-600" /> What You Can Do
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {[
                { title: 'Identity Mapping', text: 'Map users to verified bank accounts to prevent errors.', icon: <ShieldCheck /> },
                { title: 'Voice-to-Intent', text: 'Convert spoken commands into structured actions.', icon: <Globe /> },
                { title: 'Secure Preparation', text: 'Initiate prepare-only transfers requiring confirmation.', icon: <MapPin /> },
                { title: 'Auditable Logs', text: 'Fetch transaction history and correction logs.', icon: <Activity /> }
              ].map((item, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-2xl flex flex-col gap-3 shadow-sm hover:shadow-md transition">
                  <div className="text-blue-600">{item.icon}</div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            
            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Code size={120} />
              </div>
              <h3 className="text-2xl font-bold mb-4 relative z-10">Sign up here to get your API key</h3>
              <p className="text-slate-400 mb-8 relative z-10">Instant access to our sandbox and production environments.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold transition flex items-center gap-2 mx-auto relative z-10 shadow-lg">
                <ExternalLink size={20} /> Get API Key
              </button>
            </div>
          </div>
        );

      case 'api-keys':
        return (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight flex items-center gap-4">
              <Key size={32} className="text-blue-600" /> Get Your API Key
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              To use the LazziPay API, you’ll need an API key scoped to your organization. Follow these steps to get started.
            </p>
            
            <div className="space-y-12">
              <section>
                <h3 className="text-xl font-bold text-slate-900 mb-6">Instructions:</h3>
                <div className="space-y-4">
                  {[
                    'Obtain your API key from your LazziPay developer account',
                    'Once signed in, go to Developer → API Access',
                    'Generate your key',
                    'Include it in the Authorization header for all requests'
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-slate-600 font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </section>

              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Header Example</p>
                <CodeSnippet 
                  id="header"
                  code="Authorization: Bearer YOUR_LAZZIPAY_API_KEY"
                  language="HTTP"
                  onCopy={copyToClipboard}
                  copied={copied === 'header'}
                />
              </div>

              <div className="p-8 bg-amber-50 border border-amber-100 rounded-[2rem] flex gap-5">
                <div className="mt-1"><AlertCircle className="text-amber-600" /></div>
                <p className="text-amber-800 text-sm italic leading-relaxed font-medium">
                  <strong>Note:</strong> If you don’t have a LazziPay account yet, go back to the main LazziPay page to sign up before attempting to generate production keys.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-24 text-center animate-in fade-in">
            <BookOpen size={64} className="mx-auto text-slate-100 mb-6" />
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{navItems.find(i => i.id === activeSection)?.title}</h2>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
              This documentation section is currently under construction. Please refer to the Quick Start or API Keys sections for immediate guidance.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Interactive Top Search Bar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-8 py-5 flex items-center justify-between">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search LazziPay APIs, endpoints, or guides..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition shadow-inner font-medium"
          />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">v1.2.0-stable</span>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Left Side Navigation */}
        <aside className="w-80 border-r border-slate-100 hidden lg:block h-[calc(100vh-140px)] sticky top-[140px] overflow-y-auto bg-slate-50/30">
          <div className="p-8">
            <nav className="space-y-1.5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-3">Reference Library</p>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                    activeSection === item.id 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'text-slate-600 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  {item.icon}
                  {item.title}
                </button>
              ))}
            </nav>

            <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition transform pointer-events-none">
                <HelpCircle size={100} />
              </div>
              <h4 className="text-sm font-bold mb-2">Need dev help?</h4>
              <p className="text-[10px] text-slate-400 mb-6 leading-relaxed">Our engineer-led support team is online and ready.</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest transition border border-white/10">Open Ticket</button>
            </div>
          </div>
        </aside>

        {/* Main Documentation View */}
        <div className="flex-1 flex min-w-0">
          <main className="flex-1 p-8 lg:p-20 max-w-5xl mx-auto">
            <div className="mb-12 flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest">
              <span className="text-blue-600">Developer Portal</span>
              <ChevronRight size={14} className="text-slate-300" />
              <span className="text-slate-900">{navItems.find(i => i.id === activeSection)?.title}</span>
            </div>
            
            {renderContent()}
          </main>

          {/* Right-Hand Quick Navigation Table of Contents */}
          <aside className="w-72 p-12 hidden xl:block h-[calc(100vh-140px)] sticky top-[140px] border-l border-slate-50 bg-white/50 backdrop-blur-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">On this page</p>
            <ul className="space-y-6">
              {[
                { label: 'Introduction', id: 'intro' },
                { label: 'Core Capabilities', id: 'cap' },
                { label: 'Key Endpoints', id: 'end' },
                { label: 'Next Steps', id: 'next' }
              ].map((item, i) => (
                <li key={i}>
                  <button 
                    onClick={() => setActiveSection(activeSection)}
                    className="text-xs font-bold text-slate-500 hover:text-blue-600 transition flex items-center gap-3 group text-left"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-blue-600 group-hover:scale-150 transition" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-20 pt-8 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Feedback</p>
              <button className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition">Was this helpful?</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const CodeSnippet: React.FC<{ 
  id: string, 
  code: string, 
  language: string, 
  onCopy: (code: string, id: string) => void, 
  copied: boolean 
}> = ({ id, code, language, onCopy, copied }) => (
  <div className="group relative shadow-2xl rounded-2xl overflow-hidden ring-1 ring-slate-900/10">
    <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button 
        onClick={() => onCopy(code, id)}
        className="p-2.5 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition flex items-center gap-2 text-xs font-bold shadow-xl"
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
    <div className="bg-slate-950 p-8 font-mono text-xs overflow-x-auto text-blue-400">
      <div className="flex items-center gap-3 mb-6 text-slate-500 text-[10px] uppercase font-black border-b border-slate-900 pb-4 tracking-widest">
        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        <span>{language}</span>
      </div>
      <pre className="whitespace-pre-wrap leading-relaxed"><code>{code}</code></pre>
    </div>
  </div>
);

export default DeveloperDocs;
