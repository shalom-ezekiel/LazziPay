import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppView, UserSettings, PlanType } from './types';
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

const HISTORY_STATE_KEY = 'appView';

const isAppView = (value: unknown): value is AppView =>
  typeof value === 'string' && Object.values(AppView).includes(value as AppView);

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const hasMountedRef = useRef(false);
  const [settings, setSettings] = useState<UserSettings>({
    userId: '12345',
    panicWord: 'Alaska',
    reminderTime: '18:00',
    voicePreference: 'female',
    isLocked: false,
    selectedPlan: PlanType.CORE,
  });

  const navigateToView = useCallback((view: AppView, options?: { replace?: boolean; scrollToTop?: boolean }) => {
    setCurrentView(view);

    const state = { [HISTORY_STATE_KEY]: view };
    if (options?.replace) {
      window.history.replaceState(state, '', window.location.href);
    } else {
      window.history.pushState(state, '', window.location.href);
    }

    if (options?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    window.history.replaceState({ [HISTORY_STATE_KEY]: AppView.LANDING }, '', window.location.href);
    setCurrentView(AppView.LANDING);

    const handlePopState = (event: PopStateEvent) => {
      const nextView = event.state?.[HISTORY_STATE_KEY];
      setCurrentView(isAppView(nextView) ? nextView : AppView.LANDING);
    };

    window.addEventListener('popstate', handlePopState);
    hasMountedRef.current = true;

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (loading || !hasMountedRef.current) return;

    if (user) {
      if (!user.emailVerified) {
        const needsVerificationGate =
          currentView === AppView.DASHBOARD || currentView === AppView.VERIFY_EMAIL;

        if (needsVerificationGate && currentView !== AppView.VERIFY_EMAIL) {
          navigateToView(AppView.VERIFY_EMAIL, { replace: true });
        }
      }
    } else if (currentView === AppView.DASHBOARD || currentView === AppView.VERIFY_EMAIL) {
      navigateToView(AppView.LOGIN, { replace: true });
    }
  }, [currentView, loading, navigateToView, user]);

  const handlePanicTrigger = () => {
    setSettings((prev) => ({ ...prev, isLocked: true }));
  };

  const unlockApp = () => {
    setSettings((prev) => ({ ...prev, isLocked: false }));
  };

  const navigateToLanding = () => {
    navigateToView(AppView.LANDING, { scrollToTop: true });
  };

  const handlePlanSelection = (plan: PlanType) => {
    setSettings((prev) => ({ ...prev, selectedPlan: plan }));
    navigateToView(AppView.SIGNUP, { scrollToTop: true });
  };

  const handleLogout = async () => {
    await logout();
    navigateToView(AppView.LOGIN, { replace: true });
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

  const isAuthView =
    currentView === AppView.LOGIN ||
    currentView === AppView.SIGNUP ||
    currentView === AppView.FORGOT_PASSWORD;

  const isDashboardView = currentView === AppView.DASHBOARD;
  const isVerifyView = currentView === AppView.VERIFY_EMAIL;

  if (isVerifyView) {
    return (
      <EmailVerification
        onVerified={() => navigateToView(AppView.DASHBOARD, { replace: true })}
        onBackToLogin={() => navigateToView(AppView.LOGIN, { replace: true })}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.LANDING:
        return <Landing onPlanSelected={handlePlanSelection} />;
      case AppView.DEMO:
        return <VoiceDemo settings={settings} onPanic={handlePanicTrigger} />;
      case AppView.DEVELOPER:
        return <DeveloperDocs />;
      case AppView.DASHBOARD:
        return <Dashboard plan={settings.selectedPlan} onLogout={handleLogout} />;
      case AppView.SETTINGS:
        return <Settings settings={settings} setSettings={setSettings} />;
      case AppView.LOGIN:
        return (
          <Login
            onSwitchToSignup={() => navigateToView(AppView.SIGNUP)}
            onSwitchToForgotPassword={() => navigateToView(AppView.FORGOT_PASSWORD)}
            onLogin={() => navigateToView(AppView.DASHBOARD, { replace: true })}
            onVerificationNeeded={() => navigateToView(AppView.VERIFY_EMAIL, { replace: true })}
            onBackToHome={navigateToLanding}
          />
        );
      case AppView.SIGNUP:
        return (
          <Signup
            onSwitchToLogin={() => navigateToView(AppView.LOGIN)}
            onSignup={() => navigateToView(AppView.VERIFY_EMAIL, { replace: true })}
            onBackToHome={navigateToLanding}
            selectedPlan={settings.selectedPlan}
          />
        );
      case AppView.FORGOT_PASSWORD:
        return (
          <ForgotPassword
            onBackToLogin={() => navigateToView(AppView.LOGIN)}
            onBackToHome={navigateToLanding}
          />
        );
      default:
        return <Landing onPlanSelected={handlePlanSelection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 bg-slate-50 transition-colors">
      {!isAuthView && !isDashboardView && (
        <Header currentView={currentView} setView={navigateToView} />
      )}

      <main className={`flex-grow ${isAuthView ? 'flex items-center justify-center overflow-y-auto' : ''}`}>
        {renderView()}
      </main>

      <ChatWidget />

      {!isAuthView && !isDashboardView && (
        <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
              <div className="lg:col-span-2">
                <div
                  className="flex items-center gap-3 mb-6 cursor-pointer"
                  onClick={navigateToLanding}
                >
                  <FooterLogo />
                  <span className="font-bold text-white text-2xl tracking-tighter">LazziPay</span>
                </div>
                <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
                  LazziPay - Where insight and confidence meet intelligence, empowering businesses to detect,
                  understand, and resolve friction before trust breaks.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigateToView(AppView.SIGNUP)}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition"
                  >
                    Try for Free
                  </button>
                  <button
                    onClick={() => navigateToView(AppView.DEMO)}
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
      )}
    </div>
  );
};

export default App;
