import React, { createContext, useContext, useEffect, useState } from 'react';
import authService, { AdminData } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  adminData: AdminData | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Sayfa yüklendiğinde auth durumunu kontrol et
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const data = authService.getAdminData();
      
      setIsAuthenticated(authenticated);
      setAdminData(data);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authService.login({ email, password });
      
      if (response.success) {
        setIsAuthenticated(true);
        setAdminData(response.data.admin);
      } else {
        throw new Error(response.message || 'Giriş başarısız');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setAdminData(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    adminData,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};