
import { GoogleGenAI, Type } from "@google/genai";
import { UserDetails, PredictionData, Language, Message } from "../types.ts";

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
 * Sends a message to the Cosmic Oracle chat using Gemini 3 Pro.
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
    ? "You must respond exclusively in Sinhala (සිංහල). Use 'process' and 'server' as loanwords where needed in context of the app agreement if mentioned, but otherwise keep the tone mystical and traditional." 
    : "You must respond in English. Keep responses mystical, empathetic, and insightful.";

  const systemInstruction = `
    You are the "Cosmic Oracle," a wise celestial guide. 
    User Profile: ${userDetails.name}, born ${userDetails.birthDate} at ${userDetails.birthTime}.
    Prediction Context: ${prediction.prediction}.
    
    ${langInstruction}
    Maintain a consistent persona. Answer questions about the user's astrological path based on their profile and 12-month outlook.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction },
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || (currentLanguage === 'si' ? "තරු නිහඬ වී ඇත." : "The stars are silent.");
}
