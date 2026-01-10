import { GoogleGenAI, Type } from "@google/genai";
import { NotificationType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getNotificationBriefing = async (
  type: NotificationType,
  title: string,
  context: string
) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, high-impact briefing for a full-screen ${type} notification titled "${title}". 
      The context is: "${context}". 
      Return the response in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            briefing: {
              type: Type.STRING,
              description: "A 1-2 sentence summary of why this matters.",
            },
            urgencyLevel: {
              type: Type.STRING,
              enum: ["low", "medium", "high"],
            },
            encouragement: {
              type: Type.STRING,
              description: "A very short punchy call to action.",
            },
          },
          required: ["briefing", "urgencyLevel", "encouragement"],
        },
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      briefing:
        "Action is required soon to ensure system stability and productivity.",
      urgencyLevel: "medium",
      encouragement: "Please prepare for the transition.",
    };
  }
};
