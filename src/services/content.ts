import api from './api';

export interface Exam {
  id: string;
  name: string;
  examDate: string;
  targetClassLevels: number[];
  prepClassLevels: number[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  name: string;
  minClassLevel: number;
  maxClassLevel: number;
  examId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
  class_id: string;
  parent_id: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  subject_name: string;
  parent_name: string | null;
}

export interface Answer {
  id: string;
  option_letter: string;
  answer_text: string;
  answer_image_url: string | null;
  is_correct: boolean;
  order_index: number;
}

export interface Question {
  id: string;
  question_text: string;
  question_image_url: string | null;
  question_pdf_url: string | null;
  solution_text: string;
  solution_image_url: string | null;
  solution_pdf_url: string | null;
  has_multiple_correct: boolean;
  explanation: string;
  estimated_time: number;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  topic_name: string;
  subject_name: string;
  class_name: string;
  answers: Answer[];
}

export interface CreateExamData {
  name: string;
  examDate: string;
  targetClassLevels: number[];
  prepClassLevels: number[];
  description: string;
  isActive?: boolean;
}

export interface CreateClassData {
  name: string;
  minClassLevel: number;
  maxClassLevel: number;
  examId: string;
  isActive?: boolean;
}

export interface CreateSubjectData {
  name: string;
  description: string;
  min_class_level: number;
  max_class_level: number;
  orderIndex: number;
  isActive?: boolean;
}

export interface CreateTopicData {
  name: string;
  orderIndex: number;
  class_id: string;
  parent_id: string;
  description: string;
  subject_id: string;
  is_active: boolean;
}

export interface UpdateTopicData extends CreateTopicData {
  id: string;
}

export interface GetTopicsParams {
  page: number;
  limit: number;
  subject_id?: string;
  search?: string;
}

export interface TopicsResponse {
  topics: Topic[];
  pagination: {
    totalTopics: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface CreateAnswerData {
  option_letter: string;
  answer_text: string;
  answer_image_url?: string | null;
  is_correct: boolean;
  order_index: number;
}

export interface CreateQuestionData {
  question_text: string;
  question_image_url?: string | null;
  question_pdf_url?: string | null;
  solution_text: string;
  solution_image_url?: string | null;
  solution_pdf_url?: string | null;
  has_multiple_correct: boolean;
  explanation: string;
  estimated_time: number;
  difficulty_level: number;
  is_active?: boolean;
  topic_id: string;
  answers: CreateAnswerData[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    questions: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalQuestions: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

const contentService = {
  // Sınavlar
  createExam: async (data: CreateExamData): Promise<Exam> => {
    const response = await api.post('/admin/exams', data);
    return response.data.data;
  },

  // Sınıflar
  createClass: async (data: CreateClassData): Promise<Class> => {
    const response = await api.post('/admin/classes', data);
    return response.data.data;
  },

  // Dersler
  createSubject: async (data: CreateSubjectData): Promise<Subject> => {
    const response = await api.post('/admin/subjects', data);
    return response.data.data;
  },

  // Konular
  createTopic: async (data: CreateTopicData): Promise<Topic> => {
    const response = await api.post('/admin/topics', data);
    return response.data.data;
  },

  updateTopic: async (id: string, data: CreateTopicData): Promise<Topic> => {
    const response = await api.put(`/admin/topics/${id}`, data);
    return response.data.data;
  },

  deleteTopic: async (id: string): Promise<void> => {
    await api.delete(`/admin/topics/${id}`);
  },

  // Listeleme servisleri
  getExams: async (): Promise<Exam[]> => {
    const response = await api.get('/admin/exams');
    return response.data.data;
  },

  getClasses: async (): Promise<Class[]> => {
    const response = await api.get('/admin/classes');
    return response.data.data;
  },

  getSubjects: async (): Promise<Subject[]> => {
    const response = await api.get('/admin/subjects');
    return response.data.data || [];
  },

  getTopics: async (params?: GetTopicsParams): Promise<TopicsResponse> => {
    const response = await api.get('/admin/topics', { params });
    return { topics: response.data.data || [], pagination: { totalTopics: 0, totalPages: 0, currentPage: 1, limit: 10 } };
  },

  getQuestions: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Question>> => {
    const response = await api.get('/admin/questions', { params: { page, limit } });
    return response.data;
  },

  createQuestion: async (data: CreateQuestionData): Promise<Question> => {
    const response = await api.post('/admin/questions', data);
    return response.data.data;
  },

  updateQuestion: async (id: string, data: CreateQuestionData): Promise<Question> => {
    const response = await api.put(`/admin/questions/${id}`, data);
    return response.data.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/admin/questions/${id}`);
  }
};

export default contentService;