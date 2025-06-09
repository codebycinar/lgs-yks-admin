import api from './api';

export interface QuestionAnswer {
  id: string;
  option_letter: string;
  answer_text: string;
  answer_image_url?: string;
  is_correct: boolean;
  order_index: number;
}

export interface Question {
  id: string;
  question_text: string;
  question_image_url?: string;
  solution_text: string;
  has_multiple_correct: boolean;
  explanation?: string;
  estimated_time: number;
  difficulty_level: number;
  is_active: boolean;
  created_at: string;
  topic_name: string;
  subject_name: string;
  class_name: string;
  answers: QuestionAnswer[];
}

export interface CreateQuestionData {
  question_text: string;
  question_image_url?: string;
  solution_text: string;
  has_multiple_correct: boolean;
  explanation?: string;
  estimated_time: number;
  difficulty_level: number;
  is_active: boolean;
  topic_id: string;
  answers: {
    option_letter: string;
    answer_text: string;
    answer_image_url?: string;
    is_correct: boolean;
    order_index: number;
  }[];
}

export interface UpdateQuestionData extends CreateQuestionData {
  id: string;
}

export interface GetQuestionsParams {
  page: number;
  limit: number;
  topic_id?: string;
  difficulty_level?: number;
  search?: string;
}

export interface QuestionsResponse {
  questions: Question[];
  pagination: {
    totalQuestions: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface FileUploadResponse {
  questionImageUrl?: string;
  questionPdfUrl?: string;
  solutionImageUrl?: string;
  solutionPdfUrl?: string;
}

const questionsService = {
  getQuestions: async (params: GetQuestionsParams): Promise<QuestionsResponse> => {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  createQuestion: async (data: CreateQuestionData): Promise<Question> => {
    const response = await api.post('/questions', data);
    return response.data;
  },

  updateQuestion: async (data: UpdateQuestionData): Promise<Question> => {
    const response = await api.put(`/questions/${data.id}`, data);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await api.delete(`/questions/${id}`);
  },

  uploadFiles: async (files: FormData): Promise<FileUploadResponse> => {
    const response = await api.post('/upload/question-files', files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }
};

export default questionsService;