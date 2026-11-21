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
  Calculator,
  Eye,
  Layers,
  BarChart3,
  Flame,
} from 'lucide-react';
import api from '../services/api';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { INDIAN_CITIES, PROPERTY_TYPES } from '../utils/formatters';
import { useCurrency } from '../context/CurrencyContext';
import EMICalculatorModal from '../components/EMICalculatorModal';
import AIValuationModal from '../components/AIValuationModal';
import VirtualTour360Modal from '../components/VirtualTour360Modal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isValuationModalOpen, setIsValuationModalOpen] = useState(false);
  const [activeTourProperty, setActiveTourProperty] = useState<Property | null>(null);

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
      avgYield: '5.6% ROI',
    },
    {
      name: 'Bengaluru',
      desc: 'Eco-residences & golf villas in Central & North Bengaluru',
      image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      count: '980+ Properties',
      avgYield: '6.2% ROI',
    },
    {
      name: 'Delhi NCR',
      desc: 'Golf Course Road penthouses & diplomatic enclave mansions',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      count: '1,200+ Properties',
      avgYield: '5.8% ROI',
    },
    {
      name: 'Hyderabad',
      desc: 'Ultra-luxury high-rises in Jubilee Hills & Financial District',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      count: '640+ Properties',
      avgYield: '6.8% ROI',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Spectacular Luxury Hero Section */}
      <section className="relative min-h-[720px] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Animated Background Backdrop with Depth Lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=85"
            alt="BuyYourProperty Luxury Estate"
            className="w-full h-full object-cover opacity-30 scale-105 animate-pulse"
            style={{ animationDuration: '8s' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sapphire-600/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide backdrop-blur-md shadow-2xl animate-in fade-in duration-700">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>BuyYourProperty • India's #1 Ultra-Luxury Real Estate Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-extrabold tracking-tight text-white leading-[1.1]">
            Own India's Most <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-sapphire-300 drop-shadow-sm">
              Coveted Architectural Landmarks
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            Verified sea-facing sky penthouses, gated golf villas, and private coastal estates across India. Experience 360° virtual tours, instant AI valuations, and direct developer access.
          </p>

          {/* Quick Search Widget */}
          <div className="mt-8 bg-slate-900/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl shadow-2xl text-slate-100 border border-slate-700/80 max-w-4xl mx-auto text-left">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* City */}
              <div>
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" /> City / Region
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-950 text-white"
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
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Building className="w-3 h-3 text-amber-400" /> Category
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-950 text-white"
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
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                  BHK Layout
                </label>
                <select
                  value={selectedBhk}
                  onChange={(e) => setSelectedBhk(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-950 text-white"
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
                <label className="block text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                  Budget (INR)
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full text-xs font-medium py-2.5 px-3 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-400 focus:outline-none bg-slate-950 text-white"
                >
                  <option value="">Any Budget</option>
                  <option value="under-1cr">Under ₹ 1.0 Cr</option>
                  <option value="1cr-5cr">₹ 1.0 Cr - ₹ 5.0 Cr</option>
                  <option value="5cr-15cr">₹ 5.0 Cr - ₹ 15.0 Cr</option>
                  <option value="above-15cr">₹ 15.0 Cr+ (Ultra Luxury)</option>
                </select>
              </div>

              {/* Search Submit CTA */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  <Search className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Floating Action Tools Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsValuationModalOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all hover:border-amber-400/50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Instant AI Property Valuation</span>
            </button>

            <button
              onClick={() => setIsEMIModalOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-all hover:border-sapphire-400/50"
            >
              <Calculator className="w-3.5 h-3.5 text-sapphire-400" />
              <span>Indian Home Loan & Stamp Duty Engine</span>
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Counter Strip with Glassmorphism */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              ₹ 4,800 Cr+
            </p>
            <p className="text-xs text-slate-400 font-medium">Verified Property Volume</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sapphire-300 to-sapphire-500">
              50,000+
            </p>
            <p className="text-xs text-slate-400 font-medium">Curated Luxury Residences</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">
              100% RERA
            </p>
            <p className="text-xs text-slate-400 font-medium">Title & Legal Clearance</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-sapphire-400">
              360° Tours
            </p>
            <p className="text-xs text-slate-400 font-medium">Virtual Reality Guided Walkthroughs</p>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Portfolios</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Featured Luxury Residences
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Properties equipped with verified RERA documentation and interactive 360° Virtual Tours.
            </p>
          </div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 group"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900 rounded-3xl h-96 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900 rounded-3xl border border-slate-800 p-8 text-white">
            <Compass className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-200">No properties loaded</h3>
          </div>
        )}
      </section>

      {/* Interactive 360° Virtual Tour Experience Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-sapphire-950 border border-slate-800 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold">
              <Eye className="w-3.5 h-3.5" />
              <span>Next-Gen VR Property Inspection</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Tour Luxury Mansions in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sapphire-300">360° Virtual Reality</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Don't just look at flat photographs. Experience panoramic interactive 360° views of Arabian Sea sky residences, golf villas, and private plunge pools right from your laptop or phone before visiting.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => {
                  if (featuredProperties.length > 0) {
                    setActiveTourProperty(featuredProperties[0]);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Demo 360° Tour</span>
              </button>
              <Link
                to="/properties?hasVirtualTour=true"
                className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-white font-medium text-xs rounded-xl transition-all"
              >
                Browse 360° Enabled Residences
              </Link>
            </div>
          </div>

          {/* Interactive Visual Graphic */}
          <div className="w-full lg:w-96 rounded-2xl overflow-hidden aspect-[4/3] border border-amber-400/30 shadow-2xl relative group cursor-pointer"
            onClick={() => {
              if (featuredProperties.length > 0) {
                setActiveTourProperty(featuredProperties[0]);
              }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
              alt="360 Tour"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-950/80 border-2 border-amber-400 text-amber-300 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-950/80 backdrop-blur-md rounded-xl text-center text-[11px] font-bold text-amber-300">
              Click to Explore 360° Interior
            </div>
          </div>
        </div>
      </section>

      {/* Explore Indian Cities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Regional Hubs
          </p>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Prime Indian Metros & Emerging Corridors
          </h2>
          <p className="text-xs text-slate-400">
            Browse verified listings in India’s most high-growth financial and residential capital hubs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityCards.map((c) => (
            <Link
              key={c.name}
              to={`/properties?city=${c.name}`}
              className="group relative rounded-3xl overflow-hidden aspect-[4/5] bg-slate-950 shadow-md hover:shadow-2xl transition-all border border-slate-800 hover:border-amber-400/40"
            >
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {c.count}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 backdrop-blur-md px-2 py-0.5 rounded-full">
                    {c.avgYield}
                  </span>
                </div>
                <h3 className="text-2xl font-serif font-bold mt-2 text-white">{c.name}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-light">
                  {c.desc}
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold mt-3 group-hover:translate-x-1 transition-transform">
                  <span>Explore listings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA For Property Owners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 bg-white/40 px-3 py-1 rounded-full">
              For Property Owners & Developers
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-950 leading-tight">
              List Your Luxury Property on BuyYourProperty
            </h2>
            <p className="text-xs sm:text-sm text-slate-900/90 leading-relaxed font-medium">
              Reach over 250,000+ verified HNI buyers and NRI investors seeking premium residential real estate across India. Upload up to 4 high-definition photos and manage private viewing schedules directly with zero brokerage fee.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/properties/new"
                className="px-6 py-3 bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <span>List Property Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-slate-950/40 hover:bg-slate-950/10 text-slate-950 font-bold text-xs rounded-xl transition-all"
              >
                Access Owner Portal
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 bg-slate-950 text-white p-6 rounded-2xl space-y-3 text-xs max-w-xs shadow-2xl">
            <h4 className="font-bold text-amber-400 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Why List On BuyYourProperty?
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Zero listing fee for verified owners</li>
              <li>• 360° Virtual Tour hosting support</li>
              <li>• Direct booking calendar management</li>
              <li>• ImageKit high-speed cloud CDN delivery</li>
              <li>• Dedicated customer viewing concierge</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Floating 360 Tour Launcher Modal */}
      {activeTourProperty && (
        <VirtualTour360Modal
          isOpen={Boolean(activeTourProperty)}
          onClose={() => setActiveTourProperty(null)}
          property={activeTourProperty}
        />
      )}

      {/* Modals */}
      <EMICalculatorModal isOpen={isEMIModalOpen} onClose={() => setIsEMIModalOpen(false)} />
      <AIValuationModal isOpen={isValuationModalOpen} onClose={() => setIsValuationModalOpen(false)} />
    </div>
  );
};
export default HomePage;
