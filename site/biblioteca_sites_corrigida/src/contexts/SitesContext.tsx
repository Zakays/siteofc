import React, { createContext, useContext, useState, useEffect } from 'react';
import { sites as initialSites, Site } from '../data/sites';

interface SitesContextType {
  sites: Site[];
  addSite: (site: Omit<Site, 'id'>) => void;
  removeSite: (siteId: string) => void;
  updateSite: (siteId: string, updates: Partial<Site>) => void;
}

const SitesContext = createContext<SitesContextType | undefined>(undefined);

export const useSites = () => {
  const context = useContext(SitesContext);
  if (!context) {
    throw new Error('useSites must be used within a SitesProvider');
  }
  return context;
};

export const SitesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>(initialSites);

  useEffect(() => {
    const savedSites = localStorage.getItem('customSites');
    if (savedSites) {
      const customSites = JSON.parse(savedSites);
      setSites([...initialSites, ...customSites]);
    }
  }, []);

  const saveSites = (newSites: Site[]) => {
    const customSites = newSites.filter(site => !initialSites.find(initial => initial.id === site.id));
    localStorage.setItem('customSites', JSON.stringify(customSites));
  };

  const addSite = (siteData: Omit<Site, 'id'>) => {
    const newSite: Site = {
      ...siteData,
      id: Date.now().toString()
    };
    const newSites = [...sites, newSite];
    setSites(newSites);
    saveSites(newSites);
  };

  const removeSite = (siteId: string) => {
    const newSites = sites.filter(site => site.id !== siteId);
    setSites(newSites);
    saveSites(newSites);
  };

  const updateSite = (siteId: string, updates: Partial<Site>) => {
    const newSites = sites.map(site => 
      site.id === siteId ? { ...site, ...updates } : site
    );
    setSites(newSites);
    saveSites(newSites);
  };

  return (
    <SitesContext.Provider value={{ sites, addSite, removeSite, updateSite }}>
      {children}
    </SitesContext.Provider>
  );
};