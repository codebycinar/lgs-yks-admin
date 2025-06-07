import api from '../config/api';

export interface User {
  id: number;
  phone_number: string;
  name: string;
  surname: string;
  gender: 'male' | 'female';
  created_at: string;
  class_name?: string;
  exam_name?: string;
}

export interface UserDetail extends User {
  stats: {
    totalGoals: number;
    completedGoals: number;
    totalPrograms: number;
  };
  exam_date?: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

class UsersService {
  // Kullanıcıları listele
  async getUsers(params: GetUsersParams = {}): Promise<UsersResponse> {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  }

  // Kullanıcı detayını getir
  async getUserById(id: number): Promise<UserDetail> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  }
}

export default new UsersService();