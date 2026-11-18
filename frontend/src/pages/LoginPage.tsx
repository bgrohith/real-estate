import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Lock, Mail, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-luxury animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sapphire-600 to-sapphire-900 flex items-center justify-center text-white mx-auto shadow-sapphire">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
            Sign In to SapphireIQ
          </h2>
          <p className="text-xs text-slate-500">
            Access your property dashboard, listings, and viewing itineraries
          </p>
        </div>

        {/* Demo Accounts Fill Shortcuts */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Demo Fill:
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillDemoAccount('rohit.sharma@sapphireiq.in')}
              className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg hover:border-sapphire-500 text-slate-700 text-left font-medium transition-all"
            >
              <span className="font-bold text-sapphire-800 block text-[10px]">Real Estate Agent</span>
              rohit.sharma
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('ananya.deshmukh@sapphireiq.in')}
              className="py-1.5 px-2 bg-white border border-slate-200 rounded-lg hover:border-sapphire-500 text-slate-700 text-left font-medium transition-all"
            >
              <span className="font-bold text-sapphire-800 block text-[10px]">Home Buyer</span>
              ananya.deshmukh
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
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

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-sapphire-700 hover:text-sapphire-900 font-medium"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl shadow-md hover:shadow-sapphire transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have a SapphireIQ account?{' '}
            <Link to="/register" className="font-semibold text-sapphire-700 hover:text-sapphire-900">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
