import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Mic, Code2, Settings as SettingsIcon, Menu, X } from 'lucide-react';

const LazziLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 relative overflow-hidden">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[5px] border-b-[5px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg shadow-sm"></div>
    </div>
  </div>
);

const navItems = [
  { to: '/', label: 'Home', icon: <Home size={18} />, exact: true },
  { to: '/demo', label: 'Voice Demo', icon: <Mic size={18} /> },
  { to: '/developer', label: 'Developer', icon: <Code2 size={18} /> },
  { to: '/features', label: 'Features', icon: <SettingsIcon size={18} /> },
];

const getNavClasses = (isActive: boolean) =>
  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
  }`;

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenuAndNavigate = (to: string) => {
    navigate(to);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button
          className="flex items-center gap-2 cursor-pointer group bg-transparent border-0 p-0"
          onClick={() => navigate('/')}
        >
          <LazziLogo />
          <div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">LazziPay</h1>
            <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Accessibility API</span>
          </div>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => getNavClasses(isActive)}
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
  );
};

export default Header;
