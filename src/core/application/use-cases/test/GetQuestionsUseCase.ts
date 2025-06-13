import { ITestRepository } from '@/core/application/repositories/ITestRepository';
import { Question } from '@/core/domain/entities/Question';

export class GetQuestionsUseCase {
  constructor(private testRepository: ITestRepository) {}

  async execute(): Promise<Question[]> {
    const questions = await this.testRepository.getQuestions();
    
    // Shuffle questions for each test session
    return this.shuffleArray(questions);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
} 
