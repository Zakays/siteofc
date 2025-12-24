import React, { createContext, useContext, useState, useEffect } from 'react';
import { sites as initialSites, Site } from '../data/sites';

interface SitesContextType {
  sites: Site[];
  addSite: (site: Omit<Site, 'id'>) => void;
  removeSite: (siteId: string) => void;
  updateSite: (siteId: string, updates: Partial<Site>) => void;
  clearCustomSites: () => void;
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

  // Função para carregar sites salvos com tratamento de erro
  const loadCustomSites = () => {
    try {
      const savedSites = localStorage.getItem('customSites');
      if (savedSites) {
        const customSites = JSON.parse(savedSites);
        
        // Validar se é um array válido
        if (Array.isArray(customSites)) {
          // Validar cada site
          const validCustomSites = customSites.filter(site => {
            return site && 
                   typeof site.id === 'string' && 
                   typeof site.title === 'string' && 
                   typeof site.url === 'string' && 
                   typeof site.description === 'string' &&
                   typeof site.category === 'string' &&
                   typeof site.categoryId === 'string';
          });
          
          setSites([...initialSites, ...validCustomSites]);
        } else {
          console.warn('Custom sites data is not an array, clearing localStorage');
          localStorage.removeItem('customSites');
        }
      }
    } catch (error) {
      console.error('Error loading custom sites:', error);
      // Limpar localStorage corrompido
      localStorage.removeItem('customSites');
      setSites(initialSites);
    }
  };

  useEffect(() => {
    loadCustomSites();
  }, []);

  // Função para salvar sites com tratamento de erro
  const saveSites = (newSites: Site[]) => {
    try {
      const customSites = newSites.filter(site => 
        !initialSites.find(initial => initial.id === site.id)
      );
      
      // Validar dados antes de salvar
      const validCustomSites = customSites.filter(site => {
        return site && 
               typeof site.id === 'string' && 
               typeof site.title === 'string' && 
               typeof site.url === 'string' && 
               typeof site.description === 'string' &&
               typeof site.category === 'string' &&
               typeof site.categoryId === 'string';
      });
      
      localStorage.setItem('customSites', JSON.stringify(validCustomSites));
    } catch (error) {
      console.error('Error saving custom sites:', error);
      // Em caso de erro, tentar limpar e recarregar
      localStorage.removeItem('customSites');
    }
  };

  const addSite = (siteData: Omit<Site, 'id'>) => {
    try {
      // Validar dados de entrada
      if (!siteData.title || !siteData.url || !siteData.categoryId) {
        console.error('Invalid site data:', siteData);
        return;
      }

      const newSite: Site = {
        ...siteData,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      const newSites = [...sites, newSite];
      setSites(newSites);
      saveSites(newSites);
    } catch (error) {
      console.error('Error adding site:', error);
    }
  };

  const removeSite = (siteId: string) => {
    try {
      // Não permitir remoção de sites iniciais
      const isInitialSite = initialSites.find(site => site.id === siteId);
      if (isInitialSite) {
        console.warn('Cannot remove initial site:', siteId);
        return;
      }

      const newSites = sites.filter(site => site.id !== siteId);
      setSites(newSites);
      saveSites(newSites);
    } catch (error) {
      console.error('Error removing site:', error);
    }
  };

  const updateSite = (siteId: string, updates: Partial<Site>) => {
    try {
      // Não permitir atualização de sites iniciais
      const isInitialSite = initialSites.find(site => site.id === siteId);
      if (isInitialSite) {
        console.warn('Cannot update initial site:', siteId);
        return;
      }

      const newSites = sites.map(site => 
        site.id === siteId ? { ...site, ...updates } : site
      );
      setSites(newSites);
      saveSites(newSites);
    } catch (error) {
      console.error('Error updating site:', error);
    }
  };

  const clearCustomSites = () => {
    try {
      localStorage.removeItem('customSites');
      setSites(initialSites);
    } catch (error) {
      console.error('Error clearing custom sites:', error);
    }
  };

  return (
    <SitesContext.Provider value={{ 
      sites, 
      addSite, 
      removeSite, 
      updateSite, 
      clearCustomSites 
    }}>
      {children}
    </SitesContext.Provider>
  );
};