import React, { useState } from 'react';
import { PlanType } from '../types';
import {
  Mail, Lock, User, Building, ArrowRight,
  CheckCircle2, Chrome, Github, AlertCircle, Loader2, Eye, EyeOff,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignup: () => void;
  onBackToHome: () => void;
  selectedPlan: PlanType;
}

const LazziLogo = ({ onClick }: { onClick?: () => void }) => (
  <div
    onClick={onClick}
    className={`w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative ${
      onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform mx-auto' : ''
    }`}
  >
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[4px] border-b-[4px] border-white rounded-bl-sm rounded-br-md shadow-sm"></div>
    </div>
  </div>
);

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onSignup, onBackToHome, selectedPlan }) => {
  const { signUpWithEmail, loginWithGoogle, loginWithGitHub } = useAuth();

  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);

  const getFriendlyAuthError = (code: string, fallback: string) => {
    const knownMessages: Record<string, string> = {
      'auth/network-request-failed': 'Network problem. Check your internet connection and try again.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/unauthorized-domain': 'This website is not authorized for Firebase sign-in yet. Add the live domain in Firebase Authorized Domains.',
      'auth/operation-not-allowed': 'This sign-in provider is disabled in Firebase Authentication.',
      'auth/invalid-api-key': 'The live Firebase API key is invalid or missing.',
      'auth/app-not-authorized': 'This app is not authorized to use the current Firebase configuration on this domain.',
      'auth/argument-error': 'Firebase sign-in configuration is incomplete on the live site.',
      'auth/operation-not-supported-in-this-environment': 'This browser environment cannot open the sign-in popup. Try a normal browser window.',
      'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
    };

    if (knownMessages[code]) {
      return knownMessages[code];
    }

    return code ? `${fallback} (${code})` : fallback;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      // After signup, user is signed out and needs to verify email
      onSignup();
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.');
      } else if (code === 'auth/weak-password') {
        setError('Password is too weak. Use at least 8 characters.');
      } else if (code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(getFriendlyAuthError(code, 'Sign up failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      // Google accounts are auto-verified
      await loginWithGoogle();
      onSignup();
    } catch (err: any) {
      const code = err?.code ?? '';
      console.error('Google signup failed:', err);
      if (code === 'auth/popup-closed-by-user') {
        return;
      }
      if (code === 'auth/popup-blocked') {
        setError('Google popup was blocked by the browser. Allow popups and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This sign-in method is unavailable on this app address right now. Please try another sign-in option.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('Google sign-in is temporarily unavailable. Please use email and password for now.');
      } else {
        setError(getFriendlyAuthError(code, 'Google sign up failed. Please try again.'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGitHubSignup = async () => {
    setError('');
    setGithubLoading(true);
    try {
      await loginWithGitHub();
      onSignup();
    } catch (err: any) {
      const code = err?.code ?? '';
      console.error('GitHub signup failed:', err);
      if (code === 'auth/popup-closed-by-user') {
        return;
      }
      if (code === 'auth/popup-blocked') {
        setError('GitHub popup was blocked by the browser. Allow popups and try again.');
      } else if (code === 'auth/unauthorized-domain') {
        setError('This sign-in method is unavailable on this app address right now. Please try another sign-in option.');
      } else if (code === 'auth/operation-not-allowed') {
        setError('GitHub sign-in is not ready yet. Please use Google or email and password for now.');
      } else {
        setError(getFriendlyAuthError(code, 'GitHub sign up failed. Please try again.'));
      }
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200 grid md:grid-cols-5 gap-8 my-6">

      {/* Left Info Panel */}
      <div className="md:col-span-2 hidden md:flex flex-col justify-between py-2">
        <div>
          <LazziLogo onClick={onBackToHome} />
          <h2 className="text-xl font-extrabold text-slate-900 mt-4 leading-tight">Join the Voice Revolution</h2>
          <p className="text-slate-500 mt-2 text-xs leading-relaxed">
            Secure your fintech future with Africa's first voice accessibility layer.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Plan:</span>
            <span className="text-[10px] font-bold text-slate-700">{selectedPlan}</span>
          </div>
        </div>

        <div className="space-y-4">
          {['Sandbox Environment', 'Production API Keys', 'Real-time Analytics', 'Safe Confirmation Flows'].map(
            (feature, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-4 h-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-[11px] font-bold text-slate-700">{feature}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="md:col-span-3">
        <div className="md:hidden mb-6 text-center">
          <LazziLogo onClick={onBackToHome} />
        </div>
        <div className="mb-5 text-center md:text-left">
          <h3 className="text-xl font-extrabold text-slate-900">Create Account</h3>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Start building today.</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs font-medium text-red-700">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
              <div className="relative group">
                <User
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Organization</label>
              <div className="relative group">
                <Building
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  id="signup-org"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                  placeholder="Acme Inc."
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Email</label>
            <div className="relative group">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={16}
              />
              <input
                id="signup-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-3 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                placeholder="john@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={16}
              />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-10 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                placeholder="8+ characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-slate-200 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[9px] text-slate-500 font-medium leading-tight">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform group mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                Get Started <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Or sign up with
          </span>
        </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          id="signup-google"
          type="button"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Chrome size={18} className="text-blue-500" /> Google
            </>
          )}
        </button>

        <button
          id="signup-github"
          type="button"
          onClick={handleGitHubSignup}
          disabled={githubLoading}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {githubLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Github size={18} className="text-slate-800" /> GitHub
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs font-medium text-slate-500">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 font-bold hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
