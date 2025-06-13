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
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: {
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
    return response.json();
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
