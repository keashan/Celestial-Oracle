import { GoogleGenAI, GenerateContentResponse, ThinkingLevel } from "@google/genai";
import { UserDetails, PredictionData, SignCategoryPrediction, Language, MatchDetails, MatchPrediction } from '../types';
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const FIREBASE_CONFIG = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  measurementId: (import.meta as any).env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API Key not found. Please connect your API key.");
  }
  return new GoogleGenAI({ apiKey });
};

const generateCacheKey = (type: string, details: any, language: Language) => {
  return `${type}-${language}-${JSON.stringify(details)}`;
};

const fetchFromCache = async (cacheKey: string) => {
  const docRef = doc(db, "predictions", cacheKey);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().data;
  }
  return null;
};

const saveToCache = async (cacheKey: string, data: any) => {
  const docRef = doc(db, "predictions", cacheKey);
  await setDoc(docRef, { data, timestamp: new Date() });
};

export const getAstrologyPrediction = async (userDetails: UserDetails): Promise<PredictionData> => {
  const ai = getGeminiClient();
  const cacheKey = generateCacheKey("astrology", userDetails, 'en'); // Cache always in English
  const cachedData = await fetchFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const prompt = `Generate a detailed astrological prediction for the following user based on their birth details. Provide a comprehensive analysis covering various aspects of their life. The response should be in JSON format, adhering to the PredictionData interface. Ensure all fields are populated with meaningful and relevant information. The output should be directly parsable JSON, with no markdown or extra text.

User Details:
Name: ${userDetails.name}
Date of Birth: ${userDetails.dob}
Time of Birth: ${userDetails.tob}
Country: ${userDetails.country}
City: ${userDetails.city}
Gender: ${userDetails.gender}

PredictionData interface:
interface PredictionData {
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
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No prediction text received.");
    }

    const prediction = JSON.parse(text) as PredictionData;
    await saveToCache(cacheKey, prediction);
    return prediction;
  } catch (error) {
    console.error("Error getting astrology prediction:", error);
    throw error;
  }
};

export const getHoroscopeMatch = async (matchDetails: MatchDetails, language: Language): Promise<MatchPrediction> => {
  const ai = getGeminiClient();
  const cacheKey = generateCacheKey("match", matchDetails, language);
  const cachedData = await fetchFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const prompt = `Generate a detailed horoscope compatibility report for two individuals. The response should be in JSON format, adhering to the MatchPrediction interface. Ensure all fields are populated with meaningful and relevant information. The output should be directly parsable JSON, with no markdown or extra text.

Individual 1 Details:
Name: ${matchDetails.name1}
Date of Birth: ${matchDetails.dob1}
Time of Birth: ${matchDetails.tob1}
Country: ${matchDetails.country1}
City: ${matchDetails.city1}
Gender: ${matchDetails.gender1}

Individual 2 Details:
Name: ${matchDetails.name2}
Date of Birth: ${matchDetails.dob2}
Time of Birth: ${matchDetails.tob2}
Country: ${matchDetails.country2}
City: ${matchDetails.city2}
Gender: ${matchDetails.gender2}

MatchPrediction interface:
interface MatchPrediction {
  compatibilityScore: number; // A score from 0-100
  strengths: string[];
  challenges: string[];
  advice: string;
  summary: string;
}

Provide the response in ${language === 'si' ? 'Sinhala' : 'English'}.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No match prediction text received.");
    }

    const matchPrediction = JSON.parse(text) as MatchPrediction;
    await saveToCache(cacheKey, matchPrediction);
    return matchPrediction;
  } catch (error) {
    console.error("Error getting horoscope match:", error);
    throw error;
  }
};

export const getAllSignPredictions = async (language: Language): Promise<Record<string, SignCategoryPrediction>> => {
  const ai = getGeminiClient();
  const cacheKey = generateCacheKey("allSigns", {}, language);
  const cachedData = await fetchFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const prompt = `Generate detailed astrological predictions for all 12 zodiac signs. The response should be a JSON object where keys are the sign IDs (e.g., 'aries', 'taurus') and values are objects adhering to the SignCategoryPrediction interface. Ensure all fields are populated with meaningful and relevant information. The output should be directly parsable JSON, with no markdown or extra text.

SignCategoryPrediction interface:
interface SignCategoryPrediction {
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

Provide the response in ${language === 'si' ? 'Sinhala' : 'English'}.
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No sign predictions text received.");
    }

    const allSignPredictions = JSON.parse(text) as Record<string, SignCategoryPrediction>;
    await saveToCache(cacheKey, allSignPredictions);
    return allSignPredictions;
  } catch (error) {
    console.error("Error getting all sign predictions:", error);
    throw error;
  }
};

export const getChatResponse = async (history: any[], newMessage: string, userDetails: UserDetails, prediction: PredictionData, language: Language): Promise<string> => {
  const ai = getGeminiClient();

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are a helpful and mystical cosmic oracle. Provide guidance and insights based on the user's astrological prediction and birth details. Keep your responses concise, encouraging, and aligned with the mystical theme. Respond in ${language === 'si' ? 'Sinhala' : 'English'}.`,
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    },
    history: history.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }))
  });

  const fullPrompt = `User's Birth Details: ${JSON.stringify(userDetails)}
User's Astrology Prediction: ${JSON.stringify(prediction)}

User: ${newMessage}`;

  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message: fullPrompt });
    const text = response.text;
    if (!text) {
      throw new Error("No chat response text received.");
    }
    return text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw error;
  }
};

export const getDailyDestiny = async (language: Language): Promise<PredictionData> => {
  const ai = getGeminiClient();
  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = generateCacheKey("dailyDestiny", { date: today }, language);
  const cachedData = await fetchFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const prompt = `Generate a general daily destiny prediction for today. The response should be in JSON format, adhering to the PredictionData interface. Ensure all fields are populated with meaningful and relevant information. The output should be directly parsable JSON, with no markdown or extra text.

PredictionData interface:
interface PredictionData {
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

Provide the response in ${language === 'si' ? 'Sinhala' : 'English'}.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No daily destiny text received.");
    }

    const prediction = JSON.parse(text) as PredictionData;
    await saveToCache(cacheKey, prediction);
    return prediction;
  } catch (error) {
    console.error("Error getting daily destiny prediction:", error);
    throw error;
  }
};
