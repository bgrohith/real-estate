import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Compass,
  ArrowUpDown,
  Building,
} from 'lucide-react';
import api from '../services/api';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import { INDIAN_CITIES, PROPERTY_TYPES } from '../utils/formatters';

export const ListingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State populated from URL Search Params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('propertyType') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [furnishing, setFurnishing] = useState(searchParams.get('furnishing') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  // Synchronize URL query params whenever filter states change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (city && city !== 'All Cities') params.set('city', city);
    if (propertyType && propertyType !== 'All Types') params.set('propertyType', propertyType);
    if (bedrooms && bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    if (furnishing && furnishing !== 'Any') params.set('furnishing', furnishing);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (sortBy) params.set('sortBy', sortBy);
    params.set('page', '1'); // Reset to page 1 on filter submit

    setSearchParams(params);
    setPage(1);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setPropertyType('');
    setBedrooms('');
    setFurnishing('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setSearchParams({});
    setPage(1);
  };

  // Fetch properties based on active search params
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(searchParams);
        queryParams.set('page', page.toString());
        queryParams.set('limit', '9');

        const res = await api.get(`/api/properties?${queryParams.toString()}`);
        if (res.data.success) {
          setProperties(res.data.data);
          setTotalPages(res.data.totalPages || 1);
          setTotalCount(res.data.total || 0);
        }
      } catch (err) {
        console.warn('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [searchParams, page]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-semibold text-sapphire-700 uppercase tracking-wider">
            Verified Portfolios
          </span>
          <h1 className="text-3xl font-serif font-bold text-slate-900 mt-1">
            Browse Indian Real Estate
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {totalCount} luxury residences across top metropolitan addresses
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterDrawer(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sapphire-700" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                const p = new URLSearchParams(searchParams);
                p.set('sortBy', e.target.value);
                setSearchParams(p);
              }}
              className="text-xs font-medium py-2 px-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="area_desc">Largest Area (sq ft)</option>
              <option value="views">Most Viewed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-sapphire-700" /> Filter Listings
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Search Keyword
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Worli, Golf Course, Sea View..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                City / Region
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Property Category
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* BHK Bedrooms */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5">
                Bedrooms (BHK)
              </label>
              <div className="grid grid-cols-4 gap-1 text-center">
                {['Any', '2', '3', '4+'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(b === 'Any' ? '' : b)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      (bedrooms === b || (b === 'Any' && !bedrooms))
                        ? 'bg-sapphire-700 text-white border-sapphire-700'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Range (INR) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1.5">
                Price Budget (INR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400">Min Price</span>
                  <select
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                  >
                    <option value="">No Min</option>
                    <option value="5000000">₹ 50 Lakhs</option>
                    <option value="10000000">₹ 1.0 Cr</option>
                    <option value="30000000">₹ 3.0 Cr</option>
                    <option value="50000000">₹ 5.0 Cr</option>
                    <option value="100000000">₹ 10.0 Cr</option>
                  </select>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400">Max Price</span>
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs py-1.5 px-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none"
                  >
                    <option value="">No Max</option>
                    <option value="15000000">₹ 1.5 Cr</option>
                    <option value="50000000">₹ 5.0 Cr</option>
                    <option value="100000000">₹ 10.0 Cr</option>
                    <option value="250000000">₹ 25.0 Cr</option>
                    <option value="500000000">₹ 50.0 Cr</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Furnishing */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                Furnishing Status
              </label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sapphire-600 focus:outline-none bg-slate-50"
              >
                <option value="">Any Furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Apply Button */}
            <button
              onClick={applyFilters}
              className="w-full py-2.5 bg-sapphire-700 hover:bg-sapphire-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Mobile Filter Drawer Modal */}
        {showFilterDrawer && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex justify-end">
            <div className="w-full max-w-sm bg-white h-full p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-semibold text-base">Filter Properties</h3>
                <button onClick={() => setShowFilterDrawer(false)} className="p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-xs font-semibold mb-1">Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. Worli, Sea View..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold mb-1">City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                >
                  {INDIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs p-2 border rounded-lg bg-white"
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* BHK */}
              <div>
                <label className="block text-xs font-semibold mb-1">Bedrooms</label>
                <div className="grid grid-cols-4 gap-1">
                  {['Any', '2', '3', '4+'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBedrooms(b === 'Any' ? '' : b)}
                      className={`p-2 text-xs rounded border ${
                        bedrooms === b || (b === 'Any' && !bedrooms) ? 'bg-sapphire-700 text-white' : ''
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setShowFilterDrawer(false);
                  }}
                  className="w-1/2 py-2 border rounded-lg text-xs font-semibold text-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    applyFilters();
                    setShowFilterDrawer(false);
                  }}
                  className="w-1/2 py-2 bg-sapphire-700 text-white rounded-lg text-xs font-semibold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings Grid Area */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-96 border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Previous
                  </button>

                  <span className="text-xs font-medium text-slate-600 px-3">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 disabled:opacity-40 hover:bg-slate-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <Compass className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-lg font-serif font-bold text-slate-800">
                No Properties Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                We couldn't find properties matching your current filter criteria. Try expanding your budget range or clearing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-sapphire-700 text-white rounded-xl text-xs font-semibold hover:bg-sapphire-800 shadow-sm"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ListingsPage;
