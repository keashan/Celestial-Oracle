
import { GoogleGenAI, Type } from "@google/genai";
import { UserDetails, PredictionData, Language, Message, SignCategoryPrediction, MatchDetails, MatchPrediction, DailyPrediction } from "../types.ts";
import { db } from "./firebase.ts";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
 * Helper to get document ID for caching
 */
const getDocId = (prefix: string, lang: Language) => {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${date}_${lang}`;
};

/**
 * Generates category-based predictions for ALL 12 zodiac signs.
 * Uses Firebase Firestore Caching (One global call per day per language).
 */
export async function getAllSignPredictions(language: Language): Promise<Record<string, SignCategoryPrediction>> {
  const docId = getDocId('zodiac_yearly', language);
  const docRef = doc(db, "predictions", docId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Using Firestore cached 12-month forecast");
      return docSnap.data().data as Record<string, SignCategoryPrediction>;
    }
  } catch (e) {
    console.warn("Firestore cache read failed, falling back to API", e);
  }

  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const langInstruction = language === 'si' 
    ? "IMPORTANT: All values in the JSON response MUST be strictly in Sinhala language (සිංහල). Keep the tone mystical and professional." 
    : "All output text MUST be in English. Use a sophisticated, mystical, and encouraging tone.";

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
    Provide a professional astrological outlook for ALL 12 zodiac signs for the next 12 months.
    
    CRITICAL: Use the VEDIC (SIDEREAL/NIRAYANA) astrological framework.
    
    ${langInstruction}
    
    CONTENT DEPTH GUIDELINES:
    1. 'general': Extensive analysis (8-10 sentences).
    2. 'love', 'money', 'career', 'education', 'health': Meaningful summary (3-4 sentences).
    
    Return a JSON object where each key is the lowercase sign ID (e.g. "aries") and the value contains:
    1. Sign name
    2. Symbol (emoji only)
    3. Insights for categories.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictions: {
            type: Type.OBJECT,
            properties: {
              aries: signSchema, taurus: signSchema, gemini: signSchema, cancer: signSchema,
              leo: signSchema, virgo: signSchema, libra: signSchema, scorpio: signSchema,
              sagittarius: signSchema, capricorn: signSchema, aquarius: signSchema, pisces: signSchema
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
  
  const results: Record<string, SignCategoryPrediction> = {};
  Object.keys(parsed.predictions).forEach(key => {
    const data = parsed.predictions[key];
    results[key] = {
      sign: data.sign,
      symbol: data.symbol,
      categories: data.categories
    };
  });
  
  try {
    await setDoc(docRef, { data: results, timestamp: new Date() });
  } catch (e) {
    console.warn("Firestore cache save failed", e);
  }

  return results;
}

/**
 * Generates Daily Predictions for ALL 12 Signs.
 * Uses Firebase Firestore Caching (One global call per day per language).
 */
export async function getDailyPredictions(language: Language): Promise<Record<string, DailyPrediction>> {
  const docId = getDocId('daily_destiny', language);
  const docRef = doc(db, "predictions", docId);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Using Firestore cached daily destiny");
      return docSnap.data().data as Record<string, DailyPrediction>;
    }
  } catch (e) {
    console.warn("Firestore cache read failed, falling back to API", e);
  }

  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const dateStr = new Date().toLocaleDateString(language === 'si' ? 'si-LK' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const langInstruction = language === 'si' 
    ? "IMPORTANT: All output text MUST be strictly in Sinhala language (සිංහල)." 
    : "All output text MUST be in English.";

  const dailySchema = {
    type: Type.OBJECT,
    properties: {
      sign: { type: Type.STRING },
      prediction: { type: Type.STRING },
      luckyColor: { type: Type.STRING },
      luckyNumber: { type: Type.STRING },
      mood: { type: Type.STRING }
    },
    required: ["sign", "prediction", "luckyColor", "luckyNumber", "mood"]
  };

  const prompt = `
    Generate a brief DAILY Horoscope for ALL 12 Zodiac signs for today: ${dateStr}.
    Use Vedic principles.
    ${langInstruction}
    
    For each sign provide:
    - prediction: 2 sentences of guidance.
    - luckyColor: A color name.
    - luckyNumber: A single number.
    - mood: One word describing the day's vibe.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predictions: {
            type: Type.OBJECT,
            properties: {
              aries: dailySchema, taurus: dailySchema, gemini: dailySchema, cancer: dailySchema,
              leo: dailySchema, virgo: dailySchema, libra: dailySchema, scorpio: dailySchema,
              sagittarius: dailySchema, capricorn: dailySchema, aquarius: dailySchema, pisces: dailySchema
            },
            required: ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"]
          }
        },
        required: ["predictions"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Daily ritual failed.');
  const parsed = JSON.parse(text);

  const results: Record<string, DailyPrediction> = parsed.predictions;
  
  try {
    await setDoc(docRef, { data: results, timestamp: new Date() });
  } catch (e) {
    console.warn("Firestore cache save failed", e);
  }

  return results;
}

/**
 * Generates compatibility match.
 */
export async function getHoroscopeMatch(details: MatchDetails, language: Language): Promise<MatchPrediction> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const langInstruction = language === 'si' 
    ? "IMPORTANT: All output text MUST be strictly in Sinhala language (සිංහල)." 
    : "All output text MUST be in English.";

  const prompt = `
    Astrological compatibility based on VEDIC (SIDEREAL) astrology (Koota matching principle) for:
    P1: ${details.person1.name}, P2: ${details.person2.name}.
    ${langInstruction}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          categories: {
            type: Type.OBJECT,
            properties: {
              emotional: { type: Type.STRING }, physical: { type: Type.STRING },
              intellectual: { type: Type.STRING }, spiritual: { type: Type.STRING }
            },
            required: ["emotional", "physical", "intellectual", "spiritual"]
          },
          conclusion: { type: Type.STRING }
        },
        required: ["score", "summary", "categories", "conclusion"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error('Matching ritual failed.');
  return JSON.parse(text) as MatchPrediction;
}

/**
 * Generates a DEEP 12-month birth chart forecast.
 */
export async function getAstrologyPrediction(details: UserDetails): Promise<PredictionData> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const langInstruction = details.language === 'si' 
    ? "IMPORTANT: All output text MUST be strictly in Sinhala language (සිංහල)." 
    : "All output text MUST be in English.";

  const prompt = `
    Master Astrologer: Provide a comprehensive 12-month birth chart reading.
    Calculate the Zodiac sign using the VEDIC (SIDEREAL/NIRAYANA) system.
    
    User: ${details.name}, Born: ${details.birthDate} at ${details.birthTime} in ${details.birthLocation}.
    Start Date: ${currentMonthName} ${currentYear}.
    
    ${langInstruction}
    
    REQUIREMENTS:
    - 'zodiacSign': The Sun Sign (Rashi) in English.
    - 'prediction': Long-form analysis (approx 400 words).
    - 'monthlyBreakdown': 12 months with highlights.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }, 
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zodiacSign: { type: Type.STRING },
          symbol: { type: Type.STRING },
          prediction: { type: Type.STRING },
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
  if (!text) throw new Error('Oracle returned an empty signal.');
  return JSON.parse(text) as PredictionData;
}

/**
 * Chat interface message sending.
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
  
  const systemInstruction = `You are the Cosmic Oracle for ${userDetails.name}. Respond in ${currentLanguage === 'si' ? 'Sinhala' : 'English'}. Vedic context: ${prediction.prediction}.`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 0 } },
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || "The stars are silent.";
}
