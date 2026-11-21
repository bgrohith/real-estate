import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { Property } from '../types';

interface FavoritesContextType {
  favorites: string[];
  favoriteProperties: Property[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (property: Property) => Promise<boolean>;
  favoriteCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('byp_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>(() => {
    try {
      const stored = localStorage.getItem('byp_favorite_properties');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync favorites when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.favorites) {
      setFavorites(user.favorites);
      localStorage.setItem('byp_favorites', JSON.stringify(user.favorites));
    }
  }, [isAuthenticated, user]);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = async (property: Property): Promise<boolean> => {
    const propertyId = property._id;
    const currentlyFav = favorites.includes(propertyId);
    let updated: string[];
    let updatedProps: Property[];

    if (currentlyFav) {
      updated = favorites.filter((id) => id !== propertyId);
      updatedProps = favoriteProperties.filter((p) => p._id !== propertyId);
    } else {
      updated = [...favorites, propertyId];
      updatedProps = [...favoriteProperties.filter((p) => p._id !== propertyId), property];
      // Trigger subtle celebratory confetti!
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#437ff4', '#fbbf24', '#10b981'],
        });
      } catch (e) {
        // Fallback silently if canvas-confetti is not loaded
      }
    }

    setFavorites(updated);
    setFavoriteProperties(updatedProps);
    localStorage.setItem('byp_favorites', JSON.stringify(updated));
    localStorage.setItem('byp_favorite_properties', JSON.stringify(updatedProps));

    if (isAuthenticated) {
      try {
        await api.post(`/api/users/favorites/${propertyId}`);
      } catch (err) {
        console.warn('Could not sync favorite to server:', err);
      }
    }

    return !currentlyFav;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteProperties,
        isFavorite,
        toggleFavorite,
        favoriteCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
