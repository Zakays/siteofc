import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSites } from '../contexts/SitesContext';
import { categories } from '../data/sites';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, LogOut, Settings, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { logout, isAdmin } = useAuth();
  const { sites, addSite, removeSite, clearCustomSites } = useSites();
  const navigate = useNavigate();
  
  const [bulkUrls, setBulkUrls] = useState('');
  const [newSite, setNewSite] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    category: ''
  });

  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddSite = () => {
    try {
      if (!newSite.title || !newSite.url || !newSite.categoryId) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }
      
      // Validar URL
      try {
        new URL(newSite.url);
      } catch {
        alert('Por favor, insira uma URL válida.');
        return;
      }
      
      const category = categories.find(cat => cat.id === newSite.categoryId);
      if (!category) {
        alert('Categoria inválida.');
        return;
      }

      addSite({
        ...newSite,
        category: category.name
      });

      setNewSite({
        title: '',
        description: '',
        url: '',
        categoryId: '',
        category: ''
      });
      
      alert('Site adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar site:', error);
      alert('Erro ao adicionar site. Tente novamente.');
    }
  };

  const handleBulkAdd = () => {
    try {
      const urls = bulkUrls.split('\n').filter(url => url.trim());
      
      if (urls.length === 0) {
        alert('Por favor, insira pelo menos uma URL.');
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      urls.forEach(url => {
        const cleanUrl = url.trim();
        if (cleanUrl) {
          try {
            const urlObj = new URL(cleanUrl);
            const domain = urlObj.hostname;
            const title = domain.replace('www.', '').split('.')[0];
            
            addSite({
              title: title.charAt(0).toUpperCase() + title.slice(1),
              description: `Site: ${domain}`,
              url: cleanUrl,
              categoryId: '9d530a41-510a-4f03-9f63-140f5c377761', // Outros
              category: 'Outros'
            });
            successCount++;
          } catch (error) {
            console.error('URL inválida:', cleanUrl, error);
            errorCount++;
          }
        }
      });
      
      setBulkUrls('');
      alert(`Sites adicionados: ${successCount}\nErros: ${errorCount}`);
    } catch (error) {
      console.error('Erro no bulk add:', error);
      alert('Erro ao adicionar sites em lote. Tente novamente.');
    }
  };

  const customSites = sites.filter(site => 
    !site.id.includes('-') || parseInt(site.id) > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate('/')}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Site
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar todos os sites personalizados? Esta ação não pode ser desfeita.')) {
                    clearCustomSites();
                    alert('Sites personalizados removidos com sucesso!');
                  }
                }}
                className="text-orange-600 hover:text-orange-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpar Dados
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Adicionar Site Individual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Site Individual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Título do site"
                value={newSite.title}
                onChange={(e) => setNewSite({...newSite, title: e.target.value})}
              />
              <Input
                placeholder="URL do site"
                value={newSite.url}
                onChange={(e) => setNewSite({...newSite, url: e.target.value})}
              />
              <Textarea
                placeholder="Descrição do site"
                value={newSite.description}
                onChange={(e) => setNewSite({...newSite, description: e.target.value})}
                rows={3}
              />
              <Select value={newSite.categoryId} onValueChange={(value) => setNewSite({...newSite, categoryId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddSite} className="w-full">
                Adicionar Site
              </Button>
            </CardContent>
          </Card>

          {/* Adicionar Sites em Lote */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Adicionar Sites em Lote
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Cole as URLs aqui, uma por linha:&#10;https://site1.com&#10;https://site2.com&#10;https://site3.co"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={8}
              />
              <Button onClick={handleBulkAdd} className="w-full">
                Adicionar Todos os Sites
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Sites Personalizados */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sites Adicionados ({customSites.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {customSites.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                Nenhum site personalizado adicionado ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customSites.map((site) => (
                  <Card key={site.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm line-clamp-1">{site.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSite(site.id)}
                          className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 line-clamp-2">
                        {site.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {site.category}
                        </Badge>
                        <span className="text-xs text-slate-400 truncate ml-2">
                          {new URL(site.url).hostname}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;