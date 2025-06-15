// Test service for MBTI functionality
import { Question } from '@/core/domain/entities/Question';

// Type definitions
export interface QuestionStats {
  totalQuestions: number;
  categories: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
  estimatedTime: number;
}

export interface TestSubmissionResponse {
  id?: string;
  type: string;
  personalityType: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  careerRecommendations: string[];
  scores?: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  timestamp: Date | string;
  careers?: {
    title: string;
    description: string;
    matchScore: number;
  }[];
}

// Test service implementation
export const testService = {
  async getQuestions(): Promise<Question[]> {
    const response = await fetch('/api/questions');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    
    // Map _id thành id để frontend sử dụng nhất quán
    return data.map((question: any) => ({
      ...question,
      id: question._id || question.id, // Ưu tiên _id từ MongoDB, fallback về id
      options: question.options?.map((option: any) => ({
        ...option,
        id: option._id || option.id
      })) || []
    }));
  },

  async getQuestionStats(): Promise<QuestionStats> {
    const response = await fetch('/api/questions/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch question statistics');
    }
    const result = await response.json();
    return result.data;
  },

  async submitAnswers(answers: Record<string, string>): Promise<TestSubmissionResponse> {
    const response = await fetch('/api/test/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit answers');
    }

    return response.json();
  },
}; 
