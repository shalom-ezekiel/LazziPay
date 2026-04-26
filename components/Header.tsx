import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Mic, Code2, Settings as SettingsIcon, Menu, X } from 'lucide-react';

const LazziLogo = () => (
  <div className="w-8 h-8 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-lg flex items-center justify-center relative overflow-hidden">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-3.5 h-4 border-l-[3.5px] border-b-[3.5px] border-white rounded-bl-sm rounded-tr-sm rounded-br-md"></div>
    </div>
  </div>
);

const navItems = [
  { to: '/', label: 'Home', icon: <Home size={18} />, exact: true },
  { to: '/demo', label: 'Voice Demo', icon: <Mic size={18} /> },
  { to: '/developer', label: 'Developer', icon: <Code2 size={18} /> },
  { to: '/features', label: 'Features', icon: <SettingsIcon size={18} /> },
];

const getNavClasses = (isActive: boolean, scrolled: boolean) =>
  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
    isActive
      ? 'bg-blue-50 text-blue-600'
      : scrolled
        ? 'text-slate-600 hover:bg-slate-100'
        : 'text-slate-600 hover:text-blue-600'
  }`;

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenuAndNavigate = (to: string) => {
    navigate(to);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-500 ease-out ${
      scrolled ? 'px-6 pt-3' : 'px-6'
    }`}>
      <header
        className={`transition-all duration-500 ease-out mx-auto ${
          scrolled
            ? 'max-w-5xl bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/30 border border-slate-200/60 rounded-full px-6 py-2.5'
            : 'max-w-7xl bg-transparent px-0 py-5'
        }`}
      >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button
          className="flex items-center gap-2 cursor-pointer group bg-transparent border-0 p-0"
          onClick={() => navigate('/')}
        >
          <LazziLogo />
          <span className="font-bold text-xl tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">LazziPay</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => getNavClasses(isActive, scrolled)}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition shadow-md shadow-slate-200"
          >
            Sign Up
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed left-4 right-4 top-20 bg-white rounded-2xl border border-slate-200 shadow-2xl animate-slideDown overflow-hidden">
          <nav className="flex flex-col p-2">
            {navItems.map((item) => {
              const isActive = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
              return (
                <button
                  key={item.to}
                  onClick={() => closeMenuAndNavigate(item.to)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}

            <div className="border-t border-slate-200 mt-2 pt-2 flex flex-col gap-2">
              <button
                onClick={() => closeMenuAndNavigate('/login')}
                className="text-sm font-semibold text-slate-700 hover:bg-slate-100 py-3 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={() => closeMenuAndNavigate('/signup')}
                className="bg-slate-900 text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </div>
      )}

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
    </div>
  );
};

export default Header;

