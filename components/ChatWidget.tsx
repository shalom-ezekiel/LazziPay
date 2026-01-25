
import React, { useState } from 'react';
import { 
  MessageSquare, X, Search, ChevronRight, 
  Plus, Send, AlertCircle, User, Mail,
  Home as HomeIcon, HelpCircle
} from 'lucide-react';

type ChatTab = 'HOME' | 'MESSAGES' | 'ISSUE';

const LazziLogo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-lg flex items-center justify-center shadow-md relative overflow-hidden shrink-0">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-4 h-5 border-l-[3px] border-b-[3px] border-white rounded-bl-sm rounded-tr-xs rounded-br-md shadow-sm"></div>
    </div>
  </div>
);

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ChatTab>('HOME');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const toggleChat = () => setIsOpen(!isOpen);

  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-6 bg-amber-50 border-b border-amber-100 flex gap-3">
        <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed font-medium">
          <p className="font-bold mb-1">We're offline. We'll be back on Monday (2 days).</p>
          <p>You can still send a message - we'll respond when we're back.</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Frequently Asked Questions</p>
          <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-200 hover:shadow-sm transition text-left group">
            How to reset password
            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-blue-200 hover:shadow-sm transition text-left group">
            How to setup my widget
            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
        
        <button 
          onClick={() => setActiveTab('MESSAGES')}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Send us a message <Send size={16} />
        </button>
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="p-6 animate-in fade-in slide-in-from-right-2 duration-300 h-full flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center text-center pb-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <MessageSquare size={32} />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">No conversations yet</h3>
        <p className="text-xs text-slate-500 max-w-[200px] mx-auto mb-8 leading-relaxed">
          Start a new conversation and we'll get back to you as soon as possible.
        </p>
        <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition shadow-lg">
          <Plus size={18} /> New Conversation
        </button>
      </div>
    </div>
  );

  const renderIssue = () => (
    <div className="p-8 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="text-center mb-8">
        <h3 className="font-bold text-slate-900 text-lg">Share an Issue</h3>
        <p className="text-xs text-slate-500 mt-1">Let us know what's on your mind.</p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
          <div className="relative group">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="Full name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <button 
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg mt-2"
        >
          Continue <ChevronRight size={18} />
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
          isOpen ? 'bg-slate-900 rotate-90 scale-110' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} fill="currentColor" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[380px] max-h-[600px] h-[calc(100vh-140px)] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <LazziLogo />
              <div>
                <h2 className="font-bold text-sm leading-none">LazziPay</h2>
                <p className="text-[10px] text-slate-400 mt-1">Welcome to Support</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <User size={16} />
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'HOME' && renderHome()}
            {activeTab === 'MESSAGES' && renderMessages()}
            {activeTab === 'ISSUE' && renderIssue()}
          </div>

          {/* Bottom Navigation */}
          <div className="p-3 border-t border-slate-100 flex items-center justify-around bg-slate-50/50 shrink-0">
            <NavBtn 
              icon={<HomeIcon size={18} />} 
              label="Home" 
              active={activeTab === 'HOME'} 
              onClick={() => setActiveTab('HOME')} 
            />
            <NavBtn 
              icon={<MessageSquare size={18} />} 
              label="Messages" 
              active={activeTab === 'MESSAGES'} 
              onClick={() => setActiveTab('MESSAGES')} 
            />
            <NavBtn 
              icon={<HelpCircle size={18} />} 
              label="Help" 
              active={activeTab === 'ISSUE'} 
              onClick={() => setActiveTab('ISSUE')} 
            />
          </div>
        </div>
      )}
    </>
  );
};

const NavBtn = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
      active ? 'text-blue-600 bg-blue-50 font-bold' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
    <span className="text-[10px] uppercase tracking-tighter">{label}</span>
  </button>
);

export default ChatWidget;
