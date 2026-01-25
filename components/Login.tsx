
import React from 'react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

interface LoginProps {
  onSwitchToSignup: () => void;
  onLogin: () => void;
  onBackToHome: () => void;
}

const LazziLogo = ({ onClick }: { onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform active:scale-95"
  >
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[4px] border-b-[4px] border-white rounded-bl-sm rounded-tr-xs rounded-br-md shadow-sm"></div>
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onSwitchToSignup, onLogin, onBackToHome }) => {
  return (
    <div className="w-full max-w-[380px] bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200 my-4">
      <LazziLogo onClick={onBackToHome} />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 mt-1 text-xs font-medium">Continue to LazziPay</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="email" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <button type="button" className="text-[9px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">Forgot?</button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="password" 
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform group mt-2"
        >
          Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
        <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or login with</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
          <Chrome size={16} /> Google
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition">
          <Github size={16} /> GitHub
        </button>
      </div>

      <p className="text-center text-xs font-medium text-slate-500">
        New?{' '}
        <button 
          onClick={onSwitchToSignup}
          className="text-blue-600 font-bold hover:underline"
        >
          Create account
        </button>
      </p>
    </div>
  );
};

export default Login;
