
import { GoogleGenAI, Type } from "@google/genai";
import { UserDetails, PredictionData, Language, Message, SignCategoryPrediction } from "../types.ts";

/**
 * Gets the API key from environment or bridge.
 */
function getApiKey(): string {
  const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
  if (!key) {
    throw new Error('API_KEY is not configured in the environment.');
  }
  return key;
}

/**
 * Generates category-based predictions for ALL 12 zodiac signs in one go.
 */
export async function getAllSignPredictions(language: Language): Promise<Record<string, SignCategoryPrediction>> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const langInstruction = language === 'si' 
    ? "IMPORTANT: All values in the JSON response MUST be strictly in Sinhala language (සිංහල). Keep the tone mystical and professional." 
    : "All output text MUST be in English.";

  // Define the sign structure explicitly since $ref is not supported
  const signSchema = {
    type: Type.OBJECT,
    properties: {
      sign: { type: Type.STRING },
      symbol: { type: Type.STRING },
      categories: {
        type: Type.OBJECT,
        properties: {
          general: { type: Type.STRING },
          love: { type: Type.STRING },
          money: { type: Type.STRING },
          career: { type: Type.STRING },
          education: { type: Type.STRING },
          health: { type: Type.STRING },
        },
        required: ["general", "love", "money", "career", "education", "health"]
      }
    },
    required: ["sign", "symbol", "categories"]
  };

  const prompt = `
    Provide a detailed astrological outlook for ALL 12 zodiac signs for the current period.
    Signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.
    ${langInstruction}
    Return a JSON object where each key is the lowercase sign ID (e.g. "aries", "taurus") and the value contains:
    1. Sign name (in ${language === 'si' ? 'Sinhala' : 'English'})
    2. Symbol (emoji)
    3. Insights for these categories: General Path, Love & Romance, Wealth & Money, Career & Job, Education, Health.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictions: {
            type: Type.OBJECT,
            properties: {
              aries: signSchema,
              taurus: signSchema,
              gemini: signSchema,
              cancer: signSchema,
              leo: signSchema,
              virgo: signSchema,
              libra: signSchema,
              scorpio: signSchema,
              sagittarius: signSchema,
              capricorn: signSchema,
              aquarius: signSchema,
              pisces: signSchema
            },
            required: ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
          }
        },
        required: ["predictions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('The oracle returned an empty signal.');
  const parsed = JSON.parse(text);
  
  // Extract the inner "predictions" map
  const results: Record<string, SignCategoryPrediction> = {};
  Object.keys(parsed.predictions).forEach(key => {
    const data = parsed.predictions[key];
    results[key] = {
      sign: data.sign,
      symbol: data.symbol,
      categories: data.categories
    };
  });
  
  return results;
}

/**
 * Generates the initial 12-month astrology prediction using Gemini 3 Flash.
 */
export async function getAstrologyPrediction(details: UserDetails): Promise<PredictionData> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const langInstruction = details.language === 'si' 
    ? "IMPORTANT: All output text (zodiacSign, prediction, and monthly highlights) MUST be strictly in Sinhala language (සිංහල). Use appropriate astrological terms in Sinhala." 
    : "All output text MUST be in English.";

  const prompt = `
    Analyze these birth details to generate a 12-month Vedic-inspired astrology forecast:
    Name: ${details.name}
    Birth Date: ${details.birthDate}
    Birth Time: ${details.birthTime}
    Birth Location: ${details.birthLocation}, ${details.birthState}, ${details.birthCountry}
    User Context: ${details.additionalContext || "General life guidance"}
    Current Context: ${currentMonthName} ${currentYear}
    
    ${langInstruction}
    Provide a core theme for the next 12 months and a breakdown of major highlights for each month.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zodiacSign: { type: Type.STRING },
          symbol: { type: Type.STRING, description: 'A single zodiac emoji corresponding to the sign' },
          prediction: { type: Type.STRING, description: 'The overarching 12-month theme/summary' },
          monthlyBreakdown: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                highlight: { type: Type.STRING }
              },
              required: ["month", "highlight"]
            }
          }
        },
        required: ["zodiacSign", "symbol", "prediction", "monthlyBreakdown"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('The oracle returned an empty signal.');
  return JSON.parse(text) as PredictionData;
}

/**
 * Sends a message to the Cosmic Oracle chat using Gemini 3 Flash.
 */
export async function sendChatMessage(
  message: string, 
  history: Message[], 
  userDetails: UserDetails, 
  prediction: PredictionData,
  currentLanguage: Language
): Promise<string> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const langInstruction = currentLanguage === 'si' 
    ? "You must respond exclusively in Sinhala (සිංහල). Keep the tone mystical and traditional." 
    : "You must respond in English. Keep responses mystical, empathetic, and insightful.";

  const systemInstruction = `
    You are the "Cosmic Oracle," a wise celestial guide. 
    User Profile: ${userDetails.name}, born ${userDetails.birthDate} at ${userDetails.birthTime}.
    Prediction Context: ${prediction.prediction}.
    
    ${langInstruction}
    Maintain a consistent persona. Answer questions about the user's astrological path based on their profile and 12-month outlook.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction },
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || (currentLanguage === 'si' ? "තරු නිහඬ වී ඇත." : "The stars are silent.");
}
