"use server";

import { chatWithGemini } from "@/lib/api/ai/gemini";

// Intelligent offline waste sorting knowledgebase
const KNOWLEDGE_BASE: { keywords: string[]; response: string }[] = [
  {
    keywords: ["plastic", "pet", "hdpe", "bottle"],
    response: "Plastic waste should be rinsed and sorted by code. Code 1 (PET, e.g., soda bottles) and Code 2 (HDPE, e.g., milk jugs) are highly recyclable. Place clean plastics in BinBuddy's Blue/Green recycle bins. Avoid recycling thin grocery bags locally as they clog machinery."
  },
  {
    keywords: ["paper", "cardboard", "newspaper", "box"],
    response: "Clean paper and cardboard are fully recyclable! Make sure to flatten boxes. Note: greasy pizza boxes, dirty tissues, or plastic-lined coffee cups are NOT recyclable and should go in the trash or compost."
  },
  {
    keywords: ["glass", "bottle", "jar"],
    response: "Glass bottles and jars are 100% recyclable infinitely! Rinse them clean and separate them by color if possible. Do NOT mix drinking glasses, Pyrex, or lightbulbs in the recycle bin as they have different melting points."
  },
  {
    keywords: ["metal", "can", "aluminum", "tin"],
    response: "Aluminum soda cans and steel soup cans are very easy to recycle. Rinse them out and throw them in the blue recycling bin. For larger scrap metal, you can request a pickup via BinBuddy's 'Recycle Centers' dashboard."
  },
  {
    keywords: ["e-waste", "battery", "phone", "electronics", "charger", "computer"],
    response: "Electronic waste and batteries contain heavy metals and hazardous chemicals. NEVER throw them in the normal trash! Drop them off at the Kathmandu Recycling Hub or schedule a doorstep pickup in the Recycle Centers tab."
  },
  {
    keywords: ["organic", "food", "compost", "vegetable", "fruit", "scraps"],
    response: "Organic materials (food scraps, tea bags, peelings, eggshells) make excellent compost! Composting reduces landfill methane. Ensure no plastic stickers or bags get mixed in."
  },
  {
    keywords: ["hazard", "paint", "pesticide", "chemical", "bulb", "spray"],
    response: "Hazardous waste like old paint, pesticides, chemical cleaners, and batteries need specialized municipal drop-offs. Do not dump them down the drain or mix with standard recyclables."
  },
  {
    keywords: ["sorting", "separation", "categories", "color", "bin"],
    response: "For optimal sorting: use Green for organic/biodegradable waste, Blue for dry recyclables (paper, plastic, clean metal), and Black/Red for landfill trash. This helps keep local Kathmandu communities clean!"
  },
  {
    keywords: ["pickup", "schedule", "reclaim", "collect"],
    response: "To request a doorstep waste pickup: navigate to the 'Recycle Centers' page on your user dashboard. Pick any active center, click 'Request Pickup', fill out your quantity and date, and submit. The center will handle the rest!"
  },
  {
    keywords: ["binbuddy", "about", "project", "features", "dashboard"],
    response: "BinBuddy is a college project designed to promote smart waste sorting and clean communities! Features include: 'Smart Sort' classification, a dynamic Kathmandu 'Recycle Centers' catalog with pickup requests, custom notifications, sustainability tips, and blogs."
  }
];

export const askGeminiChatbot = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  try {
    // Attempt to query Gemini API first
    const response = await chatWithGemini(prompt, history);
    return { success: true, response };
  } catch (error: any) {
    console.warn("Gemini API call failed, using offline Knowledge Base:", error?.message);

    // Offline matching fallback
    const query = prompt.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const entry of KNOWLEDGE_BASE) {
      let matches = 0;
      for (const keyword of entry.keywords) {
        if (query.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = entry;
      }
    }

    if (bestMatch && maxMatches > 0) {
      return { success: true, response: bestMatch.response };
    }

    // Default friendly assistant response
    return {
      success: true,
      response: "I am the BinBuddy AI Assistant. I can help you with waste sorting guidelines, recycling centers, doorstep pickups, and composting tips. Feel free to ask about plastic, paper, e-waste, organic waste, or how BinBuddy works!"
    };
  }
};
