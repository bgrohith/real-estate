import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, AlertCircle, CheckCircle, ArrowLeft, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [devResetToken, setDevResetToken] = useState<string | null>(null);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await forgotPassword(email);
    if (res.success) {
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
      if (res.resetTokenPreview) {
        setDevResetToken(res.resetTokenPreview);
      }
    } else {
      setErrorMsg(res.error || 'Failed to request reset email.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-luxury">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sapphire-600 to-sapphire-900 flex items-center justify-center text-white mx-auto shadow-sapphire">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your registered email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Email Sent</span>
              </div>
              <p>{successMsg}</p>
            </div>

            {/* Development token shortcut for test preview */}
            {devResetToken && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
                <span className="font-bold text-amber-900 block text-[11px]">
                  ⚡ Development Mode Shortcut:
                </span>
                <p className="text-[11px] text-amber-800">
                  Because local SMTP might be mock/preview, you can jump directly to the reset page:
                </p>
                <Link
                  to={`/reset-password/${devResetToken}`}
                  className="inline-flex items-center gap-1 font-semibold text-sapphire-800 hover:underline"
                >
                  <span>Click here to Reset Password Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-sapphire-700 hover:text-sapphire-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-sapphire transition-all disabled:opacity-50"
            >
              {loading ? 'Sending Reset Link...' : 'Send Password Reset Email'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-semibold text-slate-500 hover:text-sapphire-700 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
