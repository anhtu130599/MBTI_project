import { Question } from '@/core/domain/entities/Question';
import { UserTestResult } from '@/models';

export interface ITestRepository {
  getQuestions(): Promise<Question[]>;
  submitAnswers(answers: Record<string, string>): Promise<UserTestResult>;
  saveTestResult(userId: string, result: UserTestResult): Promise<void>;
  getUserTestHistory(userId: string): Promise<UserTestResult[]>;
  getTestStatistics(): Promise<{
    totalTests: number;
    typeDistribution: Record<string, number>;
    averageCompletionTime: number;
  }>;
} 
