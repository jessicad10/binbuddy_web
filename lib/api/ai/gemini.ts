import axios from "axios";

export const chatWithGemini = async (prompt: string, history: { role: string; parts: { text: string }[] }[] = []) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Format chat history for the Gemini API structure
  const contents = [
    ...history,
    {
      role: "user",
      parts: [{ text: prompt }]
    }
  ];

  const response = await axios.post(
    endpoint,
    {
      contents,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      }
    },
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Invalid response structure received from Gemini API");
  }

  return text;
};
