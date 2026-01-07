
import { GoogleGenAI, Type } from "@google/genai";
import { UserDetails, PredictionData, Language, Message, SignCategoryPrediction, MatchDetails, MatchPrediction } from "../types.ts";

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
 * Generates category-based predictions for ALL 12 zodiac signs.
 * Optimized for speed by disabling thinking budget and focusing on core content.
 */
export async function getAllSignPredictions(language: Language): Promise<Record<string, SignCategoryPrediction>> {
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
    Signs: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces.
    
    ${langInstruction}
    
    CONTENT DEPTH GUIDELINES:
    1. 'general' (General Path): Provide an EXTENSIVE analysis (8-10 insightful sentences).
    2. 'love', 'money', 'career', 'education', 'health': Provide a meaningful summary of 3 to 4 insightful sentences each.
    
    Return a JSON object where each key is the lowercase sign ID (e.g. "aries") and the value contains:
    1. Sign name
    2. Symbol (emoji)
    3. Insights for the categories.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 0 }, // Faster and cheaper
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
    Astrological compatibility for:
    P1: ${details.person1.name}, Born: ${details.person1.birthDate} @ ${details.person1.birthTime} in ${details.person1.birthLocation}.
    P2: ${details.person2.name}, Born: ${details.person2.birthDate} @ ${details.person2.birthTime} in ${details.person2.birthLocation}.
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
    Master Astrologer: Provide a comprehensive 12-month birth chart reading for:
    Name: ${details.name}
    Born: ${details.birthDate} at ${details.birthTime} in ${details.birthLocation}, ${details.birthState}, ${details.birthCountry}.
    Context: ${details.additionalContext || "General spiritual growth"}.
    Start: ${currentMonthName} ${currentYear}.
    
    ${langInstruction}
    
    REQUIREMENTS:
    - 'prediction': Long-form analysis (approx 400-500 words). Cover Career, Inner Life, Karma, and Relationships in distinct paragraphs using \\n.
    - 'monthlyBreakdown': 12 months with substantial (3-4 sentence) highlights each.
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
  
  const systemInstruction = `You are the Cosmic Oracle for ${userDetails.name}. Respond in ${currentLanguage === 'si' ? 'Sinhala' : 'English'}. Tone: Mystical. Context: ${prediction.prediction}.`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: { systemInstruction, thinkingConfig: { thinkingBudget: 0 } },
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || (currentLanguage === 'si' ? "තරු නිහඬ වී ඇත." : "The stars are silent.");
}
