export type Language = 'en' | 'si';

export type AppView = 
  'DAILY' | 
  'HOME' | 
  'SIGN_DETAIL' | 
  'FORM' | 
  'RESULT' | 
  'MATCH_FORM' | 
  'MATCH_RESULT' | 
  'HOW_TO' | 
  'ABOUT' | 
  'PRIVACY' | 
  'TERMS';

export interface UserDetails {
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  country: string;
  city: string;
  gender: 'male' | 'female' | 'other';
}

export interface MatchDetails {
  name1: string;
  dob1: string;
  tob1: string;
  country1: string;
  city1: string;
  gender1: 'male' | 'female' | 'other';
  name2: string;
  dob2: string;
  tob2: string;
  country2: string;
  city2: string;
  gender2: 'male' | 'female' | 'other';
}

export interface PredictionData {
  horoscope: string;
  luckyNumbers: number[];
  luckyColor: string;
  compatibility: string;
  mood: string;
  career: string;
  travel: string;
  health: string;
  emotions: string;
  personalLife: string;
  finance: string;
  summary: string;
}

export interface MatchPrediction {
  compatibilityScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
  summary: string;
}

export interface SignCategoryPrediction {
  id: string;
  name: string;
  dateRange: string;
  symbol: string;
  element: string;
  rulingPlanet: string;
  traits: string[];
  prediction: string;
  compatibilitySigns: string[];
}

export interface NavButton {
  id: string;
  label: string;
  action: () => void;
  gradient: string;
  active: boolean;
}
