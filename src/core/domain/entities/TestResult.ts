export interface TestResult {
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
