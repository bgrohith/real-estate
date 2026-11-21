import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Plus,
  Building,
  MapPin,
  Check,
  AlertCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatIndianPrice, INDIAN_CITIES, PROPERTY_TYPES, STANDARD_AMENITIES } from '../utils/formatters';

export const CreateEditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [price, setPrice] = useState<number | ''>('');
  const [area, setArea] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [furnishing, setFurnishing] = useState('Semi-Furnished');
  const [possession, setPossession] = useState('Ready to Move');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [reraId, setReraId] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Security',
    'Power Backup',
    'Clubhouse',
  ]);

  // Image handling (up to 4 images)
  const [existingImages, setExistingImages] = useState<{ url: string; fileId?: string }[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  // Fetch existing property when editing
  useEffect(() => {
    if (isEditing && id) {
      const loadProperty = async () => {
        try {
          const res = await api.get(`/api/properties/${id}`);
          if (res.data.success) {
            const p = res.data.data;
            // Check ownership
            const ownerId = typeof p.owner === 'object' ? p.owner._id : p.owner;
            if (user && ownerId !== user.id && user.role !== 'admin') {
              setErrorMessage('You do not have permission to edit this property listing.');
              return;
            }

            setTitle(p.title);
            setDescription(p.description);
            setPropertyType(p.propertyType);
            setPrice(p.price);
            setArea(p.area);
            setBedrooms(p.bedrooms);
            setBathrooms(p.bathrooms);
            setFurnishing(p.furnishing);
            setPossession(p.possession);
            setAddress(p.location.address);
            setCity(p.location.city);
            setState(p.location.state || '');
            setPincode(p.location.pincode || '');
            setLandmark(p.location.landmark || '');
            setReraId(p.reraId || '');
            setSelectedAmenities(p.amenities || []);
            setExistingImages(p.images || []);
          }
        } catch (err: any) {
          setErrorMessage(err.response?.data?.error || 'Failed to fetch property details.');
        } finally {
          setFetchLoading(false);
        }
      };
      loadProperty();
    }
  }, [id, isEditing, user]);

  // Handle image files selection (max 4 total images)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const remainingSlots = 4 - (existingImages.length + newImageFiles.length);

      if (filesArray.length > remainingSlots) {
        alert(`You can upload a maximum of 4 images per property. Only first ${remainingSlots} images will be added.`);
      }

      const filesToAdd = filesArray.slice(0, remainingSlots);
      const newFiles = [...newImageFiles, ...filesToAdd];
      setNewImageFiles(newFiles);

      // Generate previews
      const previewsToAdd = filesToAdd.map((file) => URL.createObjectURL(file));
      setNewImagePreviews([...newImagePreviews, ...previewsToAdd]);
    }
  };

  const removeNewImage = (index: number) => {
    const updatedFiles = newImageFiles.filter((_, i) => i !== index);
    const updatedPreviews = newImagePreviews.filter((_, i) => i !== index);
    setNewImageFiles(updatedFiles);
    setNewImagePreviews(updatedPreviews);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setErrorMessage('Please upload at least 1 image for your property listing.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('propertyType', propertyType);
      formData.append('price', price.toString());
      formData.append('area', area.toString());
      formData.append('bedrooms', bedrooms.toString());
      formData.append('bathrooms', bathrooms.toString());
      formData.append('furnishing', furnishing);
      formData.append('possession', possession);
      formData.append('address', address);
      formData.append('city', city);
      formData.append('state', state);
      formData.append('pincode', pincode);
      formData.append('landmark', landmark);
      if (reraId) {
        formData.append('reraId', reraId);
      }
      formData.append('amenities', JSON.stringify(selectedAmenities));

      // Append up to 4 images
      newImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      if (isEditing) {
        await api.put(`/api/properties/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        navigate(`/properties/${id}`);
      } else {
        const res = await api.post('/api/properties', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          navigate(`/properties/${res.data.data._id}`);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error || 'Failed to save property listing. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-sapphire-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 mt-3">Loading listing...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sapphire-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
            {isEditing ? 'Edit Property Listing' : 'Post Exclusive Property'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Fill in the details below to publish your listing on BuyYourProperty's verified network.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building className="w-4 h-4 text-sapphire-700" /> Basic Overview
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lodha World One - 4 BHK Sea View Luxury Sky Residence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              RERA Registration Number (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. P51900001345 (MahaRERA / PRM/KA/RERA/...)"
              value={reraId}
              onChange={(e) => setReraId(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Property Category *
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              >
                {PROPERTY_TYPES.filter((t) => t !== 'All Types').map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Furnishing *
              </label>
              <select
                value={furnishing}
                onChange={(e) => setFurnishing(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              >
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Possession Status *
              </label>
              <select
                value={possession}
                onChange={(e) => setPossession(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              >
                <option value="Ready to Move">Ready to Move</option>
                <option value="Under Construction">Under Construction</option>
                <option value="New Launch">New Launch</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe key architectural elements, high-end Italian finishes, views, ceiling heights, ventilation, and exclusivity..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 2: Financials & Dimensions */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sapphire-700" /> Pricing & Dimensions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                min={100000}
                placeholder="e.g. 24500000 (2.45 Cr)"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
              {price ? (
                <p className="text-xs font-semibold text-sapphire-700 mt-1.5">
                  Display Price: {formatIndianPrice(Number(price))}
                </p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Carpet Area (sq ft) *
              </label>
              <input
                type="number"
                required
                min={50}
                placeholder="e.g. 3450"
                value={area}
                onChange={(e) => setArea(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bedrooms (BHK)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Location Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sapphire-700" /> Location & Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              >
                {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="e.g. Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Project Name / Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. World Towers, Senapati Bapat Marg, Lower Parel"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Prominent Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Opposite St. Regis / Near Phoenix Palladium"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Postal Pincode
              </label>
              <input
                type="text"
                placeholder="e.g. 400013"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sapphire-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: ImageKit 4-Image Upload Zone */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-sapphire-700" /> Property Imagery (Up to 4 Images)
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {existingImages.length + newImageFiles.length} of 4 images selected
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Upload up to 4 high-definition property photos. Images will be optimized and served via ImageKit cloud CDN.
          </p>

          {/* Upload Dropzone */}
          {existingImages.length + newImageFiles.length < 4 && (
            <label className="border-2 border-dashed border-slate-300 hover:border-sapphire-600 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-sapphire-50/40 transition-colors">
              <Upload className="w-8 h-8 text-sapphire-700 mb-2" />
              <p className="text-xs font-semibold text-slate-800">
                Click to browse or drag and drop images
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                JPEG, PNG, or WebP up to 5MB each
              </p>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}

          {/* Image Previews Grid */}
          {(existingImages.length > 0 || newImagePreviews.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {/* Existing Images */}
              {existingImages.map((img, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                    Existing
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Newly Uploaded Image Previews */}
              {newImagePreviews.map((previewUrl, idx) => (
                <div key={`new-${idx}`} className="relative aspect-[16/10] rounded-xl overflow-hidden border-2 border-sapphire-500 group">
                  <img src={previewUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] bg-sapphire-900 text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewImage(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600 text-white shadow-sm hover:bg-rose-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 5: Amenities Selection */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Check className="w-4 h-4 text-sapphire-700" /> Amenities & Features
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STANDARD_AMENITIES.map((amenity) => {
              const isChecked = selectedAmenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    isChecked
                      ? 'bg-sapphire-50 border-sapphire-600 text-sapphire-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-sapphire-700 border-sapphire-700 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3" />}
                  </div>
                  <span className="truncate">{amenity}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-sapphire-700 hover:bg-sapphire-800 text-white text-xs font-semibold shadow-md hover:shadow-sapphire transition-all disabled:opacity-50"
          >
            {loading ? 'Publishing Listing...' : isEditing ? 'Update Property Listing' : 'Publish Property Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreateEditPropertyPage;
