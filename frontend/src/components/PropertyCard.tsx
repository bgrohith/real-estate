import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Property } from '../types';
import { formatIndianPrice, formatIndianNumber } from '../utils/formatters';
import ViewingModal from './ViewingModal';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-sapphire-400 hover:shadow-sapphire transition-all duration-300 flex flex-col">
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="bg-sapphire-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">
              {property.propertyType}
            </span>
            {property.featured && (
              <span className="bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 z-10">
            <span className="bg-white/90 text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          </div>

          {/* Bottom Overlay Price inside Image on Mobile / Subtle on Desktop */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div>
              <p className="text-xs font-medium text-slate-200 uppercase tracking-wider">
                Guide Price
              </p>
              <p className="text-xl font-bold font-serif drop-shadow-md">
                {formatIndianPrice(property.price)}
              </p>
            </div>
            {property.images && property.images.length > 1 && (
              <span className="text-[11px] bg-slate-900/70 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded-md">
                {property.images.length} Photos
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-sapphire-600 shrink-0" />
              <span className="truncate">
                {property.location.landmark
                  ? `${property.location.landmark}, ${property.location.city}`
                  : `${property.location.address || ''}, ${property.location.city}`}
              </span>
            </div>

            <Link
              to={`/properties/${property._id}`}
              className="block font-semibold text-slate-900 text-base leading-snug hover:text-sapphire-700 transition-colors line-clamp-1 group-hover:underline underline-offset-2"
              title={property.title}
            >
              {property.title}
            </Link>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Specs Highlights */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-600 pb-3">
              {property.bedrooms > 0 ? (
                <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <Bed className="w-3.5 h-3.5 text-sapphire-600" />
                    <span>{property.bedrooms} BHK</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5">Bedrooms</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                  <span className="font-semibold text-slate-900 text-[11px]">{property.furnishing}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Furnishing</span>
                </div>
              )}

              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <Bath className="w-3.5 h-3.5 text-sapphire-600" />
                  <span>{property.bathrooms || 1}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">Baths</span>
              </div>

              <div className="flex flex-col items-center justify-center p-1.5 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-1 font-semibold text-slate-900">
                  <Maximize2 className="w-3.5 h-3.5 text-sapphire-600" />
                  <span>{formatIndianNumber(property.area)}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5">sq ft</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-sapphire-800 bg-sapphire-50 hover:bg-sapphire-100 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-sapphire-700" />
                Book Viewing
              </button>

              <Link
                to={`/properties/${property._id}`}
                className="py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-sapphire-800 rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Viewing Booking Modal */}
      <ViewingModal
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        property={property}
      />
    </>
  );
};
export default PropertyCard;
