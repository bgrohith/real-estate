import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Share2,
  CheckCircle,
  Building,
  ShieldCheck,
  Eye,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  Home,
  Check,
  Video,
  Calculator,
  TrendingUp,
  Heart,
  Scale,
  Compass,
  CheckSquare,
} from 'lucide-react';
import api from '../services/api';
import { Property, User } from '../types';
import ImageGallery from '../components/ImageGallery';
import ViewingModal from '../components/ViewingModal';
import VirtualTour360Modal from '../components/VirtualTour360Modal';
import EMICalculatorModal from '../components/EMICalculatorModal';
import AIValuationModal from '../components/AIValuationModal';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useComparison } from '../context/ComparisonContext';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { formatPrice, formatArea } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useComparison();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isEMIModalOpen, setIsEMIModalOpen] = useState(false);
  const [isAIValuationOpen, setIsAIValuationOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await api.get(`/api/properties/${id}`);
        if (res.data.success) {
          setProperty(res.data.data);
        } else {
          setError('Property not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 border-4 border-sapphire-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Loading BuyYourProperty Residence Portfolio...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
        <Home className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-slate-900">Property Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This listing might have been removed or sold.'}</p>
        <Link
          to="/properties"
          className="inline-block px-5 py-2.5 bg-sapphire-700 text-white rounded-xl text-xs font-semibold hover:bg-sapphire-800 shadow-sm"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  const owner = typeof property.owner === 'object' ? (property.owner as User) : null;
  const favorited = isFavorite(property._id);
  const compared = isInCompare(property._id);

  // Lifestyle scores default if undefined
  const scores = property.lifestyleScores || {
    connectivity: 94,
    luxury: 98,
    greenArea: 86,
    greenery: 86,
    safety: 96,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar: Back button, Share, Favorite, Compare */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sapphire-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portfolios</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Comparison Toggle */}
          <button
            onClick={() => {
              if (compared) {
                removeFromCompare(property._id);
              } else {
                addToCompare(property);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
              compared
                ? 'bg-sapphire-700 text-white border-sapphire-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{compared ? 'In Comparison' : 'Compare'}</span>
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => toggleFavorite(property)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
              favorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{favorited ? 'Shortlisted' : 'Save'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-sm transition-all"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Share Residence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Gallery + Details & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Gallery, 360 Banner, Overview, Lifestyle Scores */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={property.images} title={property.title} />

          {/* 360° Virtual Tour Banner Trigger */}
          <div className="bg-gradient-to-r from-sapphire-900 via-sapphire-800 to-indigo-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-sapphire-700/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-sapphire-500/20 to-transparent pointer-events-none" />
            <div className="space-y-1 text-center sm:text-left z-10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Interactive 3D Walkthrough
              </span>
              <h3 className="text-lg font-serif font-bold text-white">
                Experience 360° Virtual Reality Tour
              </h3>
              <p className="text-xs text-sapphire-200 font-light">
                Explore the grand living salon, master suite, terrace view, and gourmet kitchen.
              </p>
            </div>
            <button
              onClick={() => setIsTourModalOpen(true)}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-sapphire-950 font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 shrink-0 flex items-center gap-2 z-10"
            >
              <Video className="w-4 h-4 text-sapphire-700" />
              <span>Launch 360° Tour</span>
            </button>
          </div>

          {/* Title & Location Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sapphire-100 text-sapphire-800">
                {property.propertyType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> BuyYourProperty Verified
              </span>
              {property.reraId && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1">
                  RERA: {property.reraId}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" /> {property.viewsCount} views
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-snug">
              {property.title}
            </h1>

            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-sapphire-700 shrink-0" />
              <span>
                {property.location.address}, {property.location.city}
                {property.location.state ? `, ${property.location.state}` : ''}
                {property.location.pincode ? ` - ${property.location.pincode}` : ''}
              </span>
            </div>
          </div>

          {/* Core Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Carpet Area</span>
              <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-sapphire-700" />
                {formatArea(property.area)}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Configuration</span>
              <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-sapphire-700" />
                {property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.propertyType}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Bathrooms</span>
              <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-sapphire-700" />
                {property.bathrooms || 1} Baths
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Possession</span>
              <p className="text-base font-bold text-slate-900">
                {property.possession}
              </p>
            </div>
          </div>

          {/* Locality Lifestyle Radar / Score Gauges */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-sapphire-700" /> Locality Lifestyle & Livability Index
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated based on municipal civic amenities, metro transit proximity, and green density.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Tier-1 Rating (A+)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <div className="text-2xl font-serif font-bold text-sapphire-800">
                  {scores.connectivity}/100
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Connectivity</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Metro & Arterial Highways</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <div className="text-2xl font-serif font-bold text-indigo-700">
                  {scores.luxury}/100
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Luxury Lifestyle</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Clubs, Fine Dining & Retail</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <div className="text-2xl font-serif font-bold text-emerald-700">
                  {scores.greenery || scores.greenArea || 86}/100
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Eco & Greenery</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Parks & Air Quality</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                <div className="text-2xl font-serif font-bold text-blue-700">
                  {scores.safety}/100
                </div>
                <div className="text-xs font-semibold text-slate-700 mt-1">Safety & Gated</div>
                <div className="text-[10px] text-slate-400 mt-0.5">24/7 Patrol & Access</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              About This Residence
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Amenities & Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-sapphire-700 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RERA Certificate Block */}
          {property.reraId && (
            <div className="p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl border border-emerald-200 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-emerald-950">
                    Real Estate Regulatory Authority (RERA) Registered
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                    Active Compliance
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-mono">
                  Registration ID: <span className="font-bold">{property.reraId}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Approved title deeds, verified escrow account compliance, and construction milestones vetted by BuyYourProperty legal cell.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar: Pricing, ROI Engine, EMI trigger, Private Viewing Action */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            {/* Price & Booking Card */}
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-lg space-y-5">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Offered At
                </span>
                <p className="text-3xl font-serif font-bold text-sapphire-900 mt-1">
                  {formatPrice(property.price)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Approx. ₹ {Math.round(property.price / property.area).toLocaleString('en-IN')} / sq ft
                </p>
              </div>

              {/* Investment ROI Predictor Widget */}
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-sapphire-50 rounded-2xl border border-indigo-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-indigo-600" /> Investment Yield
                  </span>
                  <span className="text-xs font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                    {property.investmentYield || 4.2}% Gross Yield
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-indigo-100/80">
                  <span>5-Yr Capital Growth:</span>
                  <span className="font-bold text-emerald-600">
                    +{property.appreciationRate || 11.5}% CAGR
                  </span>
                </div>
                <button
                  onClick={() => setIsAIValuationOpen(true)}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>AI Valuation & ROI Forecast</span>
                </button>
              </div>

              {/* Indian Home Loan & Stamp Duty Estimator Trigger */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Estimated EMI:</span>
                  <span className="font-bold text-slate-900">
                    ₹ {Math.round((property.price * 0.8 * 0.085) / 12).toLocaleString('en-IN')}/mo*
                  </span>
                </div>
                <button
                  onClick={() => setIsEMIModalOpen(true)}
                  className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-sapphire-700" />
                  <span>Calculate EMI & Stamp Duty</span>
                </button>
              </div>

              <div className="p-3 bg-sapphire-50 rounded-2xl border border-sapphire-100 text-xs text-sapphire-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sapphire-700 shrink-0 mt-0.5" />
                <span>
                  BuyYourProperty Verified: Clear title deed, zero brokerage for select builder tie-ups, and verified owner verification.
                </span>
              </div>

              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="w-full py-3.5 px-4 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-sm rounded-2xl transition-all shadow-md hover:shadow-sapphire flex items-center justify-center gap-2 active:scale-98"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Private Viewing</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Guests and registered users can reserve viewing slots with zero upfront fee.
              </p>
            </div>

            {/* Owner / Consultant Profile Card */}
            {owner && (
              <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Listed By
                </h4>
                <div className="flex items-center gap-3">
                  <img
                    src={owner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={owner.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-sapphire-600/30"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{owner.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{owner.role} • BuyYourProperty Partner</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  {owner.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sapphire-700" />
                      <span>{owner.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-sapphire-700" />
                    <span>{owner.email}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Viewing Booking Modal */}
      <ViewingModal
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        property={property}
      />

      {/* 360° Virtual Reality Tour Modal */}
      <VirtualTour360Modal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        property={property}
      />

      {/* Indian EMI & Stamp Duty Modal */}
      <EMICalculatorModal
        isOpen={isEMIModalOpen}
        onClose={() => setIsEMIModalOpen(false)}
        defaultPrice={property.price}
        city={property.location.city}
      />

      {/* AI Valuation & ROI Predictor Modal */}
      <AIValuationModal
        isOpen={isAIValuationOpen}
        onClose={() => setIsAIValuationOpen(false)}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailsPage;
