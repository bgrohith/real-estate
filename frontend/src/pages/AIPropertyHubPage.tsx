import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Key,
  Shield,
  ExternalLink,
  Layers,
  ArrowRight,
  RotateCcw,
  Sliders,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Building2,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { AIPropertyListing } from '../types';

export const AIPropertyHubPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [firecrawlKey, setFirecrawlKey] = useState(
    localStorage.getItem('sapphireiq_firecrawl_key') || ''
  );
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIPropertyListing[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const samplePrompts = [
    '3 BHK sea-facing luxury apartment in Worli or Bandra Mumbai under 10 Cr with clubhouse',
    'Private golf course villa in North Bengaluru near international airport with private pool',
    'DLF Phase 5 Gurugram 4 BHK penthouses with panoramic golf course views and servant quarters',
    'Ultra-luxury high rise in Jubilee Hills Hyderabad Financial District with smart automation',
  ];

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sapphireiq_firecrawl_key', firecrawlKey.trim());
    setKeySavedMessage(true);
    setTimeout(() => setKeySavedMessage(false), 3000);
  };

  const handleSearch = async (promptToUse?: string) => {
    const searchQuery = promptToUse || query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMessage(null);
    setHasSearched(true);

    try {
      const headers: Record<string, string> = {};
      if (firecrawlKey.trim()) {
        headers['x-firecrawl-key'] = firecrawlKey.trim();
      }

      const res = await api.post(
        '/api/ai-hub/search',
        { query: searchQuery },
        { headers }
      );

      if (res.data.success) {
        setResults(res.data.data);
      } else {
        setErrorMessage(res.data.error || 'AI search could not complete.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'AI Discovery service is temporarily unavailable.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-sapphire-950 via-sapphire-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sapphire-800/80 border border-sapphire-400/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Driven Real Estate Matchmaker</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            SapphireIQ AI Property Hub
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            Search Indian real estate using natural conversational prompts. Powered by Firecrawl web discovery and AI ranking. Rentals are filtered out automatically so you only see genuine purchase listings.
          </p>

          {/* BYOK Toggle */}
          <div className="pt-2 flex items-center gap-4">
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-all"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {firecrawlKey ? 'Firecrawl Key Connected (BYOK)' : 'Configure Firecrawl Key (BYOK)'}
              </span>
            </button>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
          <Sparkles className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Bring Your Own Key Collapsible Settings */}
      {showKeySettings && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-sapphire-700" />
              Firecrawl API Key (Bring Your Own Key)
            </h3>
            <span className="text-xs text-slate-400">Sent securely via request headers</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            SapphireIQ supports BYOK for Firecrawl. Enter your personal Firecrawl API key below to unlock live web-crawled listings across Indian portals. If left blank, the platform automatically utilizes our curated luxury property matching index.
          </p>

          <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="fc_live_xxxxxxxxxxxxxxxxxxxxxxxx"
              value={firecrawlKey}
              onChange={(e) => setFirecrawlKey(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            />
            <button
              type="submit"
              className="py-2.5 px-5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl transition-all shadow-sm shrink-0"
            >
              Save Key to Session
            </button>
          </form>

          {keySavedMessage && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" /> Firecrawl key saved in local storage!
            </p>
          )}
        </div>
      )}

      {/* Natural Language Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-md space-y-3">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Describe Your Ideal Residence
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. 4 BHK sea facing penthouse in South Mumbai with infinity pool under 20 Cr..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="py-3 px-6 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Crawling & Ranking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>AI Property Discovery</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Prompt Pills */}
        <div className="pt-2">
          <p className="text-[11px] font-medium text-slate-400 mb-1.5">Try searching with:</p>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(p);
                  handleSearch(p);
                }}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-sapphire-50 hover:text-sapphire-800 px-3 py-1.5 rounded-lg text-left transition-all"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-900">
                AI Matchmaker Results
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {results.length} verified sale listings ranked by semantic match score
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Rental Listings Filtered Out (Buy Only)</span>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-64 border border-slate-200 animate-pulse" />
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-sapphire hover:border-sapphire-300 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    {/* Badges: Match Score & Source */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sapphire-100 text-sapphire-800 font-bold text-xs">
                        <Sparkles className="w-3 h-3 text-sapphire-600" />
                        {item.aiRankScore}% AI Match Score
                      </span>

                      {/* Source Badge */}
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                        Source: <strong>{item.source}</strong>
                      </span>
                    </div>

                    {/* Title & Price */}
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-1">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-lg font-bold text-sapphire-800">
                          {item.priceText || 'Price On Request'}
                        </span>
                        {item.city && (
                          <span className="text-xs text-slate-500">
                            • {item.locality || item.city}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AI Rationale Tag */}
                    {item.matchReason && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-sapphire-700 tracking-wider block">
                          AI Ranking Analysis:
                        </span>
                        <p className="leading-relaxed">{item.matchReason}</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 text-[11px]">
                      {item.bedrooms ? `${item.bedrooms} BHK • ` : ''}
                      {item.area ? `${item.area} sq ft` : 'Residential'}
                    </span>

                    {item.sourceUrl ? (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sapphire-700 hover:text-sapphire-900 flex items-center gap-1 font-semibold"
                      >
                        <span>View on {item.source}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400">Direct Listing</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="font-semibold text-slate-800 text-sm">No Matching Properties</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try refining your natural language prompt with specific cities (e.g. Mumbai, Bengaluru) or budget ranges.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AIPropertyHubPage;
