import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Mail, Phone, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-900">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sapphire-500 to-sapphire-800 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                Sapphire<span className="text-sapphire-400">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier luxury real estate advisory and marketplace. Curating architectural landmarks, sea-facing residences, and private villas across top Indian metropolitan corridors.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" /> 100% Verified Titles
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-sapphire-400 font-medium">
                <Sparkles className="w-4 h-4" /> Zero Brokerage Direct
              </span>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Prime Cities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?city=Mumbai" className="hover:text-white transition-colors">
                  Mumbai Real Estate
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Bengaluru" className="hover:text-white transition-colors">
                  Bengaluru Tech Corridors
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Delhi NCR" className="hover:text-white transition-colors">
                  Delhi NCR & Gurugram
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Hyderabad" className="hover:text-white transition-colors">
                  Hyderabad Financial Dist.
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Goa" className="hover:text-white transition-colors">
                  Goa Luxury Coastal Estates
                </Link>
              </li>
              <li>
                <Link to="/properties?city=Pune" className="hover:text-white transition-colors">
                  Pune Premium Residences
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Categories
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?propertyType=Apartment" className="hover:text-white transition-colors">
                  Luxury Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Penthouse" className="hover:text-white transition-colors">
                  Sky Penthouses
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Villa" className="hover:text-white transition-colors">
                  Private Gated Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Plot/Land" className="hover:text-white transition-colors">
                  Residential Plots & Land
                </Link>
              </li>
              <li>
                <Link to="/properties?propertyType=Commercial" className="hover:text-white transition-colors">
                  Grade-A Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Advisory Office
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sapphire-400 mt-0.5 shrink-0" />
                <span>Level 24, One BKC, Bandra Kurla Complex, Mumbai 400051</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sapphire-400 shrink-0" />
                <span>+91 (022) 6820 9000</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sapphire-400 shrink-0" />
                <span>advisory@sapphireiq.in</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SapphireIQ Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/properties" className="hover:text-slate-400">Search Properties</Link>
            <Link to="/dashboard" className="hover:text-slate-400">Client Portal</Link>
            <a href="/sitemap.xml" className="hover:text-slate-400">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
