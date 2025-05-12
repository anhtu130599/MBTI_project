export type MBTIType = 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP' | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP' | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ' | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface Question {
  id: string;
  text: string;
  category: 'EI' | 'SN' | 'TF' | 'JP';
  options: {
    value: string;
    text: string;
  }[];
  image?: string;
}

export interface MBTIResult {
  type: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  careers: string[];
}

export interface TestState {
  currentQuestion: number;
  answers: Record<string, string>;
  completed: boolean;
  result?: MBTIResult;
}

export interface QuestionGroup {
  category: 'EI' | 'SN' | 'TF' | 'JP';
  title: string;
  description: string;
  questions: Question[];
}

export interface TestConfig {
  introduction: {
    title: string;
    description: string;
    duration: string;
    totalQuestions: number;
  };
  groups: QuestionGroup[];
} 