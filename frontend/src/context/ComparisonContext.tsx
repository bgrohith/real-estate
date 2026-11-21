import React, { createContext, useContext, useState } from 'react';
import { Property } from '../types';

interface ComparisonContextType {
  compareList: Property[];
  addToCompare: (property: Property) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  isComparisonOpen: boolean;
  setIsComparisonOpen: (open: boolean) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const addToCompare = (property: Property): boolean => {
    if (compareList.some((p) => p._id === property._id)) {
      removeFromCompare(property._id);
      return false;
    }
    if (compareList.length >= 3) {
      alert('You can compare a maximum of 3 properties at a time.');
      return false;
    }
    setCompareList([...compareList, property]);
    return true;
  };

  const removeFromCompare = (propertyId: string) => {
    setCompareList(compareList.filter((p) => p._id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsComparisonOpen(false);
  };

  const isInCompare = (propertyId: string) => compareList.some((p) => p._id === propertyId);

  return (
    <ComparisonContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isComparisonOpen,
        setIsComparisonOpen,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
