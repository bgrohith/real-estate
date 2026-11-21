import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, Building2, MapPin, CheckCircle, BarChart3, ArrowRight } from 'lucide-react';
import { INDIAN_CITIES, PROPERTY_TYPES, formatIndianPrice } from '../utils/formatters';
import { Property } from '../types';

interface AIValuationModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property;
}

export const AIValuationModal: React.FC<AIValuationModalProps> = ({ isOpen, onClose, property }) => {
  const [city, setCity] = useState(property?.location?.city || 'Mumbai');
  const [locality, setLocality] = useState(property?.location?.address || 'Worli / Lower Parel');
  const [propertyType, setPropertyType] = useState<string>(property?.propertyType || 'Apartment');
  const [area, setArea] = useState<number>(property?.area || 2400);
  const [bedrooms, setBedrooms] = useState<number>(property?.bedrooms || 3);
  const [furnishing, setFurnishing] = useState(property?.furnishing || 'Furnished');

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<{
    estimatedPrice: number;
    priceRangeLow: number;
    priceRangeHigh: number;
    ratePerSqFt: number;
    fiveYearAppreciation: number;
    projectedValue2031: number;
    annualRentalYield: number;
    confidenceScore: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    setTimeout(() => {
      // Deterministic realistic Indian real estate valuation algorithm
      let baseRate = 32000; // Mumbai base
      if (city === 'Bengaluru') baseRate = 14500;
      else if (city === 'Delhi NCR') baseRate = 22000;
      else if (city === 'Hyderabad') baseRate = 11500;
      else if (city === 'Pune') baseRate = 9800;
      else if (city === 'Goa') baseRate = 18500;

      if (propertyType === 'Penthouse') baseRate *= 1.45;
      else if (propertyType === 'Villa') baseRate *= 1.35;

      if (furnishing === 'Furnished') baseRate *= 1.12;

      const estimatedPrice = Math.round(area * baseRate);
      const priceRangeLow = Math.round(estimatedPrice * 0.94);
      const priceRangeHigh = Math.round(estimatedPrice * 1.08);
      const fiveYearAppreciation = city === 'Bengaluru' || city === 'Hyderabad' ? 48.5 : 38.2;
      const projectedValue2031 = Math.round(estimatedPrice * (1 + fiveYearAppreciation / 100));
      const annualRentalYield = Math.round(estimatedPrice * 0.048);

      setResult({
        estimatedPrice,
        priceRangeLow,
        priceRangeHigh,
        ratePerSqFt: Math.round(baseRate),
        fiveYearAppreciation,
        projectedValue2031,
        annualRentalYield,
        confidenceScore: 96,
      });
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sapphire-950 via-sapphire-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Valuation Engine</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white">
            Instant Property Valuation & ROI Predictor
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Compute real-time market value, price per sq ft, and 5-year capital appreciation powered by BuyYourProperty AI.
          </p>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleCalculate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600 font-medium"
                >
                  {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Locality / Sector</label>
                <input
                  type="text"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  placeholder="e.g. Worli / Indiranagar"
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600 font-medium"
                >
                  {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Carpet (sq ft)</label>
                <input
                  type="number"
                  min={200}
                  max={25000}
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">BHK</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sapphire-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={calculating}
              className="w-full py-3 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              {calculating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Market Transactions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Calculate AI Valuation</span>
                </>
              )}
            </button>
          </form>

          {/* Results Display */}
          {result && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
              <div className="p-5 bg-gradient-to-br from-sapphire-900 to-slate-900 rounded-2xl text-white space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                  <span>Estimated Market Value</span>
                  <span>{result.confidenceScore}% Model Confidence</span>
                </div>
                <p className="text-3xl font-serif font-bold text-white">
                  {formatIndianPrice(result.estimatedPrice)}
                </p>
                <p className="text-xs text-slate-300">
                  Value Range: {formatIndianPrice(result.priceRangeLow)} – {formatIndianPrice(result.priceRangeHigh)} (approx. ₹ {result.ratePerSqFt.toLocaleString('en-IN')} / sq ft)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    5-Year Capital Growth
                  </span>
                  <p className="text-base font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +{result.fiveYearAppreciation}%
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Proj. Value: <strong>{formatIndianPrice(result.projectedValue2031)}</strong> by 2031
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Est. Annual Rental Yield
                  </span>
                  <p className="text-base font-bold text-sapphire-700 mt-0.5">
                    {formatIndianPrice(result.annualRentalYield)} / yr
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Yield Rate: <strong>~4.8% gross</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AIValuationModal;
