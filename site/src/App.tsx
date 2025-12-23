import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SitesProvider } from './contexts/SitesContext';
import Index from './pages/Index';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import SiteDetail from './pages/SiteDetail';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <SitesProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/site/:id" element={<SiteDetail />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Router>
          </SitesProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;