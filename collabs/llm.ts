import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "~/env";

export const llmChat = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  apiKey: env.GEMINI_API_KEY,
});
