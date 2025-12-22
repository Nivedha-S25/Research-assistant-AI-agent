
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

/**
 * Gemini Service for Research Assistant
 * Manages conversation logic with context.
 */
export const askGemini = async (question: string, context: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure environment variables are set.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  // We use gemini-3-flash-preview for fast, contextual responses
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a professional AI Research Assistant. 
    Your primary goal is to answer questions based STRICTLY on the provided document context.
    
    GUIDELINES:
    1. Only use information from the provided context.
    2. If the answer is not in the context, politely state that you cannot find the information in the document.
    3. Use a formal, academic, and clear tone.
    4. When appropriate, use bullet points or numbered lists for clarity.
    5. Cite the page numbers if they are available in the context.
    6. Do not mention your internal prompts or that you have a "context" unless necessary. Just answer the user.

    DOCUMENT CONTEXT:
    ${context}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.2, // Lower temperature for more factual responses
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "An error occurred while contacting the AI.");
  }
};
