import React from 'react';
import { X, Check, Bed, Bath, Maximize2, MapPin, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useCurrency } from '../context/CurrencyContext';

export const PropertyComparisonModal: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, isComparisonOpen, setIsComparisonOpen } = useComparison();
  const { formatPrice, formatArea } = useCurrency();

  if (!isComparisonOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
              Side-by-Side Analysis
            </span>
            <h3 className="text-xl font-serif font-bold text-white mt-0.5">
              Compare Luxury Properties ({compareList.length} of 3)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsComparisonOpen(false)}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 overflow-x-auto flex-1 space-y-6">
          <div className="grid grid-cols-4 gap-4 min-w-[650px]">
            {/* Attribute Labels Column */}
            <div className="space-y-4 pt-48 text-xs font-semibold text-slate-500 border-r border-slate-100 pr-3">
              <div className="py-2.5">Category</div>
              <div className="py-2.5">Price</div>
              <div className="py-2.5">Carpet Area</div>
              <div className="py-2.5">Bedrooms (BHK)</div>
              <div className="py-2.5">Bathrooms</div>
              <div className="py-2.5">Furnishing</div>
              <div className="py-2.5">Possession</div>
              <div className="py-2.5">Location</div>
              <div className="py-2.5">RERA Registered</div>
              <div className="py-2.5">360° Virtual Tour</div>
              <div className="py-2.5">Annual ROI Yield</div>
            </div>

            {/* Compared Property Columns */}
            {compareList.map((prop) => (
              <div key={prop._id} className="space-y-4 text-xs">
                {/* Property Card Header */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 p-3 h-44 flex flex-col justify-between">
                  <button
                    onClick={() => removeFromCompare(prop._id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <img
                    src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                    alt={prop.title}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <h4 className="font-semibold text-slate-900 truncate mt-1 text-[11px]" title={prop.title}>
                    {prop.title}
                  </h4>
                </div>

                {/* Values */}
                <div className="py-2.5 font-bold text-slate-800">{prop.propertyType}</div>
                <div className="py-2.5 font-serif font-bold text-sapphire-800 text-sm">{formatPrice(prop.price)}</div>
                <div className="py-2.5 font-medium text-slate-700">{formatArea(prop.area)}</div>
                <div className="py-2.5 font-medium text-slate-700">{prop.bedrooms > 0 ? `${prop.bedrooms} BHK` : 'N/A'}</div>
                <div className="py-2.5 font-medium text-slate-700">{prop.bathrooms || 1} Baths</div>
                <div className="py-2.5 font-medium text-slate-700">{prop.furnishing}</div>
                <div className="py-2.5 font-medium text-slate-700">{prop.possession}</div>
                <div className="py-2.5 font-medium text-slate-700 truncate">{prop.location.city}</div>
                <div className="py-2.5 font-medium text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Yes
                </div>
                <div className="py-2.5 font-medium text-slate-700">
                  {prop.virtualTour && prop.virtualTour.length > 0 ? (
                    <span className="text-sapphire-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> 360° Available
                    </span>
                  ) : (
                    'Standard Gallery'
                  )}
                </div>
                <div className="py-2.5 font-bold text-emerald-600">
                  {prop.investmentYield || 5.4}% gross
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PropertyComparisonModal;
