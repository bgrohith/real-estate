/**
 * Format price in Indian Rupee format (Crores / Lakhs)
 * e.g., 25000000 -> ₹ 2.50 Cr
 *       8500000 -> ₹ 85 Lakhs
 */
export const formatIndianPrice = (price: number): string => {
  if (!price || isNaN(price)) return '₹ Price on Request';

  if (price >= 10000000) {
    const cr = (price / 10000000).toFixed(2);
    // remove trailing zero if unnecessary like 2.00 -> 2
    return `₹ ${parseFloat(cr)} Cr`;
  } else if (price >= 100000) {
    const lk = (price / 100000).toFixed(2);
    return `₹ ${parseFloat(lk)} Lakhs`;
  } else {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
};

/**
 * Format raw numbers with Indian Comma System (e.g., 10,00,000)
 */
export const formatIndianNumber = (num: number): string => {
  if (!num || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format date string into human-friendly format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Top Indian Metro & Emerging Real Estate Cities
 */
export const INDIAN_CITIES = [
  'All Cities',
  'Mumbai',
  'Bengaluru',
  'Delhi NCR',
  'Hyderabad',
  'Pune',
  'Goa',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
];

/**
 * Common Property Types
 */
export const PROPERTY_TYPES = [
  'All Types',
  'Apartment',
  'Villa',
  'Penthouse',
  'Independent House',
  'Plot/Land',
  'Commercial',
];

/**
 * Standard amenities list for property creation
 */
export const STANDARD_AMENITIES = [
  '24/7 Security',
  'Power Backup',
  'Clubhouse',
  'Swimming Pool',
  'Reserved Parking',
  'Gym & Fitness Center',
  'EV Charging Bays',
  'High-Speed Elevators',
  'Kids Play Area',
  'Smart Home Automation',
  'Landscaped Gardens',
  'Servant Quarters',
  'Sea / Skyline View',
  'Vastu Compliant',
];
