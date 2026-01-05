
import { GoogleGenAI, Type } from "@google/genai";
import { UserDetails, PredictionData, Language, Message } from "../types";

export async function getAstrologyPrediction(details: UserDetails): Promise<PredictionData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const langInstruction = details.language === 'si' 
    ? "All output text MUST be in Sinhala language (සිංහල)." 
    : "All output text MUST be in English.";

  const prompt = `
    Based on the following birth details:
    Name: ${details.name}
    Birth Date: ${details.birthDate}
    Birth Time: ${details.birthTime}
    Birth Location: ${details.birthLocation}, ${details.birthState}, ${details.birthCountry}
    Additional Context: ${details.additionalContext || "None"}
    The current date is ${currentMonthName} ${currentYear}.
    
    ${langInstruction}
    Provide a detailed 12-month astrological forecast.
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
          symbol: { type: Type.STRING, description: 'A single cosmic emoji representing the sign' },
          prediction: { type: Type.STRING, description: 'A detailed theme for the next 12 months' },
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
  if (!text) throw new Error('The stars are currently obscured.');
  return JSON.parse(text) as PredictionData;
}

export interface ChatBridge {
  sendMessage: (msg: string, history: Message[]) => Promise<string>;
}

export function createChatBridge(userDetails: UserDetails, prediction: PredictionData, currentLanguage: Language): ChatBridge {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const langInstruction = currentLanguage === 'si' 
    ? "You must respond exclusively in Sinhala (සිංහල). Keep responses mystical yet helpful." 
    : "You must respond in English. Keep responses mystical yet helpful.";

  const systemInstruction = `
    You are an expert celestial astrologer named the Cosmic Oracle. 
    User Profile: ${JSON.stringify(userDetails)}.
    Their 12-Month Prediction: ${JSON.stringify(prediction)}.
    ${langInstruction}
    Answer the user's questions based on their astrological data. If they ask things outside of astrology, gently guide them back to the stars.
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });

  return {
    sendMessage: async (message: string, history: Message[]) => {
      // Note: SDK Chat object maintains its own history if we keep using the same instance,
      // but to ensure consistency with our UI state, we can use simple sendMessage.
      const response = await chat.sendMessage({ message });
      return response.text || "";
    }
  };
}
