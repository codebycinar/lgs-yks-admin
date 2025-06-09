import api from '../config/api';

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
  description: string;
  min_class_level: number;
  max_class_level: number;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  orderIndex: number;
  subject_name: string;
  class_name: string;
  class_level: number;
  parent_name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  topicId: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  questionText?: string;
  questionImageUrl?: string;
  questionPdfUrl?: string;
  solutionText?: string;
  solutionImageUrl?: string;
  solutionPdfUrl?: string;
  correctAnswers: any[];
  explanation?: string;
  keywords: string[];
  estimatedTime?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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
  description?: string;
  orderIndex: number;
  subjectId: string;
  classId: string;
  parentId?: string;
  isActive?: boolean;
}

export interface CreateQuestionData {
  topicId: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  questionText?: string;
  questionImageUrl?: string;
  questionPdfUrl?: string;
  solutionText?: string;
  solutionImageUrl?: string;
  solutionPdfUrl?: string;
  correctAnswers: any[];
  explanation?: string;
  keywords: string[];
  estimatedTime?: number;
  isActive?: boolean;
}

class ContentService {
  // Sınavlar
  async createExam(data: CreateExamData): Promise<Exam> {
    const response = await api.post('/admin/exams', data);
    return response.data.data;
  }

  // Sınıflar
  async createClass(data: CreateClassData): Promise<Class> {
    const response = await api.post('/admin/classes', data);
    return response.data.data;
  }

  // Dersler
  async createSubject(data: CreateSubjectData): Promise<Subject> {
    const response = await api.post('/admin/subjects', data);
    return response.data.data;
  }

  // Konular
  async createTopic(data: CreateTopicData): Promise<Topic> {
    const response = await api.post('/admin/topics', data);
    return response.data.data;
  }

  // Listeleme servisleri (mevcut API'ları kullan)
  async getExams(): Promise<Exam[]> {
    const response = await api.get('/exams');
    return response.data.data;
  }

  async getClasses(): Promise<Class[]> {
    const response = await api.get('/classes');
    return response.data.data;
  }

  async getSubjects(): Promise<Subject[]> {
    const response = await api.get('/subjects');
    return response.data.data;
  }

  async getTopics(params?: { subjectId?: number; classId?: number }): Promise<Topic[]> {
    const response = await api.get('/topics', { params });
    return response.data.data;
  }
}

export default new ContentService();