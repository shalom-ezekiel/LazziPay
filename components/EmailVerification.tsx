import React, { useEffect, useRef, useState } from 'react';
import { MailCheck, RefreshCw, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationProps {
  onVerified: () => void;
  onBackToLogin: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerified, onBackToLogin }) => {
  const { user, resendVerificationEmail, refreshUser, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('Checking your verification status...');
  const hasCompletedRef = useRef(false);

  const getFriendlyVerificationError = (code?: string) => {
    if (code === 'auth/network-request-failed') {
      return 'Network problem. Check your internet connection and try again.';
    }
    return 'Could not resend email. Please wait a moment and try again.';
  };

  const checkVerificationStatus = async (showPendingError = false) => {
    if (hasCompletedRef.current) return;

    setChecking(true);

    try {
      const refreshedUser = await refreshUser();

      if (refreshedUser?.emailVerified) {
        hasCompletedRef.current = true;
        setStatusMessage('Email verified. Redirecting...');
        setError('');
        onVerified();
        return;
      }

      setStatusMessage('Waiting for verification link to be clicked...');
      if (showPendingError) {
        setError("Your email isn't verified yet. Please check your inbox and click the link.");
      }
    } catch {
      setStatusMessage('We could not refresh your verification status just now.');
      setError('Could not check verification status. Please try again.');
    } finally {
      if (!hasCompletedRef.current) {
        setChecking(false);
      }
    }
  };

  useEffect(() => {
    checkVerificationStatus();

    const intervalId = window.setInterval(() => {
      checkVerificationStatus();
    }, 5000);

    const handleFocus = () => {
      checkVerificationStatus();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      await resendVerificationEmail();
      setResent(true);
      setStatusMessage('Verification email sent again. Please check your inbox and spam folder.');
      window.setTimeout(() => setResent(false), 5000);
    } catch (err: any) {
      setError(getFriendlyVerificationError(err?.code));
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setError('');
    await checkVerificationStatus(true);
  };

  const handleLogout = async () => {
    await logout();
    onBackToLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <MailCheck size={38} className="text-blue-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-black">!</span>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          Verify Your Email
        </h2>

        <p className="text-slate-500 text-sm leading-relaxed mb-1">
          We sent a verification link to
        </p>
        <p className="text-blue-600 font-bold text-sm mb-4 truncate px-4">
          {user?.email}
        </p>
        <p className="text-slate-400 text-xs leading-relaxed mb-4">
          Check your inbox and spam folder, then click the verification link. This page will continue automatically once Firebase confirms your email.
        </p>

        <div className="mb-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs font-medium text-blue-700 text-left">
          {statusMessage}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-xs font-medium text-red-700 text-left">
            {error}
          </div>
        )}

        {resent && (
          <div className="mb-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2 text-xs font-medium text-green-700">
            <CheckCircle2 size={14} />
            Verification email resent successfully!
          </div>
        )}

        <button
          id="check-verification"
          onClick={handleRefresh}
          disabled={checking}
          className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-lg shadow-slate-200 active:scale-[0.98] transform mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {checking ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Checking verification status...
            </>
          ) : (
            'Refresh Verification Status'
          )}
        </button>

        <button
          id="resend-verification"
          onClick={handleResend}
          disabled={resending}
          className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition mb-6 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {resending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <RefreshCw size={15} /> Resend Verification Email
            </>
          )}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-1.5 mx-auto text-xs font-bold text-slate-400 hover:text-slate-700 transition"
        >
          <LogOut size={13} /> Sign out and use a different account
        </button>
      </div>
    </div>
  );
};

export default EmailVerification;
