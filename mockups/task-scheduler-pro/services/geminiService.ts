import { GoogleGenAI, Type } from "@google/genai";
import { ActionType, Frequency, ScheduleMode } from "../types";

// Always use process.env.API_KEY directly in the constructor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseNaturalLanguageTask = async (input: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this user request for a scheduled task: "${input}". 
               Extract the task details into a JSON object. 
               Today's date is ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          action: {
            type: Type.STRING,
            enum: ["SHUTDOWN", "RESTART", "SLEEP", "MEETING", "REMINDER"],
          },
          frequency: {
            type: Type.STRING,
            enum: ["ONCE", "DAILY", "WEEKLY"],
          },
          scheduleMode: {
            type: Type.STRING,
            enum: ["RELATIVE", "ABSOLUTE"],
          },
          days: { type: Type.NUMBER, description: "Days from now if relative" },
          hours: {
            type: Type.NUMBER,
            description: "Hours from now if relative",
          },
          minutes: {
            type: Type.NUMBER,
            description: "Minutes from now if relative",
          },
          absoluteDate: {
            type: Type.STRING,
            description: "YYYY-MM-DD format if absolute",
          },
          absoluteTime: {
            type: Type.STRING,
            description: "HH:MM format if absolute",
          },
          notes: { type: Type.STRING },
        },
        required: ["title", "action", "frequency", "scheduleMode"],
      },
    },
  });

  try {
    // response.text is a property, not a method.
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return null;
  }
};
