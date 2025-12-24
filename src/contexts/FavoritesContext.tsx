import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (siteId: string) => void;
  removeFromFavorites: (siteId: string) => void;
  isFavorite: (siteId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorites');
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed.filter(id => typeof id === 'string'));
        } else {
          localStorage.removeItem('favorites');
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      localStorage.removeItem('favorites');
      setFavorites([]);
    }
  }, []);

  const addToFavorites = (siteId: string) => {
    try {
      if (typeof siteId !== 'string' || !siteId) return;
      
      const newFavorites = [...favorites, siteId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = (siteId: string) => {
    try {
      const newFavorites = favorites.filter(id => id !== siteId);
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (siteId: string) => {
    try {
      return favorites.includes(siteId);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };

  const clearFavorites = () => {
    try {
      setFavorites([]);
      localStorage.removeItem('favorites');
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites, 
      isFavorite, 
      clearFavorites 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};