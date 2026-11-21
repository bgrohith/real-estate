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
  Heart,
  Layers,
  Check,
} from 'lucide-react';
import { Property } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useFavorites } from '../context/FavoritesContext';
import { useComparison } from '../context/ComparisonContext';
import ViewingModal from './ViewingModal';
import VirtualTour360Modal from './VirtualTour360Modal';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [isVirtualTourOpen, setIsVirtualTourOpen] = useState(false);

  const { formatPrice, formatArea } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCompare, isInCompare } = useComparison();

  const isFav = isFavorite(property._id);
  const isCompared = isInCompare(property._id);

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <div className="group bg-slate-900/90 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-400/50 hover:shadow-2xl hover:shadow-sapphire-500/10 transition-all duration-300 flex flex-col justify-between relative backdrop-blur-sm">
        {/* Image Container with Badges */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          <img
            src={primaryImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="bg-slate-950/90 border border-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">
              {property.propertyType}
            </span>
            {property.featured && (
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3 fill-slate-950" /> Featured
              </span>
            )}
          </div>

          {/* Top Right: Favorite & Compare Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            {/* Compare Toggle Button */}
            <button
              onClick={() => addToCompare(property)}
              className={`p-2 rounded-full backdrop-blur-md transition-all ${
                isCompared
                  ? 'bg-sapphire-600 text-white shadow-sapphire scale-105'
                  : 'bg-slate-950/70 hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Favorite Heart Button */}
            <button
              onClick={() => toggleFavorite(property)}
              className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-900 backdrop-blur-md text-white transition-all hover:scale-110 active:scale-95"
              title={isFav ? 'Remove from Saved' : 'Save to Favorites'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFav ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                }`}
              />
            </button>
          </div>

          {/* 360° Virtual Tour Badge Button */}
          {property.virtualTour && property.virtualTour.length > 0 && (
            <button
              onClick={() => setIsVirtualTourOpen(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/80 hover:bg-sapphire-600 border border-white/20 hover:border-sapphire-400 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5 shadow-xl opacity-90 group-hover:opacity-100 group-hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Experience 360° Tour</span>
            </button>
          )}

          {/* Bottom Price in Card Image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div>
              <p className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider">
                Guide Price
              </p>
              <p className="text-xl sm:text-2xl font-bold font-serif drop-shadow-md text-white">
                {formatPrice(property.price)}
              </p>
            </div>
            {property.reraId && (
              <span className="text-[10px] bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Shield className="w-3 h-3 text-emerald-400" /> RERA
              </span>
            )}
          </div>
        </div>

        {/* Card Content Section */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">
                {property.location.landmark
                  ? `${property.location.landmark}, ${property.location.city}`
                  : `${property.location.address || ''}, ${property.location.city}`}
              </span>
            </div>

            <Link
              to={`/properties/${property._id}`}
              className="block font-serif font-bold text-white text-base leading-snug hover:text-amber-400 transition-colors line-clamp-1"
              title={property.title}
            >
              {property.title}
            </Link>

            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-light">
              {property.description}
            </p>
          </div>

          {/* Specs Highlights */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-center gap-1 font-bold text-white">
                  <Bed className="w-3.5 h-3.5 text-sapphire-400" />
                  <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : property.propertyType}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Layout</span>
              </div>

              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-center gap-1 font-bold text-white">
                  <Bath className="w-3.5 h-3.5 text-sapphire-400" />
                  <span>{property.bathrooms || 1}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Baths</span>
              </div>

              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-center gap-1 font-bold text-white">
                  <Maximize2 className="w-3.5 h-3.5 text-sapphire-400" />
                  <span>{formatArea(property.area)}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Carpet</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setIsViewingModalOpen(true)}
                className="flex-1 py-2 px-3 text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-950" />
                Book Viewing
              </button>

              <Link
                to={`/properties/${property._id}`}
                className="py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center gap-1 transition-colors border border-slate-700"
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

      {/* 360° Virtual Tour Modal */}
      <VirtualTour360Modal
        isOpen={isVirtualTourOpen}
        onClose={() => setIsVirtualTourOpen(false)}
        property={property}
      />
    </>
  );
};
export default PropertyCard;
