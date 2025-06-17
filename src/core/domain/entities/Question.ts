export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    type: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
  }[];
  category: 'EI' | 'SN' | 'TF' | 'JP';
} 
