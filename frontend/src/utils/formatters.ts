export type CurrencyType = 'INR' | 'USD' | 'AED' | 'GBP';
export type AreaUnit = 'sqft' | 'sqm' | 'acre';

// Currency exchange rates relative to INR
export const EXCHANGE_RATES: Record<CurrencyType, number> = {
  INR: 1,
  USD: 1 / 84.5,
  AED: 1 / 23.0,
  GBP: 1 / 106.8,
};

export const CURRENCY_SYMBOLS: Record<CurrencyType, string> = {
  INR: '₹',
  USD: '$',
  AED: 'AED ',
  GBP: '£',
};

/**
 * Format price according to selected currency and Indian real estate numbering conventions
 */
export const formatCurrencyPrice = (priceInINR: number, currency: CurrencyType = 'INR'): string => {
  if (!priceInINR || isNaN(priceInINR)) return 'Price on Request';

  if (currency === 'INR') {
    if (priceInINR >= 10000000) {
      const cr = (priceInINR / 10000000).toFixed(2);
      return `₹ ${parseFloat(cr)} Cr`;
    } else if (priceInINR >= 100000) {
      const lk = (priceInINR / 100000).toFixed(2);
      return `₹ ${parseFloat(lk)} Lakhs`;
    } else {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(priceInINR);
    }
  }

  const converted = priceInINR * EXCHANGE_RATES[currency];
  const symbol = CURRENCY_SYMBOLS[currency];

  if (converted >= 1000000) {
    return `${symbol}${(converted / 1000000).toFixed(2)}M`;
  } else if (converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(0)}K`;
  } else {
    return `${symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }
};

/**
 * Legacy formatter fallback
 */
export const formatIndianPrice = (price: number): string => formatCurrencyPrice(price, 'INR');

/**
 * Convert and format area in sqft, sqm, or acres
 */
export const formatPropertyArea = (sqft: number, unit: AreaUnit = 'sqft'): string => {
  if (!sqft || isNaN(sqft)) return '0 sq ft';

  if (unit === 'sqm') {
    const sqm = Math.round(sqft * 0.092903);
    return `${sqm.toLocaleString('en-IN')} sq m`;
  } else if (unit === 'acre') {
    const acres = (sqft / 43560).toFixed(2);
    return `${acres} Acres`;
  }
  return `${Math.round(sqft).toLocaleString('en-IN')} sq ft`;
};

export const formatIndianNumber = (num: number): string => {
  if (!num || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

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
 * Calculate Indian Home Loan EMI
 * EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
 */
export const calculateEMI = (
  loanAmount: number,
  annualInterestRate: number,
  tenureYears: number
): { monthlyEMI: number; totalInterest: number; totalPayment: number } => {
  const principal = loanAmount;
  const monthlyRate = annualInterestRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {
    const emi = principal / totalMonths;
    return { monthlyEMI: Math.round(emi), totalInterest: 0, totalPayment: principal };
  }

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEMI: Math.round(emi),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
  };
};

/**
 * Indian State Stamp Duty Rates (%)
 */
export const INDIAN_STAMP_DUTY_RATES: Record<string, number> = {
  Maharashtra: 6.0,
  Karnataka: 5.6,
  'Delhi NCR': 6.0,
  Telangana: 7.5,
  Goa: 4.5,
  Gujarat: 4.9,
  'Tamil Nadu': 7.0,
  'West Bengal': 5.0,
};

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

export const PROPERTY_TYPES = [
  'All Types',
  'Apartment',
  'Villa',
  'Penthouse',
  'Independent House',
  'Plot/Land',
  'Commercial',
];

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
