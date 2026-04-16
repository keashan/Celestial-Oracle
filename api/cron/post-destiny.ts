import { getDailyPredictions } from "../../src/services/geminiService.js";
import { ZODIAC_SIGNS } from "../../src/types.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req: any, res: any) {
  // 1. Verify Authorization (Vercel Cron security)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const pageId = process.env.FB_PAGE_ID;
    const pageToken = process.env.FB_PAGE_ACCESS_TOKEN;

    if (!pageId || !pageToken) {
      throw new Error("Missing environment variables (FB_PAGE_ID or FB_PAGE_ACCESS_TOKEN)");
    }

    // 2. Get Daily Predictions for both languages (Uses Firestore Cache automatically)
    const [predictionsEn, predictionsSi] = await Promise.all([
      getDailyPredictions('en'),
      getDailyPredictions('si')
    ]);
    
    // 3. Pick a random sign
    const randomSign = ZODIAC_SIGNS[Math.floor(Math.random() * ZODIAC_SIGNS.length)];
    const dataEn = predictionsEn[randomSign.id];
    const dataSi = predictionsSi[randomSign.id];

    if (!dataEn || !dataSi) {
      throw new Error(`Missing predictions for sign: ${randomSign.id}`);
    }

    // 4. Format the Facebook Post (Sinhala + English)
    const postMessage = `✨ අද දවසේ දෛවය ✨

🌌 **${randomSign.si} ලග්නය සඳහා පොදු අනාවැකිය:** ${dataSi.prediction}

🔮 **වාසනාවන්ත අංක:** ${dataSi.luckyNumber}
🎨 **වාසනාවන්ත වර්ණය:** ${dataSi.luckyColor}
🧘 **මනෝභාවය:** ${dataSi.mood}
✨ **විශ්වීය උපදෙස:** ${dataSi.celestialTip}

---

✨ TODAY'S DESTINY ✨

🌌 **General Forecast for ${randomSign.en}:** ${dataEn.prediction}

🔮 **Lucky Numbers:** ${dataEn.luckyNumber}
🎨 **Lucky Color:** ${dataEn.luckyColor}
🧘 **Mood:** ${dataEn.mood}
✨ **Celestial Tip:** ${dataEn.celestialTip}

🙏 Trust the whispers of the universe. Your path is unfolding exactly as it should. ✨

ඔබේ සම්පූර්ණ කේන්ද්‍ර පලාපල පරීක්ෂා කර ගැනීමට පිවිසෙන්න:
Explore your full birth chart at:
https://palapala.ktktools.net

#CosmicOracle #DailyHoroscope #DailyDestiny #SinhalaAstrology #Zodiac #${randomSign.en} #${randomSign.si}`;

    // 5. Post to Facebook with Image (using the app logo as the featured image)
    const fbUrl = `https://graph.facebook.com/v19.0/${pageId}/photos`;
    const fbResponse = await fetch(fbUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: "https://i.imgur.com/JUYyd8A.png", // Using the app logo as requested
        caption: postMessage,
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
      sign: randomSign.en,
      message: "Daily destiny posted successfully!" 
    });

  } catch (error: any) {
    console.error("Cron Job Failed:", error);
    return res.status(500).json({ error: error.message });
  }
}
