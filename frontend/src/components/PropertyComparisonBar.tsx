import React from 'react';
import { Layers, ArrowRight, X } from 'lucide-react';
import { useComparison } from '../context/ComparisonContext';
import { useCurrency } from '../context/CurrencyContext';

export const PropertyComparisonBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare, setIsComparisonOpen } = useComparison();
  const { formatPrice } = useCurrency();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 text-white border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-md max-w-xl w-[95%] animate-in slide-in-from-bottom duration-200 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-x-auto">
        {compareList.map((prop) => (
          <div key={prop._id} className="relative group shrink-0">
            <img
              src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80'}
              alt={prop.title}
              className="w-12 h-12 rounded-xl object-cover border border-slate-600"
            />
            <button
              onClick={() => removeFromCompare(prop._id)}
              className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-600 text-white hover:bg-rose-700"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <div className="hidden sm:block text-xs">
          <p className="font-semibold">{compareList.length} Selected</p>
          <p className="text-[10px] text-slate-400">Max 3 properties</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={clearCompare}
          className="text-xs text-slate-400 hover:text-white px-2 py-1"
        >
          Clear
        </button>
        <button
          onClick={() => setIsComparisonOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-sapphire-600 to-sapphire-800 hover:from-sapphire-500 hover:to-sapphire-700 text-white rounded-xl text-xs font-bold shadow-sapphire flex items-center gap-1.5 transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
export default PropertyComparisonBar;
