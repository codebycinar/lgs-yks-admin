import api from '../config/api';

export interface Question {
  id: number;
  topic_id: number;
  topic_name?: string;
  subject_name?: string;
  class_name?: string;
  difficulty_level: 'easy' | 'medium' | 'hard';
  question_text?: string;
  question_image_url?: string;
  question_pdf_url?: string;
  solution_text?: string;
  solution_image_url?: string;
  solution_pdf_url?: string;
  correct_answers: string[];
  explanation?: string;
  keywords: string[];
  estimated_time?: number;
  is_active: boolean;
  created_at: string;
}

export interface CreateQuestionData {
  topicId: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  questionText?: string;
  questionImageUrl?: string;
  questionPdfUrl?: string;
  solutionText?: string;
  solutionImageUrl?: string;
  solutionPdfUrl?: string;
  correctAnswers: string[];
  explanation?: string;
  keywords: string[];
  estimatedTime?: number;
}

export interface UpdateQuestionData extends CreateQuestionData {
  id: number;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  topicId?: number;
  difficultyLevel?: string;
  search?: string;
}

export interface QuestionsResponse {
  questions: Question[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalQuestions: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FileUploadResponse {
  questionImageUrl?: string;
  questionPdfUrl?: string;
  solutionImageUrl?: string;
  solutionPdfUrl?: string;
}

class QuestionsService {
  // Soruları listele
  async getQuestions(params: GetQuestionsParams = {}): Promise<QuestionsResponse> {
    const response = await api.get('/questions', { params });
    return response.data.data;
  }

  // Soru oluştur
  async createQuestion(data: CreateQuestionData): Promise<Question> {
    const response = await api.post('/admin/questions', data);
    return response.data.data;
  }

  // Soru güncelle
  async updateQuestion(data: UpdateQuestionData): Promise<Question> {
    const { id, ...updateData } = data;
    const response = await api.put(`/admin/questions/${id}`, updateData);
    return response.data.data;
  }

  // Soru sil
  async deleteQuestion(id: number): Promise<void> {
    await api.delete(`/admin/questions/${id}`);
  }

  // Dosya yükle
  async uploadFiles(files: FormData): Promise<FileUploadResponse> {
    const response = await api.post('/upload/question-files', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
}

export default new QuestionsService();