import api from '../config/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminData {
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    admin: AdminData;
  };
  message: string;
}

class AuthService {
  // Admin girişi yap
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post('/admin/login', credentials);
    
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.data.token);
      localStorage.setItem('adminData', JSON.stringify(response.data.data.admin));
    }
    
    return response.data;
  }

  // Çıkış yap
  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  }

  // Giriş durumunu kontrol et
  isAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  // Admin bilgilerini getir
  getAdminData(): AdminData | null {
    const adminData = localStorage.getItem('adminData');
    return adminData ? JSON.parse(adminData) : null;
  }

  // Token getir
  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }
}

export default new AuthService();