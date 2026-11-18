import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Award,
  Users,
  Compass,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import api from '../services/api';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { INDIAN_CITIES, PROPERTY_TYPES } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick search state
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/properties?featured=true&limit=6');
        if (res.data.success) {
          setFeaturedProperties(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCity && selectedCity !== 'All Cities') params.append('city', selectedCity);
    if (selectedType && selectedType !== 'All Types') params.append('propertyType', selectedType);
    if (selectedBhk && selectedBhk !== 'Any') params.append('bedrooms', selectedBhk);
    if (selectedBudget) {
      if (selectedBudget === 'under-1cr') params.append('maxPrice', '10000000');
      else if (selectedBudget === '1cr-5cr') {
        params.append('minPrice', '10000000');
        params.append('maxPrice', '50000000');
      } else if (selectedBudget === '5cr-15cr') {
        params.append('minPrice', '50000000');
        params.append('maxPrice', '150000000');
      } else if (selectedBudget === 'above-15cr') {
        params.append('minPrice', '150000000');
      }
    }
    navigate(`/properties?${params.toString()}`);
  };

  const cityCards = [
    {
      name: 'Mumbai',
      desc: 'Sea-facing high rises in Worli, Bandra & Lower Parel',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      count: '1,450+ Properties',
    },
    {
      name: 'Bengaluru',
      desc: 'Eco-residences & golf villas in Central & North Bengaluru',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      count: '980+ Properties',
    },
    {
      name: 'Delhi NCR',
      desc: 'Golf Course Road penthouses & diplomatic enclave mansions',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      count: '1,200+ Properties',
    },
    {
      name: 'Hyderabad',
      desc: 'Ultra-luxury high-rises in Jubilee Hills & Financial District',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      count: '640+ Properties',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[620px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Background Backdrop with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="SapphireIQ Luxury Estate"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sapphire-900/60 border border-sapphire-500/30 text-sapphire-200 text-xs font-semibold tracking-wide backdrop-blur-md animate-in fade-in duration-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>India's Ultra-Prime Real Estate Marketplace</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Discover Homes Built for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sapphire-300 via-sapphire-100 to-amber-200">
              Generational Legacy
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Verified sea-facing sky residences, gated golf villas, and bespoke penthouses across India’s premier metropolitan addresses with direct developer & owner access.
          </p>

          {/* Quick Search Widget */}
          <div className="mt-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl text-slate-900 border border-slate-100 max-w-4xl mx-auto text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* City */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sapphire-600" /> City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
                >
                  <option value="">Select City</option>
                  {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-sapphire-600" /> Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
                >
                  <option value="">All Categories</option>
                  {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  BHK Layout
                </label>
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
                >
                  <option value="">Any Layout</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="4+">5+ BHK Grand</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Budget (INR)
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full text-xs font-medium py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
                >
                  <option value="">Any Budget</option>
                  <option value="under-1cr">Under ₹ 1.0 Cr</option>
                  <option value="1cr-5cr">₹ 1.0 Cr - ₹ 5.0 Cr</option>
                  <option value="5cr-15cr">₹ 5.0 Cr - ₹ 15.0 Cr</option>
                  <option value="above-15cr">₹ 15.0 Cr+ (Ultra Luxury)</option>
                </select>
              </div>

              {/* Submit CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-lg transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-sapphire-800">₹ 4,500 Cr+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Transaction Volume</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-sapphire-800">50,000+</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Curated Residences</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-sapphire-800">100%</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Title Verified Listings</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-sapphire-800">15+ Metro</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Indian Cities Covered</p>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-sapphire-700 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Portfolios</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Featured Luxury Properties
            </h2>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sapphire-700 hover:text-sapphire-900 group"
          >
            <span>View All Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-96 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8">
            <Compass className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">No properties listed yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Be the first to list an exclusive residence on SapphireIQ.
            </p>
            <Link
              to="/properties/new"
              className="px-4 py-2 bg-sapphire-700 text-white rounded-lg text-xs font-semibold"
            >
              Post a Property
            </Link>
          </div>
        )}
      </section>

      {/* Explore Indian Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-sapphire-700">
            Regional Hubs
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            Prime Real Estate Metros
          </h2>
          <p className="text-xs text-slate-500">
            Browse coveted properties in India’s most high-growth financial and residential zones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityCards.map((c) => (
            <Link
              key={c.name}
              to={`/properties?city=${c.name}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] bg-slate-900 shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-medium bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                  {c.count}
                </span>
                <h3 className="text-xl font-serif font-bold mt-2">{c.name}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {c.desc}
                </p>
                <div className="flex items-center gap-1 text-xs text-sapphire-300 font-medium mt-3 group-hover:translate-x-1 transition-transform">
                  <span>Explore listings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose SapphireIQ */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              The SapphireIQ Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Why Discerning Homeowners Choose Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sapphire-900 text-sapphire-300 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                RERA & Title Verification
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every listing is cross-checked against RERA registration and local municipal approvals, ensuring absolute peace of mind for high-value acquisitions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sapphire-900 text-sapphire-300 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                Direct Owner & Concierge Access
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Schedule private in-person or video viewings seamlessly. Transparent communications without inflated intermediary broker margins.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sapphire-900 text-sapphire-300 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="font-serif font-bold text-lg text-white">
                AI Property Discovery Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe your dream residence in plain English and let our intelligent engine match, rank, and crawl verified homes across prime Indian addresses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA For Property Owners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-sapphire-950 via-sapphire-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              For Property Owners & Developers
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-snug">
              List Your Premier Estate on SapphireIQ
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Reach over 250,000+ verified HNI buyers and NRI investors seeking premium residential real estate across India. Upload up to 4 high-definition photos and manage private viewings directly.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/properties/new"
                className="px-6 py-3 bg-white text-sapphire-950 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <span>List Your Property Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-slate-600 hover:border-slate-400 text-white font-medium text-xs rounded-xl transition-all"
              >
                Access Owner Portal
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3 text-xs max-w-xs">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Why List With Us?
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Zero listing fee for verified owners</li>
              <li>• Direct booking calendar management</li>
              <li>• ImageKit high-speed CDN delivery</li>
              <li>• Dedicated customer viewing concierge</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
