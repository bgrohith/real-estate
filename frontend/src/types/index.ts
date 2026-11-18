export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'agent' | 'admin';
  phone?: string;
  avatar?: string;
  createdAt?: string;
}

export interface PropertyImage {
  url: string;
  fileId?: string;
  thumbnail?: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state?: string;
  pincode?: string;
  landmark?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: 'Apartment' | 'Villa' | 'Penthouse' | 'Independent House' | 'Plot/Land' | 'Commercial';
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
  possession: 'Ready to Move' | 'Under Construction' | 'New Launch';
  location: PropertyLocation;
  images: PropertyImage[];
  amenities: string[];
  status: 'Available' | 'Under Offer' | 'Sold';
  featured: boolean;
  viewsCount: number;
  owner: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  property: Property;
  owner: User;
  user?: User;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  preferredDate: string;
  timeSlot: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  cancellationReason?: string;
  cancelledBy?: 'user' | 'owner' | 'guest' | 'none';
  createdAt: string;
}

export interface PropertyFilters {
  keyword?: string;
  city?: string;
  propertyType?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  minArea?: number | string;
  maxArea?: number | string;
  bedrooms?: string;
  furnishing?: string;
  possession?: string;
  featured?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'area_desc' | 'views';
  page?: number;
  limit?: number;
}

export interface AIPropertyListing {
  title: string;
  description: string;
  city?: string;
  locality?: string;
  price?: number;
  priceText?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  images: string[];
  source: string;
  sourceUrl?: string;
  aiRankScore: number;
  matchReason?: string;
}
