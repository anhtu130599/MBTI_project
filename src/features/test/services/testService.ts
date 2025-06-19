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
  percentages?: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  total_questions?: number;
  timestamp: Date | string;
  careers?: {
    title: string;
    description: string;
    matchScore: number;
  }[];
}

// 🎯 INTERFACE CHO LAST TEST RESULT
export interface LastTestResult {
  percentages: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
  total_questions: number;
  type: string;
  timestamp: string;
}

interface ApiQuestion extends Omit<Question, 'id'> {
  _id: string;
}

// Test service implementation
export const testService = {
  async getQuestions(): Promise<Question[]> {
    const response = await fetch('/api/questions');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const data = await response.json();
    
    // CORRECTED MAPPING:
    // Ensure that the 'id' field used by the frontend is always the
    // '_id' string from the database to guarantee consistency.
    return data.map((question: ApiQuestion) => {
      return {
        ...question,
        id: question._id, // Explicitly use the database _id
        options: question.options || [],
      };
    });
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
    // DEBUG: Log dữ liệu trước khi gửi
    console.log('🚀 testService.submitAnswers - Data being sent:', answers);
    console.log('🚀 testService.submitAnswers - JSON stringified:', JSON.stringify({ answers }));
    
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

    const result = await response.json();
    
    // 🎯 LƯU KẾT QUẢ VÀO LOCALSTORAGE ĐỂ SỬ DỤNG CHO TRANG KẾT QUẢ
    if (result.percentages && result.scores) {
      const testResultData = {
        percentages: result.percentages,
        scores: result.scores,
        total_questions: result.total_questions || 0,
        type: result.personalityType || result.type,
        timestamp: new Date().toISOString(),
        isLoggedIn: result.isLoggedIn || false
      };
      localStorage.setItem('last_test_result', JSON.stringify(testResultData));
      localStorage.setItem('last_test_answers', JSON.stringify(answers)); // Lưu answers để có thể save vào history
      console.log('🎯 Saved test result to localStorage:', testResultData);
      console.log('🎯 Saved test answers to localStorage:', answers);
    }

    return result;
  },

  // 🎯 PHƯƠNG THỨC MỚI: LẤY KẾT QUẢ TEST CUỐI CÙNG TỪ LOCALSTORAGE
  getLastTestResult(): LastTestResult | null {
    try {
      const saved = localStorage.getItem('last_test_result');
      if (saved) {
        const parsed = JSON.parse(saved) as LastTestResult;
        console.log('🎯 Retrieved test result from localStorage:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error getting last test result:', error);
    }
    return null;
  },

  // 🎯 XÓA KẾT QUẢ TEST (khi cần)
  clearLastTestResult(): void {
    localStorage.removeItem('last_test_result');
  },
}; 
