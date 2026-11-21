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
  Heart,
  Calculator,
  Layers,
  Coins,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { CurrencyType } from '../utils/formatters';
import EMICalculatorModal from './EMICalculatorModal';
import AIValuationModal from './AIValuationModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { currency, setCurrency, unit, setUnit } = useCurrency();
  const { favoriteCount } = useFavorites();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo - BuyYourProperty */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-sapphire-600 to-indigo-700 flex items-center justify-center text-white shadow-sapphire group-hover:scale-105 transition-transform p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <span className="font-serif font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-tr from-amber-300 via-amber-100 to-white">
                    BYP
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-white">
                    BuyYour<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sapphire-400">Property</span>
                  </span>
                  <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    India
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Premier Luxury Real Estate Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                to="/properties"
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isActive('/properties')
                    ? 'text-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Explore Portfolios
              </Link>

              {isAiHubEnabled && (
                <Link
                  to="/ai-hub"
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all border ${
                    isActive('/ai-hub')
                      ? 'bg-sapphire-600 text-white border-sapphire-400'
                      : 'text-amber-300 bg-amber-400/10 border-amber-400/20 hover:bg-amber-400/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  AI Property Hub
                </Link>
              )}

              {/* Tools Triggers */}
              <button
                onClick={() => setIsEMIModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-sapphire-400" />
                EMI & Taxes
              </button>

              <button
                onClick={() => setIsValuationModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI Valuation
              </button>

              <Link
                to="/properties/new"
                className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                  isActive('/properties/new')
                    ? 'text-amber-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Post Property
              </Link>
            </nav>

            {/* Desktop Right Side: Currency Converter + Favorites + Auth Menu */}
            <div className="hidden md:flex items-center gap-3">
              {/* Currency & Unit Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-slate-500 transition-colors"
                  title="Switch Currency & Units"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currency}</span>
                  <span className="text-[10px] text-slate-400">({unit})</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {currencyDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 text-xs space-y-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block">
                        Currency (Live)
                      </span>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {(['INR', 'USD', 'AED', 'GBP'] as CurrencyType[]).map((c) => (
                          <button
                            key={c}
                            onClick={() => {
                              setCurrency(c);
                              setCurrencyDropdownOpen(false);
                            }}
                            className={`py-1.5 px-2 rounded-lg text-center font-bold transition-colors ${
                              currency === c
                                ? 'bg-sapphire-600 text-white'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-1.5">
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block">
                        Area Measurement
                      </span>
                      <div className="grid grid-cols-3 gap-1 mt-1">
                        {(['sqft', 'sqm', 'acre'] as const).map((u) => (
                          <button
                            key={u}
                            onClick={() => {
                              setUnit(u);
                              setCurrencyDropdownOpen(false);
                            }}
                            className={`py-1 px-1.5 rounded-lg text-center font-medium capitalize text-[11px] ${
                              unit === u
                                ? 'bg-amber-500 text-slate-950 font-bold'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Saved Homes / Favorites Counter */}
              <Link
                to="/dashboard"
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-rose-400 hover:border-slate-500 transition-colors"
                title="Saved Homes"
              >
                <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center animate-bounce">
                    {favoriteCount}
                  </span>
                )}
              </Link>

              {/* Auth / User Menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors"
                  >
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-400/40"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 text-slate-200">
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs font-bold text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        My Dashboard & Portfolios
                      </Link>

                      <Link
                        to="/properties/new"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Post New Property
                      </Link>

                      <div className="border-t border-slate-800 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/40"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:bg-slate-900 border border-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/properties"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-200 font-medium hover:text-amber-400"
            >
              <Compass className="w-5 h-5 text-amber-400" />
              Explore Portfolios
            </Link>

            {isAiHubEnabled && (
              <Link
                to="/ai-hub"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-amber-300 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                AI Property Hub
              </Link>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEMIModalOpen(true);
              }}
              className="flex items-center gap-2 py-2 text-slate-200 font-medium w-full text-left"
            >
              <Calculator className="w-5 h-5 text-sapphire-400" />
              EMI & Stamp Duty Estimator
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsValuationModalOpen(true);
              }}
              className="flex items-center gap-2 py-2 text-slate-200 font-medium w-full text-left"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              Instant AI Valuation
            </button>

            <Link
              to="/properties/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-slate-200 font-medium hover:text-amber-400"
            >
              <PlusCircle className="w-5 h-5 text-sapphire-400" />
              Post Property
            </Link>

            <div className="border-t border-slate-800 pt-3">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-slate-200 font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5 text-sapphire-400" />
                    Dashboard ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-rose-400 font-medium w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 border border-slate-700 rounded-xl text-xs font-bold text-slate-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold"
                  >
                    Join BuyYourProperty
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Financial & Valuation Modals */}
      <EMICalculatorModal isOpen={isEMIModalOpen} onClose={() => setIsEMIModalOpen(false)} />
      <AIValuationModal isOpen={isValuationModalOpen} onClose={() => setIsValuationModalOpen(false)} />
    </>
  );
};
export default Navbar;
