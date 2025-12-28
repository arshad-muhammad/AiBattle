import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: process.env.API_KEY is expected to be available in the environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const streamGeminiResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  onChunk: (text: string) => void
) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // optimization for speed
      }
    });

    const result = await chat.sendMessageStream({ message: prompt });
    
    for await (const chunk of result) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    onChunk("\n\n*Error: Failed to get response from Gemini API.*");
  }
};
