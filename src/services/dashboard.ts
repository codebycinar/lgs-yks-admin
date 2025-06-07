import api from '../config/api';

export interface DashboardStats {
  summary: {
    totalUsers: number;
    totalQuestions: number;
    totalTopics: number;
    activePrograms: number;
  };
  recentUsers: Array<{
    id: number;
    name: string;
    surname: string;
    phone_number: string;
    created_at: string;
  }>;
  subjectStats: Array<{
    subject_name: string;
    topic_count: number;
    question_count: number;
  }>;
}

class DashboardService {
  // Dashboard istatistiklerini getir
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  }
}

export default new DashboardService();