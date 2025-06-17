import { Career, CreateCareerDto, UpdateCareerDto } from '@/core/domain/entities/Career';

export interface ICareerRepository {
  create(careerData: CreateCareerDto): Promise<Career>;
  findById(id: string): Promise<Career | null>;
  findAll(filters?: {
    industry?: string;
    experienceLevel?: string;
    personalityTypes?: string[];
    page?: number;
    limit?: number;
  }): Promise<{
    careers: Career[];
    total: number;
    page: number;
    limit: number;
  }>;
  update(id: string, careerData: UpdateCareerDto): Promise<Career>;
  delete(id: string): Promise<void>;
  findByPersonalityType(personalityType: string): Promise<Career[]>;
  searchCareers(query: string): Promise<Career[]>;
} 
