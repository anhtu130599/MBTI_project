export interface PersonalityType {
  id: string;
  code: string; // INTJ, ENFP, etc.
  name: string;
  description: string;
  traits: {
    introversion: number; // 0-100
    intuition: number; // 0-100
    thinking: number; // 0-100
    judging: number; // 0-100
  };
  strengths: string[];
  weaknesses: string[];
  cognitive_functions: {
    dominant: string;
    auxiliary: string;
    tertiary: string;
    inferior: string;
  };
  famous_people: string[];
  compatibility: {
    romantic: string[];
    friendship: string[];
    work: string[];
  };
  career_paths: string[];
  growth_tips: string[];
  stress_triggers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePersonalityTypeDto {
  code: string;
  name: string;
  description: string;
  traits: {
    introversion: number;
    intuition: number;
    thinking: number;
    judging: number;
  };
  strengths: string[];
  weaknesses: string[];
  cognitive_functions: {
    dominant: string;
    auxiliary: string;
    tertiary: string;
    inferior: string;
  };
  famous_people: string[];
  compatibility: {
    romantic: string[];
    friendship: string[];
    work: string[];
  };
  career_paths: string[];
  growth_tips: string[];
  stress_triggers: string[];
} 
