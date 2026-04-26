import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Chrome, Github, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToForgotPassword: () => void;
  onLogin: () => void;
  onVerificationNeeded: () => void;
  onBackToHome: () => void;
}

const LazziLogo = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    className="w-10 h-10 bg-gradient-to-br from-[#33C4CC] via-[#2D73E0] to-[#8D25D1] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 relative mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform active:scale-95"
  >
    <div className="relative transform -translate-y-0.5 translate-x-0.5">
      <div className="w-5 h-6 border-l-[4px] border-b-[4px] border-white rounded-bl-sm rounded-br-md shadow-sm"></div>
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({
  onSwitchToSignup,
  onSwitchToForgotPassword,
  onLogin,
  onVerificationNeeded,
  onBackToHome,
}) => {
  const { loginWithEmail, loginWithGoogle, loginWithGitHub } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await loginWithEmail(email, password);
      if (!user.emailVerified) {
        onVerificationNeeded();
      } else {
        onLogin();
      }
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(getFriendlyAuthError(code, 'Login failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      // Google users are automatically verified
      await loginWithGoogle();
      onLogin();
    } catch (err: any) {
      const code = err?.code ?? '';
      console.error('Google login failed:', err);
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
        setError(getFriendlyAuthError(code, 'Google login failed. Please try again.'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setError('');
    setGithubLoading(true);
    try {
      await loginWithGitHub();
      onLogin();
    } catch (err: any) {
      const code = err?.code ?? '';
      console.error('GitHub login failed:', err);
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
        setError(getFriendlyAuthError(code, 'GitHub login failed. Please try again.'));
      }
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200 my-4">
      <LazziLogo onClick={onBackToHome} />
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
        <p className="text-slate-500 mt-1 text-xs font-medium">Continue to LazziPay</p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs font-medium text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleEmailLogin}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Email Address
          </label>
          <div className="relative group">
            <Mail
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="name@company.com"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-end">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              className="text-[9px] font-bold text-blue-600 hover:underline uppercase tracking-tighter"
            >
              Forgot?
            </button>
          </div>
          <div className="relative group">
            <Lock
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
              size={18}
            />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-10 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform group mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Or login with
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          id="login-google"
          type="button"
          onClick={handleGoogleLogin}
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
          id="login-github"
          type="button"
          onClick={handleGitHubLogin}
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
        New?{' '}
        <button onClick={onSwitchToSignup} className="text-blue-600 font-bold hover:underline">
          Create account
        </button>
      </p>
    </div>
  );
};

export default Login;
