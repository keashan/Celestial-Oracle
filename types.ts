
export type Language = 'en' | 'si';

export type AppView = 'HOME' | 'SIGN_DETAIL' | 'FORM' | 'RESULT';

export interface UserDetails {
  name: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
  birthState: string;
  birthCountry: string;
  language: Language;
  additionalContext?: string;
}

export interface PredictionData {
  zodiacSign: string;
  symbol: string;
  prediction: string;
  monthlyBreakdown: { month: string; highlight: string }[];
}

export interface SignCategoryPrediction {
  sign: string;
  symbol: string;
  categories: {
    general: string;
    love: string;
    money: string;
    career: string;
    education: string;
    health: string;
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ZodiacSignInfo {
  id: string;
  en: string;
  si: string;
  symbol: string;
}

export const ZODIAC_SIGNS: ZodiacSignInfo[] = [
  { id: 'aries', en: 'Aries', si: 'මේෂ', symbol: '♈' },
  { id: 'taurus', en: 'Taurus', si: 'වෘෂභ', symbol: '♉' },
  { id: 'gemini', en: 'Gemini', si: 'මිථුන', symbol: '♊' },
  { id: 'cancer', en: 'Cancer', si: 'කටක', symbol: '♋' },
  { id: 'leo', en: 'Leo', si: 'සිංහ', symbol: '♌' },
  { id: 'virgo', en: 'Virgo', si: 'කන්‍යා', symbol: '♍' },
  { id: 'libra', en: 'Libra', si: 'තුලා', symbol: '♎' },
  { id: 'scorpio', en: 'Scorpio', si: 'වෘශ්චික', symbol: '♏' },
  { id: 'sagittarius', en: 'Sagittarius', si: 'ධනු', symbol: '♐' },
  { id: 'capricorn', en: 'Capricorn', si: 'මකර', symbol: '♑' },
  { id: 'aquarius', en: 'Aquarius', si: 'කුම්භ', symbol: '♒' },
  { id: 'pisces', en: 'Pisces', si: 'මීන', symbol: '♓' },
];
