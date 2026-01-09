
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChatResponse = async (
  message: string,
  history: ChatMessage[]
): Promise<string> => {
  try {
    const model = "gemini-3-flash-preview";
    
    // Construct the context based on previous messages
    let historyContext = "";
    history.forEach(msg => {
        historyContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
    });

    const systemInstruction = `You are a friendly and helpful food ordering assistant for a restaurant called "Scan To Serve". 
    Help users find items on the menu, make recommendations, and answer questions about the restaurant. 
    The menu includes: Meals (South Indian Thali), Biryani, Porotta, Veg Biryani, Vada, Chicken 65, Gopi 65, Bonda, Gulab Jamun, Ice Cream, Payasam, Cake, Juice, Coffee, Milk Shake, and Soft Drinks.
    Keep your answers concise and appetizing.`;

    const prompt = `${systemInstruction}\n\nChat History:\n${historyContext}\nUser: ${message}\nAssistant:`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "I'm having trouble connecting right now. Please try again.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Sorry, I encountered an error. Please try again later.";
  }
};
