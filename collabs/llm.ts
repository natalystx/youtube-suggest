import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "~/env";

export const llmChat = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: env.GEMINI_API_KEY,
  json: true,
});
