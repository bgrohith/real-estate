import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Sparkles, Compass, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-sapphire-600 to-indigo-700 flex items-center justify-center text-white shadow-sapphire p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-serif font-extrabold text-amber-300">
                  BYP
                </div>
              </div>
              <span className="text-2xl font-serif font-extrabold tracking-tight text-white">
                BuyYour<span className="text-amber-400">Property</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier luxury real estate advisory and 360° discovery platform. Curating architectural landmarks, sea-facing residences, and private estates across top Indian metropolitan corridors.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% RERA Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Sparkles className="w-4 h-4" /> 360° Virtual Tours
              </span>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Prime Metro Markets
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-white transition-colors">
                  Mumbai Sky Residences
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-white transition-colors">
                  Bengaluru Tech Mansions
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi NCR" className="hover:text-white transition-colors">
                  Delhi NCR Golf Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="hover:text-white transition-colors">
                  Hyderabad Financial District
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Goa" className="hover:text-white transition-colors">
                  Goa Portuguese Coastal Estates
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Pune" className="hover:text-white transition-colors">
                  Pune Designer High-Rises
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Architecture Portfolios
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/properties?propertyType=Apartment" className="hover:text-white transition-colors">
                  Ultra-Luxury Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Penthouse" className="hover:text-white transition-colors">
                  Crown Sky Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-white transition-colors">
                  Private Gated Golf Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Plot/Land" className="hover:text-white transition-colors">
                  Residential Land & Estates
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Commercial" className="hover:text-white transition-colors">
                  Grade-A Commercial Assets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Corporate Headquarters
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>Level 24, One BKC, Bandra Kurla Complex, Mumbai 400051</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 (022) 6820 9000</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@buyyourproperty.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BuyYourProperty Platform Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/properties" className="hover:text-slate-300">Property Directory</Link>
            <Link to="/ai-hub" className="hover:text-slate-300">AI Matchmaker</Link>
            <Link to="/dashboard" className="hover:text-slate-300">Owner Portal</Link>
            <a href="/sitemap.xml" className="hover:text-slate-300">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
