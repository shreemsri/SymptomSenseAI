const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export const callGeminiAPI = async (prompt, fallbackResponse) => {
  if (!GEMINI_API_KEY) {
    console.error("Gemini API key is missing");
    // Return dummy data if no key, ensuring UI works
    return fallbackResponse;
  }
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 500 }
      })
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    // Strip markdown backticks before JSON.parse
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
    
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error.message === "RATE_LIMIT") {
      return { ...fallbackResponse, error: "RATE_LIMIT" };
    }
    return fallbackResponse;
  }
};
