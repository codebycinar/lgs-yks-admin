import api from '../config/api';

export interface Exam {
  id: number;
  name: string;
  exam_date: string;
  target_class_levels: number[];
  prep_class_levels: number[];
  description?: string;
  created_at: string;
}

export interface Class {
  id: number;
  name: string;
  min_class_level: number;
  max_class_level: number;
  exam_id?: number;
  exam_name?: string;
  created_at: string;
}

export interface Subject {
  id: number;
  name: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Topic {
  id: number;
  name: string;
  subject_id: number;
  subject_name?: string;
  class_id: number;
  class_name?: string;
  parent_id?: number;
  parent_name?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  children?: Topic[];
}

export interface CreateExamData {
  name: string;
  examDate: string;
  targetClassLevels: number[];
  prepClassLevels: number[];
  description?: string;
}

export interface CreateClassData {
  name: string;
  minClassLevel: number;
  maxClassLevel: number;
  examId?: number;
}

export interface CreateSubjectData {
  name: string;
  orderIndex?: number;
}

export interface CreateTopicData {
  name: string;
  subjectId: number;
  classId: number;
  parentId?: number;
  orderIndex?: number;
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