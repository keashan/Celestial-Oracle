import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export const config = {
  maxDuration: 60, // Gemini can take a while
};

export default async function handler(req: any, res: any) {
  // 1. Verify Authorization (Vercel Cron security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const apiKey = process.env.VITE_API_KEY || process.env.API_KEY;
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;

    if (!apiKey || !pageId || !pageToken) {
      throw new Error("Missing environment variables (GEMINI_API_KEY, FB_PAGE_ID, or FB_PAGE_ACCESS_TOKEN)");
    }

    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    // 2. Generate the Daily Destiny
    const prompt = `Generate a mystical "Today's Destiny" prediction for a Facebook post. 
    Include:
    - A general horoscope summary for the day.
    - Lucky numbers.
    - Lucky color.
    - A short piece of advice.
    
    The response must be a JSON object with a "message" field containing the full formatted text for the post. 
    Use emojis to make it look celestial and engaging.
    Language: English.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const prediction = JSON.parse(responseText);
    const postMessage = prediction.message;

    // 3. Post to Facebook
    const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/feed`;
    const fbResponse = await fetch(fbUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: postMessage,
        access_token: pageToken,
      }),
    });

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      throw new Error(`Facebook API Error: ${JSON.stringify(fbData)}`);
    }

    return res.status(200).json({ 
      success: true, 
      postId: fbData.id,
      message: "Daily destiny posted successfully!" 
    });

  } catch (error: any) {
    console.error("Cron Job Failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
