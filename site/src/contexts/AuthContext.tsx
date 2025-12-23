import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { authenticated, admin } = JSON.parse(authData);
      setIsAuthenticated(authenticated);
      setIsAdmin(admin);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === 'zakay92' && password === '16042008F') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('auth', JSON.stringify({ authenticated: true, admin: true }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};