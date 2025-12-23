import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSites } from '../contexts/SitesContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { categories, Category } from '../data/sites';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ExternalLink, Globe, Heart, Sun, Moon, Settings, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { sites } = useSites();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { isAdmin } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredSites = useMemo(() => {
    let filtered = sites.filter(site => {
      const matchesSearch = site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           site.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || site.categoryId === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || isFavorite(site.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });

    // Sort sites
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'favorites':
          const aFav = isFavorite(a.id);
          const bFav = isFavorite(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [sites, searchTerm, selectedCategory, sortBy, showFavoritesOnly, isFavorite]);

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id);
  };

  const handleSiteClick = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  const handleFavoriteToggle = (e: React.MouseEvent, siteId: string) => {
    e.stopPropagation();
    if (isFavorite(siteId)) {
      removeFromFavorites(siteId);
    } else {
      addToFavorites(siteId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sites Úteis
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="transition-all duration-300"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="transition-all duration-300"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/login')}
                className="transition-all duration-300"
              >
                Login
              </Button>
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-slate-600 dark:text-slate-300 text-lg">
              Uma coleção de {sites.length} sites úteis organizados por categoria
            </p>
            {favorites.length > 0 && (
              <p className="text-sm text-slate-500 mt-1">
                {favorites.length} site{favorites.length !== 1 ? 's' : ''} favorito{favorites.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 transition-all duration-300"
              />
            </div>
            
            {/* Advanced Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                  <SelectItem value="favorites">Favoritos</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="transition-all duration-300"
              >
                <Star className={`h-4 w-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favoritos ({favorites.length})
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="text-xs transition-all duration-300"
            >
              Todos ({sites.length})
            </Button>
            {categories.map((category) => {
              const count = sites.filter(site => site.categoryId === category.id).length;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined,
                    borderColor: category.color,
                    color: selectedCategory === category.id ? 'white' : category.color
                  }}
                >
                  {category.name} ({count})
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-300">
            Mostrando {filteredSites.length} de {sites.length} sites
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSites.map((site) => {
            const category = getCategoryById(site.categoryId);
            return (
              <Card
                key={site.id}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:scale-105 hover:-translate-y-1"
                onClick={() => handleSiteClick(site.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {site.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {site.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleFavoriteToggle(e, site.id)}
                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                      >
                        <Heart className={`h-4 w-4 transition-all duration-300 ${
                          isFavorite(site.id) 
                            ? 'fill-red-500 text-red-500 scale-110' 
                            : 'text-slate-400 hover:text-red-500'
                        }`} />
                      </Button>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {category && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-2 py-1 transition-all duration-300"
                        style={{
                          backgroundColor: `${category.color}20`,
                          color: category.color,
                          borderColor: `${category.color}40`
                        }}
                      >
                        {category.name}
                      </Badge>
                    )}
                    <span className="text-xs text-slate-400 truncate ml-2">
                      {new URL(site.url).hostname}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              Nenhum site encontrado
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Tente ajustar sua busca ou filtro de categoria
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-slate-600 dark:text-slate-300">
            <p className="text-sm">
              Uma coleção curada de {sites.length} sites úteis organizados em {categories.length} categorias
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;