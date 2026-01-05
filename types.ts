
export type Language = 'en' | 'si';

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

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
