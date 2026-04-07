import React from 'react';
import { AppView } from '../types';
import { Home, Mic, BarChart3, Settings as SettingsIcon, Code2, Menu, X } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const LazziLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 relative overflow-hidden">
    {/* Stylized L */}
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[5px] border-b-[5px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg shadow-sm"></div>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { view: AppView.LANDING, label: 'Home', icon: <Home size={18} /> },
    { view: AppView.DEMO, label: 'Voice Demo', icon: <Mic size={18} /> },
    { view: AppView.DEVELOPER, label: 'Developer', icon: <Code2 size={18} /> },
    { view: AppView.SETTINGS, label: 'Features', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView(AppView.LANDING)}
        >
          <LazziLogo />
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">LazziPay</h1>
            <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Accessibility API</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.view 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button 
            onClick={() => setView(AppView.LOGIN)}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            Login
          </button>
          <button 
            onClick={() => setView(AppView.SIGNUP)}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-md shadow-slate-200"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed left-4 right-4 top-20 bg-white rounded-2xl border border-slate-200 shadow-2xl animate-slideDown overflow-hidden">
          <nav className="flex flex-col p-2">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.view 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            
            {/* Mobile Login/Signup */}
            <div className="border-t border-slate-200 mt-2 pt-2 flex flex-col gap-2">
              <button 
                onClick={() => {
                  setView(AppView.LOGIN);
                  setMobileMenuOpen(false);
                }}
                className="text-sm font-semibold text-slate-700 hover:bg-slate-100 py-3 rounded-lg transition"
              >
                Login
              </button>
              <button 
                onClick={() => {
                  setView(AppView.SIGNUP);
                  setMobileMenuOpen(false);
                }}
                className="bg-slate-900 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;