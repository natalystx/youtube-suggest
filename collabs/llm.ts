import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "~/env";

export const llmChat = new ChatGoogleGenerativeAI({
  model: env.GEMINI_MODEL,
  apiKey: env.GEMINI_API_KEY,
});
