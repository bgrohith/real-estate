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
} from 'lucide-react';
import api from '../services/api';
import { Property, User } from '../types';
import ImageGallery from '../components/ImageGallery';
import ViewingModal from '../components/ViewingModal';
import { formatIndianPrice, formatIndianNumber, formatDate } from '../utils/formatters';

export const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
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
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-sapphire-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
          Loading Residence Portfolio...
        </p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <Home className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-serif font-bold text-slate-900">Property Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This listing might have been removed or sold.'}</p>
        <Link
          to="/properties"
          className="inline-block px-4 py-2 bg-sapphire-700 text-white rounded-lg text-xs font-semibold"
        >
          Back to Listings
        </Link>
      </div>
    );
  }

  const owner = typeof property.owner === 'object' ? (property.owner as User) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sapphire-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-sm transition-all"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Residence</span>
            </>
          )}
        </button>
      </div>

      {/* Main Grid: Gallery + Quick Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gallery - 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={property.images} title={property.title} />

          {/* Title & Location Header */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sapphire-100 text-sapphire-800">
                {property.propertyType}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
              </span>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-medium uppercase">Carpet Area</span>
              <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-sapphire-700" />
                {formatIndianNumber(property.area)} sq ft
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

          {/* Description */}
          <div className="space-y-3 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-slate-900">
              About This Residence
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line font-light">
              {property.description}
            </p>
          </div>

          {/* Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
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
        </div>

        {/* Right Sticky Sidebar: Pricing & Private Viewing Action */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-6">
            {/* Price & Booking Card */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg space-y-5">
              <div>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Offered At
                </span>
                <p className="text-3xl font-serif font-bold text-sapphire-900 mt-1">
                  {formatIndianPrice(property.price)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Approx. ₹ {Math.round(property.price / property.area).toLocaleString('en-IN')} / sq ft
                </p>
              </div>

              <div className="p-3 bg-sapphire-50 rounded-xl border border-sapphire-100 text-xs text-sapphire-900 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-sapphire-700 shrink-0 mt-0.5" />
                <span>
                  Sapphire Verified: 100% genuine title deed and direct developer/owner confirmation.
                </span>
              </div>

              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="w-full py-3.5 px-4 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-sapphire flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Private Viewing</span>
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Guests and registered users can reserve viewing slots with no fee.
              </p>
            </div>

            {/* Owner / Consultant Profile Card */}
            {owner && (
              <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
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
                    <p className="text-xs text-slate-500 capitalize">{owner.role} • Sapphire Partner</p>
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
    </div>
  );
};
export default PropertyDetailsPage;
