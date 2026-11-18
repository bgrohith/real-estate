import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  Menu,
  X,
  User as UserIcon,
  PlusCircle,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAiHubEnabled = import.meta.env.VITE_ENABLE_AI_HUB !== 'false';

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sapphire-600 to-sapphire-900 flex items-center justify-center text-white shadow-sapphire group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-serif font-bold tracking-tight text-slate-900">
                  Sapphire<span className="text-sapphire-700">IQ</span>
                </span>
                <span className="text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Luxury
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                India's Prime Real Estate
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/properties"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive('/properties')
                  ? 'text-sapphire-700 font-semibold'
                  : 'text-slate-600 hover:text-sapphire-700'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore Listings
            </Link>

            {isAiHubEnabled && (
              <Link
                to="/ai-hub"
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full transition-all ${
                  isActive('/ai-hub')
                    ? 'bg-sapphire-100 text-sapphire-800 font-semibold'
                    : 'text-sapphire-700 bg-sapphire-50/70 hover:bg-sapphire-100 hover:text-sapphire-900'
                }`}
              >
                <Sparkles className="w-4 h-4 text-sapphire-600 animate-pulse" />
                AI Property Hub
              </Link>
            )}

            <Link
              to="/properties/new"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                isActive('/properties/new')
                  ? 'text-sapphire-700 font-semibold'
                  : 'text-slate-600 hover:text-sapphire-700'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Post Property
            </Link>
          </nav>

          {/* Desktop Auth / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-sapphire-600/30"
                  />
                  <div className="text-left pr-1">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sapphire-700 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard & Listings
                    </Link>

                    <Link
                      to="/properties/new"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sapphire-700 transition-colors"
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add New Listing
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-sapphire-700 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-sapphire-700 hover:bg-sapphire-800 text-white px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Join SapphireIQ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-sapphire-700"
          >
            <Compass className="w-5 h-5 text-sapphire-700" />
            Explore Listings
          </Link>

          {isAiHubEnabled && (
            <Link
              to="/ai-hub"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sapphire-800 font-medium"
            >
              <Sparkles className="w-5 h-5 text-sapphire-600" />
              AI Property Hub
            </Link>
          )}

          <Link
            to="/properties/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-sapphire-700"
          >
            <PlusCircle className="w-5 h-5 text-sapphire-700" />
            Post Property
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2 text-slate-800 font-medium hover:text-sapphire-700"
                >
                  <LayoutDashboard className="w-5 h-5 text-sapphire-700" />
                  Dashboard ({user.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 py-2 text-rose-600 font-medium w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-sapphire-700 text-white rounded-lg text-sm font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
