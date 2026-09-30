import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { handleAIError } from "../utils/aiErrorHandler.js";
import AppError from "../utils/AppError.js";

dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const generateAIResponse = async (prompt) => {
  const controller = new AbortController()
  const timeout = setTimeout(() => {
    controller.abort();
  }, 50000);

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        abortSignal: controller.signal,
      },
    });

    return response.text;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new AppError("AI request timed out", 504);
    }
    handleAIError(error);
    throw error
  } finally {
    clearTimeout(timeout);
  }
};
