
import { GoogleGenAI, Type } from "@google/genai";
import { AisleCategory, SmartSuggestion } from "../types";

// Always use direct process.env.API_KEY for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeItem = async (itemName: string): Promise<AisleCategory> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Categorize the following grocery item into one of these aisles: ${Object.values(AisleCategory).join(', ')}. Return only the category name. Item: ${itemName}`,
    });

    const category = response.text?.trim() as AisleCategory;
    return Object.values(AisleCategory).includes(category) ? category : AisleCategory.OTHER;
  } catch (error) {
    console.error("Gemini Categorization Error:", error);
    return AisleCategory.OTHER;
  }
};

export const getSmartSuggestions = async (currentItems: string[]): Promise<SmartSuggestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this shopping list: ${currentItems.join(', ')}, suggest 4 additional items that are often bought together with these. Return in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { 
                type: Type.STRING,
                description: "One of: " + Object.values(AisleCategory).join(', ')
              }
            },
            required: ["name", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return [];
  }
};
