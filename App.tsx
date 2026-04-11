import React, { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PlanType, UserSettings } from './types';
import Landing from './components/Landing';
import VoiceDemo from './components/VoiceDemo';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Header from './components/Header';
import DeveloperDocs from './components/DeveloperDocs';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import EmailVerification from './components/EmailVerification';
import ChatWidget from './components/ChatWidget';
import { useAuth } from './contexts/AuthContext';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

const FooterLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-black/20 relative">
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[5px] border-b-[5px] border-white rounded-bl-md rounded-tr-sm rounded-br-lg"></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState<UserSettings>({
    userId: '12345',
    panicWord: 'Alaska',
    reminderTime: '18:00',
    voicePreference: 'female',
    isLocked: false,
    selectedPlan: PlanType.CORE,
  });

  const handlePanicTrigger = () => {
    setSettings((prev) => ({ ...prev, isLocked: true }));
  };

  const unlockApp = () => {
    setSettings((prev) => ({ ...prev, isLocked: false }));
  };

  const navigateToLanding = () => {
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanSelection = (plan: PlanType) => {
    setSettings((prev) => ({ ...prev, selectedPlan: plan }));
    navigate('/signup');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (settings.isLocked) {
    return (
      <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center text-white p-6 text-center">
        <ShieldAlert size={80} className="mb-6 animate-pulse" />
        <h1 className="text-4xl font-bold mb-4">EMERGENCY LOCK ACTIVE</h1>
        <p className="text-xl mb-8 max-w-md">
          A panic word was detected. Your accounts have been temporarily suspended for your safety.
          Contact your bank to verify your identity.
        </p>
        <button
          onClick={unlockApp}
          className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition shadow-lg flex items-center gap-2"
        >
          <LogIn size={20} /> Admin Unlock (Demo Only)
        </button>
      </div>
    );
  }

  const isAuthPath =
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';
  const isDashboardPath = location.pathname === '/dashboard';
  const isVerifyPath = location.pathname === '/verify-email';

  const Footer = () => (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={navigateToLanding}>
              <FooterLogo />
              <span className="font-bold text-white text-2xl tracking-tighter">LazziPay</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
              LazziPay - Where insight and confidence meet intelligence, empowering businesses to detect,
              understand, and resolve friction before trust breaks.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
              >
                Try for Free
              </button>
              <button
                onClick={() => navigate('/demo')}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-700 transition"
              >
                Book a Demo
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Product</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition">Ticketing</a></li>
              <li><a href="#" className="hover:text-white transition">Developer</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition">LazziPay</a></li>
              <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-600 font-medium">
            © 2026 LazziPay. All rights reserved. <span className="mx-2">|</span>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>{' '}
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </p>
          <div className="flex gap-6 opacity-40 grayscale hover:grayscale-0 transition duration-500">
            <div className="w-6 h-6 bg-slate-400 rounded-sm"></div>
            <div className="w-6 h-6 bg-slate-400 rounded-sm"></div>
            <div className="w-6 h-6 bg-slate-400 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );

  const ProtectedDashboard = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (!user.emailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
    return <Dashboard plan={settings.selectedPlan} onLogout={handleLogout} />;
  };

  const VerifyEmailGate = () => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (user.emailVerified) {
      return <Navigate to="/dashboard" replace />;
    }
    return (
      <EmailVerification
        onVerified={() => navigate('/dashboard', { replace: true })}
        onBackToLogin={() => navigate('/login', { replace: true })}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 bg-slate-50 transition-colors">
      {!isAuthPath && !isDashboardPath && !isVerifyPath && <Header />}

      <main className={`flex-grow ${isAuthPath ? 'flex items-center justify-center overflow-y-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing onPlanSelected={handlePlanSelection} />} />
          <Route path="/demo" element={<VoiceDemo settings={settings} onPanic={handlePanicTrigger} />} />
          <Route path="/developer" element={<DeveloperDocs />} />
          <Route path="/features" element={<Settings settings={settings} setSettings={setSettings} />} />
          <Route path="/login" element={
            <Login
              onSwitchToSignup={() => navigate('/signup')}
              onSwitchToForgotPassword={() => navigate('/forgot-password')}
              onLogin={() => navigate('/dashboard', { replace: true })}
              onVerificationNeeded={() => navigate('/verify-email', { replace: true })}
              onBackToHome={navigateToLanding}
            />
          } />
          <Route path="/signup" element={
            <Signup
              onSwitchToLogin={() => navigate('/login')}
              onSignup={() => navigate('/verify-email', { replace: true })}
              onBackToHome={navigateToLanding}
              selectedPlan={settings.selectedPlan}
            />
          } />
          <Route path="/forgot-password" element={
            <ForgotPassword
              onBackToLogin={() => navigate('/login')}
              onBackToHome={navigateToLanding}
            />
          } />
          <Route path="/verify-email" element={<VerifyEmailGate />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <ChatWidget />

      {!isAuthPath && !isDashboardPath && !isVerifyPath && <Footer />}
    </div>
  );
};

export default App;
