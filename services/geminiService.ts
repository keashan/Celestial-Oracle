
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
 * Generates category-based predictions for ALL 12 zodiac signs in one go.
 * Optimized for speed by concentrating detail on the primary path.
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
    1. 'general' (General Path): Provide an EXTENSIVE, DEEP, and HIGHLY DETAILED analysis (8 to 10 insightful sentences).
    2. 'love', 'money', 'career', 'education', 'health': Provide a concise but meaningful summary of 2 to 3 insightful sentences each. 
    
    Ensure the insights feel premium and specific to the sign's planetary transits over the next year.
    
    Return a JSON object where each key is the lowercase sign ID (e.g. "aries", "taurus") and the value contains:
    1. Sign name (in ${language === 'si' ? 'Sinhala' : 'English'})
    2. Symbol (emoji)
    3. Detailed insights for the categories listed above.
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
 * Generates compatibility match for two individuals.
 */
export async function getHoroscopeMatch(details: MatchDetails, language: Language): Promise<MatchPrediction> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const langInstruction = language === 'si' 
    ? "IMPORTANT: All output text MUST be strictly in Sinhala language (සිංහල). Use traditional Vedic terms for matching (Porutham)." 
    : "All output text MUST be in English.";

  const prompt = `
    Perform a deep astrological compatibility analysis for marriage between these two individuals:
    
    Person 1: ${details.person1.name}, Born: ${details.person1.birthDate} at ${details.person1.birthTime} in ${details.person1.birthLocation}, ${details.person1.birthCountry}.
    Person 2: ${details.person2.name}, Born: ${details.person2.birthDate} at ${details.person2.birthTime} in ${details.person2.birthLocation}, ${details.person2.birthCountry}.

    ${langInstruction}
    Provide:
    1. A harmony score (percentage)
    2. A mystical summary of their bond
    3. Detailed insights for: Emotional (Moon), Physical (Mars/Venus), Intellectual (Mercury), Spiritual (Jupiter)
    4. A final conclusion/blessing.
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
              emotional: { type: Type.STRING },
              physical: { type: Type.STRING },
              intellectual: { type: Type.STRING },
              spiritual: { type: Type.STRING }
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
  if (!text) throw new Error('The matching ritual failed.');
  return JSON.parse(text) as MatchPrediction;
}

/**
 * Generates a DEEP 12-month birth chart astrology forecast.
 */
export async function getAstrologyPrediction(details: UserDetails): Promise<PredictionData> {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });
  
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const langInstruction = details.language === 'si' 
    ? "IMPORTANT: All output text MUST be strictly in Sinhala language (සිංහල). Use advanced Vedic astrological terminology." 
    : "All output text MUST be in English. Use sophisticated, high-end astrological prose.";

  const prompt = `
    Act as a Master Astrologer. Generate an extremely comprehensive, high-resolution 12-month birth chart reading for:
    Name: ${details.name}
    Exact Birth Date: ${details.birthDate}
    Exact Birth Time: ${details.birthTime}
    Birth Location: ${details.birthLocation}, ${details.birthState}, ${details.birthCountry}
    User Current Context: ${details.additionalContext || "General life guidance and spiritual evolution"}
    Reference Start Date: ${currentMonthName} ${currentYear}
    
    ${langInstruction}
    
    REQUIREMENTS FOR 'prediction' FIELD:
    - This must be a DEEP DIVE. Provide a long-form analysis of at least 8 to 10 detailed paragraphs (approx 600-800 words).
    - Analyze the unique positioning of planets based on their birth time and coordinates.
    - Cover specific areas: Inner Transformation, Career Trajectory, Karmic Lessons for the year, and Relationship Dynamics.
    - Incorporate the 'User Current Context' seamlessly into the divine advice.
    - Use mystical, evocative language that feels authoritative and deeply personal. Use line breaks (\\n) between paragraphs.

    REQUIREMENTS FOR 'monthlyBreakdown' FIELD:
    - For each month, provide a substantial 'highlight' (3-4 sentences) that describes specific planetary transits (e.g., Jupiter movement, Saturn aspects) affecting the user's chart specifically.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // Giving it a bit of budget for reasoning to ensure the long prediction is high quality
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          zodiacSign: { type: Type.STRING },
          symbol: { type: Type.STRING },
          prediction: { type: Type.STRING, description: 'The overarching multi-paragraph 12-month deep dive analysis.' },
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
 * Sends a message to the Cosmic Oracle chat.
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
    config: { 
      systemInstruction,
      thinkingConfig: { thinkingBudget: 0 }
    },
    history: history.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))
  });

  const response = await chat.sendMessage({ message });
  return response.text || (currentLanguage === 'si' ? "තරු නිහඬ වී ඇත." : "The stars are silent.");
}
