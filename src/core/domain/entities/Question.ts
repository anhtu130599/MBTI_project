export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
  category: string; // Allow flexible category names
  isActive?: boolean;
  order?: number;
} 
