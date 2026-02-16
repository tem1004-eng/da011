
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDiaryEntry(content: string): Promise<AIAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Please analyze the following diary entry and provide a thoughtful reflection, a short summary, a sentiment label, and a few descriptive tags. Content: "${content}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentiment: {
            type: Type.STRING,
            description: "A single word describing the overall mood (e.g., Grateful, Anxious, Happy, Reflective).",
          },
          summary: {
            type: Type.STRING,
            description: "A concise 1-sentence summary of the entry.",
          },
          reflection: {
            type: Type.STRING,
            description: "A warm, encouraging, and empathetic reflection or question based on the content.",
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A few keywords related to themes in the entry.",
          },
        },
        required: ["sentiment", "summary", "reflection", "tags"],
      },
    },
  });

  try {
    return JSON.parse(response.text.trim()) as AIAnalysis;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return {
      sentiment: "Unknown",
      summary: "Could not summarize entry.",
      reflection: "Take a deep breath and keep writing. Your words matter.",
      tags: [],
    };
  }
}
