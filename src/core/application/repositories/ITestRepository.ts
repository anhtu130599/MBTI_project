import { Question } from '@/core/domain/entities/Question';
import { TestResult } from '@/core/domain/entities/TestResult';

export interface ITestRepository {
  getQuestions(): Promise<Question[]>;
  submitAnswers(answers: Record<string, string>): Promise<TestResult>;
  saveTestResult(userId: string, result: TestResult): Promise<void>;
  getUserTestHistory(userId: string): Promise<TestResult[]>;
  getTestStatistics(): Promise<{
    totalTests: number;
    typeDistribution: Record<string, number>;
    averageCompletionTime: number;
  }>;
} 
