
import React from 'react';
import { PlanType } from '../types';
import { Mail, Lock, User, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignup: () => void;
  onBackToHome: () => void;
  selectedPlan: PlanType;
}

const LazziLogo = ({ onClick }: { onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform mx-auto' : ''}`}
  >
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[4px] border-b-[4px] border-white rounded-bl-sm rounded-tr-xs rounded-br-md shadow-sm"></div>
    </div>
  </div>
);

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onSignup, onBackToHome, selectedPlan }) => {
  return (
    <div className="w-full max-w-4xl bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200 grid md:grid-cols-5 gap-8 my-6">
      
      {/* Left Info Panel */}
      <div className="md:col-span-2 hidden md:flex flex-col justify-between py-2">
        <div>
          <LazziLogo onClick={onBackToHome} />
          <h2 className="text-xl font-extrabold text-slate-900 mt-4 leading-tight">Join the Voice Revolution</h2>
          <p className="text-slate-500 mt-2 text-xs leading-relaxed">Secure your fintech future with Africa's first voice accessibility layer.</p>
          
          <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
             <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Plan:</span>
             <span className="text-[10px] font-bold text-slate-700">{selectedPlan}</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            "Sandbox Environment",
            "Production API Keys",
            "Real-time Analytics",
            "Safe Confirmation Flows"
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div className="w-4 h-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">{feature}</span>
            </div>
          ))}
        </div>


      </div>

      {/* Right Form Panel */}
      <div className="md:col-span-3">
        <div className="md:hidden mb-6 text-center">
          <LazziLogo onClick={onBackToHome} />
        </div>
        <div className="mb-6 text-center md:text-left">
          <h3 className="text-xl font-extrabold text-slate-900">Create Account</h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Start building today.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSignup(); }}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Organization</label>
              <div className="relative group">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="email" 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                placeholder="8+ characters"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input type="checkbox" required className="mt-0.5 w-3.5 h-3.5 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
              <span className="text-[9px] text-slate-500 font-medium leading-tight">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy</a>.
              </span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform group mt-2"
          >
            Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-500 mt-6">
          Already have an account?{' '}
          <button 
            onClick={onSwitchToLogin}
            className="text-blue-600 font-bold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
