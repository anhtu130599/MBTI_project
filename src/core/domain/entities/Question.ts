export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    trait: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P' | null;
    score: number;
  }[];
  category: 'EI' | 'SN' | 'TF' | 'JP';
} 
