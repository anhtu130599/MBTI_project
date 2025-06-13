export interface Career {
  id: string;
  title: string;
  description: string;
  industry: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  educationLevel: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  personalityTypes: string[];
  workEnvironment: string;
  location: string;
  jobOutlook: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCareerDto {
  title: string;
  description: string;
  industry: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills: string[];
  educationLevel: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  personalityTypes: string[];
  workEnvironment: string;
  location: string;
  jobOutlook: string;
}

export interface UpdateCareerDto {
  title?: string;
  description?: string;
  industry?: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  requiredSkills?: string[];
  educationLevel?: string;
  experienceLevel?: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  personalityTypes?: string[];
  workEnvironment?: string;
  location?: string;
  jobOutlook?: string;
} 
