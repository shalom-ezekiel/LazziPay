import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
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

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin, onBackToHome }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const getFriendlyResetError = (code: string) => {
    if (code === 'auth/network-request-failed') {
      return 'Network problem. Check your internet connection and try again.';
    }
    return 'Failed to send reset email. Try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
        setError('No account found with this email address.');
      } else {
        setError(getFriendlyResetError(code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] bg-white rounded-[2rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200 my-4">
      <LazziLogo onClick={onBackToHome} />

      {sent ? (
        /* ─── Success State ─── */
        <div className="text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Check Your Inbox</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            Password reset email sent to{' '}
            <span className="font-bold text-slate-700">{email}</span>.
          </p>
          <p className="text-slate-400 text-xs mb-6">
            Click the link in the email to create a new password. Check your spam folder if you don't see it.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      ) : (
        /* ─── Form State ─── */
        <>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h2>
            <p className="text-slate-500 mt-1 text-xs font-medium leading-relaxed">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition shadow-inner"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>

          <button
            onClick={onBackToLogin}
            className="w-full mt-4 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
