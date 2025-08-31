import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { env } from "~/env";

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004",
  apiKey: env.GEMINI_API_KEY,
  stripNewLines: true,
});
