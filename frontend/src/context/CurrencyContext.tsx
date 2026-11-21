import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyType, AreaUnit, formatCurrencyPrice, formatPropertyArea } from '../utils/formatters';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  unit: AreaUnit;
  setUnit: (u: AreaUnit) => void;
  formatPrice: (priceInINR: number) => string;
  formatArea: (sqft: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyType>(
    (localStorage.getItem('byp_currency') as CurrencyType) || 'INR'
  );
  const [unit, setUnitState] = useState<AreaUnit>(
    (localStorage.getItem('byp_unit') as AreaUnit) || 'sqft'
  );

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    localStorage.setItem('byp_currency', c);
  };

  const setUnit = (u: AreaUnit) => {
    setUnitState(u);
    localStorage.setItem('byp_unit', u);
  };

  const formatPrice = (priceInINR: number) => formatCurrencyPrice(priceInINR, currency);
  const formatArea = (sqft: number) => formatPropertyArea(sqft, unit);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        unit,
        setUnit,
        formatPrice,
        formatArea,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
