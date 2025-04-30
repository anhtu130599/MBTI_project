export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface Question {
  id: number;
  text: string;
  category: 'EI' | 'SN' | 'TF' | 'JP';
  options: {
    text: string;
    value: string;
  }[];
}

export interface MBTIResult {
  type: MBTIType;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

export interface TestState {
  currentQuestion: number;
  answers: Record<number, string>;
  completed: boolean;
  result?: MBTIResult;
} 