import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSites } from '../contexts/SitesContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { categories } from '../data/sites';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, Heart, Globe, Calendar, Users } from 'lucide-react';

const SiteDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sites } = useSites();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const site = sites.find(s => s.id === id);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site não encontrado</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  const category = categories.find(cat => cat.id === site.categoryId);
  const isFav = isFavorite(site.id);
  const domain = new URL(site.url).hostname;

  const handleFavoriteToggle = () => {
    if (isFav) {
      removeFromFavorites(site.id);
    } else {
      addToFavorites(site.id);
    }
  };

  const handleVisitSite = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-6 w-6 text-blue-600" />
                <h1 className="text-3xl font-bold">{site.title}</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-4">
                {site.description}
              </p>
              <div className="flex items-center gap-4">
                {category && (
                  <Badge
                    variant="secondary"
                    className="px-3 py-1"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                      borderColor: `${category.color}40`
                    }}
                  >
                    {category.name}
                  </Badge>
                )}
                <span className="text-slate-500 flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {domain}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Site Preview */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 p-8 text-center">
                  <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Globe className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Prévia do Site</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    Clique no botão abaixo para visitar {site.title}
                  </p>
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-inner">
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <span className="ml-2">{site.url}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded p-4 text-center">
                      <Globe className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500 text-sm">
                        Prévia do site será carregada ao visitar
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions & Info */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Ações</h3>
                <div className="space-y-3">
                  <Button 
                    onClick={handleVisitSite}
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visitar Site
                  </Button>
                  
                  <Button 
                    variant={isFav ? "destructive" : "outline"}
                    onClick={handleFavoriteToggle}
                    className="w-full"
                    size="lg"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFav ? 'fill-current' : ''}`} />
                    {isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Site Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Informações</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-medium">Domínio</p>
                      <p className="text-slate-600 dark:text-slate-300">{domain}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-medium">Categoria</p>
                      <p className="text-slate-600 dark:text-slate-300">{site.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-green-600 dark:text-green-400">Ativo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Sobre este site</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {site.description}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500">
                    Este site faz parte da categoria "{site.category}" e oferece ferramentas e recursos úteis para usuários.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SiteDetail;