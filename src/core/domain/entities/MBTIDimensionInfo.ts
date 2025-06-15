export interface MBTIDimensionInfo {
  id: string;
  name_en: string;
  name_vi: string;
  description: string;
  keywords: string[];
  examples?: string[];
  dimension_type: 'EI' | 'SN' | 'TF' | 'JP';
}

export interface MBTITraitInfo {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  dimension_name_vi: string;
  trait_a: MBTIDimensionInfo;
  trait_b: MBTIDimensionInfo;
}

export interface PersonalityDetailInfo {
  type: string;
  name: string;
  description: string;
  note: string;
  trait_percentages: {
    E: number; // Extraversion
    I: number; // Introversion
    S: number; // Sensing
    N: number; // Intuition
    T: number; // Thinking
    F: number; // Feeling
    J: number; // Judging
    P: number; // Perceiving
  };
  dimensions: MBTITraitInfo[];
  strengths: {
    title: string;
    description: string;
    why_explanation: string;
  }[];
  weaknesses: {
    title: string;
    description: string;
    why_explanation: string;
    improvement_advice: string;
  }[];
  development_advice: string[];
  relationship_analysis: {
    interaction_style: string;
    improvement_tips: string[];
  };
  career_guidance: {
    suitable_fields: string[];
    improvement_skills: string[];
    career_matches: string[];
  };
} 